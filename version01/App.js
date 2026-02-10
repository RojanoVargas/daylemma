import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useEffect, useRef } from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	Animated,
	Alert,
	SafeAreaView,
} from "react-native";
import { auth } from "./config/firebaseConfig";
//import { loadFonts } from "./config/fontsConfig" // bring fonts from config. not in use now
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

import { onAuthStateChanged, signOut } from "firebase/auth";
import Header from "./app/screens/Header";
import SignInForm from "./app/screens/SignInForm";
import SignUpForm from "./app/screens/SignUpForm";
import {
	fetchDilemma,
	updateVotes,
	fetchDilemmaContent,
} from "./fetch/DataFetcher";
import UserProfileScreen from "./app/screens/UserProfileScreen";

SplashScreen.preventAutoHideAsync();
Alert.alert(
	"Dear tester, new Daylemmas will come soon. Thank you so much for your help!"
);

export default function App() {
	console.log("App executed");

	// Generate dilemmaId based on current date
	const getCurrentDilemmaId = () => {
		const today = new Date();
		const year = today.getFullYear();
		const month = String(today.getMonth() + 1).padStart(2, "0");
		const day = String(today.getDate()).padStart(2, "0");
		return `${year}-${month}-${day}`;
	};

	const dilemmaId = getCurrentDilemmaId();
	const [dilemma, setDilemma] = useState(null);
	const [countA, setCountA] = useState(0);
	const [countB, setCountB] = useState(0);
	const [votesByUser, setVotesByUser] = useState({});
	const [hasVoted, setHasVoted] = useState(false);
	const buttonScale = useRef(new Animated.Value(1)).current;
	const [modalVisible, setModalVisible] = useState(false);
	const [isSignIn, setIsSignIn] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [userModalVisible, setUserModalVisible] = useState(false);

	const [fontsLoaded] = useFonts({
		"gord-quick": require("./app/assets/fonts/gordqucikblack-p7erv.ttf"),
	});

	useEffect(() => {
		if (fontsLoaded) {
			SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	useEffect(() => {
		// Initialize the daily dilemma from database
		const initializeDilemma = async () => {
			try {
				const dailyDilemma = await fetchDilemmaContent(dilemmaId);
				setDilemma(dailyDilemma);
				// Reset voting state when dilemma changes
				setHasVoted(false);
			} catch (error) {
				console.error("Error initializing dilemma:", error);
				// Set fallback dilemma
				setDilemma({
					optionA: "Option A 🤔",
					optionB: "Option B 🤯",
				});
			}
		};

		initializeDilemma();
	}, [dilemmaId]);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setIsAuthenticated(!!user);
		});

		return () => unsubscribe();
	}, []);

	useEffect(() => {
		if (isAuthenticated) {
			fetchDilemma(dilemmaId, setCountA, setCountB).then((votesData) => {
				setVotesByUser(votesData);
				// Check if current user has already voted for this specific dilemma
				const currentUser = auth.currentUser;
				if (currentUser && votesData) {
					// Encode email for consistent checking
					const encodeEmail = (email) =>
						email.replace(/[./]/g, (match) => encodeURIComponent(match));
					const encodedEmail = encodeEmail(currentUser.email);

					if (votesData[encodedEmail]) {
						setHasVoted(true);
					} else {
						setHasVoted(false);
					}
				} else {
					setHasVoted(false);
				}
			});
		}
	}, [isAuthenticated, dilemmaId]); // Added dilemmaId to dependencies

	if (!fontsLoaded) {
		return null; // Return null while fonts are loading
	}

	const customFontStyles = {
		fontFamily: "gord-quick",
	};

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
		]).start();
	};

	const onLongPressVote = async (voteType) => {
		if (!isAuthenticated) {
			animateButton();
			openModal();
			return;
		}

		const currentUser = auth.currentUser;
		if (!currentUser) {
			Alert.alert("Authentication Error", "Please sign in to vote");
			return;
		}

		// Encode email for consistent checking
		const encodeEmail = (email) =>
			email.replace(/[./]/g, (match) => encodeURIComponent(match));
		const encodedEmail = encodeEmail(currentUser.email);

		// Check if user has already voted for this specific dilemma
		if (hasVoted || (votesByUser && votesByUser[encodedEmail])) {
			Alert.alert("You've already voted", "Day-lemma means one dilemma a day");
			return;
		}

		try {
			await updateVotes(dilemmaId, voteType, currentUser.email);
			fetchDilemma(dilemmaId, setCountA, setCountB).then((votesData) => {
				setVotesByUser(votesData);
				setHasVoted(true);
			});
		} catch (error) {
			console.error(`Error updating votes for ${voteType}:`, error);
		}
	};

	const total = countA + countB;

	let flexOptionA = countA;
	let flexOptionB = countB;

	if (countA === 0 && countB === 0) {
		flexOptionA = 1;
		flexOptionB = 1;
	} else {
		flexOptionA = countA === 0 ? 0.5 : countA;
		flexOptionB = countB === 0 ? 0.5 : countB;
	}

	const styles = createStyles(flexOptionA, flexOptionB);

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
	const SignOut = () => {
		signOut(auth)
			.then(() => {
				setCountA(0);
				setCountB(0);
				setIsAuthenticated(false);
				setUserModalVisible(false);
				console.log("User signed out");
			})
			.catch((error) => {
				console.error("Error signing out:", error);
			});
	};

	const handleModal = () => {
		setUserModalVisible(true);
	};

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
								animateButton();
								openModal();
							}
						}}
						onLongPress={() => onLongPressVote("aVotes")}
						activeOpacity={0.8}
					>
						<Text style={styles.h2}>{dilemma?.optionA || "Loading..."}</Text>
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
								animateButton();
								openModal();
							}
						}}
						onLongPress={() => onLongPressVote("bVotes")}
						activeOpacity={0.8}
					>
						<Text style={styles.h2}>{dilemma?.optionB || "Loading..."}</Text>
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
											customFontStyles={customFontStyles}
										/>
									) : (
										<SignUpForm
											onClose={closeModal}
											switchToSignIn={switchToSignIn}
											setIsAuthenticated={setIsAuthenticated}
											customFontStyles={customFontStyles}
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
						setUserModalVisible(false);
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
										<UserProfileScreen
											customFontStyles={customFontStyles}
											SignOut={SignOut}
										/>
										{/* <TouchableOpacity
											style={styles.button}
											onPress={()=> SignOut()}
										>
											<Text style={styles.buttonText}>Log out</Text>
										</TouchableOpacity> */}
									</View>
								</TouchableWithoutFeedback>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>

				<StatusBar style="auto" />
			</View>
		</>
	);
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
			fontFamily: "gord-quick",
			fontSize: 50,
			color: "white",
			textTransform: "uppercase",
			textAlign: "center",
			textShadowColor: "black",
			textShadowOffset: { width: 4, height: 2 },
			textShadowRadius: 1,
			padding: 10,
		},
		paragraph: {
			fontSize: 38,
			paddingTop: 20,
			fontFamily: "gord-quick",
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
			shadowOpacity: 1,
		},
		buttonText: {
			color: "white", // Change this to your desired text color
			fontSize: 16,
			textTransform: "uppercase", // Apply textTransform here
		},
		modalContainer: {
			width: "80%",
			padding: 20,
			backgroundColor: "white",
			borderRadius: 10,
		},
	});
