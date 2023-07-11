import { db } from '../data/firebase.js';

export function writeDataToMapField(docId, cascade_map) {
    console.log(cascade_map)
    // Update the map field in the Firestore document
    //  
    //     cascadem : {
    //       key1: 'value1',
    //       key2: 'value2',
    //       key3: 'value3'
    //     }
    //   }

    
    db.collection('posts').doc(docId).update(cascade_map)
    .then(() => {
      console.log('Data written to map field successfully!');
    })
    .catch((error) => {
      console.error('Error writing data to map field:', error);
    });
  }