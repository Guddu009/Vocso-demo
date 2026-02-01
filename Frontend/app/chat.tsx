import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,

    StatusBar
} from 'react-native';
import { useRouter } from 'expo-router';
import io from 'socket.io-client';
import axios from 'axios';
import { useUserStore } from '../src/store/userStore';
import { Colors } from '../src/constants/Colors';
import { Fonts } from '../src/constants/Fonts';
import { Metrics } from '../src/constants/Metrics';
import Ionicons from '@expo/vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

// Replace with your server's IP address (not localhost for Android emulator/device)
const BACKEND_URL = 'http://192.168.1.16:3000';

interface Message {
    id: string;
    text: string;
    sender: string;
    timestamp: string;
}

export default function ChatRoomScreen() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const username = useUserStore((state) => state.username);
    const fcmToken = useUserStore((state) => state.fcmToken);
    const logout = useUserStore((state) => state.logout);
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);
    const socketRef = useRef<any>(null);

    useEffect(() => {
        if (!username) {
            router.replace('/login');
            return;
        }

        // Fetch history
        axios.get(`${BACKEND_URL}/api/messages`)
            .then(res => setMessages(res.data))
            .catch(err => console.error("Error fetching history:", err));

        // Socket setup
        socketRef.current = io(BACKEND_URL);

        socketRef.current.on('receive_message', (message: Message) => {
            setMessages(prev => [...prev, message]);
        });

        return () => {
            if (socketRef.current) socketRef.current.disconnect();
        };
    }, [username]);

    const sendMessage = () => {
        if (inputText.trim() && username && socketRef.current) {
            socketRef.current.emit('send_message', {
                text: inputText.trim(),
                sender: username,
                fcmToken: fcmToken
            });
            setInputText('');
        }
    };

    const formatTime = (isoString: string) => {
        try {
            const date = new Date(isoString);
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return '';
        }
    };

    const renderItem = ({ item }: { item: Message }) => {
        const isMe = item.sender === username;
        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                <View style={[styles.bubble, isMe ? styles.myBubble : styles.theirBubble]}>
                    {!isMe && <Text style={styles.senderName}>{item.sender}</Text>}
                    <Text style={[styles.messageText, isMe ? styles.myText : styles.theirText]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.theirTimeText]}>
                        {formatTime(item.timestamp)}
                    </Text>
                </View>
            </View>
        );
    };

    if (!username) return null;

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Chatroom</Text>
                    <View style={styles.onlineBadge} />
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={() => logout()}>
                    <Ionicons name="log-out-outline" size={24} color={Colors.Error} />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.flex}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.listContent}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.inputWrapper}>
                    <View style={styles.inputBox}>
                        <TextInput
                            style={styles.input}
                            placeholder="Type a message..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            placeholderTextColor={Colors.Placeholder}
                        />
                        <TouchableOpacity
                            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                            onPress={sendMessage}
                            disabled={!inputText.trim()}
                        >
                            <Ionicons name="send" size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FA',
    },
    flex: {
        flex: 1,
    },
    header: {
        height: 60,
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        zIndex: 10,
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 22,
        fontFamily: Fonts.Bold,
        color: Colors.Text,
    },
    onlineBadge: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.Success,
        marginLeft: 8,
        marginTop: 4,
    },
    logoutBtn: {
        padding: 5,
    },
    listContent: {
        paddingHorizontal: 15,
        paddingTop: 10,
        paddingBottom: 20,
    },
    messageRow: {
        marginVertical: 4,
        maxWidth: '85%',
    },
    myMessageRow: {
        alignSelf: 'flex-end',
    },
    theirMessageRow: {
        alignSelf: 'flex-start',
    },
    bubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    myBubble: {
        backgroundColor: Colors.Primary,
        borderBottomRightRadius: 2,
    },
    theirBubble: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: '#E9ECEF',
    },
    senderName: {
        fontSize: 12,
        fontFamily: Fonts.Bold,
        color: Colors.Primary,
        marginBottom: 2,
    },
    messageText: {
        fontSize: 15,
        fontFamily: Fonts.Regular,
        lineHeight: 20,
    },
    myText: {
        color: '#fff',
    },
    theirText: {
        color: Colors.Text,
    },
    timeText: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 4,
        fontFamily: Fonts.Regular,
    },
    myTimeText: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    theirTimeText: {
        color: Colors.TextSecondary,
    },
    inputWrapper: {
        paddingHorizontal: 10,
        paddingVertical: 8,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E9ECEF',
    },
    inputBox: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: '#F1F3F5',
        borderRadius: 25,
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 15,
        fontFamily: Fonts.Regular,
        color: Colors.Text,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.Primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
        marginBottom: 5,
    },
    sendButtonDisabled: {
        backgroundColor: Colors.Placeholder,
    },
});

