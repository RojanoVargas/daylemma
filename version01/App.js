import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import React, { useState, useEffect } from "react"
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback
} from "react-native"
import Header from "./app/screens/Header"
import SignInForm from "./app/screens/SignInForm"
import SignUpForm from "./app/screens/SignUpForm"
import { auth } from './config/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

export default function App() {
	console.log("App executed")
	const [countA, setCountA] = useState(0)
	const [countB, setCountB] = useState(0)

	const onPressA = () => setCountA((prevCount) => prevCount + 1)
	const onPressB = () => setCountB((prevCount) => prevCount + 1)

	const total = countA + countB

	let flexOptionA = countA
	let flexOptionB = countB

	if (countA === 0 && countB === 0) {
		flexOptionA = 1
		flexOptionB = 1
	} else {
		flexOptionA = countA === 0 ? 0.1 : countA
		flexOptionB = countB === 0 ? 0.1 : countB
	}

	const styles = createStyles(flexOptionA, flexOptionB)

	// Modal signin signup

	const [modalVisible, setModalVisible] = useState(false)
	const [isSignIn, setIsSignIn] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
		  if (user) {
			setIsAuthenticated(true);
		  } else {
			setIsAuthenticated(false);
		  }
		});
	
		return () => unsubscribe();
	  }, []);

	const openModal = () => {
		setModalVisible(true);
	  };
	
	  const closeModal = () => {
		setModalVisible(false);
	  };
	
	  const switchToSignIn = () => {
		setIsSignIn(true);
	  };
	
	  const switchToSignUp = () => {
		setIsSignIn(false);
	  };

	return (
		<>
			<Header onLoginPress={openModal} isAuthenticated={isAuthenticated} />
			<View style={styles.mainContainer}>
				<LinearGradient
					colors={["#fad0c4", "#ff9a9e", "#ff9a9e"]}
					style={[styles.containerOptionA, { flex: flexOptionA }]}
				>
					<TouchableOpacity
						style={styles.touchable}
						onLongPress={onPressA}
						activeOpacity={0.8}
					>
						<Text style={styles.h2}>Pizza w/ Pineapple🍍</Text>
						<Text style={styles.paragraph}>
							{total === 0
								? "Hold to vote"
								: `${((countA / total) * 100).toFixed(2)}%`}
						</Text>
					</TouchableOpacity>
				</LinearGradient>
				<View style={styles.divider} />
				<LinearGradient
					colors={["#13547a", "#13547a", "#80d0c7"]}
					style={[styles.containerOptionB, { flex: flexOptionB }]}
				>
					<TouchableOpacity
						style={styles.touchable}
						onLongPress={onPressB}
						activeOpacity={0.8}
					>
						<Text style={styles.h2}>Pizza margherita 🍕</Text>
						<Text style={styles.paragraph}>
							{total === 0
								? "Hold to vote"
								: `${((countB / total) * 100).toFixed(2)}%`}
						</Text>
					</TouchableOpacity>
				</LinearGradient>
				<Modal
					animationType="slide"
					transparent={true}
					visible={modalVisible}
					onRequestClose={closeModal}
				>
					<TouchableWithoutFeedback onPress={closeModal}>
						<View style={styles.modalOverlay}>
							<TouchableWithoutFeedback>
								<View style={styles.modalContainer}>
									{isSignIn ? (
										<SignInForm
											onClose={closeModal}
											switchToSignUp={switchToSignUp}
											setIsAuthenticated={setIsAuthenticated}
										/>
									) : (
										<SignUpForm
											onClose={closeModal}
											switchToSignIn={switchToSignIn}
											setIsAuthenticated={setIsAuthenticated}
										/>
									)}
								</View>
							</TouchableWithoutFeedback>
						</View>
					</TouchableWithoutFeedback>
				</Modal>

				<StatusBar style="auto" />
			</View>
		</>
	)
}

const createStyles = () =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			backgroundColor: "#fff",
			alignItems: "center",
			justifyContent: "center",
		},
		containerOptionA: {
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
		},
		containerOptionB: {
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
		},
		touchable: {
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
			height: "100%",
		},
		h2: {
			fontSize: 32,
			textShadowColor: "rgba(0, 0, 0, 0.75)",
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
			color: "white",
			fontWeight: "700",
		},
		paragraph: {
			fontSize: 20,
			fontWeight: "700",
		},
		divider: {
			height: 4,
			width: "100%",
			backgroundColor: "#000",
		},
		modalOverlay: {
			flex: 1,
			justifyContent: "center",
			alignItems: "center",
			backgroundColor: "rgba(0,0,0,0)",
		},
		modalContainer: {
			width: "80%",
			padding: 20,
			backgroundColor: "white",
			borderRadius: 10,
		},
	})
