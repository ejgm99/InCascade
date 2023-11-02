<script>
	export let data;
    import Editor from "../../../InCascade/Editor.svelte";

</script>

<h1>{data.post_id}</h1>

<Editor post_id = {data.post_id}></Editor>