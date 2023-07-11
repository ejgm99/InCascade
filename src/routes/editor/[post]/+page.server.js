import { error } from '@sveltejs/kit';
import { db } from './../../../data/firebase.js';


export async function load({ params }) {
	
    console.log("Calling load")
    console.log(params)
    var post_id = params.post;
	if (!post_id) throw error(404);
    console.log(post_id)
	return	{post_id};
}