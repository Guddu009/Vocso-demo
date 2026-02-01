import { create } from 'zustand';

interface UserState {
    username: string | null;
    fcmToken: string | null;
    setUsername: (username: string) => void;
    setFcmToken: (token: string) => void;
    logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
    username: null,
    fcmToken: null,
    setUsername: (username) => set({ username }),
    setFcmToken: (token) => set({ fcmToken: token }),
    logout: () => set({ username: null, fcmToken: null }),
}));

