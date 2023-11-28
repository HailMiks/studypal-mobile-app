import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getFirestore } from 'firebase/firestore';
import { collection, addDoc, setDoc, doc } from 'firebase/firestore';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async () => {
    if (email && password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
  
        const db = getFirestore();
        const usersCollection = collection(db, 'users');
  
        const uid = user.uid;
  
        const docRef = doc(usersCollection, uid); // Set the document ID to be the UID
        await setDoc(docRef, {
          userName: userName,
          email: email,
          // Add any other fields you want to store
        });
  
        console.log('Document written with ID: ', uid);
        console.log('User UID:', user.uid);
        console.log('UserName:', userName);
        console.log('Email:', email);
  
      } catch (err) {
        console.error('Error:', err);
      }
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
          <Text style={styles.label}>User Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Name"
            value={userName}
            onChangeText={(value) => setUserName(value)}
          />
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="t1.faker@gmail.com"
            value={email}
            onChangeText={(value) => setEmail(value)}
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            placeholder="Enter Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
          />
          <TouchableOpacity style={styles.signupButton} onPress={handleSubmit}>
            <Text style={styles.signupButtonText}>SIGN UP</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLink}> Log in</Text>
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
    flex: 2,
    backgroundColor: 'white',
    paddingHorizontal: 8,
    paddingTop: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  form: {
    marginVertical: 84,
  },
  label: {
    color: '#9F9F9F',
    marginLeft: 30,
    marginBottom: 5,
  },
  input: {
    width: '300px',
    height: '45px',
    padding: 12,
    backgroundColor: 'white',
    color: '#9F9F9F',
    borderRadius: 4,
    marginBottom: 20,
    marginHorizontal: 30,
    borderColor: '#9F9F9F',
    borderWidth: 1,
  },
  signupButton: {
    padding: 20,
    backgroundColor: 'black',
    borderRadius: 6,
    marginBottom: 7,
    marginHorizontal: 30,
  },
  signupButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  loginText: {
    color: 'gray',
    fontWeight: '600',
  },
  loginLink: {
    color: '#00a8e8',
    fontWeight: '600',
  },
});
