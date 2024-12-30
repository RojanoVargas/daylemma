import { db } from "../config/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

// Function to fetch all friends' votes for the current dilemma
export async function fetchAllFriendsVotes(dilemmaId, friendsUIDs) {
  try {
    const votesRef = doc(db, "votes", dilemmaId);
    const votesSnap = await getDoc(votesRef);

    if (votesSnap.exists()) {
      const votesData = votesSnap.data();
      const friendsVotes = {};

      // Loop through friends' UIDs and get their votes
      for (let friendUID of friendsUIDs) {
        const friendVote = votesData.votesByUser ? votesData.votesByUser[friendUID] : null;
        if (friendVote) {
          friendsVotes[friendUID] = friendVote;
        }
      }

      return friendsVotes; // Returns an object with friends' votes (UIDs and their votes)
    } else {
      console.log("Dilemma not found.");
      return {};
    }
  } catch (error) {
    console.error("Error fetching all friends' votes:", error);
    return {};
  }
}