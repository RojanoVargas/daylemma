import React, { useEffect, useState } from "react"
import { View, Text, TextInput, Button, StyleSheet } from "react-native"
import { auth, db } from "../../config/firebaseConfig"
import {
	doc,
	getDoc,
	updateDoc,
	collection,
	query,
	where,
	getDocs,
} from "firebase/firestore"

export default function UserProfileScreen() {
	const [username, setUsername] = useState("")
	const [newUsername, setNewUsername] = useState("") // State for the new username
	const [error, setError] = useState("") // Error handling state

	useEffect(() => {
		const fetchUserProfile = async () => {
			const user = auth.currentUser // Get the logged-in user
			if (user) {
				const userRef = doc(db, "users", user.uid) // Reference to the user's document
				const docSnap = await getDoc(userRef) // Fetch the document

				if (docSnap.exists()) {
					setUsername(docSnap.data().username) // Set the username from Firestore
				} else {
					console.log("No such document!")
				}
			}
		}

		fetchUserProfile()
	}, [])

	const handleUsernameChange = async () => {
		if (newUsername.length < 4 || newUsername.length > 8) {
			setError("Username must be between 4 and 8 characters.")
			return
		}

		// Query Firestore to check if the new username already exists
		const usersRef = collection(db, "users")
		const q = query(usersRef, where("username", "==", newUsername))
		const querySnapshot = await getDocs(q)

		if (!querySnapshot.empty) {
			setError("Username is already taken. Please choose another one.")
			return
		}

		const user = auth.currentUser
		if (user) {
			const userRef = doc(db, "users", user.uid)
			try {
				// Update the username in Firestore
				await updateDoc(userRef, { username: newUsername })
				setUsername(newUsername) // Update the local state with the new username
				setNewUsername("") // Clear the new username field
				setError("") // Clear any previous error
			} catch (error) {
				console.error("Error updating username:", error)
				setError("There was an error updating your username.")
			}
		}
	}

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hey there,</Text>
			<Text style={styles.text}>"{username.toUpperCase()}"</Text>
			<Text style={styles.text}>
				It's a very cool name, I'm not gonna lie, but if you want to change it,
				feel free:
			</Text>
			<TextInput
				placeholder="New Username"
				style={styles.input}
				value={newUsername}
				onChangeText={setNewUsername}
			/>
			{error ? <Text style={styles.error}>{error}</Text> : null}
			<Button title="Change Username" onPress={handleUsernameChange} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 20,
	},
	text: {
		fontSize: 18,
		marginBottom: 10,
	},
	input: {
		height: 40,
		borderColor: "gray",
		borderWidth: 1,
		marginBottom: 20,
		paddingHorizontal: 10,
		width: "80%",
	},
	error: {
		color: "red",
		marginBottom: 10,
	},
})
