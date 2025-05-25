import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import Reanimated, { useAnimatedStyle } from "react-native-reanimated";

const RightAction = (progress, drag, onDelete, word) => {
  const styleAnimation = useAnimatedStyle(() => ({
    transform: [{ translateX: drag.value + 60 }],
    opacity: progress.value,
  }));

  return (
    <Reanimated.View style={[styles.deleteButton, styleAnimation]}>
      <TouchableOpacity onPress={onDelete} accessibilityLabel={`Delete ${word}`}>
        <Ionicons name="trash" size={20} color="#fff" />
      </TouchableOpacity>
    </Reanimated.View>
  );
};

const RecentItem = ({ word, isDark, onDelete, onPress }) => {
  const swipeableRef = useRef(null);

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      friction={2}
      rightThreshold={40}
      renderRightActions={(progress, drag) =>
        RightAction(progress, drag, () => {
          onDelete();
          swipeableRef.current?.close();
        }, word)
      }
      containerStyle={[
        styles.container,
        { backgroundColor: isDark ? "#333" : "#eee" },
      ]}
    >
      <TouchableOpacity onPress={onPress} accessibilityLabel={`Select ${word}`}>
        <Text
          style={[
            styles.text,
            { color: isDark ? "#fff" : "#000" },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {word || "Placeholder"}
        </Text>
      </TouchableOpacity>
    </ReanimatedSwipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    minHeight: 50,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: "normal",
    fontFamily: "Roboto", // Ensure font is supported on Android
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    borderRadius: 10,
    marginBottom: 10,
    height: "100%",
  },
});

export default RecentItem;