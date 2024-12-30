import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

// Function to encode the email address
const encodeEmail = (email) => email.replace(/[./]/g, (match) => encodeURIComponent(match));

export async function fetchDilemma(dilemmaId, setCountA, setCountB) {
  try {
    const docRef = doc(db, "votes", dilemmaId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      setCountA(data.aVotes || 0);
      setCountB(data.bVotes || 0);
      return data.votesByUser || {}; // Return votesByUser if it exists
    } else {
      console.log("No such document! Initializing...");
      // Initialize document with default values
      await updateDoc(docRef, {
        aVotes: 0,
        bVotes: 0,
        votesByUser: {}, // Empty object for users' votes
      });
      setCountA(0);
      setCountB(0);
      return { aVotes: 0, bVotes: 0 }; // Return initialized vote counts for UI
    }
  } catch (error) {
    console.error("Error fetching dilemma:", error);
    throw error;
  }
}


export async function updateVotes(dilemmaId, voteType, userEmail) {
  if (!voteType || !userEmail) {
    throw new Error("Invalid voteType or userEmail");
  }

  try {
    const encodedEmail = encodeEmail(userEmail); // Encode the email properly
    const docRef = doc(db, "votes", dilemmaId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const userVote = data.votesByUser ? data.votesByUser[encodedEmail] : null;

      // Check if the user has already voted
      if (userVote) {
        console.log("User has already voted.");
        return; // Prevent vote update if the user has already voted
      }

      // Proceed with updating the vote
      await updateDoc(docRef, {
        [voteType]: increment(1),
        [`votesByUser.${encodedEmail}`]: voteType, // Store the encoded email vote
      });
    } else {
      console.log("No such dilemma document.");
    }
  } catch (error) {
    console.error(`Error updating votes for ${voteType}:`, error);
    throw error;
  }
}
