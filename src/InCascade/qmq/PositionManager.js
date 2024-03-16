
//The code in this function generalizes the logic of managing cursor position
//with the state of the Quill editor
//Hopefully what is written here will one day be folded into Quill itself
//But that would require breaking Quill down a little further which i am not
// prepared to do at the moment.

export var MathquillState = {}
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

//return the state of each position of MQ and their offsets
export function getState(){
    return JSON.stringify(MathquillState)
}

export function newMQ(id, position){
    //only if we haven't pulled this id before do we add it to the state
    if (typeof MathquillState[id] == 'undefined') {
      MathquillState[id] = position
    }
}

export function shouldFocusOnMq(range){
    for (var key in MathquillState){
      let MQ_position = MathquillState[key]
      if (checkIfPositionInRange(MQ_position,range)){
        return focusOnMQ(key)
      }
    }
  }

function focusOnMQ(id){
    let node = document.getElementById(id+'_Editor')
    node.focus()
  }
  
function checkIfPositionInRange(position, range){
    return position==(range[0]+(range[0]-range[1]))/2.0
}

export function setCurrentPosition(position){
    currentPosition = position;
  }