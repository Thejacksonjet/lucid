import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Audio } from "expo-audio";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { useRoute } from "@react-navigation/native";

export default function WordDetailScreen() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const route = useRoute();

  const { wordData } = route.params || {};

  if (!wordData || wordData.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? "#111" : "#fff" },
        ]}
      >
        <Text style={{ color: isDark ? "#fff" : "#000" }}>No data found </Text>
      </View>
    );
  }

  const playAudio = async () => {
    const audioUrt = wordEntry.phonetics?.find((p) => p.audio)?.audio;

    if (audioUrl) {
      const { sound } = await Audio.sound.createAsync({ uri: audioUrl });
      await sound.playAsync();
    }
  };

  const wordEntry = wordData[0];
  return (
    <ScrollView
      style={[styles.container, { backgroundColor: isDark ? "#111" : "#fff" }]}
    >
      <Text style={[styles.word, { color: isDark ? "#fff" : "#000" }]}>
        {wordEntry.word}
      </Text>

      {/* Audio */}

      {wordEntry.phonetics?.map((p, index) =>
        p.audio ? (
          <View key={index} style={styles.audioRow}>
            <Text style={{ color: isDark ? "#aaa" : "#333" }}> {p.text}</Text>
            <TouchableOpacity onPress={() => playAudio(p.audio)}>
              <Ionicons
                name="volume-high-outline"
                size={24}
                color={isDark ? "#fff" : "#000"}
              />
            </TouchableOpacity>
          </View>
        ) : null
      )}

      {/* Meaning */}

      {wordEntry.meanings?.map((meaning, i) => (
        <View key={i} style={styles.section}>
          <Text
            style={[styles.partOfSpeech, { color: isDark ? "#0af" : "#333" }]}
          >
            {meaning.partOfSpeech}
          </Text>
          {meaning.definitions?.map((def, j) => (
            <View key={j} style={styles.definitionBlock}>
              <Text style={{ color: isDark ? "#fff" : "#000" }}>
                • {def.definition}
              </Text>
              {def.example && (
                <Text
                  style={{
                    color: isDark ? "#aaa" : "#555",
                    fontStyle: "italic",
                  }}
                >
                  “{def.example}”
                </Text>
              )}
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
  },
  word: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
  },
  audioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  section: {
    marginTop: 20,
  },
  partOfSpeech: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 5,
  },
  definitionBlock: {
    marginBottom: 10,
  },
});