import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Video } from 'expo-av';


const WelcomeScreen = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container}>
      <Video
        source={{ uri: 'https://i.imgur.com/tJYWOW7.mp4' }}
        style={[styles.backgroundVideo, { transform: [{ rotate: '-180deg' }] }]}
        resizeMode="cover"
        isLooping
        shouldPlay
        useNativeControls={false}
      />
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Studypal!</Text>
        <View style={styles.imageContainer}>
          <Image
            source={require('../assets/images/welcome.png')}
            style={styles.image}
          />
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            style={styles.button}>
            <Text style={styles.buttonText}>SIGN UP</Text>
          </TouchableOpacity>
          <View style={styles.loginContainer}>
            <Text style={styles.text}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={[styles.text, styles.loginText]}> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    marginVertical: 4,
  },
  title: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
  },
  imageContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  image: {
    width: 350,
    height: 350,
    shadowColor: 'black',
    shadowOffset: { width: 30, height: 30 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
  },
  buttonContainer: {
    marginVertical: 10, 
  },
  button: {
    paddingVertical: 20,
    backgroundColor: 'black',
    marginHorizontal: 30, 
    borderRadius: 20, 
    shadowColor: 'rgba(0, 0, 0, 0.25)', 
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 5, 
  },
  buttonText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10, 
  },
  text: {
    paddingTop: 15,
    color: '#9F9F9F',
    fontWeight: '600',
  },
  loginText: {
    fontWeight: '600',
    color: '#00a8e8',
  },
});

export default WelcomeScreen;
