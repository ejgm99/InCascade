<script>
  import {createEventDispatcher, onMount} from 'svelte'
  export let value, required = true
  let editing = false
  let original = value;
  const dispatch = createEventDispatcher();
  function edit(){
    editing = true;
  }
    
 function keydown(event) {
    if (event.key == 'Escape') {
      event.preventDefault()
      value = original
      editing = false
    }
  }


  function submit(){
    
    if (value != original) {
			dispatch('submit', value)
		}
		
    editing = false
  }


  function focus(element) {
		element.focus()
	}
</script>


{#if editing}
  <form on:keydown={keydown}>
    <input bind:value on:blur={submit} size="300" use:focus>
  </form>
{:else }
<div on:click={edit}>
  {value}
</div>
{/if}


<style>
  input {
    border: none;
    background: none;
    font-size: inherit;
    color: inherit;
    font-weight: inherit;
    text-align: inherit;
    box-shadow: none;
  }
</style>
