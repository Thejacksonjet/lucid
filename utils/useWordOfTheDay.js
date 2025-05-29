import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WORDNIK_API_KEY = "m6aaklh6fljdogom4qwtbq7fm63r2kxzf0f2nj21dwykj7xni"; // Replace with your actual key
const WORDNIK_WORD_OF_DAY_URL = `https://api.wordnik.com/v4/words.json/wordOfTheDay`;
const todayKey = `wordOfTheDay-${new Date().toISOString().slice(0, 10)}`;

export const useWordOfTheDay = () => {
  const [wordData, setWordData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadWord = async () => {
      try {
        setLoading(true);

        const cached = await AsyncStorage.getItem(todayKey);
        if (cached && mounted) {
          setWordData(JSON.parse(cached));
          setLoading(false);
          return;
        }

        const response = await fetch(
          `${WORDNIK_WORD_OF_DAY_URL}?api_key=${WORDNIK_API_KEY}`
        );

        if (!response.ok) throw new Error("Failed to fetch from Wordnik");

        const data = await response.json();

        const word = data.word;
        const note = data.note;
        const definitions = (data.definitions || []).map((def) => ({
          definition: def.text,
          partOfSpeech: def.partOfSpeech,
          source: def.source
        }));

        const examples = (data.examples || []).map((example) => ({
          text: example.text,
          title: example.title,
          url: example.url
        }));

        const newWordData = { word, note, definitions, examples };

        if (mounted) {
          setWordData(newWordData);
          await AsyncStorage.setItem(todayKey, JSON.stringify(newWordData));
        }
      } catch (error) {
        console.error("Error fetching word of the day:", error.message);
        const fallback = {
          word: "explore",
          note: "Fallback word when the API fails.",
          definitions: [
            {
              definition: "To investigate or travel in order to discover something new.",
              partOfSpeech: "verb",
              source: "fallback"
            }
          ],
          examples: []
        };
        if (mounted) setWordData(fallback);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadWord();

    return () => {
      mounted = false;
    };
  }, []);

  return { wordData, loading };
};
