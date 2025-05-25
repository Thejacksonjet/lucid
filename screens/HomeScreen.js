import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import RecentItem from "../components/RecentItem";

export default function HomeScreen({ navigation }) {
  const [greeting, setGreeting] = useState("");
  const [searchText, setSearchText] = useState("");
  const wordOfTheDay = useWordOfTheDay();

  const [recentWords, setRecentWords] = useState([]);

  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const handleSearch = async () => {
    const query = searchText.trim();
    console.log("🔍 Search initiated with query:", query);

    if (!query) {
      console.log("❌ Empty query, returning");
      return;
    }

    console.log("🌐 Fetching word definition...");
    const result = await fetchWordDefinition(query);

    if (result) {
      console.log("✅ Word definition found:", result.word);
      console.log("💾 Saving to recent words...");

      await saveRecentWord(query);
      const words = await getRecentWords();

      console.log("📋 Updated recent words from storage:", words);
      setRecentWords(words);
      console.log("🔄 State updated with recent words");

      navigation.navigate("WordDetail", { wordData: result });
    } else {
      console.log("❌ Word not found");
      alert("Word not found. Please try another word.");
    }
  };

  const handleRecentSearch = async (word) => {
    const result = await fetchWordDefinition(word);
    if (result) {
      navigation.navigate("WordDetail", { wordData: result });
    }
  };

  const clearAllRecents = async () => {
    await clearAllRecentWords();
    setRecentWords([]);
  };

  const greetings = ["Welcome!", "Hello!", "Hi!", "Welcome Back", "Hello!"];

  const deleteRecentWord = async (wordToDelete) => {
    const updated = recentWords.filter((word) => word !== wordToDelete);
    setRecentWords(updated);
    await AsyncStorage.setItem("recent_searches", JSON.stringify(updated));
  };

  // Determine greeting by day index (0 = Sunday, 1 = Monday, etc.)
  useEffect(() => {
    const todayIndex = new Date().getDate() % greetings.length;
    setGreeting(greetings[todayIndex]);
  }, []);

  useEffect(() => {
    const loadRecent = async () => {
      console.log("🚀 Loading recent words on app start...");
      const words = await getRecentWords();
      console.log("📱 Setting recent words in state:", words);
      setRecentWords(words);
    };
    loadRecent();
  }, []);

  console.log("🏠 HomeScreen render - recentWords state:", recentWords);
  console.log("🏠 HomeScreen render - recentWords length:", recentWords.length);

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? "#111" : "#fff" }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: isDark ? "#fff" : "#000" }]}>
          {greeting}
        </Text>
        <TouchableOpacity onPress={toggleTheme}>
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
      />
      <TouchableOpacity
        style={[
          styles.button,
          { backgroundColor: isDark ? "#444" : "#008080" },
        ]}
        onPress={handleSearch}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            padding: 12,
            fontSize: 16,
          }}
        >
          Search
        </Text>
      </TouchableOpacity>

      {wordOfTheDay && (
        <View
          style={[
            styles.wordCard,
            { backgroundColor: isDark ? "#222" : "#f0f0f0" },
          ]}
        >
          <Text style={[styles.wordTitle, { color: isDark ? "#fff" : "#000" }]}>
            Word of the Day: {wordOfTheDay.word}
          </Text>
          <Text style={{ color: isDark ? "#ccc" : "#333" }}>
            {wordOfTheDay.definitions?.[0]?.text}
          </Text>
        </View>
      )}

      {recentWords.length > 0 && (
        <View style={{marginTop: 20}}>
          <View style={styles.recentHeader}>
            <Text
              style={[styles.recentTitle, { color: isDark ? "#fff" : "#000" }]}
            >
              Recent Searches ({recentWords.length})
            </Text>
            <TouchableOpacity onPress={clearAllRecents}>
              <Text style={{ color: "#FF3B30" }}>Clear All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.recentContainer}>
            {recentWords.map((word, index) => {
              console.log(`📋 Rendering recent item ${index}:`, word);
              return (
                <RecentItem
                  key={`${word}-${index}`}
                  word={word}
                  isDark={isDark}
                  onDelete={async () => {
                    console.log("🗑️ Deleting recent word:", word);
                    const updatedWords = await removeRecentWord(word);
                    console.log(
                      "📋 Updated words after deletion:",
                      updatedWords
                    );
                    setRecentWords(updatedWords);
                  }}
                  onPress={async () => {
                    console.log("👆 Recent word pressed:", word);
                    const result = await fetchWordDefinition(word);
                    if (result) {
                      console.log(
                        "💾 Re-saving recent word to update order..."
                      );
                      await saveRecentWord(word); // Save the word again to update recent order
                      const words = await getRecentWords();
                      setRecentWords(words);
                      navigation.navigate("WordDetail", { wordData: result });
                    }
                  }}
                />
              );
            })}
          </View>
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
    paddingVertical: 5,
    paddingHorizontal: 20,
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
});
