import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "../config/firebaseConfig";

export default function DataFetcher({ dilemmaId, onDataFetched }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDilemmaData() {
      try {
        const docRef = doc(db, "votes", dilemmaId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          onDataFetched(docSnap.data()); // Pass data to parent component (App.js)
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching dilemma:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchDilemmaData();
  }, [dilemmaId, onDataFetched]);

  if (loading) {
    return null;
  }

  return null;
}

export async function fetchDilemma(dilemmaId) {
  try {
    const docRef = doc(db, "votes", dilemmaId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error fetching dilemma:", error);
    throw error;
  }
}

export async function updateVotes(dilemmaId, voteType) {
  try {
    const docRef = doc(db, "votes", dilemmaId);
    await updateDoc(docRef, {
      [voteType]: increment(1)
    });
  } catch (error) {
    console.error(`Error updating votes for ${voteType}:`, error);
    throw error;
  }
}