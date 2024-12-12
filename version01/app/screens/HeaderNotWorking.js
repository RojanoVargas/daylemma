import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native"
import { Menu, Provider } from "react-native-paper"

const Header = () => {
	const [visible, setVisible] = useState(false)

	const openMenu = () => setVisible(true)
	const closeMenu = () => setVisible(false)

	return (
		<Provider>
			<View style={styles.header}>
				<Image
					source={require("../assets/vitamin-d.png")}
					style={styles.icon}
				/>
				<Text style={styles.title}>Daylemma</Text>

				<TouchableOpacity onPress={openMenu} style={styles.iconButton}>
					<Image
						source={require("../assets/burger-menu.png")}
						style={styles.burgerImage}
					/>
				</TouchableOpacity>
				<Menu
					visible={visible}
					onDismiss={closeMenu}
					anchor={<Text style={{ visibility: "hidden" }} />}
				>
					<Menu.Item onPress={() => alert("Go to Profile")} title="Profile" />
					<Menu.Item onPress={() => alert("Go to Friends")} title="Friends" />
					<Menu.Item onPress={() => alert("Settings")} title="Settings" />
					<Menu.Item onPress={() => alert("Log Out")} title="Log Out" />
				</Menu>
			</View>
		</Provider>
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
		position: "relative",
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
		left: 60,
	},
})

export default Header
