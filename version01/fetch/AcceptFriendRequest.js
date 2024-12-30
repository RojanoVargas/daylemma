export async function AcceptFriendRequest(receiverUID, senderUID) {
    try {
      const receiverRef = doc(db, "users", receiverUID);
      const receiverSnap = await getDoc(receiverRef);
  
      if (receiverSnap.exists()) {
        const receiverUser = receiverSnap.data();
  
        // Accept the friend request and add the sender to the receiver's friends list
        await updateDoc(receiverRef, {
          friendRequests: {
            ...receiverUser.friendRequests,
            [senderUID]: "accepted",
          },
          friends: [...receiverUser.friends, senderUID], // Add sender to friends
        });
  
        console.log(`Friend request from ${senderUID} accepted by ${receiverUID}`);
      } else {
        console.log("Receiver not found.");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  }
  