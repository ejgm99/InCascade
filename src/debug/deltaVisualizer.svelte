<script>

    export let ops,position,mq,length;


</script>

<p>Editor position: {position}</p>
<p>Editor length: {length}</p>

<p> Delta: {ops}</p>

<ul>
	{#each Object.keys(ops) as op}
        {op}
        {#each Object.keys(ops[op]) as operation}
            <li>
            {operation} : {typeof(ops[op][operation])==="string" ? ops[op][operation] : JSON.stringify(ops[op][operation]) }
            </li>
        {/each}
	{/each}
</ul>



<div>
    
    <ul>
	{#each Object.keys(mq) as mqid}
    <li>
        {mqid} : {mq[mqid]}
    </li>
	{/each}
</ul>
</div>
