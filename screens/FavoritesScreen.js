import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Button, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../firebase';

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(firestore, 'events'),
      where('userId', '==', user.uid),
      where('isFavorite', '==', true)
    );

    const unsubscribe = onSnapshot(q, snapshot => {
      setFavorites(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    return unsubscribe;
  }, []);

  const removeFavorite = async id => {
    const eventRef = doc(firestore, 'events', id);
    await updateDoc(eventRef, { isFavorite: false });
  };

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <Text style={styles.noFavorites}>No favorite events yet.</Text>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.favoriteItem}>
              <Text>{item.name}</Text>
              <Button title="Remove from Favorites" onPress={() => removeFavorite(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  favoriteItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  noFavorites: { textAlign: 'center', marginTop: 20, fontSize: 16, color: 'gray' },
});
