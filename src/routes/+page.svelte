<script> 
    import { db } from '../data/firebase.js';
    import {getDocs} from 'firebase/firestore/lite';
    import Editor from "../InCascade/Editor.svelte";
    import { onMount } from 'svelte';
    
    let documents = [];
    let doc_id = [];
    
    onMount(async () => {
        const querySnapshot = await db.collection('posts').get();

        // Map the documents to an array
        documents = querySnapshot.docs.map(doc => {return {
                                                    data: doc.data(),
                                                    id: doc.id
                                                    }
        });
    })

    async function deleteDocumentsWithPattern(pattern) {
    // Query the collection
    const querySnapshot = await db.collection('posts').get();

    // Filter documents based on the title pattern
    const documentsToDelete = querySnapshot.docs.filter(doc => doc.data().title.includes(pattern));

    // Delete each document
    documentsToDelete.forEach(async doc => {
      await db.collection('posts').doc(doc.id).delete();
    });
  }

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
