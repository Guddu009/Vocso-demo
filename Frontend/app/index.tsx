import { Redirect } from 'expo-router';
import { useUserStore } from '../src/store/userStore';

export default function Index() {
    const username = useUserStore((state) => state.username);

    if (!username) {
        return <Redirect href="/login" />;
    }

    return <Redirect href="/chat" />;
}
