import { db } from '../data/firebase.js';

export async function getPost(post_id) {
  // Get the Firestore document by ID
  try {
    console.log('Pulling from this id', post_id)
    const docSnapshot = await db.doc(`posts/${post_id}`).get();
    return docSnapshot.data();
  } catch (err) {
    console.log(err)
  }
}
