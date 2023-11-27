import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [deckName, setDeckName] = useState('');
    const [questions, setQuestions] = useState('');
    const [answer, setAnswer] = useState('');

    const handleSubmit = async () => {
        try {
        const db = getFirestore();
        const decksCollection = collection(db, 'decks');

        const deckData = {
            deckName,
            questions,
            answer,
        };

        await addDoc(decksCollection, deckData);

        console.log('Deck successfully created:', deckData);
        } catch (error) {
        console.error('Error creating deck:', error);
        }
    };

return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
        <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.backButtonContainer}>
            <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            >
            <ArrowLeftIcon size={20} color="black" />
            </TouchableOpacity>
        </View>
        <View style={styles.imageContainer}>
            <Image
            source={require('../assets/images/signup-flash.jpg')}
            style={styles.image}
            />
        </View>
      </SafeAreaView>
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
                <Text style={styles.label}>Questions</Text>
                <TextInput
                style={styles.input}
                placeholder="Enter Questions"
                value={questions}
                onChangeText={(value) => setQuestions(value)}
                />
                <Text style={styles.label}>Answer</Text>
                <TextInput
                style={styles.input}
                placeholder="Enter Answer"
                value={answer}
                onChangeText={(value) => setAnswer(value)}
                />
                <TouchableOpacity style={styles.createDeckButton} onPress={handleSubmit}>
                <Text style={styles.createDeckButtonText}>CREATE DECK</Text>
                </TouchableOpacity>
            </View>
        </View>
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
      flex: 5,
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
    input: {
      width: '300px',
      height: '45px',
      padding: 12,
      backgroundColor: 'white',
      color: 'black',
      borderRadius: 4,
      marginBottom: 20,
      borderColor: '#9F9F9F',
      borderWidth: 1,
    },
    horizontalLine: {
        borderBottomColor: '#9F9F9F',
        borderBottomWidth: StyleSheet.hairlineWidth,
        marginTop: -10,
        marginBottom: 20,
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
  });