import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
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
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => {
            if (token) {
                setFcmToken(token);
                setExpoPushToken(token);
            }
        });

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            console.log("Notification Received:", notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log("Notification Tapped:", response);
            // Redirect to chatroom
            router.push('/chat');
        });

        return () => {
            notificationListener.current?.remove();
            responseListener.current?.remove();
        };
    }, []);

    if (!loaded) {
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
