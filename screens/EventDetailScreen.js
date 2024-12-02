import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';

export default function EventDetailScreen({ route }) {
  const { event } = route.params;

  const toggleFavorite = async () => {
    const eventRef = doc(firestore, 'events', event.id);
    await updateDoc(eventRef, { isFavorite: !event.isFavorite });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{event.name}</Text>
      <Button
        title={event.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        onPress={toggleFavorite}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
});
