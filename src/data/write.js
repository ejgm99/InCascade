import { db } from '../data/firebase.js';
import { collection, addDoc } from 'firebase/firestore'

export function writeDataToMapField(docId, cascade_map) {
  db.collection('posts').doc(docId).update(cascade_map)
}

export function createNewDoc() {
  let post_collection_reference = collection(db, 'posts')
  let new_doc = {
    title: 'Untitled Doc Id',
    description: 'Undescribed Document'
  }
  return addDoc(post_collection_reference, new_doc)
}

export function updateDoc(docId, docKey, new_title) {
  let update_map = {}
  update_map[docKey] = new_title;
  db.collection('posts').doc(docId).update(update_map)
}

export async function deleteDocumentsWithPattern(pattern) {
  // Query the collection
  const querySnapshot = await db.collection('posts').get();
  // Filter documents based on the title pattern
  const documentsToDelete = querySnapshot.docs.filter(doc => {
    try {
      return doc.data().title.includes(pattern);
    } catch {
      return true;
    }
  })
  // Delete each document
  documentsToDelete.forEach(async doc => {
    await db.collection('posts').doc(doc.id).delete();
  });
}
