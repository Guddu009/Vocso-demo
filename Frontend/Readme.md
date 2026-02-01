# Chatroom App with Background Notifications (Expo)

A real-time chatroom application built with React Native (Expo Router), Firebase, and NativeWind.

## Features

- **Real-time Messaging**: Powered by Firebase Firestore.
- **Simple Auth**: Username-based login.
- **Push Notifications**: Expo Notifications with background support and navigation.
- **Modern UI**: Styled with NativeWind (Tailwind CSS).

## Prerequisites

- [Node.js](https://nodejs.org/)
- [Expo Go](https://expo.dev/go) app (for testing on device)
- [Firebase Account](https://firebase.google.com/)

## Getting Started

1.  **Clone the repository**:
    ```bash
    git clone <repository-url>
    cd <project-folder>
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Configure Firebase**:
    - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
    - Enable **Cloud Firestore**.
    - Copy your web config and paste it into `src/config/firebaseConfig.js`.

4.  **Start the app**:
    ```bash
    npx expo start
    ```

5.  **Run on Android/iOS**:
    - Scan the QR code with the Expo Go app.

## Building for Production (Android APK)

To generate a standalone APK:

1.  **Install EAS CLI**:
    ```bash
    npm install -g eas-cli
    ```

2.  **Login to Expo**:
    ```bash
    eas login
    ```

3.  **Configure Project**:
    ```bash
    eas build:configure
    ```

4.  **Build APK**:
    ```bash
    eas build -p android --profile preview
    ```
    This will provide a download link to the `.apk` file once the build is complete.

## Project Structure

- `app/`: Expo Router screens (routing).
- `src/config/`: Firebase and app configurations.
- `src/store/`: State management (Zustand).
- `src/utils/`: Helper functions (Notifications).
- `src/features/`: Component and screen logic (if modularized further).

## Troubleshooting

- **Push Tokens**: Make sure to test on a physical device for push notifications. Android emulators require Google Play Services.
- **Firebase Permissions**: Ensure your Firestore rules allow read/write for testing.
