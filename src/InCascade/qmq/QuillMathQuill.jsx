import Quill from 'quill'
import left from  "./myStyle.css" assert { type: 'css' };
//import MathQuill Dependancies
import MathQuill from './mathquill/mathquill'
import { getBackspacePressed } from './KeystrokeHandler';
import { deleteAtPosition } from '../CascadeEditor';

//This code does two things 
//   1) takes in info from our handler about position and content to manage focusing on windows
//   2) Sets up behavior for creating new mathquill instances 
var Embed = Quill.import('blots/embed')
var MQ = MathQuill.MathQuill.getInterface(3);

export function setQuillEmitter(q_emitter){
  quill_emitter = q_emitter;
}
var quill_emitter = null;

function preprocessLatex(inputLatex){
  if (inputLatex==null){
    inputLatex = "";
  }
  return inputLatex
}

class myFormula extends Embed {

  constructor(node){
    super(node)
    this.latex = 'going'
    this.editorId = node.id
    this.mathField = null
}

  appendChild(child){
  let timer = setTimeout(()=> {
      focusOnMQ(this.editorId)
    }, 1)
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
  deleteAt(...args){
    delete MathquillState[this.editorId]
    try {
      let position = parseInt(getKeyByValue(MathquillPositions,this.editorId))
      if (!Number.isNaN(position)) {
        deleteMqPosition(position)
      }
    }
    catch(e){
      console.log('Just a bonkeroni',e)
    }
    super.deleteAt(args[0],args[1])
  }
// this function creates a new mathquill and appends it to the DOM
// takes in id and position
  static create(value) {

    //we'll only generate another mathquill if we don't already have a
    //MQ we're working on
    let mathquillString = value.content
    let node = super.create(mathquillString)
    //generate id 
    var id =  generateUniqueId(value);
    //generate the positioning data
    newMQ(id,currentPosition+0.5)
    mathquillString = preprocessLatex(mathquillString)
    if (value.type =='inline'){
      generateInlineMathfield({
        'id':id,
        'mathquillString':mathquillString
      }, node)
    } else {
      
      generateMathfield({
        'id':id,
        'mathquillString':mathquillString
      }, node)
    }
    node.id = id
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

// 
//
//   Welcome to the hell that is keyboard input handling
//
//
var backoutofThreshold = 2; //configurable variable that is the threshold for when to delete a mathquill object
var emptyBackspaceCount = 0; //variable that keeps track of how many times backspace has been pressed while in an empty mathquill item

//
//
// We are going to seperate user input/user state for now
//       this means we probably wrote some fucked code
//

var currentPosition = -1;
function checkIfPositionInRange(position, range){
  return position==(range[0]+(range[0]-range[1]))/2.0
}

export function setCurrentPosition(position){
  currentPosition = position;
  getCurrentPosition()
}

export function getCurrentPosition(){
  return currentPosition
}

export function shouldFocusOnMq(range){
  for (var key in MathquillState){
    let MQ_position = MathquillState[key]
    if (checkIfPositionInRange(MQ_position,range)){
      currentPosition = MQ_position
      return focusOnMQ(key)
    }
  }
  return false
}

function focusOnMQ(id){
  quill_emitter.emit('enterMathCell',{})
  setCurrentPosition(MathquillState[id])
  let node = document.getElementById(id+'_Editor')
  node.focus()

  return true
}

//
//
//  State management of qmq's
//
//

// a javascript object capturing:
//   1. the id of each math equation
//   2. the position of each equation
export var MathquillState = {}

//a mapping of MQ ID's to positions relative to each other
//This can be combined with the Mathquill State dictionary in order to 
//determine the 'formal' MQ's position relative to each other
var MathquillPositions = {}

//set the state of each position of MQ and their offsets
export function setMqState(new_state){
  MathquillState = JSON.parse(new_state);
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

//takes in information about updates made to the DOM and updates how to handle the positions of the window
export function updateMQPositions(new_position){
  //this function should only be called on a text change, so we will need to update offsets based on new_position and old_position
  let d_pos = new_position-currentPosition;
  if (d_pos==0){
    d_pos = 1;
  }
  for (var key in MathquillState){
    if (MathquillState[key]>currentPosition+.6){
      MathquillState[key] = MathquillState[key]+d_pos;
      
    }
  }
}

var maxPosition = -1;
// Determines what number to annotate a formal MathField with 
function getMathCount(id){
  //need to understand where the MQ we are documenting is in the docuement
  let values = Object.values(MathquillPositions)

  if (values.length==0){
    MathquillPositions[1]=id
    maxPosition = currentPosition+0.5
    return 1
  }

  //if we just have the maximum position, we append to the end
  if (MathquillState[id] >maxPosition){
    maxPosition = MathquillState[id]
    MathquillPositions[values.length+1]=id 
    return values.length+1
  }

  //find the first entry that has a position greater than our current MQ
  //give that position to our current MQ id, sort the rest of the positions
  for (var i =1;i<=values.length;i++){
    let compareToPosition =  MathquillState[MathquillPositions[i]]
    if (currentPosition<compareToPosition){
      insertMqPosition(id,i)
      return i;
    }
  }
}

function deleteMqPosition(position){
  let maxLen = Object.values(MathquillPositions).length
  for (var i = position;i<maxLen;i++){
    MathquillPositions[i] = MathquillPositions[(i+1).toString()]
  }
  delete MathquillPositions[maxLen]
  updateAllMathquillPositions()
}

function insertMqPosition(id,position){
  let maxLen = Object.values(MathquillPositions).length
  MathquillPositions[maxLen+1] = MathquillPositions[maxLen]

  for (var i = maxLen;i>position;i--){
    MathquillPositions[i] = MathquillPositions[i-1]

  }

  MathquillPositions[position] = id;
  updateAllMathquillPositions()
}

function updateAllMathquillPositions(){

  let maxLen = Object.values(MathquillPositions).length
  for (var i=1;i<=maxLen;i++){
    updateMathquillPositionDisplay(MathquillPositions[i],i)
  }
}

function updateMathquillPositionDisplay(id,position){
  try{
    let div = document.getElementById(id+'_Position')
    div.textContent = position;
  } catch {

  }
}

//
//
//  Actual frontend handling
//
//

// !!! Scoping in this function is currently not obvious to me
// for now I'll just pass the containing object into this, but I can't help but wonder if there is any more of a containing object 
// that should be required for this
//this function needs to solve the problem of referencing an arbitrary javascript object that this gets attached to 
function generateMathfield(props,element){
  let mathquillString = 'e^x'
  let inputLatex = 'e^x'
  const body = document.createElement('body')
  body.classList.add('container');
  const div1 = document.createElement('span');
  div1.setAttribute('data-latex',mathquillString)
  div1.classList.add('left');
  div1.textContent = mathquillString;
  div1.innerHTML = inputLatex
  var mathField = MQ.MathField(
    div1, generateMathquillConfig(mathField,props.id+'_Editor')
  )
  div1.childNodes[0].childNodes[0].id = props.id+'_Editor'
  const div2 = document.createElement('span');
  div2.classList.add('right');
  div2.id = props.id+'_Position'
  // consulting our current state to determine what positional id to use
  div2.textContent = getMathCount(props.id);

  body.appendChild(div1);
  body.appendChild(div2);
  element.appendChild(body);
}

function generateInlineMathfield(props, element){
  // element.setAttribute('id', props.id)
  element.setAttribute('data-latex',props.mathquillString)
  element.classList.add('paddedDiv')
  var mathField = MQ.MathField(
    element, generateMathquillConfig(mathField,props.id)
  )
  // element.childNodes[1].childNodes[0].childNodes[0].id = props.id
  element.childNodes[0].childNodes[0].id = props.id+'_Editor'
  return mathField
}

function generateMathquillConfig(mathField,id){
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
      upOutOf: function(dir, mathField){
        quill_emitter.emit('leaveMathCell',{'id':id, 'dir':dir})
      },
      downOutOf: function(dir, mathField){
        quill_emitter.emit('leaveMathCell',{'id':id, 'dir':dir})
      },
      selectOutOf: function(dir){

        quill_emitter.emit('leaveMathCell',{'id':id, 'dir':dir})
      },
      deleteOutOf: function(dir){
        quill_emitter.emit('leaveMathCell',{'id':id, 'dir':dir})
      }
    },
  };
}

//
//
//  JavaScript Utility functions :3
//
//

function isDefined(key, object){
  if (object[key] == undefined){
    return false
  }
  return true
}
function getKeyByValue(object, value) {
  return Object.keys(object).find(key => object[key] === value);
}

//checks in passed in properties to make sure an ID is set
//if not set, generates a new id
function generateUniqueId(value){
  var id;
  if (!isDefined('id',value)){
    let d = new Date()
    id = 'MQ'+d.getTime().toString()
  } else {
    id = value.id
  }
  return id
}