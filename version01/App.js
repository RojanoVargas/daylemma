import { StatusBar } from "expo-status-bar"
import { LinearGradient } from "expo-linear-gradient"
import React, { useState, useEffect, useRef } from "react"
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	Animated,
} from "react-native"
import { auth } from "./config/firebaseConfig"
import { loadFonts } from "./config/fontsConfig"; // Importa la función de carga de fuentes
import * as Font from 'expo-font';

import { onAuthStateChanged, signOut } from "firebase/auth"
import Header from "./app/screens/Header"
import SignInForm from "./app/screens/SignInForm"
import SignUpForm from "./app/screens/SignUpForm"
import { fetchDilemma, updateVotes } from "./fetch/DataFetcher"

export default function App() {
	console.log("App executed")

	// const [dilemma, setDilemma] = useState(null)
	const dilemmaId = "2024-12-28"
	const [countA, setCountA] = useState(0)
	const [countB, setCountB] = useState(0)
	const buttonScale = useRef(new Animated.Value(1)).current
	const [modalVisible, setModalVisible] = useState(false)
	const [isSignIn, setIsSignIn] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    const loadFonts = async () => {
      try {
        await Font.loadAsync({
          'my-custom-font': require('./app/assets/fonts/gordqucikblack-p7erv.ttf'),
        });
        setFontLoaded(true);
      } catch (error) {
        console.error('Error loading fonts', error);
      }
    };

    loadFonts();
  }, []);

	const fetchData = async () => {
		try {
			const data = await fetchDilemma(dilemmaId)
			setCountA(data.aVotes)
			setCountB(data.bVotes)
		} catch (error) {
			console.error("Error fetching the dilemma:", error)
		}
	}

	useEffect(() => {
		fetchData()
	}, [dilemmaId])

	const onPressA = () => {
		if (!isAuthenticated) {
			animateButton()
		}
	}

	const onLongPressA = async () => {
		if (isAuthenticated) {
			try {
				await updateVotes(dilemmaId, "aVotes")
				// setCountA((prevCount) => prevCount + 1)
				await fetchData()
			} catch (error) {
				console.error("Error updating votes for A:", error)
			}
		}
	}

	const onPressB = () => {
		if (!isAuthenticated) {
			animateButton()
		}
	}

	const onLongPressB = async () => {
		if (isAuthenticated) {
			try {
				await updateVotes(dilemmaId, "bVotes")
				// setCountB((prevCount) => prevCount + 1)
				await fetchData()
			} catch (error) {
				console.error("Error updating votes for B:", error)
			}
		}
	}

	const animateButton = () => {
		Animated.sequence([
			Animated.timing(buttonScale, {
				toValue: 1.2,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(buttonScale, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start()
	}

	const total = countA + countB

	let flexOptionA = countA
	let flexOptionB = countB

	if (countA === 0 && countB === 0) {
		flexOptionA = 1
		flexOptionB = 1
	} else {
		flexOptionA = countA === 0 ? 0.5 : countA
		flexOptionB = countB === 0 ? 0.5 : countB
	}

	const styles = createStyles(flexOptionA, flexOptionB)

	// Modal signin signup

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsAuthenticated(true)
			} else {
				setIsAuthenticated(false)
			}
		})

		return () => unsubscribe()
	}, [])

	const openModal = () => {
		setModalVisible(true)
	}

	const closeModal = () => {
		setModalVisible(false)
	}

	const switchToSignIn = () => {
		setIsSignIn(true)
	}

	const switchToSignUp = () => {
		setIsSignIn(false)
	}
	const handleAuthenticatedPress = () => {
		signOut(auth)
			.then(() => {
				setIsAuthenticated(false)
				console.log("User signed out")
			})
			.catch((error) => {
				console.error("Error signing out:", error)
			})
	}

	return (
		<>
			<Header
				onLoginPress={openModal}
				isAuthenticated={isAuthenticated}
				onAuthenticatedPress={handleAuthenticatedPress}
				buttonScale={buttonScale}
			/>
			<View style={styles.mainContainer}>
				<LinearGradient
					colors={["#ff9a9e", "#ff9a9e", "#ff9a9e"]}
					style={[styles.containerOptionA, { flex: flexOptionA }]}
				>
					<TouchableOpacity
						style={styles.touchable}
						onPress={onPressA}
						onLongPress={onLongPressA}
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
					colors={["#13547a", "#13547a", "#13547a"]}
					style={[styles.containerOptionB, { flex: flexOptionB }]}
				>
					<TouchableOpacity
						style={styles.touchable}
						onPress={onPressB}
						onLongPress={onLongPressB}
						activeOpacity={0.8}
					>
						<Text style={[styles.h2, {fontFamily: 'my-custom-font'}]}>Pizza margherita 🍕</Text>
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
			fontFamily: 'my-custom-font',
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
