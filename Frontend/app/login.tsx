import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { useUserStore } from '../src/store/userStore';
import { registerForPushNotificationsAsync } from '../src/utils/notificationHelper';

// Replace with your server's IP address (not localhost for Android emulator/device)
const BACKEND_URL = 'http://192.168.1.63:3000';


export default function LoginScreen() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const setUsername = useUserStore((state) => state.setUsername);
    const router = useRouter();

    const handleJoin = async () => {
        if (!name.trim() || !password.trim()) {
            Alert.alert("Error", "Username and password are required");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/api/login`, {
                username: name.trim(),
                password: password.trim()
            });

            if (response.status === 200) {
                const username = name.trim();
                setUsername(username);

                // Get FCM Token and save to backend
                try {
                    const token = await registerForPushNotificationsAsync();
                    if (token) {
                        // Store in local state
                        useUserStore.getState().setFcmToken(token);

                        // Save to backend
                        await axios.post(`${BACKEND_URL}/api/save-token`, {
                            username: username,
                            fcmToken: token
                        });
                        console.log("FCM Token registered and saved for:", username);
                    }
                } catch (tokenError) {
                    console.warn("FCM Token registration failed:", tokenError);
                }

                router.replace('/chat');
            }
        } catch (error: any) {
            console.error("Login error:", error);
            const msg = error.response?.data?.error || "Login failed. Please check your credentials.";
            Alert.alert("Login Failed", msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <View style={styles.inner}>
                <Text style={styles.title}>Welcome to Chatroom</Text>
                <Text style={styles.subtitle}>Login with your credentials</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Username (user1 or user2)"
                    value={name}
                    onChangeText={setName}
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

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleJoin}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>{loading ? 'Joining...' : 'Join Chat'}</Text>
                </TouchableOpacity>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>Demo Users:</Text>
                    <Text style={styles.infoText}>user1 / pass123</Text>
                    <Text style={styles.infoText}>user2 / pass123</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'Outfit-Bold',
        marginBottom: 5,
        color: '#333',
    },
    subtitle: {
        fontSize: 16,
        fontFamily: 'Outfit-Regular',
        color: '#666',
        marginBottom: 30,
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        fontFamily: 'Outfit-Regular',
        borderWidth: 1,
        borderColor: '#ddd',
        marginBottom: 15,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#007AFF',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#A0CCFF',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontFamily: 'Outfit-SemiBold',
    },
    infoBox: {
        marginTop: 30,
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#eee',
        alignItems: 'center',
    },
    infoText: {
        fontSize: 14,
        fontFamily: 'Outfit-Regular',
        color: '#888',
        marginBottom: 2,
    }
});
