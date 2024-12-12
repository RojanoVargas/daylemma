import React from "react"
import { ImageBackground, StyleSheet } from "react-native"

export function WelcomeScreen(props) {
	return (
		<ImageBackground
			style={styles.background}
			source={require("../assets/background.jpeg")}
		></ImageBackground>
	)
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
	},
})

export default WelcomeScreen
