import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });

        await Notifications.setNotificationChannelAsync('chat-messages', {
            name: 'Chat Messages',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#075E54',
            showBadge: true,
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }

        // Learn more about projectId:
        // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
        // This will error if not configured in app.json properly for EAS
        try {
            // Get the native device token (FCM token for Android)
            token = (await Notifications.getDevicePushTokenAsync()).data;
            console.log("Device Push Token (FCM):", token);
        } catch (e) {
            console.warn("Error getting device push token:", e);
        }
    } else {
        // alert('Must use physical device for Push Notifications');
    }

    return token;
}

// Function to simulate sending a notification (for demo purposes)
export async function sendPushNotification(expoPushToken: string, message: { title: string, body: string, data?: any }) {
    const messageData = {
        to: expoPushToken,
        sound: 'default',
        title: message.title,
        body: message.body,
        data: message.data || { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Accept-encoding': 'gzip, deflate',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(messageData),
    });
}
