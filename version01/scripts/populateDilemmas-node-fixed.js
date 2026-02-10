// Node.js compatible script to populate Firestore with initial dilemmas
// Run this once to add dilemmas to your database

require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getFirestore, doc, setDoc } = require("firebase/firestore");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

// Firebase config (same as your React Native app)
const firebaseConfig = {
	apiKey: "AIzaSyC5LutNGqcwRKvIlxunQgCOMirI5pKAB-8",
	authDomain: "daylemma-4d24a.firebaseapp.com",
	projectId: "daylemma-4d24a",
	storageBucket: "daylemma-4d24a.firebasestorage.app",
	messagingSenderId: "1039291459621",
	appId: "1:1039291459621:android:a2ed21cb9082e9c4c6b7cc",
};

// Initialize Firebase for Node.js
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const initialDilemmas = {
	"2025-06-30": {
		optionA: "Pineapple pizza🍍",
		optionB: "Pizza margherita🍕",
	},
	"2025-07-01": {
		optionA: "Coffee ☕",
		optionB: "Tea 🍵",
	},
	"2025-07-02": {
		optionA: "Early bird 🐦",
		optionB: "Night owl 🦉",
	},
	"2025-07-03": {
		optionA: "Beach vacation 🏖️",
		optionB: "Mountain hiking 🏔️",
	},
	"2025-07-04": {
		optionA: "Book reading 📚",
		optionB: "Movie watching 🎬",
	},
	"2025-07-05": {
		optionA: "Cats 🐱",
		optionB: "Dogs 🐶",
	},
	"2025-07-06": {
		optionA: "Summer ☀️",
		optionB: "Winter ❄️",
	},
	"2025-07-07": {
		optionA: "Sweet 🍯",
		optionB: "Salty 🧂",
	},
	"2025-07-08": {
		optionA: "City life 🏙️",
		optionB: "Country life 🌾",
	},
	"2025-07-09": {
		optionA: "Marvel 🦸‍♂️",
		optionB: "DC Comics 🦸‍♀️",
	},
	"2025-07-10": {
		optionA: "iOS 📱",
		optionB: "Android 🤖",
	},
	"2025-07-11": {
		optionA: "Chocolate 🍫",
		optionB: "Vanilla 🍦",
	},
	"2025-07-12": {
		optionA: "Music 🎵",
		optionB: "Silence 🤫",
	},
	"2025-07-13": {
		optionA: "Superman 🦸‍♂️",
		optionB: "Batman 🦇",
	},
	"2025-07-14": {
		optionA: "Pizza 🍕",
		optionB: "Burgers 🍔",
	},
	"2025-07-15": {
		optionA: "Hot weather ☀️",
		optionB: "Cold weather ❄️",
	},
	"2025-07-16": {
		optionA: "Netflix 📺",
		optionB: "YouTube 📹",
	},
	"2025-07-17": {
		optionA: "Morning person 🌅",
		optionB: "Night person 🌙",
	},
	"2025-07-18": {
		optionA: "Texting 💬",
		optionB: "Phone calls ☎️",
	},
	"2025-07-19": {
		optionA: "Introvert 😌",
		optionB: "Extrovert 🎉",
	},
	"2025-07-20": {
		optionA: "Board games 🎲",
		optionB: "Video games 🎮",
	},
	"2025-07-21": {
		optionA: "Rain 🌧️",
		optionB: "Sunshine ☀️",
	},
	"2025-07-22": {
		optionA: "Flying 🛩️",
		optionB: "Teleportation ⚡",
	},
	"2025-07-23": {
		optionA: "Money 💰",
		optionB: "Time ⏰",
	},
	"2025-07-24": {
		optionA: "Invisibility 👻",
		optionB: "Mind reading 🧠",
	},
	"2025-07-25": {
		optionA: "Past travel ⏪",
		optionB: "Future travel ⏩",
	},
	"2025-07-26": {
		optionA: "Sweet dreams 😴",
		optionB: "No sleep needed 😎",
	},
	"2025-07-27": {
		optionA: "Comedy movies 😂",
		optionB: "Horror movies 😱",
	},
	"2025-07-28": {
		optionA: "Space travel 🚀",
		optionB: "Ocean exploration 🌊",
	},
	"2025-07-29": {
		optionA: "Live forever 🧬",
		optionB: "Live intensely 🔥",
	},
	"2025-07-30": {
		optionA: "Always be right ✅",
		optionB: "Always be happy 😊",
	},
};

async function populateDilemmas() {
	try {
		// First, authenticate with Firebase
		console.log("Authenticating...");
		const email = process.env.FIREBASE_EMAIL;
		const password = process.env.FIREBASE_PASSWORD;

		if (
			!email ||
			!password ||
			email === "your@email.com" ||
			password === "your-password"
		) {
			console.error("Please set your Firebase credentials in the .env file:");
			console.error("1. Open the .env file in your project root");
			console.error("2. Replace 'your@email.com' with your actual email");
			console.error("3. Replace 'your-password' with your actual password");
			console.error("4. Save the file and run the script again");
			process.exit(1);
		}

		await signInWithEmailAndPassword(auth, email, password);
		console.log("Authentication successful!");

		console.log("Starting to populate dilemmas...");

		for (const [date, dilemma] of Object.entries(initialDilemmas)) {
			await setDoc(doc(db, "dilemmas", date), {
				optionA: dilemma.optionA,
				optionB: dilemma.optionB,
				createdAt: new Date(),
				isActive: true,
			});
			console.log(
				`Added dilemma for ${date}: ${dilemma.optionA} vs ${dilemma.optionB}`
			);
		}

		console.log("Successfully populated all dilemmas!");
		process.exit(0);
	} catch (error) {
		console.error("Error populating dilemmas:", error);
		process.exit(1);
	}
}

// Run the population function
populateDilemmas();
