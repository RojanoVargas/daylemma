import React from "react";
import { View, TouchableOpacity, StyleSheet, Text, Animated } from "react-native";

export default function Header({ onLoginPress, handleModal, isAuthenticated, buttonScale }) {
  return (
    <View style={styles.container}>
      {isAuthenticated ? (
        <TouchableOpacity style={styles.floatingButton} onPress={handleModal}>
          <Text style={styles.buttonText}>🍺</Text>
        </TouchableOpacity>
      ) : (
        <Animated.View style={[styles.floatingButton, { transform: [{ scale: buttonScale }] }]}>
          <TouchableOpacity onPress={onLoginPress}>
            <Text style={styles.buttonText}>👤?</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  floatingButton: {
    position: "absolute",
    top: 40, // Adjust to your desired position
    right: 30, // Adjust to your desired position
    width: 40, // Button size
    height: 40, // Button size
    borderRadius: 30, // Circle shape
    backgroundColor: "white", // Button color
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for Android
	zIndex: 2,
  },
  buttonText: {
    fontSize: 20,
  },
});
