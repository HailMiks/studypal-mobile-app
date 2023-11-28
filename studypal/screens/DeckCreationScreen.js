import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { auth } from '../config/firebase';
import { getFirestore, collection, getDoc, doc, addDoc, setUserData } from 'firebase/firestore';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const ContentSection = ({ title, placeholder, value, onChangeText }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

export default function DeckCreationScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [deckName, setDeckName] = useState('');
  const [sections, setSections] = useState([{ id: 1, questions: '', answer: '' }]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userDataState, setUserDataState] = useState({});
  
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
  
      if (currentUser) {
        const uid = currentUser.uid;
        const db = getFirestore();
        const userDocRef = doc(db, 'users', uid);
  
        try {
          const userDocSnap = await getDoc(userDocRef);
  
          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserDataState(userData);
  
            // Set categories from Firestore
            if (userData.categories) {
              // Add 'Select a category' as the first option
              setCategories(['Select a category', ...userData.categories]);
              setSelectedCategory(''); // Set the default selected category
            }
          } else {
            console.log('User document does not exist.');
          }
        } catch (error) {
          console.error('Error fetching user data:', error.message);
        }
      }
    };
  
    fetchUserData();
  }, []);
  
  

  const addNewSection = () => {
    setSections((prevSections) => [
      ...prevSections,
      { id: prevSections.length + 1, questions: '', answer: '' },
    ]);
    setCurrentIndex(sections.length);
  };

  const deleteCurrentSection = () => {
    if (sections.length > 1) {
      setSections((prevSections) => {
        const updatedSections = prevSections.filter((_, index) => index !== currentIndex);
        return updatedSections.map((section, index) => ({ ...section, id: index + 1 }));
      });
      setCurrentIndex((prevIndex) => Math.min(prevIndex, sections.length - 2));
    }
  };

  const navigateToNextSection = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, sections.length - 1));
  };

  const navigateToPreviousSection = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleInputChange = (value, field) => {
    const updatedSections = [...sections];
    updatedSections[currentIndex][field] = value;
    setSections(updatedSections);
  };

  const handleSubmit = async () => {
    try {
      if (sections.length > 0 && deckName.trim() !== '' && selectedCategory !== '') {
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          const uid = currentUser.uid;
          const db = getFirestore();
          
          // Reference to the user's document
          const userDocRef = doc(db, 'users', uid);
  
          // Reference to the 'decks' collection within the user's document
          const userDecksCollection = collection(userDocRef, 'decks');
  
          // Data for the new deck
          const deckData = {
            deckName,
            category: selectedCategory,
            sections: sections.map((section) => ({
              questions: section.questions,
              answer: section.answer,
            })),
          };
  
          // Add the deck to the 'decks' collection within the user's document
          const docRef = await addDoc(userDecksCollection, deckData);
  
          console.log('Deck successfully created with ID:', docRef.id);
  
          // Optionally, you can update other collections or documents based on your requirements.
  
          // Navigate to the HomeScreen
          navigation.navigate('Home');
        } else {
          console.log('User not authenticated.');
        }
      } else {
        console.log('Please fill in all required fields.');
      }
    } catch (error) {
      console.error('Error creating deck:', error);
    }
  };

return (
  <KeyboardAvoidingView style={{ flex: 1 }}>
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
        </View>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/signup-flash.jpg')}
          style={styles.image}
        />
      </View>
      <View style={styles.formContainer}>
        <View style={styles.form}>
          <Text style={styles.textStyle}>Add Deck</Text>
          <Text style={styles.label}>Name your Deck</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Deck Name"
            value={deckName}
            onChangeText={(value) => setDeckName(value)}
          />
          <View
            style={styles.horizontalLine}
          />
          <View style={styles.flashcardsHeader}>
            <View>
              <Text style={styles.textStyle}>Flash Cards</Text>
              <Text style={{ color: '#BDBDBD' }}>Write your QnA</Text>
            </View>
            <View style={styles.navigationButtons}>
              <TouchableOpacity onPress={navigateToPreviousSection} style={styles.navigationButton}>
                <FontAwesomeIcon name="chevron-left" style={styles.icon} />
              </TouchableOpacity>
              <TouchableOpacity onPress={navigateToNextSection} style={styles.navigationButton}>
              <FontAwesomeIcon name="chevron-right" style={styles.icon} />
              </TouchableOpacity>
            </View>
          </View>
          {sections.map((section, index) => (
            index === currentIndex && (
              <View key={section.id} style={styles.sectionContainer}>
                <Text style={styles.labelFlash}>Question</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.inputFlash, { height: 100 }]}
                    multiline={true}
                    placeholder="Enter Question"
                    value={section.questions}
                    onChangeText={(value) => handleInputChange(value, 'questions')}
                  />
                </View>
                <Text style={styles.labelFlash}>Answer</Text>
                <View style={styles.inputContainerFlash}>
                  <TextInput
                    style={styles.inputFlash}
                    placeholder="Enter Answer"
                    value={section.answer}
                    onChangeText={(value) => handleInputChange(value, 'answer')}
                  />
                </View>
              </View>
            )
          ))}
                    <View style={styles.addAndRemoveButtons}>
            <TouchableOpacity onPress={deleteCurrentSection} style={styles.deleteCardButton}>
              <Text style={styles.deleteCardButtonText}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.newCardButton} onPress={addNewSection}>
              <Text style={styles.newCardButtonText}>Add</Text>
            </TouchableOpacity>   
          </View>
          <View>
            <Text style={styles.textStyle}>Category</Text>
            <Text style={styles.label}>Add deck within:</Text>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCategory}
                onValueChange={(itemValue) => {
                  console.log('Selected Category:', itemValue);
                  setSelectedCategory(itemValue);
                }}
              >
                {categories.map((category, index) => (
                  <Picker.Item key={index} label={category} value={category} />
                ))}
              </Picker>
            </View>
          </View>
          <View style={styles.buttonsDeckCreate}>
          <TouchableOpacity style={styles.cancelCreateDeckButton} onPress={() => navigation.goBack()}>
            <Text style={styles.cancelCreateDeckButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.createDeckButton} onPress={handleSubmit}>
            <Text style={styles.createDeckButtonText}>Create</Text>
          </TouchableOpacity>
          </View>
      </View>
    </View>
    </SafeAreaView>
  </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    backButtonContainer: {
      position: 'absolute',
      top: 50,
      left: 10,
      zIndex: 1,
    },
    backButton: {
      backgroundColor: 'white',
      padding: 10,
      borderRadius: 20,
      marginLeft: 10,
    },
    imageContainer: {
      height: windowHeight * 0.4,
      overflow: 'hidden',
      marginTop: -40,
    },
    image: {
      flex: 1,
      width: null,
      height: null,
      resizeMode: 'cover',
      marginTop: -50,
      marginRight: -30,
    },
    formContainer: {
      marginTop: -180,
      flex: 1,
      backgroundColor: 'white',
      paddingHorizontal: 8,
      paddingTop: 8,
      borderTopLeftRadius: 30,
      borderTopRightRadius: 30,
    },
    form: {
      marginVertical: 35,
      marginHorizontal: 25,
    },
    textStyle: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    label: {
      color: '#BDBDBD',
      marginBottom: 5,
    },
    labelFlash: {
      color: 'black',
      marginBottom: 15,
      marginLeft: 5,
      fontSize: 13,
      fontWeight: 'bold',
    },
    input: {
      width: '300px',
      height: '45px',
      padding: 12,
      backgroundColor: 'white',
      color: 'black',
      borderRadius: 4,
      marginBottom: 20,
      borderColor: '#BDBDBD',
      borderWidth: 1,
      fontSize: 12,
    },
    inputFlash: {
      width: '300px',
      height: 'auto',
      padding: 12,
      backgroundColor: 'white',
      color: 'black',
      borderRadius: 4,
      marginHorizontal: 5,
      borderColor: '#BDBDBD',
      borderWidth: 1,
      fontSize: 12,
    },
    horizontalLine: {
        borderBottomColor: '#9F9F9F',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: -10,
        marginBottom: 20,
    },
    sectionContainer: {
      borderWidth: 1,
      borderColor: '#9F9F9F',
      borderRadius: 6,
      padding: 10,
      marginBottom: 8,
    },
    inputContainer: {
      marginBottom: 10,
    },
    createDeckButton: {
      padding: 20,
      backgroundColor: 'black',
      borderRadius: 6,
      marginBottom: 7,
      marginHorizontal: 30,
    },
    createDeckButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
    flashcardsHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 5,
    },
    navigationButtons: {
      flexDirection: 'row',
      marginVertical: 10,
    },
    navigationButton: {
      padding: 10,
      borderRadius: 5,
      marginLeft: 10,
    },
    icon: {
      color: 'black',
      fontSize: 15,
    },
    newCardButton: {
      backgroundColor: 'black',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 4,
      marginLeft: 5,
    },
    newCardButtonText: {
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
    deleteCardButton: {
      padding: 10,
      borderRadius: 4,
      borderWidth: 1,
      marginHorizontal: 10,
      borderColor: '#BDBDBD',
    },
    deleteCardButtonText: {
      fontSize: 13,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
    },
    addAndRemoveButtons: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginHorizontal: 10,
      marginBottom: 5,
    },
    pickerContainer: {
      borderWidth: 1,
      borderColor: '#9F9F9F',
      borderRadius: 5,
      marginBottom: 30,
    },
    buttonsDeckCreate: {
      flexDirection: 'row',
      justifyContent: 'space-evenly'
    },
    createDeckButton: {
      backgroundColor: 'black',
      borderRadius: 6,
      marginBottom: 7,
      marginLeft: 7,
      height: 46,
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center', 
    },
    createDeckButtonText: {
      fontSize: 17,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'white',
    },
    cancelCreateDeckButton: {
      backgroundColor: 'white',
      borderWidth: 1,
      borderRadius: 6,
      borderColor: '#9F9F9F',
      marginBottom: 7,
      marginRight: 7,
      justifyContent: 'center', 
      alignItems: 'center', 
      flex: 1,
    },    
    cancelCreateDeckButtonText: {
      fontSize: 17,
      fontWeight: 'bold',
      textAlign: 'center',
      color: 'black',
    },
  });