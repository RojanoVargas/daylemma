import React, { useState } from 'react';
import { Button, TextInput, View, SafeAreaView, StyleSheet, Text } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, fetchSignInMethodsForEmail, signOut } from 'firebase/auth';

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

export default function AppLoginNoGoogle() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Handle successful login here
                console.log('User signed in:', userCredential.user);
                setUser(userCredential.user);
            })
            .catch((error) => {
                // Handle error here
                setError(error.message);
                console.error('Error signing in:', error);
            });
    };

    const handleSignUp = () => {
        fetchSignInMethodsForEmail(auth, email)
            .then((signInMethods) => {
                if (signInMethods.length === 0) {
                    // Email does not exist, proceed with sign up
                    createUserWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            // Handle successful sign up here
                            console.log('User signed up:', userCredential.user);
                            setUser(userCredential.user);
                        })
                        .catch((error) => {
                            // Handle error here
                            setError(error.message);
                            console.error('Error signing up:', error);
                        });
                } else {
                    // Email already exists
                    setError('The email address is already in use by another account.');
                }
            })
            .catch((error) => {
                // Handle error here
                setError(error.message);
                console.error('Error checking email:', error);
            });
    };

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                // Handle successful logout here
                console.log('User signed out');
                setUser(null);
            })
            .catch((error) => {
                // Handle error here
                setError(error.message);
                console.error('Error signing out:', error);
            });
    };

    if (user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.welcome}>Welcome, {user.email}!</Text>
                <Button title="Logout" onPress={handleLogout} />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <Button title="Login" onPress={handleLogin} />
            <Button title="Sign Up" onPress={handleSignUp} />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    welcome: {
        fontSize: 20,
        marginBottom: 20,
    },
});