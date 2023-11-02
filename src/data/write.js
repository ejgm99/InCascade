import { db } from '../data/firebase.js';

export function writeDataToMapField(docId, cascade_map) {
  console.log(cascade_map)
    
    db.collection('posts').doc(docId).update(cascade_map)
    .then(() => {
      console.log('Data written to map field successfully!');
    })
    .catch((error) => {
      console.error('Error writing data to map field:', error);
    });
  }