import { StatusBar } from "expo-status-bar"
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

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
	}

	const styles = createStyles(flexOptionA, flexOptionB)

	return (
		<View style={styles.mainContainer}>
			<TouchableOpacity
				style={styles.containerOptionA}
				onLongPress={onPressA}
				activeOpacity={0.8}
			>
				<Text style={styles.h2}>Option A</Text>
				<Text style={styles.paragraph}>
					{((countA / total) * 100).toFixed(2) === "NaN"
						? "Hold to vote"
						: `${((countA / total) * 100).toFixed(2)}%`}
				</Text>
			</TouchableOpacity>
			<View style={styles.divider} />
			<TouchableOpacity
				style={styles.containerOptionB}
				onLongPress={onPressB}
				activeOpacity={0.8}
			>
				<Text style={styles.h2}>Option B</Text>
				<Text style={styles.paragraph}>
					{((countB / total) * 100).toFixed(2) === "NaN"
						? "Hold to vote"
						: `${((countB / total) * 100).toFixed(2)}%`}
				</Text>
			</TouchableOpacity>
			<StatusBar style="auto" />
		</View>
	)
}

const createStyles = (flexOptionA, flexOptionB) =>
	StyleSheet.create({
		mainContainer: {
			flex: 1,
			backgroundColor: "#fff",
			alignItems: "center",
			justifyContent: "center",
		},
		containerOptionA: {
			flex: flexOptionA,
			backgroundColor: "lightgreen",
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
		},
		containerOptionB: {
			flex: flexOptionB,
			backgroundColor: "orange",
      background: "linear-gradient(#ff9a9e, #fad0c4)",
			alignItems: "center",
			justifyContent: "center",
			width: "100%",
		},
		h2: {
			fontSize: 32,
			textShadowColor: "rgba(0, 0, 0, 0.75)",
			textShadowOffset: { width: -1, height: 1 },
			textShadowRadius: 10,
			color: "white",
			fontWeight: 700,
		},
		paragraph: {
			fontSize: 20,
			fontWeight: 700,
		},
		divider: {
			height: 4,
			width: "100%",
			backgroundColor: "#000",
		},
	})
