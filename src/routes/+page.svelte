<script> 
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

<button on:click={() => deleteDocumentsWithPattern('Untitled')}>
    Delete Documents with Pattern
</button>

<a href ="/editor/new" on:click={() => console.log('create a new post') }> Create new doc </a>

<ul>
  {#each documents as doc}
    <li><a href = "/editor/{doc.id}"> {doc.data.title} </a> - {doc.data.description}</li>
  {/each}
</ul>
