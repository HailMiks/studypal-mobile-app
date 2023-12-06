import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore'; 
import { auth } from '../config/firebase'; 

const FieldScreen = ({ route, navigation }) => {
  const { deckId } = route.params;
  const [deck, setDeck] = useState(null);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [shuffledSections, setShuffledSections] = useState([]);

  const fetchDeck = async () => {
    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const uid = currentUser.uid;
        const db = getFirestore();
        const deckRef = doc(collection(db, 'users', uid, 'decks'), deckId);

        const deckDoc = await getDoc(deckRef);

        if (deckDoc.exists()) {
          const deckData = deckDoc.data();

          setDeck({
            deckId: deckDoc.id,
            deckName: deckData.deckName,
            category: deckData.category,
            sections: deckData.sections,
          });
        }
      }
    } catch (error) {
      console.error('Error fetching deck:', error.message);
    }
  };

  useEffect(() => {
    const fetchDeck = async () => {
      try {
        const currentUser = auth.currentUser;

        if (currentUser) {
          const uid = currentUser.uid;
          const db = getFirestore();
          const deckRef = doc(collection(db, 'users', uid, 'decks'), deckId);

          const deckDoc = await getDoc(deckRef);

          if (deckDoc.exists()) {
            const deckData = deckDoc.data();

            setDeck({
              deckId: deckDoc.id,
              deckName: deckData.deckName,
              category: deckData.category,
              sections: deckData.sections,
            });

            navigation.setOptions({
              headerTitle: deckData.deckName,
            });
          }
        }
      } catch (error) {
        console.error('Error fetching deck:', error.message);
      }
    };

    fetchDeck();
  }, [deckId]);

  const handleNextSection = () => {
    setShowAnswer(false); // Reset to not show the answer for the next section
    setCurrentSectionIndex((prevIndex) => Math.min(prevIndex + 1, deck.sections.length - 1));
  };

  const handleToggleAnswer = () => {
    setShowAnswer((prevShowAnswer) => !prevShowAnswer);
  };

  const handleShuffle = () => {
    const clonedSections = [...deck.sections];

    // Shuffle the clonedSections array using Fisher-Yates algorithm
    for (let i = clonedSections.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [clonedSections[i], clonedSections[j]] = [clonedSections[j], clonedSections[i]];
    }

    // Set the shuffledSections state to trigger a re-render
    setShuffledSections(clonedSections);
    setCurrentSectionIndex(0); 
    setShowAnswer(false); 
  };

  const renderCurrentSection = () => {
    if (!deck || !deck.sections || deck.sections.length === 0) {
      return null;
    }

    const currentSection = shuffledSections.length > 0 ? shuffledSections[currentSectionIndex] : deck.sections[currentSectionIndex];

    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={handleToggleAnswer}>
          <View style={styles.fieldItem}>
            <Text style={styles.question}>{currentSection.questions}</Text>
            {showAnswer && <Text style={styles.answer}>Answer: {currentSection.answer}</Text>}
          </View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={handleShuffle} style={styles.shuffleButton}>
            <Text style={styles.buttonText}>Shuffle</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextSection} style={styles.nextButton}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return renderCurrentSection();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  fieldItem: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 15,
    padding: 10,
    marginBottom: 10,
    width: 320, 
    height: 200, 
    alignItems: 'center',
    justifyContent: 'center',
  },
  shuffleButton: {
    fontSize: 16,
    width: 103,
    height: 40,
    borderRadius: 15,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 24,
  },
  nextButton: {
    fontSize: 16,
    width: 103,
    height: 40,
    borderRadius: 15,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  question: {
    fontSize: 20,
  },
  answer: {
    fontWeight: 'bold',
  }
});

export default FieldScreen;
