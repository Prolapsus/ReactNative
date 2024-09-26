import AsyncStorage from '@react-native-async-storage/async-storage';

// Save data
export const storeData = async (key: string, value: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // Handle saving error
    console.error("Error saving data: ", e);
  }
};

// Retrieve data
export const getData = async (key: string): Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? value : null;
  } catch (e) {
    // Handle retrieval error
    console.error("Error retrieving data: ", e);
    return null;
  }
};

// Remove data
export const removeData = async (key: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // Handle removing error
    console.error("Error removing data: ", e);
  }
};
