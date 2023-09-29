<script>
    import { onMount } from "svelte";
    import DeltaVisualizer from "../debug/deltaVisualizer.svelte";
    import ObjectVisualizer from "../debug/ObjectVisualizer.svelte";
    import {handleKeyDown,handleKeyUp,setEmitter} from './KeystrokeHandler'
    import {getPost} from '../data/fetch.js'

    // import { setQuillEmitter, setState } from "./QuillMathQuill";

    //hacky check to make sure we're in browser
    import { browser } from '$app/environment'
    export let post_id;

    let editor;
    let doc_delta = 0;
    let doc_position = -1;
    let doc_mq = 0;
    let quill_length;
    let mq_state = 0;
    let mq_handover = 0;
    let quill_obj = {}
    let quill_handover = {}
    let quill_rendered = false;
    let cursor_position = 0;
    $: quill_obj=quill_handover;
    $: mq_state = mq_handover;
    // $: quill_length = quill_length    

    onMount(async () => {

      if (browser){

              const CascadeEditor = await import('./CascadeEditor')
              const { default: Quill } = await import("quill");
              const MathQuillFormula  = await import('./QuillMathQuill')

              let cascade_map = await getPost(post_id);

              let quill = CascadeEditor.setupQuill(editor,cascade_map)
              doc_delta = quill.getContents().ops
              quill_obj = quill.getLength()
            //   MathQuillFormula.setQuillEmitter(quill.emitter)
            // MathQuillFormula.setState(cascade_map.cascade.mq)

            //   quill.setContents(JSON.parse(cascade_map.cascade.quill))
            //   quill.on('text-change', function() {
            //     try{
            //     MathQuillFormula.setCurrentPosition(quill.getSelection().index)
            //     } catch{}
            //   })

            quill.on('editor-change', function(eventName) {
                console.log('Event change: ',eventName)
                quill_rendered=true
                // console.log(`We've detected a selection change`, quill_obj)
                quill_length = quill.getLength()
                // console.log(quill_length)
                mq_handover = MathQuillFormula.getState()
                quill_handover = quill
                // console.log(quill.getContents())
                cursor_position = quill.getSelection().index
                console.log(cursor_position)
              })
              

            //   //need to pass in the emitter to our keystroke handler to be able to save
            //   setEmitter(quill.emitter)

            //   quill.on('editor-change', function(eventName, ...args) {
            //     if (eventName === 'text-change') {
            //       textChange = true;
            //     // args[0] will be delta
            //       doc_delta = quill.getContents().ops
            //       // need to add to all the mq's ahead of us in order to not accidentally focus on them
            //       MathQuillFormula.updateMQPositions(quill.getSelection().index)
            //     } else if (eventName === 'selection-change') {
            //       // need to generate all the info necessary to understand the nature of the selection change
            //       // and pass this info in to determine if selection needs to change
            //       try{
            //         //if we have a position before and after, we can decide if we need to do math to decide where the position ended up
            //         let positionDelta = args[0].index - args[1].index
            //         if (positionDelta*positionDelta==1){ //quick math to check if we are cursoring around
            //           MathQuillFormula.shouldFocusOnMq([args[0].index , positionDelta])
            //         }
            //         textChange = false;
            //         textChangeLength = 0;
            //         }
            //       catch{

            //       }
            //       // args[0] will be old range
            //       // console.log('Quill has detected selection',quill.getSelection().index)
            //     }
                
            //     //updating our MQ's awareness of cursor position at the end to discern what has been changed
            //     //CLEAN UP WITH MORE SANE STATE HANDLING
            //     try{
            //       doc_position = quill.getSelection().index
            //       doc_mq = MathQuillFormula.MathquillState
            //     } catch {

            //     }

            //   });

            // quill.on('leaveMathCell',function(args){
            //   // depending on the direction we want to move we leave teh math cell
            //   quill.setSelection(quill.getSelection().index+args.dir+1)
            // })

            // quill.on('save',async function(args){
            //   //need to get the document state and the document meta-state and save it to the database
            //   // this is the data we will turn to strings and save to the database
            //   let updated_map = {
            //     cascade :{
            //       quill : JSON.stringify(quill.getContents().ops),
            //       mq : MathQuillFormula.getState()
            //     }
            //   }
            //   writeDataToMapField(post_id,updated_map);
            // })



        }
        


    });
  
  </script>
  
  <style>
    @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
    @import './mathquill/mathquill.css';

    .ql-container.ql-snow {
      border: 0px !important;
      box-shadow: none !important;
    }

    .ql-toolbar.ql-snow {
      border: none !important;
      box-shadow: none !important;
    }


    .editor-wrapper {
      border: none !important;
      box-shadow: none !important;
    }
  </style>
  
  <div class="editor-wrapper">
    <div on:keydown={handleKeyDown} on:keyup={handleKeyUp} bind:this={editor} />
  </div>

  <p> Editor {quill_obj} </p>

  <p> Cursor Position {cursor_position} </p>

{#if quill_rendered}
  
  <p> Mq Handover {mq_state}</p>
  
  {#each Object.keys(mq_state) as mq_pos}
    <!-- {typeof(mq_state{mq_pos})} -->
  {/each}

  <p> QUILL RENDERING </p>
  <ObjectVisualizer ops = {quill_obj.options.modules}> </ObjectVisualizer>
  {#each Object.keys(quill_obj) as operation}
  
  <li>
    {operation}
      <ObjectVisualizer ops = {quill_obj[operation]}> </ObjectVisualizer>
  </li>
   {/each}

{/if}

  <!-- <div>
  <p>{doc_delta}</p>
  <DeltaVisualizer ops={doc_delta} position = {doc_position} mq = {doc_mq} quill={quill_obj}></DeltaVisualizer>
  </div> -->
