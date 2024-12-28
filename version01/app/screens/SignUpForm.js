import React, { useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth } from "../../config/firebaseConfig"

const SignUpForm = ({ onClose, switchToSignIn, setIsAuthenticated }) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")

	const handleSignUp = () => {
		createUserWithEmailAndPassword(auth, email, password)
			.then(() => {
				setIsAuthenticated(true)
				onClose()
			})
			.catch((error) => {
				console.error("Error signing up:", error)
			})
	}

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Sign Up</Text>
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
			<Button title="Submit" onPress={handleSignUp} />
			<Text style={styles.switchText} onPress={switchToSignIn}>
				Already have an account? Sign In
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

export default SignUpForm
