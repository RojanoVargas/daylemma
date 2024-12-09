import { StatusBar } from "expo-status-bar"
import React, { useState } from "react"
import { StyleSheet, Text, View, TouchableOpacity } from "react-native"

export default function App() {
	console.log("App executed")
	const [countA, setCountA] = useState(0)
	const [countB, setCountB] = useState(0)

	const onPressA = () => setCountA((prevCount) => prevCount + 1)
	const onPressB = () => setCountB((prevCount) => prevCount + 1)

	return (
		<View style={styles.mainContainer}>
			<TouchableOpacity style={styles.containerOptionA} onPress={onPressA}>
				<Text>Option A</Text>
				<Text>{countA}</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.containerOptionB} onPress={onPressB}>
				<Text>Option B</Text>
				<Text>{countB}</Text>
			</TouchableOpacity>
			<StatusBar style="auto" />
		</View>
	)
}

const totalFlex = 10
const flexOptionA = 1.3
const flexOptionB = totalFlex - flexOptionA

const styles = StyleSheet.create({
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
		alignItems: "center",
		justifyContent: "center",
		width: "100%",
	},
})
