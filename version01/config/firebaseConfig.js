import { initializeApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage';


const firebaseConfig = {
    apiKey: "AIzaSyC5LutNGqcwRKvIlxunQgCOMirI5pKAB-8",
    authDomain: "daylemma-4d24a.firebaseapp.com",
    projectId: "daylemma-4d24a",
    storageBucket: "daylemma-4d24a.firebasestorage.app",
    messagingSenderId: "1039291459621",
    appId: "1:1039291459621:android:a2ed21cb9082e9c4c6b7cc",
}

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
export { auth }