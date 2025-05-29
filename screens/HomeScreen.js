import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  FlatList
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { fetchWordDefinition } from "../utils/dictionaryApi";
import { useWordOfTheDay } from "../utils/useWordOfTheDay";
import {
  saveRecentWord,
  getRecentWords,
  removeRecentWord,
  clearAllRecentWords,
} from "../utils/recentSearches";
import RecentItem from "../components/RecentItem";

export default function HomeScreen({ navigation }) {
  const [greeting, setGreeting] = useState("");
  const [searchText, setSearchText] = useState("");
  const [recentWords, setRecentWords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const { wordData, loading } = useWordOfTheDay(); // Destructure wordData and loading
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  // Custom Alert/Message Box
  const showMessage = (message) => {
    setModalMessage(message);
    setModalVisible(true);
  };

  const handleSearch = async () => {
    const query = searchText.trim();
    if (!query) {
      showMessage("Please enter a word to search.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchWordDefinition(query);

      if (result) {
        await saveRecentWord(query);
        const words = await getRecentWords();
        setRecentWords(words);
        navigation.navigate("WordDetail", { wordData: result });
      } else {
        showMessage("Word not found. Please try another word.");
      }
    } catch (error) {
      console.error("Error fetching word definition:", error);
      showMessage("An error occurred. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecentSearch = async (word) => {
    setIsLoading(true);
    try {
      const result = await fetchWordDefinition(word);
      if (result) {
        await saveRecentWord(word);
        const words = await getRecentWords();
        setRecentWords(words);
        navigation.navigate("WordDetail", { wordData: result });
      } else {
        showMessage("Word not found. Please try another word.");
      }
    } catch (error) {
      console.error("Error fetching recent word definition:", error);
      showMessage("An error occurred. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for Word of the Day tap
  const handleWordOfTheDayPress = async () => {
    if (!wordData?.word) {
      showMessage("Word of the Day is not available.");
      return;
    }

    setIsLoading(true);
    try {
      const result = await fetchWordDefinition(wordData.word);
      if (result) {
        await saveRecentWord(wordData.word);
        const words = await getRecentWords();
        setRecentWords(words);
        navigation.navigate("WordDetail", { wordData: result });
      } else {
        showMessage("Word details not found. Please try again.");
      }
    } catch (error) {
      console.error("Error fetching Word of the Day details:", error);
      showMessage("An error occurred. Please check your internet connection.");
    } finally {
      setIsLoading(false);
    }
  };

    const handleDeleteRecent = async (word) => {
    try {
      await removeRecentWord(word);
      const updatedWords = await getRecentWords();
      setRecentWords(updatedWords);
    } catch (error) {
      console.error('Error deleting recent word:', error);
      showMessage('Failed to delete recent search.');
    }
  };

  const handleClearAllRecents = async () => {
    await clearAllRecentWords();
    setRecentWords([]);
  };

  const greetings = [
    "Welcome!",
    "Hello!",
    "Hi!",
    "Welcome Back!",
    "Greetings!",
  ];

  // Determine greeting randomly
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setGreeting(greetings[randomIndex]);
  }, []);

  // Load recent words on component mount
  useEffect(() => {
    const loadRecent = async () => {
      const words = await getRecentWords();
      setRecentWords(words);
    };
    loadRecent();
  }, []);

  // Add debug logging for wordOfTheDay
  useEffect(() => {
    console.log("WordOfTheDay state changed:", wordData, loading);
  }, [wordData, loading]);

  // Get the first definition for Word of the Day display
  const getWordOfTheDayDefinition = () => {
    if (
      wordData &&
      Array.isArray(wordData.definitions) &&
      wordData.definitions.length > 0
    ) {
      return wordData.definitions[0].definition || "Definition not available";
    }
    return "Definition not available";
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? "#111" : "#fff" }]}
    >
      {/* Custom Alert Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: isDark ? "#333" : "#fff" },
            ]}
          >
            <Text
              style={[styles.modalText, { color: isDark ? "#fff" : "#000" }]}
            >
              {modalMessage}
            </Text>
            <TouchableOpacity
              style={[
                styles.modalButton,
                { backgroundColor: isDark ? "#555" : "#008080" },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: isDark ? "#fff" : "#000" }]}>
          {greeting}
        </Text>
        <TouchableOpacity
          onPress={toggleTheme}
          accessibilityLabel="Toggle theme"
        >
          <Ionicons
            name={isDark ? "sunny" : "moon"}
            size={24}
            color={isDark ? "#fff" : "#000"}
          />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDark ? "#333" : "#eee",
            color: isDark ? "#fff" : "#000",
          },
        ]}
        placeholder="Search for a word"
        placeholderTextColor={isDark ? "#aaa" : "#666"}
        value={searchText}
        onChangeText={setSearchText}
        onSubmitEditing={handleSearch}
        editable={!isLoading}
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#444" : "#008080" },
        ]}
        onPress={handleSearch}
        disabled={isLoading}
        accessibilityLabel="Search button"
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={{
              color: "#fff",
              textAlign: "center",
              fontSize: 16,
            }}
          >
            Search
          </Text>
        )}
      </TouchableOpacity>

      {/* Word of the Day Section */}
      <TouchableOpacity
        style={[
          styles.wordCard,
          { backgroundColor: isDark ? "#222" : "#f0f0f0" },
        ]}
        onPress={handleWordOfTheDayPress}
        activeOpacity={0.7}
        disabled={loading || !wordData?.word}
      >
        {loading ? (
          <>
            <Text style={[styles.wordTitle, { color: isDark ? "#fff" : "#000" }]}>
              Word of the Day
            </Text>
            <Text style={{ color: isDark ? "#ccc" : "#333" }}>
              Loading word of the day...
            </Text>
          </>
        ) : (
          <>
            <Text style={[styles.wordTitle, { color: isDark ? "#fff" : "#000" }]}>
              Word of the Day: {wordData?.word || "Not available"}
            </Text>
            <Text
              style={[styles.wordDefinition, { color: isDark ? "#ccc" : "#333" }]}
            >
              {wordData?.word ? getWordOfTheDayDefinition() : "Definition not available"}
            </Text>
            {wordData?.note && (
              <Text
                style={{
                  fontSize: 12,
                  fontStyle: "italic",
                  color: isDark ? "#aaa" : "#555",
                }}
              >
                {wordData.note}
              </Text>
            )}
            {wordData?.definitions?.[0]?.partOfSpeech && (
              <Text style={{ fontSize: 12, color: isDark ? "#888" : "#666" }}>
                Part of Speech: {wordData.definitions[0].partOfSpeech}
              </Text>
            )}
            {wordData?.word && (
              <Text style={[styles.tapHint, { color: isDark ? "#888" : "#666" }]}>
                Tap to view full details
              </Text>
            )}
          </>
        )}
      </TouchableOpacity>

       {recentWords.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <View style={styles.recentHeader}>
            <Text
              style={[styles.recentTitle, { color: isDark ? "#fff" : "#000" }]}
            >
              Recent Searches
            </Text>
            <TouchableOpacity
              onPress={handleClearAllRecents}
              accessibilityLabel="Clear all recent searches"
            >
              <Text style={{ color: "#FF3B30" }}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={recentWords}
            keyExtractor={(item, index) => `${item}-${index}`}
            renderItem={({ item }) => (
              <RecentItem
                word={item}
                isDark={isDark}
                onPress={() => handleRecentSearch(item)}
                onDelete={handleDeleteRecent}
              />
            )}
            contentContainerStyle={styles.recentContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => (
              <View style={styles.separator} />
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 10,
  },
  button: {
    borderRadius: 10,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    width: "70%",
    alignSelf: "center",
  },
  wordCard: {
    marginTop: 30,
    padding: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  wordTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  wordDefinition: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 12,
    fontStyle: "italic",
    textAlign: "center",
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 10,
  },
  recentTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  recentContainer: {
    // This container will hold all recent items with proper spacing
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 16,
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    marginTop: 10,
    minWidth: 80,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
});