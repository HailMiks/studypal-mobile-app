import React from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, StyleSheet, Dimensions, KeyboardAvoidingView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default function SignUpScreen() {
  const navigation = useNavigation();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: themeColors.bg }}>
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
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            value="john snow"
            placeholder="Enter Name"
          />
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value="john@gmail.com"
            placeholder="Enter Email"
          />
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            value="test12345"
            placeholder="Enter Password"
          />
          <TouchableOpacity style={styles.signupButton}>
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
    backgroundColor: '#4957D4',
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
    color: '#4957D4',
    fontWeight: '600',
  },
});
