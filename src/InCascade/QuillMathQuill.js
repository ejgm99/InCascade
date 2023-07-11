//import javascript dependancies
import Quill from 'quill'

//import MathQuill Dependancies
import MathQuill from './mathquill/mathquill'


// <textarea autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" x-palm-disable-ste-all="true" aria-label="Math Input:"></textarea>

//This code does two things 
//   1) takes in info from our handler about position and content to manage focusing on windows
//   2) Sets up behavior for creating new mathquill instances 

var Embed = Quill.import('blots/embed')
var MQ = MathQuill.MathQuill.getInterface(3);


// a javascript object capturing:
//   1. the id of each math equation
//   2. the position of each equation


function isDefined(key, object){
  if (object[key] == undefined){
    return false
  }
  return true
}

export var MathquillState = {}

var currentPosition = -1;
var quill_emitter = null;


export function setCurrentPosition(position){
  currentPosition = position;
}

function focusOnMQ(id){
  let node = document.getElementById(id)
  node.focus()
}

function checkIfPositionInRange(position, range){
  let bounds = []
  if (range[1] == -1) {
    bounds = [range[0],range[0]-range[1]]
  }
  else {
    bounds = [range[0]-range[1],range[0]]
  }
  console.log('bounds: ',bounds)
  console.log('bool: ',bounds[0]<position & position<bounds[1] )
  return bounds[0]<position & position<bounds[1] 
}

export function shouldFocusOnMq(range){
  for (var key in MathquillState){
    let MQ_position = MathquillState[key]
    console.log('MQ position: ',MQ_position)
    console.log('range: ',range)
    if (checkIfPositionInRange(MQ_position,range)){
      console.log('focusing on: ',key+'_Editor')
      return focusOnMQ(key+'_Editor')
    }
  }
}

export function newMQ(id, position){
  //only if we haven't pulled this id before do we add it to the state
  if (typeof MathquillState[id] == 'undefined') {
    MathquillState[id] = position
  }
}

//return the state of each position of MQ and their offsets
export function getState(){
  return JSON.stringify(MathquillState)
}

//set the state of each position of MQ and their offsets
export function setState(new_state){
  MathquillState = JSON.parse(new_state);
}

export function setQuillEmitter(q_emitter){
  quill_emitter = q_emitter;
}

//takes in information about updates made to the DOM and updates how to handle the positions of the window
export function updateMQPositions(new_position){
  //this function should only be called on a text change, so we will need to update offsets based on new_position and old_position
  let d_pos = new_position-currentPosition;
  for (var key in MathquillState){
    if (MathquillState[key]>currentPosition){
      MathquillState[key] = MathquillState[key]+d_pos;
    }
  }
}


class myFormula extends Embed {


  constructor(node){
    super(node)
    this.latex = 'going'
    this.editorId = node.id+'_Editor'
    this.mathField = null
    node.childNodes[1].childNodes[0].childNodes[0].id = this.editorId
  }

  appendChild(child){
    // console.log('APPENDCHILD is stubbed: ', this.latex)
    let timer = setTimeout(()=> {focusOnMQ(this.editorId)}, 1)
    // console.log(timer)
  }
  html(){
    return '<latex>'+this.mathField.latex()+'</latex>'
  }

  // index(node,offset){
  //   console.log(node, offset)
  //   super.node(node,offset)
  // }

  static value(node){
    return {
      'content' : node.getAttribute('data-latex'),
      // 'index' : 1,
      'id': node.getAttribute('id')
    }
  }



// this function creates a new mathquill and appends it to the DOM
// takes in id and position
  static create(value) {
    console.log('Creating new mathquill: ',value)
    let mathquillString = value.content
    let quillEmitter = value.emitter
    console.log('mathquillString: ', mathquillString)
    let d = new Date()
    let node = super.create(mathquillString)
    var id;
    if (!isDefined('id',value)){
      id = 'MQ'+d.getTime().toString()
    } else {
      console.log('This is a mathquill from the database, just using its id')
      id = value.id
    }
    
    newMQ(id,currentPosition+0.5)
    var inputLatex=mathquillString
    node.setAttribute('id', id)
    node.setAttribute('data-latex',mathquillString)

    node.classList.add('paddedDiv')

    if (inputLatex==null){
      inputLatex = "";
    }

    node.innerHTML = inputLatex

    var mathField = MQ.MathField(node, {
        spaceBehavesLikeTab: true, // an example config option, for more see:
        //   http://docs.mathquill.com/en/latest/Config/
        handlers: {
          edit: function () {
            //Going to need to figure out how to push in our delta function to reflect change on the GUI

            node.setAttribute('data-latex', mathField.latex())
            // window.emitter.emit( 'editedMathCell', {'id':id,'latex':mathField.latex()})
          },
          enter: function() {
            console.log('Need to implement refocusing on Quill');
          },
           moveOutOf: function(dir, math){
            quill_emitter.emit('leaveMathCell',{'id':id, 'dir':dir})
          },
          upOutOf: function(mathField){
            console.log('select if this is going to be a main body or not?')
          },
          downOutOf: function(mathField){

          }
        },
      });



    this.mathField = mathField
    return node
  }
}

myFormula.blotName = 'formula';
myFormula.className = 'ql-formula';
myFormula.tagName = 'SPAN';

var Formula = Quill.import('modules/formula')


class MathQuillFormula extends Formula {
  constructor(node,options){
    super()
    try {
      this.MathCells = JSON.parse(options.MathCells)
    } catch {
      this.MathCells = {}
    }
    this.numberOfMQs = Object.keys(this.MathCells).length;
    this.quill = node

    this.previousLengthOfDocument;
    this.previousCursorPosition;
    this.quill.on('selection-change', this.shouldFocus.bind(this))
    this.quill.on('text-change', this.shiftEmbedPosition.bind(this))
    console.log('MQF constructer is firing')
    this.emitter.addListener('leaveMathCell', (params) => {
      this.selectInQuill(params.id, params.dir)
    })

  }

  selectInQuill(ID, dir){
    var index = this.MathCells[ID].position+(dir)
    if(dir==1){
      index=index+1
    }
    this.quill.setSelection(index,0)
  }
  
  generateMathQuillID(){
    this.numberOfMQs=this.numberOfMQs+1;
    return 'MQ'+String(this.numberOfMQs)
  }

  shiftEmbedPosition(){
    var lengthOfDocument = this.quill.getLength()
        
    var lengthOfChange = lengthOfDocument-this.previousLengthOfDocument

    var cursorPosition;

    // //Depending on what's been done before we have different versions available to us
    try{
      cursorPosition = this.quill.getSelection().index
    } catch(err) {
      // cursorPosition = this.previousCursorPosition
    }

    //Iterate through all of our MathCells and update the position of everything accordingly
    for (var key in this.MathCells){
      if (this.MathCells[key]['position'] > cursorPosition){
        this.MathCells[key]['position'] = this.MathCells[key]['position'] + lengthOfChange
      }
    }

    // //Closing step, make sure we're keeping update with our previous length of document being updated
    this.previousLengthOfDocument = lengthOfDocument
  }

  static register(){
    Quill.register(myFormula, true);
  }

}

Quill.register('modules/formula',MathQuillFormula,true)
