<script>
	export let data;
    console.log(data)
    import Editor from "../../../InCascade/Editor.svelte";
    console.log(data)

</script>

<h1>{data.post_id}</h1>

<Editor post_id = {data.post_id}></Editor>