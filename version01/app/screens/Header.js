import React from "react"
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
  Image
} from "react-native"

export default function Header({
	onLoginPress,
	handleModal,
	isAuthenticated,
	buttonScale,
}) {
	return (
		<View style={styles.container}>
			{isAuthenticated ? (
				<TouchableOpacity style={styles.floatingButton} onPress={handleModal}>
					<Image
						source={require("../assets/daylemma-logo-gamma.png")}
						style={styles.loggedInLogo}
					/>
				</TouchableOpacity>
			) : (
				<Animated.View
					style={[
						styles.floatingButton,
						{ transform: [{ scale: buttonScale }] },
					]}
				>
					<TouchableOpacity onPress={onLoginPress}>
          <Image
						source={require("../assets/enter-icon.png")}
						style={styles.logInLogo}
					/>
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
  logInLogo: {
    width: 25,
    height: 25
  },
  loggedInLogo: {
    width: 35,
    height: 35
  }
})
