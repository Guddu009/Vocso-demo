import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { Colors } from '../../src/constants/Colors';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Colors.Theme,
                    borderTopWidth: 1,
                    borderTopColor: Colors.Border,
                    // height: Platform.OS === 'ios' ? Metrics.verticalScale(85) : Metrics.verticalScale(60), // TODO: Metrics
                    paddingBottom: Platform.OS === 'ios' ? 25 : 10,
                    paddingTop: 10,
                    elevation: 8,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                },
                tabBarActiveTintColor: Colors.Primary,
                tabBarInactiveTintColor: Colors.TextSecondary,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color} />,
                }}
            />
        </Tabs>
    );
}
