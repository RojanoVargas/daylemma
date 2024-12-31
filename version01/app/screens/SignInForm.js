import React, { useState } from "react"
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
} from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebaseConfig"

const SignInForm = ({
	onClose,
	switchToSignUp,
	setIsAuthenticated,
	customFontStyles,
}) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleSignIn = () => {
		signInWithEmailAndPassword(auth, email, password)
			.then(() => {
				setIsAuthenticated(true)
				onClose()
			})
			.catch((error) => {
				console.error("Error signing in:", error)
			})
	}

	return (
		<View style={styles.container}>
			<Text style={[styles.title, customFontStyles]}>Sign In</Text>
			<TextInput
				placeholder="Email"
				style={styles.input}
				value={email}
				onChangeText={setEmail}
			/>
			<TextInput
				placeholder="Password"
				secureTextEntry
				style={styles.input}
				value={password}
				onChangeText={setPassword}
			/>
			<TouchableOpacity style={styles.button} onPress={handleSignIn}>
				<Text style={styles.buttonText}>Submit</Text>
			</TouchableOpacity>
			<Text style={styles.switchText} onPress={switchToSignUp}>
				Don't have an account? Sign Up
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 40,
		backgroundColor: "white",
		borderRadius: 10,
	},
	title: {
		fontSize: 43,
		marginBottom: 20,
		textAlign: "center",
		paddingBottom: "20",
		color: "#A6E1D7",
		textShadowColor: "black",
		textShadowOffset: { width: 2, height: 2 },
		textShadowRadius: 1,
	},
	input: {
		height: 40,
		borderColor: "black",
		borderWidth: 1,
		marginBottom: 20,
		paddingHorizontal: 10,
		borderRadius: 12,
	},
	button: {
		backgroundColor: "#F49A9D",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		marginTop: 5,
		marginBottom: 15,
		shadowColor: "black",
		shadowOffset: { width: -2, height: -2 },
		shadowRadius: 1,
		elevation: 5,
		shadowOpacity: 1
	},
	buttonText: {
		color: "white", // Change this to your desired text color
		fontSize: 16,
		textTransform: "uppercase", // Apply textTransform here
	},
	switchText: {
		marginTop: 20,
		color: "blue",
		textAlign: "center",
		fontSize: 15
	},
})

export default SignInForm
