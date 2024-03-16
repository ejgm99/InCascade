import 'highlight.js/styles/atom-one-dark.css';
import { highlighter } from './HighlightQuill.js'
import Quill from 'quill';
import { setQuillEmitter, updateMQPositions, shouldFocusOnMq, getState, setCurrentPosition, setMqState } from './QuillMathQuill.js';
import { handleKeyDown, handleKeyUp, setEmitter } from './KeystrokeHandler'
import { writeDataToMapField } from "../data/write.js";
import * as Y from 'yjs'
import { WebrtcProvider } from 'y-webrtc'
import { QuillBinding } from 'y-quill'
import QuillCursors from 'quill-cursors'
import {notifications} from './ui/notifications.js'

var myQuill;
let post_id = -1;
var inMQ = false

Quill.register('modules/cursors', QuillCursors)
var ydoc = new Y.Doc()
var provider = new WebrtcProvider('quill-demo-xxxx', ydoc)
var type = ydoc.getText('quill')


var toolbarOptions = {
  handlers: {// handlers object will be merged with default handlers object
    'formula': function(value) {
      if (value) {
        this.quill.format('formula', { content: 'e^x', emitter: this.quill.emitter });
      } else {
        this.quill.format('formula', false);
      }
    }
  },
  container: [
    //Defining the two different options for the dropdown
    [{ header: [1, 2, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['image', 'code', 'formula'],
    ['blockquote', 'link'], ['code-block'],
  ],

};

export function deleteAtPosition() {
  let change = {
    "ops": [
      {
        "retain": myQuill.getSelection().index
      },
      {
        "delete": 1
      }
    ]
  }
  myQuill.updateContents(change);
}

export function getPosition() {
  return myQuill.getSelection()
}

export function setPostID(id) {
  post_id = id;
}

export function setState() {

}

var binding = null;
export function setupQuill(editor, cascade_map) {
  console.log(cascade_map)
  myQuill = new Quill(editor, {
    modules: {
      cursors: true,
      toolbar: toolbarOptions,
      syntax: {
        highlight: highlighter
      }
    },
    theme: "snow",
    placeholder: "Write your story...",
  });

  // yjs <-> Quill setup 


  // --- MathQuill setup ---
  setQuillEmitter(myQuill.emitter)

  try {
    try {
      setMqState(cascade_map.cascade.mq)
    } catch (err) {

    }
    try {
      myQuill.setContents(JSON.parse(cascade_map.cascade.quill))
    } catch (err) {

    }
  } catch (err) {

  }

  //need to pass in the emitter to our keystroke handler to be able to save
  setEmitter(myQuill.emitter)

  //var ydoc = new Y.Doc()
  //var provider = new WebrtcProvider('quill-demo-xxxx', ydoc)
  //var type = ydoc.getText('quill')
  //binding = new QuillBinding(type, myQuill, provider.awareness)

  myQuill.on('editor-change', function(eventName, ...args) {
    try { 
      setCurrentPosition(myQuill.getSelection().index)
    } catch(error) {
      console.log(error)
    }
    if (eventName === 'text-change') {
      // need to add to all the mq's ahead of us in order to not accidentally focus on them
      updateMQPositions(myQuill.getSelection().index)
    } else if (eventName === 'selection-change') {
      // need to generate all the info necessary to understand the nature of the selection change
      // and pass this info in to determine if selection needs to change
      try {

        //if we have a position before and after, we can decide if we need to do math to decide where the position ended up
        let positionDelta = args[0].index - args[1].index
        if (positionDelta * positionDelta == 1) { //quick math to check if we are cursoring around
          shouldFocusOnMq([args[0].index, positionDelta])
        }
        inMQ = false;
      }
      catch {

      }
      // args[0] will be old range
    }


  });

  myQuill.on('leaveMathCell', function(args) {
    // depending on the direction we want to move we leave teh math cell
    inMQ = false;
    myQuill.setSelection(myQuill.getSelection().index + args.dir + 1)
  })

  myQuill.on('enterMathCell', function(args) {
    inMQ = true;

  })

  //these handle keyboard strokes to call the populate the correct key
  myQuill.on('inline_mathquill', async function(args) {
    if (inMQ) {
      return;
    }
    myQuill.format('formula', { content: 'e^x', emitter: myQuill.emitter, type: 'inline' });
  })

  myQuill.on('mathquill', async function(args) {
    if (inMQ) {
      return;
    }
    myQuill.format('formula', { content: 'e^x', emitter: myQuill.emitter, type: 'regular' });
  })

  myQuill.on('save', async function(args) {
    notifications.info('saving... ', 1000)
    if (post_id != -1) {
      //need to get the document state and the document meta-state and save it to the database
      // this is the data we will turn to strings and save to the database
      let updated_map = {
        cascade: {
          quill: JSON.stringify(myQuill.getContents().ops),
          mq: getState()
        }
      }
      writeDataToMapField(post_id, updated_map);
    }
  }
  )
  //not sure we'll be needing to return quill but just in case
  return myQuill;
}