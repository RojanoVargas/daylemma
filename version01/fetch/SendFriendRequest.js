import { db } from "../config/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

// Function to send a friend request
export async function SendFriendRequest(senderUID, receiverUsername) {
  try {
    const userRef = doc(db, "users", receiverUsername); // Assuming you store users by their username
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const receiverUser = userSnap.data();

      // Add the sender's UID to the receiver's pending friend requests
      await updateDoc(userRef, {
        friendRequests: {
          ...receiverUser.friendRequests,
          [senderUID]: "pending",
        },
      });

      console.log(`Friend request sent to ${receiverUsername}`);
    } else {
      console.log("User not found.");
    }
  } catch (error) {
    console.error("Error sending friend request:", error);
  }
}
