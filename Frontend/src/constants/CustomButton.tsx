import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { Colors } from './Colors';
import { Fonts } from './Fonts';
import { Metrics } from './Metrics';

interface Props {
    title: string;
    onPress: () => void;
    isLoading?: boolean;
    disabled?: boolean;
    style?: ViewStyle;
    textStyle?: TextStyle;
    variant?: 'primary' | 'outline' | 'text';
}

const CustomButton: React.FC<Props> = ({
    title,
    onPress,
    isLoading = false,
    disabled = false,
    style,
    textStyle,
    variant = 'primary'
}) => {
    const getBackgroundColor = () => {
        if (disabled) return Colors.Placeholder;
        if (variant === 'outline' || variant === 'text') return Colors.Transparent;
        return Colors.Primary;
    };

    const getTextColor = () => {
        if (disabled) return Colors.TextSecondary;
        if (variant === 'outline') return Colors.Primary;
        if (variant === 'text') return Colors.Primary;
        return Colors.Theme;
    };

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: getBackgroundColor(),
                    borderWidth: variant === 'outline' ? 1 : 0,
                    borderColor: variant === 'outline' ? Colors.Primary : Colors.Transparent,
                },
                style
            ]}
            onPress={onPress}
            disabled={disabled || isLoading}
            activeOpacity={0.7}
        >
            {isLoading ? (
                <ActivityIndicator color={getTextColor()} />
            ) : (
                <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        height: Metrics.verticalScale(50),
        borderRadius: Metrics.moderateScale(12),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Metrics.horizontalScale(20),
        width: '100%',
    },
    text: {
        fontFamily: Fonts.Bold,
        fontSize: Metrics.moderateScale(16),
    },
});

export default CustomButton;
