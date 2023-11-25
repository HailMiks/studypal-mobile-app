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
  Button,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../config/firebase';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen() {
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
      <View key={index} style={styles.categoryButtonContainer}>
        <TouchableOpacity
          style={[
            styles.categoryButton,
            {
              backgroundColor: selectedCategory === category ? '#D9D9D9' : 'white',
              color: selectedCategory === category ? 'white' : 'black',
            },
          ]}
          onPress={() => setSelectedCategory(category)}
        >
          <Text style={styles.categoryButtonText}>{category}</Text>
        </TouchableOpacity>
        {category !== 'All' && (
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => deleteCategory(category)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        )}
      </View>
    ));
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
          contentContainerStyle={styles.categoryButtonsContainer}
        >
          {renderCategoryButtons()}
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.categoryButtonText}>+</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.contentBelowButtons}>
          <Text>Hey</Text>
        </View>

        {/* Modal for adding new category */}
        <Modal
          animationType="slide"
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
              <Button title="Add" onPress={addCategory} />
              <Button title="Cancel" onPress={() => setModalVisible(false)} />
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',  // Align items in the center vertically
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
    fontSize: 20,
    padding: 8,
    paddingBottom: 25,
    marginTop: 15,
    color: 'black',
    fontSize: 15,
    marginLeft: 1,
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
    marginLeft: 25,
    maxHeight: 60,
  },
  addCategoryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addCategoryButtonText: {
    fontSize: 16,
    color: 'white',
  },
  categoryButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#9F9F9F',
    marginHorizontal: 5,
    justifyContent: 'center',
  },
  categoryButtonText: {
    fontSize: 16,
    color: 'black', // Default font color
  },
  categoryButtonsScrollView: {
    maxHeight: 60,  // Set a maximum height for the ScrollView
  },
  contentBelowButtons: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'lightgray',
    marginTop: 25,
    marginHorizontal: 25,
  },
});
