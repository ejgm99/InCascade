<script>
    import { onMount } from "svelte";
    import {handleKeyDown,handleKeyUp} from './KeystrokeHandler'
    import {getPost} from '../data/fetch.js'
    // import { setQuillEmitter, setState } from "./QuillMathQuill";

    //hacky check to make sure we're in browser
    // import { browser } from '$app/environment'
    export let post_id;

    let editor;

    // $: quill_length = quill_length    

    onMount(async () => {
              const CascadeEditor = await import('./CascadeEditor')
              const { default: Quill } = await import("quill");
              const MathQuillFormula  = await import('./QuillMathQuill')
              let cascade_map = await getPost(post_id);
              CascadeEditor.setPostID(post_id)
              let quill = CascadeEditor.setupQuill(editor,cascade_map)
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

 
