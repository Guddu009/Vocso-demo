import React from 'react';
import { TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Colors } from './Colors';
import { Metrics } from './Metrics';
import Ionicons from '@expo/vector-icons/Ionicons';

interface Props {
    onPress?: () => void;
    color?: string;
}

const CustomBackButton: React.FC<Props> = ({ onPress, color = Colors.Text }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        if (onPress) {
            onPress();
        } else if (navigation.canGoBack()) {
            navigation.goBack();
        }
    };

    // Hardware back button handling
    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                handlePress();
                return true; // Prevent default behavior
            };

            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () => subscription.remove();
        }, [onPress, navigation]) // Re-bind if onPress changes
    );

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={handlePress}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
            <Ionicons name="chevron-back" size={Metrics.moderateScale(24)} color={color} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        width: Metrics.moderateScale(40),
        height: Metrics.moderateScale(40),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: Metrics.moderateScale(20),
        backgroundColor: Colors.InputBackground, // Subtle background
    },
});

export default CustomBackButton;
