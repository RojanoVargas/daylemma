# daylemma

might use later


import { StatusBar } from "expo-status-bar"
import React, { useState, useEffect } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"
import * as Google from "expo-auth-session/providers/google"
import * as WebBrowser from "expo-web-browser"
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getApp, getApps } from 'firebase/app';

WebBrowser.maybeCompleteAuthSession()

const firebaseConfig = {
	apiKey: "AIzaSyC5LutNGqcwRKvIlxunQgCOMirI5pKAB-8",
	authDomain: "daylemma-4d24a.firebaseapp.com",
	projectId: "daylemma-4d24a",
	storageBucket: "daylemma-4d24a.firebasestorage.app",
	messagingSenderId: "1039291459621",
	appId: "1:1039291459621:android:a2ed21cb9082e9c4c6b7cc",
}

// Inicializamos Firebase solo una vez
let app
if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp(); // Usamos la instancia ya existente
}


export default function App(app) {
	const [showSplash, setShowSplash] = useState(true) // State to control splash screen visibility
	const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
		clientId: "1039291459621-k15hq34ga04p675r3d5t988hvi4pn42n.apps.googleusercontent.com",
	})

	useEffect(() => {
		if (response?.type === "success") {
			const { id_token } = response.params
			const credential = firebase.auth.GoogleAuthProvider.credential(id_token)
			firebase
				.auth()
				.signInWithCredential(credential)
				.catch((error) => {
					console.error(error)
				})
		}
	}, [response])

	const signInWithGoogle = () => {
		promptAsync()
	}

	return (
		<View style={styles.container}>
			{showSplash ? (
				<SplashScreen />
			) : (
				<>
					<Header />
					<View style={styles.content}>
						<Text>Welcome to the App!</Text>
						<TouchableOpacity onPress={signInWithGoogle} style={styles.button}>
							<Text style={styles.buttonText}>Sign in with Google</Text>
						</TouchableOpacity>
					</View>
					<Footer />
				</>
			)}
			<StatusBar style="auto" />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
	},
	content: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		backgroundColor: "#4285F4",
		padding: 10,
		borderRadius: 5,
	},
	buttonText: {
		color: "#fff",
		fontSize: 16,
	},
})
