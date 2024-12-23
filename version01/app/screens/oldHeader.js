import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"

const Header = () => {
	return (
		<View style={styles.header}>
			<Image source={require("../assets/vitamin-d.png")} style={styles.icon} />
			<Text style={styles.title}>Daylemma</Text>

			<TouchableOpacity
				// onPress={handlePress}
				style={styles.iconButton}
			>
				<Image
					source={require("../assets/burger-menu.png")}
					style={styles.burgerImage}
				/>
			</TouchableOpacity>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		backgroundColor: "white", //
		paddingTop: 50,
		paddingBottom: 10,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		elevation: 3,
        position: "relative"
	},
	icon: {
		width: 30,
		height: 30,
		marginRight: 10,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "black",
	},
	burgerImage: {
		width: 30,
		height: 30,
        position: "absolute",
        bottom: -13,
        left: 60
	},
})

export default Header
