import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebaseConfig"

const SignInForm = ({ onClose, switchToSignUp, setIsAuthenticated }) => {
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
			<Text style={styles.title}>Sign In</Text>
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
			<Button title="Submit" onPress={handleSignIn} />
			<Text style={styles.switchText} onPress={switchToSignUp}>
				Don't have an account? Sign Up
			</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 20,
		backgroundColor: "white",
		borderRadius: 10,
	},
	title: {
		fontSize: 20,
		marginBottom: 20,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 20,
		paddingHorizontal: 10,
	},
	switchText: {
		marginTop: 20,
		color: "blue",
		textAlign: "center",
	},
})

export default SignInForm
