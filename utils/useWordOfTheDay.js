import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WORDNIK_API_KEY = ""; // replace with your key
const BASE_URL = "https://api.wordnik.com/v4/words.json/wordOfTheDay";

export const useWordOfTheDay = () => {
  const [wordData, setWordData] = useState(null);
  const todayKey = `wordOfTheDay-${new Date().toISOString().slice(0, 10)}`;

  useEffect(() => {
    const loadWord = async () => {
      try {
        const cached = await AsyncStorage.getItem(todayKey);
        if (cached) {
          setWordData(JSON.parse(cached));
        } else {
          const res = await fetch(`${BASE_URL}?api_key=${WORDNIK_API_KEY}`);
          const json = await res.json();
          setWordData(json);
          await AsyncStorage.setItem(todayKey, JSON.stringify(json));
        }
      } catch (error) {
        console.error("Error fetching word of the day:", error);
      }
    };
    loadWord();
  }, []);

  return wordData;
};
