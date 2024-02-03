import { db } from '../data/firebase.js';

export async function getPost(post_id) {
  // Get the Firestore document by ID
  try {
    const docSnapshot = await db.doc(`posts/${post_id}`).get();
    return docSnapshot.data();
  } catch (err) {

  }
}

export async function getPosts() {
  let querySnapshot = await db.collection('posts').get()
  return querySnapshot.docs.map(doc => {
    return {
      data: doc.data(),
      id: doc.id
    }
  });
}
