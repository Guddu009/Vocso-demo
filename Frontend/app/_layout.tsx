import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme } from 'react-native';
import { Outfit_400Regular, Outfit_500Medium, Outfit_600SemiBold, Outfit_700Bold } from '@expo-google-fonts/outfit';
import * as Notifications from 'expo-notifications';
import { registerForPushNotificationsAsync } from '../src/utils/notificationHelper';
import { useUserStore } from '../src/store/userStore';

import '../global.css';

// Configure notification behavior
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: false,
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: false,
        shouldShowList: false,
    }),
});

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();
const BACKEND_URL = 'http://192.168.1.63:3000';

export default function RootLayout() {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const { username, setFcmToken } = useUserStore();
    const [expoPushToken, setExpoPushToken] = useState<string | undefined>('');
    const notificationListener = useRef<any>(null);
    const responseListener = useRef<any>(null);

    const [loaded] = useFonts({
        'Outfit-Regular': Outfit_400Regular,
        'Outfit-Medium': Outfit_500Medium,
        'Outfit-SemiBold': Outfit_600SemiBold,
        'Outfit-Bold': Outfit_700Bold,
    });

    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        // Wait for store to hydrate from AsyncStorage
        const unsubHydrate = useUserStore.persist.onFinishHydration(() => {
            setHasHydrated(true);
        });

        // If it's already hydrated
        if (useUserStore.persist.hasHydrated()) {
            setHasHydrated(true);
        }

        return () => unsubHydrate();
    }, []);

    useEffect(() => {
        if (loaded && hasHydrated) {
            SplashScreen.hideAsync();
        }
    }, [loaded, hasHydrated]);

    useEffect(() => {
        registerForPushNotificationsAsync().then(async (token) => {
            if (token) {
                setFcmToken(token);
                setExpoPushToken(token);

                // If user is already logged in, register token with backend
                // (Important because backend store is in-memory and resets on restart)
                if (username) {
                    try {
                        await axios.post(`${BACKEND_URL}/api/save-token`, {
                            username: username,
                            fcmToken: token
                        });
                        console.log("FCM Token re-registered on startup for:", username);
                    } catch (e) {
                        console.warn("Failed to re-register token on startup:", e);
                    }
                }
            }
        });

        // Background handler (when app is not running) logic is handled by expo-notifications automatically
        // but we can listen for responses (taps)

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification Received:", notification);
            // Optional: If we are already in the chat room with THIS user, we might want to suppress the banner
            // or play a different sound. For now, we let it show if the user isn't on the chat screen.
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const data = response.notification.request.content.data;
            console.log("Notification Tapped:", response);

            // Redirect to chatroom
            if (data.screen === 'Chat') {
                router.push('/chat');
            } else {
                router.push('/chat');
            }
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    if (!loaded || !hasHydrated) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <QueryClientProvider client={queryClient}>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack initialRouteName={username ? "chat" : "login"}>
                        <Stack.Screen name="login" options={{ headerShown: false }} />
                        <Stack.Screen name="chat" options={{ headerShown: false }} />
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="+not-found" />
                    </Stack>
                    <StatusBar style="auto" />
                </ThemeProvider>
            </QueryClientProvider>
        </SafeAreaProvider>
    );
}
