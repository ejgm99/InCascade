<script> 
    import '../app.css'

    import Editor from "../InCascade/Editor.svelte";
    import { onMount } from 'svelte';
    import {getPosts} from '../data/fetch.js'
    import {deleteDocumentsWithPattern} from '../data/write.js'

    let documents = [];
    let doc_id = [];
    
    onMount(async () => {
        documents = await getPosts();
    })
</script>

<button class='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' on:click={() => deleteDocumentsWithPattern('Untitled')}>
    Delete Documents with Pattern
</button>

<a class='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded' href ="/editor/new" on:click={() => console.log('create a new post') }> Create new doc </a>

<ul>
  {#each documents as doc}
    <li><a class='font-semibold hover:font-extrabold hover:bg-sky-500' href = "/editor/{doc.id}"> {doc.data.title} </a> - {doc.data.description}</li>
  {/each}
</ul>
