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
	Alert,
	Button,
	SafeAreaView,
} from "react-native"
import { auth } from "./config/firebaseConfig"
//import { loadFonts } from "./config/fontsConfig" // bring fonts from config. not in use now
import { useFonts } from "expo-font"
import * as SplashScreen from "expo-splash-screen"

import { onAuthStateChanged, signOut } from "firebase/auth"
import Header from "./app/screens/Header"
import SignInForm from "./app/screens/SignInForm"
import SignUpForm from "./app/screens/SignUpForm"
import { fetchDilemma, updateVotes } from "./fetch/DataFetcher"
import UserProfileScreen from "./app/screens/UserProfileScreen"

SplashScreen.preventAutoHideAsync()

export default function App() {
	console.log("App executed")

	// const [dilemma, setDilemma] = useState(null)
	const dilemmaId = "2024-12-28"
	const [countA, setCountA] = useState(0)
	const [countB, setCountB] = useState(0)
	const [votesByUser, setVotesByUser] = useState({})
	const [hasVoted, setHasVoted] = useState(false)
	const buttonScale = useRef(new Animated.Value(1)).current
	const [modalVisible, setModalVisible] = useState(false)
	const [isSignIn, setIsSignIn] = useState(true)
	const [isAuthenticated, setIsAuthenticated] = useState(false)
	const user = auth.currentUser
	const [userModalVisible, setUserModalVisible] = useState(false)

	const [fontsLoaded] = useFonts({
		"my-custom-font": require("./app/assets/fonts/gordqucikblack-p7erv.ttf"),
	})

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync()
		}
	}, [fontsLoaded])

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsAuthenticated(!!user)
		})

		return () => unsubscribe()
	}, [])

	useEffect(() => {
		if (isAuthenticated && !hasVoted) {
			fetchDilemma(dilemmaId, setCountA, setCountB).then((votesData) => {
				setVotesByUser(votesData)
				setCountA(0)
				setCountB(0)
			})
		}
	}, [isAuthenticated, hasVoted])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		try {
	// 			const data = await fetchDilemma(dilemmaId, setCountA, setCountB) // Get the data and update the state
	// 			setCountA(data.aVotes)
	// 			setCountB(data.bVotes)
	// 		} catch (error) {
	// 			console.error("Error fetching the dilemma:", error)
	// 		}
	// 	}

	// 	fetchData()
	// }, [dilemmaId])

	if (!fontsLoaded) {
		return null // Return null while fonts are loading
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

	const onLongPressVote = async (voteType) => {
		if (!isAuthenticated) {
			animateButton()
			openModal()
			return
		}

		if (votesByUser[user.uid]) {
			// Set the error message if the user has already voted
			Alert.alert("You've already voted", "Day-lemma means one dilemma a day")
			return // Prevent further action
		}

		try {
			await updateVotes(dilemmaId, voteType, user.uid)
			fetchDilemma(dilemmaId, setCountA, setCountB).then((votesData) => {
				setVotesByUser(votesData)
				setHasVoted(true)
			})
		} catch (error) {
			console.error(`Error updating votes for ${voteType}:`, error)
		}
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
	const SignOut = () => {
		signOut(auth)
			.then(() => {
				setCountA(0)
				setCountB(0)
				setIsAuthenticated(false)
				setUserModalVisible(false)
				console.log("User signed out")
			})
			.catch((error) => {
				console.error("Error signing out:", error)
			})
	}

	const handleModal = () => {
		setUserModalVisible(true)
	}

	return (
		<>
			<SafeAreaView>
				<Header
					onLoginPress={openModal}
					isAuthenticated={isAuthenticated}
					handleModal={handleModal}
					buttonScale={buttonScale}
				/>
			</SafeAreaView>
			<View style={styles.mainContainer}>
				<LinearGradient
					colors={["#A6E1D7", "#A6E1D7", "#A6E1D7"]}
					style={[styles.containerOptionA, { flex: flexOptionA }]}
				>
					<TouchableOpacity
						style={styles.touchable}
						onPress={() => {
							if (!isAuthenticated) {
								animateButton()
								openModal()
							}
						}}
						onLongPress={() => onLongPressVote("aVotes")}
						activeOpacity={0.8}
					>
						<Text style={styles.h2}>Pinneapple pizza🍍</Text>
						<Text style={styles.paragraph}>
							{total === 0 && !hasVoted
								? "Hold to vote"
								: `${((countA / total) * 100).toFixed(2)}%`}
						</Text>
					</TouchableOpacity>
				</LinearGradient>
				<View style={styles.divider} />
				<LinearGradient
					colors={["#F49A9D", "#F49A9D"]}
					style={[styles.containerOptionB, { flex: flexOptionB }]}
				>
					<TouchableOpacity
						style={styles.touchable}
						onPress={() => {
							if (!isAuthenticated) {
								animateButton()
								openModal()
							}
						}}
						onLongPress={() => onLongPressVote("bVotes")}
						activeOpacity={0.8}
					>
						<Text style={[styles.h2, { fontFamily: "my-custom-font" }]}>
							Pizza margherita🍕
						</Text>
						<Text style={styles.paragraph}>
							{total === 0 && !hasVoted
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
				<Modal
					animationType="slide"
					transparent={true}
					visible={userModalVisible}
					onRequestClose={() => {
						setUserModalVisible(false)
					}}
				>
					<TouchableWithoutFeedback onPress={() => setUserModalVisible(false)}>
						<View style={{ flex: 1 }}>
							<View
								style={{
									flex: 1,
									justifyContent: "center",
									alignItems: "center",
								}}
							>
								<TouchableWithoutFeedback>
									<View
										style={{
											width: 300,
											height: 400,
											backgroundColor: "white",
											padding: 20,
										}}
									>
										<UserProfileScreen />
										<Button title="Log out" onPress={() => SignOut()} />
									</View>
								</TouchableWithoutFeedback>
							</View>
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
			fontFamily: "my-custom-font",
			fontSize: 50,
			color: "white",
			textTransform: "uppercase",
			textAlign: "center",
			textShadowColor: "black",
			textShadowOffset: { width: 4, height: 2 },
			textShadowRadius: 1,
		},
		paragraph: {
			fontSize: 38,
			paddingTop: 20,
			fontFamily: "my-custom-font",
			color: "white",
			textShadowColor: "black",
			textShadowOffset: { width: 4, height: 2 },
			textShadowRadius: 1,
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
