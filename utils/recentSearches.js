import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "recent_searches";

export const saveRecentWord = async (word) => {
  try {
    console.log("🔍 Saving recent word:", word);
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("📂 Existing data from storage:", existing);
    
    let recentWords = existing ? JSON.parse(existing) : [];
    console.log("📋 Current recent words:", recentWords);
    
    // Remove if already exists (case insensitive)
    recentWords = recentWords.filter(
      (item) => item.toLowerCase() !== word.toLowerCase()
    );
    console.log("🧹 After removing duplicates:", recentWords);
    
    // Add to front
    recentWords.unshift(word);
    console.log("➕ After adding new word:", recentWords);
    
    // Keep max 10 recent words
    if (recentWords.length > 10) {
      recentWords = recentWords.slice(0, 10);
    }
    console.log("✂️ Final words to save:", recentWords);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recentWords));
    console.log("💾 Successfully saved to storage");
  } catch (error) {
    console.error("❌ Error saving recent word:", error);
  }
};

export const getRecentWords = async () => {
  try {
    console.log("📖 Getting recent words from storage...");
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("📂 Raw data from storage:", data);
    
    const result = data ? JSON.parse(data) : [];
    console.log("📋 Parsed recent words:", result);
    
    return result;
  } catch (error) {
    console.error('❌ Error getting recent words:', error);
    return [];
  }
};

export const removeRecentWord = async (wordToRemove) => {
  try {
    console.log("🗑️ Removing recent word:", wordToRemove);
    const existing = await AsyncStorage.getItem(STORAGE_KEY);
    let recentWords = existing ? JSON.parse(existing) : [];
    console.log("📋 Words before removal:", recentWords);
    
    // Remove the word (case insensitive)
    recentWords = recentWords.filter(
      (item) => item.toLowerCase() !== wordToRemove.toLowerCase()
    );
    console.log("📋 Words after removal:", recentWords);
    
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recentWords));
    console.log("💾 Successfully updated storage after removal");
    
    return recentWords;
  } catch (error) {
    console.error('❌ Error removing recent word:', error);
    return [];
  }
};

export const clearAllRecentWords = async () => {
  try {
    console.log("🧹 Clearing all recent words...");
    await AsyncStorage.removeItem(STORAGE_KEY);
    console.log("✅ Successfully cleared all recent words");
  } catch (error) {
    console.error('❌ Error clearing recent words:', error);
  }
};