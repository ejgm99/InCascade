import 'highlight.js/styles/atom-one-dark.css';
import {highlighter} from './HighlightQuill.js'
import Quill from 'quill';
import {setQuillEmitter,updateMQPositions,shouldFocusOnMq,getState,setCurrentPosition,setMqState} from './QuillMathQuill.js';
import {handleKeyDown,handleKeyUp,setEmitter} from './KeystrokeHandler'
import {writeDataToMapField} from "../data/write.js";

var myQuill;
let textChange = false;
let textChangeLength =-1;

let doc_delta = 0;
let doc_position = -1;
let doc_mq = 0;
let post_id = -1;

var toolbarOptions = {
    handlers : {// handlers object will be merged with default handlers object
        'formula': function(value) {
            if (value) {
                this.quill.format('formula', {content : 'e^x' , emitter : this.quill.emitter});
            } else {
                this.quill.format('formula', false);
                }
            }
    },
    container : [
               //Defining the two different options for the dropdown
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline'],
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              ['image','code','formula'],
              ['blockquote','link'],['code-block'],
    ],

};

function containsDeletion(text_change){
    for (var change in text_change) {
        // console.log(change)
    }
}

export function getICState(){
    // gets the state of everything this editor needs
    // get quill state

    // get MathQuill state


}

export function setState(){

}

export function setupQuill(editor,cascade_map){
    myQuill = new Quill(editor, {
        modules: {
          toolbar: toolbarOptions,
          syntax: {
            highlight:highlighter
          }
          },
        theme : "snow", 
        placeholder : "Write your story...",
      });

      // --- MathQuill setup ---
      setQuillEmitter(myQuill.emitter)

      try{
        setMqState(cascade_map.cascade.mq)
        myQuill.setContents(JSON.parse(cascade_map.cascade.quill))
      } catch(err){
        console.log('No connection to firebase...',err)
      }

      myQuill.on('text-change', function() {
        try{
            console.log('text change detected')
            setCurrentPosition(myQuill.getSelection().index)
        } catch{}
      })

      myQuill.on('selection-change', function() {
        try{
                console.log('selection change detected')
            setCurrentPosition(myQuill.getSelection().index)
        } catch {
          
        }
      })
      
      //need to pass in the emitter to our keystroke handler to be able to save
      setEmitter(myQuill.emitter)

      myQuill.on('editor-change', function(eventName, ...args) {
        if (eventName === 'text-change') {
          textChange = true;
        // args[0] will be delta
          doc_delta = myQuill.getContents().ops
          // need to add to all the mq's ahead of us in order to not accidentally focus on them
          // console.log('quill selection',myQuill.getSelection().index)
          // console.log('Delta: ', args)
          updateMQPositions(myQuill.getSelection().index)
        } else if (eventName === 'selection-change') {
          // need to generate all the info necessary to understand the nature of the selection change
          // and pass this info in to determine if selection needs to change
          try{
            //if we have a position before and after, we can decide if we need to do math to decide where the position ended up
            let positionDelta = args[0].index - args[1].index
            if (positionDelta*positionDelta==1){ //quick math to check if we are cursoring around
              shouldFocusOnMq([args[0].index , positionDelta])
            }
            textChange = false;
            textChangeLength = 0;
            }
          catch{

          }
          // args[0] will be old range
          // console.log('Quill has detected selection',myQuill.getSelection().index)
        }
        
        //updating our MQ's awareness of cursor position at the end to discern what has been changed
        //CLEAN UP WITH MORE SANE STATE HANDLING
        try{
          doc_position = myQuill.getSelection().index
          doc_mq = MathQuillFormula.MathquillState
        } catch {

        }

      });
    myQuill.on('leaveMathCell',function(args){
      // depending on the direction we want to move we leave teh math cell
      myQuill.setSelection(myQuill.getSelection().index+args.dir+1)
    })

    myQuill.on('save',async function(args){
      if (post_id != -1){
      //need to get the document state and the document meta-state and save it to the database
      // this is the data we will turn to strings and save to the database
      let updated_map = {
            cascade :{
                quill : JSON.stringify(myQuill.getContents().ops),
                mq : getState()
                }
            }
            writeDataToMapField(post_id,updated_map);
        }
        }
    )

    //not sure we'll be needing to return quill but just in case
    return myQuill;
}
