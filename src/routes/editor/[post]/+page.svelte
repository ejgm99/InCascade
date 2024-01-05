<script>
  import {goto} from '$app/navigation';
  import {onMount} from 'svelte';
	import {updateDoc,createNewDoc} from "../../../data/write.js"
  export let data;
  import Editor from "../../../InCascade/Editor.svelte";
  import InPlaceEdit from "../InplaceEdit.svelte"
  import {getPost} from '../../../data/fetch.js'
  var title,description;
  
  onMount( async ()=> { 
    if (data.post_id == 'new'){
      createNewDoc().then( (new_doc_ref) => {
        data.post_id = new_doc_ref.id
        goto(`/editor/${new_doc_ref.id}`)
        getPostData() 
      })
    } else if (data.post_id == 'test') {
      title = "Test Doc"
      description = "Test Discription" 
    } 
    else {
      getPostData()
    }
  })

  function getPostData(){
    getPost(data.post_id).then( (value) => {
      try {
        title = value.title
        description = value.description
      } catch {
      }
    })
  }

  function submit(key) {
		return ({detail: newValue}) => {
			updateDoc(data.post_id,key, newValue)
		}
	}
</script>

<h1>
  <InPlaceEdit bind:value={title} on:submit={submit('title')}></InPlaceEdit>
</h1>
 
<p>
  <InPlaceEdit bind:value={description} on:submit={submit('description')}></InPlaceEdit>
</p>

<Editor post_id = {data.post_id}/>
