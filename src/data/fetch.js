import { db } from '../data/firebase.js';

export async function getPost(post_id) {
  // Get the Firestore document by ID
  try {
    const docSnapshot = await db.doc(`posts/${post_id}`).get();
    console.log(docSnapshot)
    return docSnapshot.data();
  } catch (err) {
    console.log(err)
  }
  // Access the child element by its property name
  // console.log(docSnapshot.data())
}
