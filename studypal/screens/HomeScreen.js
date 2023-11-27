import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  DrawerLayoutAndroid,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation(); 
  const drawerRef = useRef(null);
  const [userData, setUserData] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);
  const [newCategory, setNewCategory] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

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
            setUserData(userData);

            // Set categories from Firestore
            if (userData.categories) {
              setCategories(['All', ...userData.categories]);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const openDrawer = () => {
    drawerRef.current.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current.closeDrawer();
  };

  const navigateToScreen = (screen) => {
    console.log(`Navigate to ${screen}`);
    closeDrawer();
  };
  
  const navigationView = (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerProfile}>
        <TouchableOpacity onPress={() => navigateToScreen('Screen1')}>
          <View style={styles.circleContainer}>
            <Image
              source={require('../assets/images/cat.jpg')}
              style={styles.iconImage}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.userDataContainer}>
          <Text style={styles.userName}>{userData.userName}</Text>
          <Text style={styles.email}>{userData.email}</Text>
        </View>
      </View>
      <View style={styles.buttonsDrawer}>
        <TouchableOpacity style={styles.drawerItemContainer} onPress={() => navigateToScreen('Screen1')}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon name="user" style={styles.icon} />
          </View>
          <Text style={styles.drawerItem}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.drawerItemContainer} onPress={() => navigateToScreen('Screen2')}>
          <View style={styles.iconContainer}>
            <FontAwesomeIcon name="question-circle" style={styles.icon} />
          </View>
          <Text style={styles.drawerItem}>About</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <View style={styles.iconContainer}>
          <FontAwesomeIcon name="sign-out" style={styles.icon} />
        </View>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryButtons = () => {
    return categories.map((category, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setSelectedCategory(category)}
        onLongPress={() => deleteCategoryConfirmation(category)}
      >
        <View style={styles.categoryButtonContainer}>
          <View
            style={[
              styles.categoryButton,
              {
                backgroundColor:
                  selectedCategory === category ? '#D9D9D9' : 'white',
                color: selectedCategory === category ? 'white' : 'black',
              },
            ]}
          >
            <Text style={styles.categoryButtonText}>{category}</Text>
          </View>
        </View>
      </TouchableOpacity>
    ));
  };

  const deleteCategoryConfirmation = (categoryToDelete) => {
    Alert.alert(
      'Delete Category',
      `Are you sure you want to delete the category '${categoryToDelete}'?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteCategory(categoryToDelete),
        },
      ]
    );
  };

  const addCategory = async () => {
    if (newCategory.trim() !== '') {
      // Update categories in Firestore
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;
      const db = getFirestore();
      const userDocRef = doc(db, 'users', uid);
  
      try {
        await updateDoc(userDocRef, {
          categories: arrayUnion(newCategory),
        });
  
        // Update local state
        setCategories((prevCategories) => {
          // Check if 'All' is already in the categories list
          const categoriesWithoutAll = prevCategories.filter(cat => cat !== 'All');
  
          return ['All', ...categoriesWithoutAll, newCategory];
        });
  
        setNewCategory('');
        setModalVisible(false);
      } catch (error) {
        console.error('Error updating categories:', error.message);
      }
    }
  };

  const deleteCategory = async (categoryToDelete) => {
    if (categoryToDelete !== 'All') {
      // Update categories in Firestore
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;
      const db = getFirestore();
      const userDocRef = doc(db, 'users', uid);
  
      try {
        await updateDoc(userDocRef, {
          categories: arrayRemove(categoryToDelete),
        });
  
        // Update local state
        setCategories((prevCategories) =>
          prevCategories.filter((category) => category !== categoryToDelete)
        );
      } catch (error) {
        console.error('Error deleting category:', error.message);
      }
    } else {
      // Handle the case where the user tries to delete the "All" category
      Alert.alert("Cannot delete this category.");
      console.warn();("Cannot delete 'All' category.");
    }
  };

  const navigateToDeckCreation = () => {
    navigation.navigate('DeckCreation');
  };

  return (
    <DrawerLayoutAndroid
      ref={drawerRef}
      drawerWidth={255} // Adjust this value to make the drawer wider
      drawerPosition={'right'}
      renderNavigationView={() => navigationView}
    >
      <SafeAreaView style={styles.homeStyles}>
        <View style={styles.header}>
          <Text style={styles.headerText}>My{'\n'}Decks</Text>
          <TouchableOpacity onPress={openDrawer} style={styles.hamburgerIcon}>
            <View style={styles.circleContainer}>
              <Image
                source={require('../assets/images/cat.jpg')}
                style={styles.iconImage}
              />
            </View>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoryButtonsScrollView}
          contentContainerStyle={{ paddingHorizontal: 25, ...styles.categoryButtonsContainer }}
        >
          {renderCategoryButtons()}
          <TouchableOpacity
            style={styles.addCategoryButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addCategoryButtonText}>&#65291;</Text>
          </TouchableOpacity>
        </ScrollView>

        {selectedCategory === 'All' && (
          <View style={styles.deckContainer}>
            <TouchableOpacity style={styles.deck}>
              <Text>Hey</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Modal for adding new category */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add New Category</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Enter category name"
                value={newCategory}
                onChangeText={(text) => setNewCategory(text)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, { borderColor: '#9F9F9F', borderWidth: 1 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={[styles.modalButtonText, { color: 'black' }]}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: 'black', color: 'white' }]}
                  onPress={addCategory}
                >
                  <Text style={styles.modalButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <TouchableOpacity
          style={styles.plusButton}
          onPress={navigateToDeckCreation}
        >
          <Text style={styles.plusButtonText}>&#65291;</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </DrawerLayoutAndroid>
  );
}

const styles = StyleSheet.create({
  homeStyles: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 50,
    paddingHorizontal: 18.5,
  },
  circleContainer: {
    width: 64,
    height: 64,
    borderWidth: 0.5,
    borderRadius: 32,
    backgroundColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  drawerProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 41,
    marginHorizontal: 24,
  },
  iconImage: {
    width: 75,
    height: 75,
    resizeMode: 'contain',
  },
  userDataContainer: {
    marginLeft: 10,
  },
  headerText: {
    fontSize: 80,
    fontWeight: 'regular',
    lineHeight: 73,
    letterSpacing: 0.25,
  },
  logoutButton: {
    marginTop: 'auto',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 35,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#09090A',
    fontSize: 15,
    marginLeft: 5,
    marginBottom: 3,
  },
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: 'white',
  },
  buttonsDrawer: {
    marginTop: 20,
    marginLeft: 20,
  },
  drawerItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  drawerItem: {
    fontSize: 15,
    padding: 8,
    paddingBottom: 25,
    marginTop: 15,
    color: 'black',
  },
  iconContainer: {
    marginRight: 5,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    maxWidth: 170,
    overflow: 'hidden',
  },
  icon: {
    fontSize: 20,
    marginRight: 5,
  },
  categoryButtonContainer: {
    flexDirection: 'row',
    marginTop: 7,
    marginLeft: 5,
    maxHeight: 60,
  },
  addCategoryButton: {
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#9F9F9F',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  addCategoryButtonText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'black',
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#9F9F9F',
    justifyContent: 'center',
  },
  categoryButtonText: {
    fontSize: 16,
  },
  categoryButtonsScrollView: {
    maxHeight: 60,
  },
  deckContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 25,
    marginHorizontal: 25,
  },
  deck: {
    backgroundColor: '#D9D9D9',
    marginHorizontal: 25,
    marginBottom: 10,
    width: '100%',
    height: 190,
    borderRadius: 15,
  },
  deleteButton: {
    borderWidth: 1,
    padding: 3,
    marginBottom: 20,
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    width: 250,
    borderColor: '#9F9F9F',
    borderWidth: 2,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: 'auto',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    color: 'white',
  },
  modalContent: {
    paddingVertical: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 20,
  },
  plusButton: {
    position: 'absolute',
    bottom: 20,
    justifyContent: 'center',
    backgroundColor: 'black',
    borderRadius: 35,
    width: 70,
    height: 70,
    alignItems: 'center',
    left: '50%',
    transform: [{ translateX: -35 }], 
  },
  
  plusButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
});


