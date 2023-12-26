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
              CascadeEditor.setPostID(post_id)
              let quill = CascadeEditor.setupQuill(editor,cascade_map)
              doc_delta = quill.getContents().ops
              quill_obj = quill.getLength()
              console.log(quill)
            quill.on('editor-change', function(eventName) {
                quill_rendered=true
                quill_length = quill.getLength()
                mq_handover = MathQuillFormula.getState()
                quill_handover = quill.getContents()
              })


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

    * {margin: 0; padding: 0;}
  #mybigcontainer {height: 100%; width:30%; font-size: 0;}
  #left, #middle, #right {display: inline-block; *display: inline; zoom: 1; vertical-align: top; font-size: 12px;}
  #left {width: 25%; background: blue;}
  #middle {width: 50%; background: green;}
  #right {width: 25%; background: yellow;}



  </style>
  
  <div class="editor-wrapper">
    <div on:keydown={handleKeyDown} on:keyup={handleKeyUp} bind:this={editor} />
  </div>

  <p> Editor {quill_obj} </p>

  <p> Cursor Position {cursor_position} </p>

{#if quill_rendered}

  <p> QUILL RENDERING </p>
  <!-- <ObjectVisualizer ops = {quill_obj.options.modules}> </ObjectVisualizer> -->
  <!-- {#each quill_obj.ops as operation}
    {operation.keys()}, 
  {/each} -->

{/if}
 
  <!-- <body> -->
  <!-- </body> -->
  <!-- <div>
  <p>{doc_delta}</p>
  <DeltaVisualizer ops={doc_delta} position = {doc_position} mq = {doc_mq} quill={quill_obj}></DeltaVisualizer>
  </div> -->
