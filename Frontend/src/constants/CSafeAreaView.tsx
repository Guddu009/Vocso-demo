import React from 'react';
import { View, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from './Colors';

interface Props {
    children: React.ReactNode;
    style?: any;
}

const CSafeAreaView: React.FC<Props> = ({ children, style }) => {
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }, style]}>
            <RNStatusBar barStyle="dark-content" backgroundColor={Colors.Background} />
            <View style={[styles.content]}>
                {children}
            </View>
            {/* Bottom safe area protection if needed, though usually handled by content padding */}
            {insets.bottom > 0 && <View style={{ height: insets.bottom, backgroundColor: Colors.Background }} />}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.Background,
    },
    content: {
        flex: 1,
    },
});

export default CSafeAreaView;
