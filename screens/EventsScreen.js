// import React, { useEffect, useState } from 'react';
// import { View, Text, FlatList, Button, TextInput, StyleSheet, Alert } from 'react-native';
// import { signOut } from 'firebase/auth';
// import { collection, addDoc, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
// import { auth, firestore } from '../firebase';

// export default function EventsScreen({ navigation }) {
//   const [events, setEvents] = useState([]);
//   const [newEvent, setNewEvent] = useState('');
//   const user = auth.currentUser;

//   useEffect(() => {
//     const q = query(collection(firestore, 'events'), where('userId', '==', user.uid));
//     const unsubscribe = onSnapshot(q, snapshot => {
//       setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
//     });
//     return unsubscribe;
//   }, []);

//   const addEvent = async () => {
//     if (!newEvent.trim()) {
//       Alert.alert('Error', 'Event name cannot be empty.');
//       return;
//     }
//     await addDoc(collection(firestore, 'events'), {
//       name: newEvent,
//       userId: user.uid,
//     });
//     setNewEvent('');
//   };

//   const deleteEvent = async id => {
//     await deleteDoc(doc(firestore, 'events', id));
//   };

//   const editEvent = async (id, newName) => {
//     await updateDoc(doc(firestore, 'events', id), { name: newName });
//   };

//   return (
//     <View style={styles.container}>
//       <Button title="Log Out" onPress={() => signOut(auth).then(() => navigation.replace('Auth'))} />
//       <TextInput
//         style={styles.input}
//         placeholder="New Event"
//         value={newEvent}
//         onChangeText={setNewEvent}
//       />
//       <Button title="Add Event" onPress={addEvent} />
//       <FlatList
//         data={events}
//         keyExtractor={item => item.id}
//         renderItem={({ item }) => (
//           <View style={styles.eventItem}>
//             <Text>{item.name}</Text>
//             <Button title="Edit" onPress={() => {
//               const newName = prompt('Enter new name:', item.name);
//               if (newName) editEvent(item.id, newName);
//             }} />
//             <Button title="Delete" onPress={() => deleteEvent(item.id)} />
//           </View>
//         )}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16 },
//   input: { borderWidth: 1, padding: 8, marginVertical: 8 },
//   eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
// });


import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { signOut } from 'firebase/auth';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function EventsScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState('');
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [updatedName, setUpdatedName] = useState('');
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(firestore, 'events'), where('userId', '==', user.uid));
    const unsubscribe = onSnapshot(q, snapshot => {
      setEvents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return unsubscribe;
  }, []);

  const addEvent = async () => {
    if (!newEvent.trim()) {
      Alert.alert('Error', 'Event name cannot be empty.');
      return;
    }
    await addDoc(collection(firestore, 'events'), {
      name: newEvent,
      userId: user.uid,
      isFavorite: false, // Initialize with isFavorite = false
    });
    setNewEvent('');
  };

  const deleteEvent = async id => {
    await deleteDoc(doc(firestore, 'events', id));
  };

  const toggleFavorite = async id => {
    const eventRef = doc(firestore, 'events', id);
    const event = events.find(e => e.id === id);
    if (event) {
      await updateDoc(eventRef, { isFavorite: !event.isFavorite });
    }
  };

  const saveUpdatedEvent = async () => {
    if (!updatedName.trim()) {
      Alert.alert('Error', 'Event name cannot be empty.');
      return;
    }
    await updateDoc(doc(firestore, 'events', selectedEvent.id), { name: updatedName });
    setEditModalVisible(false);
    setUpdatedName('');
    setSelectedEvent(null);
  };

  return (
    <View style={styles.container}>
      <Button title="Log Out" onPress={() => signOut(auth).then(() => navigation.replace('Auth'))} />
      <TextInput
        style={styles.input}
        placeholder="New Event"
        value={newEvent}
        onChangeText={setNewEvent}
      />
      <Button title="Add Event" onPress={addEvent} />
      <FlatList
        data={events}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.eventItem}>
            <Text>{item.name}</Text>
            <Button
              title={item.isFavorite ? 'Unfavorite' : 'Favorite'}
              onPress={() => toggleFavorite(item.id)}
            />
            <Button
              title="Edit"
              onPress={() => {
                setSelectedEvent(item);
                setUpdatedName(item.name);
                setEditModalVisible(true);
              }}
            />
            <Button title="Delete" onPress={() => deleteEvent(item.id)} />
          </View>
        )}
      />

      {/* Modal for Editing Event */}
      {selectedEvent && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={editModalVisible}
          onRequestClose={() => {
            setEditModalVisible(false);
            setSelectedEvent(null);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text>Edit Event</Text>
              <TextInput
                style={styles.input}
                placeholder="Event Name"
                value={updatedName}
                onChangeText={setUpdatedName}
              />
              <Pressable style={styles.button} onPress={saveUpdatedEvent}>
                <Text style={styles.buttonText}>Save</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 8, marginVertical: 8 },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: 'white', padding: 16, borderRadius: 8, width: '80%' },
  button: { backgroundColor: 'blue', padding: 10, marginVertical: 8, borderRadius: 5 },
  buttonText: { color: 'white', textAlign: 'center' },
  cancelButton: { backgroundColor: 'gray' },
});
