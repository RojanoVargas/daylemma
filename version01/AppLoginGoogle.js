// future login with google

/*import React from 'react';
import { Button, View, SafeAreaView, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import Constants from 'expo-constants';

WebBrowser.maybeCompleteAuthSession();

const firebaseConfig = {
    apiKey: "AIzaSyC5LutNGqcwRKvIlxunQgCOMirI5pKAB-8",
    authDomain: "daylemma-4d24a.firebaseapp.com",
    projectId: "daylemma-4d24a",
    storageBucket: "daylemma-4d24a.firebasestorage.app",
    messagingSenderId: "1039291459621",
    appId: "1:1039291459621:android:a2ed21cb9082e9c4c6b7cc",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default function App() {
    const { expoClientId, androidClientId } = Constants.expoConfig?.extra || {};

    const [request, response, promptAsync] = Google.useAuthRequest({
        expoClientId,
        androidClientId,
		redirectUri: 'https://auth.expo.io/@rojanovargas/version01',
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then((userCredential) => {
                    console.log('User signed in: ', userCredential.user);
                })
                .catch((error) => {
                    console.error('Error signing in: ', error);
                });
        }
    }, [response]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button
                    disabled={!request}
                    title="Sign in with Google"
                    onPress={() => {
                        promptAsync();
                    }}
                />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        width: '80%',
    },
});
*/