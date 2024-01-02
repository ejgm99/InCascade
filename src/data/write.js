import { db } from '../data/firebase.js';

export function writeDataToMapField(docId, cascade_map) {
  db.collection('posts').doc(docId).update(cascade_map)
}


export function updateDoc(docId, docKey, new_title) {
  let update_map = {}
  update_map[docKey] = new_title;
  db.collection('posts').doc(docId).update(update_map)
}
