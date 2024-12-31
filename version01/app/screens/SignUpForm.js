import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { auth, db } from "../../config/firebaseConfig"
import { isValidUsername } from "../../utils/usernameValidator"
import {
	collection,
	query,
	where,
	getDocs,
	doc,
	setDoc,
} from "firebase/firestore"

const SignUpForm = ({ onClose, switchToSignIn, setIsAuthenticated, customFontStyles }) => {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [username, setUsername] = useState("")
	const [error, setError] = useState("")

	const handleSignUp = async () => {
		if (username.length > 8) {
			setError("Username must be maximum 8 characters.")
			return
		}

		if (username.length < 4) {
			setError("Username must be at least 4 characters.")
			return
		}

		if (!isValidUsername(username)) {
			setError(
				"Username contains inappropriate words. Please choose another one."
			)
			return
		}

		const usersRef = collection(db, "users")
		const q = query(usersRef, where("username", "==", username))
		const querySnapshot = await getDocs(q)

		if (!querySnapshot.empty) {
			setError("Username is already taken. Please choose another one.")
			return
		}

		createUserWithEmailAndPassword(auth, email, password)
			.then(async () => {
				// Save the username to the user's profile or database
				// Assuming you have a users collection in Firestore
				const user = auth.currentUser
				const userRef = doc(db, "users", user.uid)
				await setDoc(userRef, { username, email })

				setIsAuthenticated(true)
				onClose()
			})
			.catch((error) => {
				console.error("Error signing up:", error)
			})
	}

	return (
		<View style={styles.container}>
			<Text style={[styles.title, customFontStyles]}>Sign Up</Text>
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<TextInput
				placeholder="Username"
				style={styles.input}
				value={username}
				onChangeText={setUsername}
			/>
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
			<TouchableOpacity style={styles.button} onPress={handleSignUp}>
				<Text style={styles.buttonText}>Submit</Text>
			</TouchableOpacity>
			<Text style={styles.switchText} onPress={switchToSignIn}>
				Already have an account? Sign In
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

export default SignUpForm
