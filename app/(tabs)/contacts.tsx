import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { storeData, getData } from '../utils/storage';
import { launchImageLibrary } from 'react-native-image-picker';

// Define an interface for the data items
interface DataItem {
  id: number;
  name: string;
  phoneNumber: string;
}

export default function ObstaclesScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [data, setData] = useState<DataItem[]>([]); // Explicitly type the data state

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await getData('dataList');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    };

    fetchData();
  }, []);

  // Handle form submission to store data
  const addData = async () => {
    const newItem: DataItem = {
      id: data.length + 1,
      name,
      phoneNumber,
    };

    // Save to state and AsyncStorage (optional)
    const newData = [...data, newItem];
    setData(newData);
    await storeData('dataList', JSON.stringify(newData)); // Storing data locally

    // Reset form inputs
    setName('');
    setPhoneNumber('');
  };

  // Liste des contacts utiles
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    safeView: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginRight: insets.right,
      marginLeft: insets.left,
      flex: 1,
      padding: 16,
      borderWidth: 1,
      borderColor: 'black',
      justifyContent: 'center',
      alignItems: 'center',
    },
    contactUtile: {
      padding: 10,
      marginVertical: 8,
      borderBottomWidth: 1,
      backgroundColor: 'gray',
    },
  });

  const contactList = [
    { id: 1, name: 'Police', phoneNumber: '17' },
    { id: 2, name: 'Pompiers', phoneNumber: '18' },
    { id: 3, name: 'Samu', phoneNumber: '15' },
    { id: 4, name: 'Gendarmerie', phoneNumber: '112' },
    { id: 5, name: 'Urgences médicales', phoneNumber: '116 117' },
  ];
  const Item = ({ id, name, phoneNumber }: DataItem) => (
    <View style={styles.contactUtile}>
      <Text>Name: {name}</Text>
      <Text>Phone Number: {phoneNumber}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeView}>
        <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold', alignItems: 'center', marginTop: 30 }}>
          Liste de contacts utiles
        </Text>
        <FlatList 
        data={contactList}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id.toString()}
      />
      </SafeAreaView>
    </View>
    
  );
}
