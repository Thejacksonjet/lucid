import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { useAnimatedStyle } from 'react-native-reanimated';

const RecentItem = ({ word, isDark, onPress, onDelete }) => {
  // Render the right action (delete icon)
  const renderRightActions = (prog, drag) => {
    const styleAnimation = useAnimatedStyle(() => ({
      transform: [{ translateX: drag.value + 50 }],
    }));

    return (
      <Reanimated.View style={[styles.deleteButtonContainer, styleAnimation]}>
        <TouchableOpacity
          style={[styles.deleteButton, { backgroundColor: '#FF3B30' }]}
          onPress={() => onDelete(word)}
          accessibilityLabel={`Delete ${word} from recent searches`}
        >
          <Ionicons name="trash" size={24} color="#fff" />
        </TouchableOpacity>
      </Reanimated.View>
    );
  };

  return (
    <GestureHandlerRootView>
      <ReanimatedSwipeable
        friction={2}
        rightThreshold={40}
        overshootRight={false}
        containerStyle={[
          styles.container,
          { backgroundColor: isDark ? '#333' : '#eee' },
        ]}
        renderRightActions={renderRightActions}
      >
        <TouchableOpacity
          onPress={onPress}
          accessibilityLabel={`Search for ${word}`}
        >
          <Text style={[styles.text, { color: isDark ? '#fff' : '#000' }]}>
            {word}
          </Text>
        </TouchableOpacity>
      </ReanimatedSwipeable>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    minHeight: 50,
  },
  text: {
    flex: 1,
    fontSize: 16,
    fontWeight: 'normal',
  },
  deleteButtonContainer: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    width: 50,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});

export default RecentItem;