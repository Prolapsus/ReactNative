import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  FlatList,
  StyleSheet,
  Text,
  Image,
  Button,
  Modal,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getData, removeData, storeData } from '../utils/storage';
import { launchImageLibrary } from 'react-native-image-picker';

interface DataItem {
  id: number;
  name: string;
  indication: string;
  position: string;
  imageUri: string;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState<DataItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [indication, setIndication] = useState('');
  const [position, setPosition] = useState('');
  const [imageUri, setImageUri] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const storedData = await getData('dataList');
      if (storedData) {
        setData(JSON.parse(storedData));
      }
    };

    fetchData();
  }, []);

  const addData = async () => {
    const newItem: DataItem = {
      id: data.length + 1,
      name,
      indication,
      position,
      imageUri,
    };

    const newData = [...data, newItem];
    setData(newData);
    await storeData('dataList', JSON.stringify(newData));

    setName('');
    setIndication('');
    setPosition('');
    setImageUri('');
    setModalVisible(false);
  };

  const selectImage = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0 && response.assets[0].uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const styles = StyleSheet.create({
    safeView: {
      marginTop: insets.top,
      marginBottom: insets.bottom,
      marginRight: insets.right,
      marginLeft: insets.left,
      flex: 1,
      padding: 16,
      justifyContent: 'center',
    },
    item: {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: 'gray',
    },
    titleContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 25,
      marginTop: 25,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    image: {
      width: 100,
      height: 100,
      alignSelf: 'center',
      marginTop: 10,
      marginBottom: 10,
    },
    modalView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'white',
      padding: 20,
    },
    input: {
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      marginBottom: 10,
      paddingLeft: 10,
      width: '100%',
    },
    buttonContainer: {
      marginVertical: 10,
    },
    imagePicker: {
      marginBottom: 10,
    },
  });

  const Item = ({ name, indication, position, imageUri }: DataItem) => (
    <View style={styles.item}>
      <Text>Name: {name}</Text>
      <Text>Indication: {indication}</Text>
      <Text>Position: {position}</Text>
      {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
      <Button
        title="Remove"
        onPress={async () => {
          const newData = data.filter((item) => item.name !== name);
          setData(newData);
          await removeData('dataList');
          await storeData('dataList', JSON.stringify(newData));
        }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeView}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Liste des obstacles <Button title="Add Obstacle" onPress={() => setModalVisible(true)} /></Text>
        
      </View>
      <FlatList
        data={data}
        renderItem={({ item }) => <Item {...item} />}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalView}>
          <Text style={{ fontSize: 20, marginBottom: 10, fontWeight: 'bold' }}>
            Ajouter un obstacle
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Indication"
            value={indication}
            onChangeText={setIndication}
          />
          <TextInput
            style={styles.input}
            placeholder="Enter Position"
            value={position}
            onChangeText={setPosition}
          />
          <View style={styles.buttonContainer}>
            <Button title="Select Image" onPress={selectImage} />
          </View>
          {imageUri ? <Image source={{ uri: imageUri }} style={styles.image} /> : null}
          <View style={styles.buttonContainer}>
            <Button title="Add Data" onPress={addData} />
          </View>
          <View style={styles.buttonContainer}>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}