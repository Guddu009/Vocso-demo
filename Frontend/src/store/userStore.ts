import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface UserState {
    username: string | null;
    fcmToken: string | null;
    setUsername: (username: string) => void;
    setFcmToken: (token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            username: null,
            fcmToken: null,
            setUsername: (username) => set({ username }),
            setFcmToken: (token) => set({ fcmToken: token }),
            logout: () => set({ username: null, fcmToken: null }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

