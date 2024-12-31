import React, { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet } from "react-native"
import { auth, db } from "../../config/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"

export default function UserProfileScreen({ customFontStyles, SignOut }) {
	const [username, setUsername] = useState("")

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

	return (
		<View style={styles.container}>
			<Text style={styles.text}>Hey there,</Text>
			<Text style={[styles.username, customFontStyles]}>
				"{username.toUpperCase()}"
			</Text>
			<Text style={styles.text}>thank you for joining</Text>
			<Text style={styles.daylemmaTitle}>
				<Text style={[customFontStyles, { color: "#F49A9D" }]}>Day</Text>
				<Text style={[customFontStyles, { color: "#A6E1D7" }]}>
					lemma
				</Text>
			</Text>


			<TouchableOpacity style={styles.button} onPress={SignOut}>
				<Text style={styles.buttonText}>Sign Out</Text>
			</TouchableOpacity>
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
		margin: 5,
	},
	username: {
		fontSize: 28,
	},
	daylemmaTitle: {
		fontSize: 34,
	},
	button: {
		backgroundColor: "#F49A9D",
		padding: 10,
		borderRadius: 5,
		alignItems: "center",
		shadowColor: "black",
		shadowOffset: { width: -2, height: -2 },
		shadowRadius: 1,
		elevation: 5,
		shadowOpacity: 1,
		marginTop: 50,
	},
	buttonText: {
		color: "white", // Change this to your desired text color
		fontSize: 16,
		textTransform: "uppercase", // Apply textTransform here
	},
})
