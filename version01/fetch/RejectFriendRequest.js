export async function rejectFriendRequest(receiverUID, senderUID) {
    try {
      const receiverRef = doc(db, "users", receiverUID);
      const receiverSnap = await getDoc(receiverRef);
  
      if (receiverSnap.exists()) {
        const receiverUser = receiverSnap.data();
  
        // Reject the friend request by removing the sender from pending requests
        const { [senderUID]: _, ...updatedRequests } = receiverUser.friendRequests;
  
        await updateDoc(receiverRef, {
          friendRequests: updatedRequests,
        });
  
        console.log(`Friend request from ${senderUID} rejected by ${receiverUID}`);
      } else {
        console.log("Receiver not found.");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  }
  