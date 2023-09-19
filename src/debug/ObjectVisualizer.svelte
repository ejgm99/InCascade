<script>

    export let ops;
</script>


<ul>
	{#each Object.keys(ops) as op}
        {op}
        <!-- {#each Object.keys(ops[op]) as operation}
            <li>
            {operation} : {typeof(ops[op][operation])==="string" ? ops[op][operation] : JSON.stringify(ops[op][operation]) }
            </li>
        {/each} -->
	{/each}
</ul>


