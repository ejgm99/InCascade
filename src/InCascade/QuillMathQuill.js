//import javascript dependancies
import Quill from 'quill'
//import MathQuill Dependancies
import MathQuill from './mathquill/mathquill'
import { getBackspacePressed } from './KeystrokeHandler';
import { deleteAtPosition } from './CascadeEditor';
// <textarea autocapitalize="none" autocomplete="off" autocorrect="off" spellcheck="false" x-palm-disable-ste-all="true" aria-label="Math Input:"></textarea>

//This code does two things 
//   1) takes in info from our handler about position and content to manage focusing on windows
//   2) Sets up behavior for creating new mathquill instances 

var Embed = Quill.import('blots/embed')
var MQ = MathQuill.MathQuill.getInterface(3);
var emptyBackspaceCount = 0; //variable that keeps track of how many times backspace has been pressed while in an empty mathquill item
var backoutofThreshold = 2; //configurable variable that is the threshold for when to delete a mathquill object

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
  return position==(range[0]+(range[0]-range[1]))/2.0
}

export function shouldFocusOnMq(range){
  for (var key in MathquillState){
    let MQ_position = MathquillState[key]
    if (checkIfPositionInRange(MQ_position,range)){
      // console.log('focusing on: ',key+'_Editor')
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
export function setMqState(new_state){
  MathquillState = JSON.parse(new_state);
}

export function setQuillEmitter(q_emitter){
  quill_emitter = q_emitter;
}

//takes in information about updates made to the DOM and updates how to handle the positions of the window
export function updateMQPositions(new_position){
  console.log('We have a new position:', new_position)
  console.log('Current position:', currentPosition)
  
  //this function should only be called on a text change, so we will need to update offsets based on new_position and old_position
  let d_pos = new_position-currentPosition;
  console.log('d_pos can be zero for mathquills',d_pos)
  if (d_pos==0){
    d_pos = 1;
  }
  for (var key in MathquillState){
    if (MathquillState[key]>currentPosition+.6){
      console.log(key,MathquillState[key])
      MathquillState[key] = MathquillState[key]+d_pos;
    }
  }
}

class myFormula extends Embed {

  // deleteAt(index, length){
  //   console.log('Deleting a mathquill from the quill side of things')
  // }

  constructor(node){
    super(node)
    this.latex = 'going'
    this.editorId = node.id+'_Editor'
    this.mathField = null
    node.childNodes[1].childNodes[0].childNodes[0].id = this.editorId
  }

  appendChild(child){
    let timer = setTimeout(()=> {focusOnMQ(this.editorId)}, 1)
  }
  html(){
    return '<latex>'+this.mathField.latex()+'</latex>'
  }

  static value(node){
    return {
      'content' : node.getAttribute('data-latex'),
      'id': node.getAttribute('id')
    }
  }

// this function creates a new mathquill and appends it to the DOM
// takes in id and position
  static create(value) {
    let mathquillString = value.content
    let quillEmitter = value.emitter
    let d = new Date()
    let node = super.create(mathquillString)
    var id;
    if (!isDefined('id',value)){
      id = 'MQ'+d.getTime().toString()
    } else {
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
    var mathField = generateInlineMathfield({
      'id': id,
    }, node)
    console.log('mathfield returned: ', mathField)
    this.mathField = mathField
    return node
  }
}

myFormula.blotName = 'formula';
myFormula.className = 'ql-formula';
myFormula.tagName = 'SPAN';

var Formula = Quill.import('modules/formula')

// !!! Scoping in this function is currently not obvious to me
// for now I'll just pass the containing object into this, but I can't help but wonder if there is any more of a containing object 
// that should be required for this
//this function needs to solve the problem of referencing an arbitrary javascript object that this gets attached to 

function generateInlineMathfield(props, element){
  var mathField = MQ.MathField(
    element, generateMathquillConfig(mathField,props.id)
  )
  return mathField
}

function generateMathquillConfig(mathField,id){
  console.log(mathField)
  return {
    spaceBehavesLikeTab: true, // an example config option, for more see:
    //   http://docs.mathquill.com/en/latest/Config/
    handlers: {
      edit: function (e) {
        if(e.latex() =='' && getBackspacePressed()){
          emptyBackspaceCount++;
          if (emptyBackspaceCount==backoutofThreshold){
            emptyBackspaceCount = 0;
            deleteAtPosition()
          }
        }
        //might need to set quill-visible logic here somehow
        // node.setAttribute('data-latex',e.latex())
      },
      enter: function() {
      },
       moveOutOf: function(dir, math){
        quill_emitter.emit('leaveMathCell',{'id':id, 'dir':dir})
      },
      upOutOf: function(mathField){
      },
      downOutOf: function(mathField){
      }
    },
  };
}

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