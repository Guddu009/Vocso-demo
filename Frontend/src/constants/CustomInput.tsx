import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps, TouchableOpacity } from 'react-native';
import { Colors } from './Colors';
import { Fonts } from './Fonts';
import { Metrics } from './Metrics';

interface Props extends TextInputProps {
    label?: string;
    error?: string;
}

const CustomInput: React.FC<Props> = ({ label, error, style, ...props }) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.inputContainer,
                    isFocused && styles.focusedInput,
                    !!error && styles.errorInput,
                    style
                ]}
            >
                <TextInput
                    style={styles.input}
                    placeholderTextColor={Colors.Placeholder}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    selectionColor={Colors.Primary}
                    {...props}
                />
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: Metrics.verticalScale(16),
        width: '100%',
    },
    label: {
        fontFamily: Fonts.Medium,
        fontSize: Metrics.moderateScale(14),
        color: Colors.Text,
        marginBottom: Metrics.verticalScale(8),
    },
    inputContainer: {
        height: Metrics.verticalScale(50),
        backgroundColor: Colors.InputBackground,
        borderRadius: Metrics.moderateScale(12),
        borderWidth: 1,
        borderColor: Colors.Transparent,
        paddingHorizontal: Metrics.horizontalScale(16),
        justifyContent: 'center',
    },
    input: {
        fontFamily: Fonts.Regular,
        fontSize: Metrics.moderateScale(16),
        color: Colors.Text,
        flex: 1,
    },
    focusedInput: {
        borderColor: Colors.Primary,
        backgroundColor: Colors.Background,
    },
    errorInput: {
        borderColor: Colors.Error,
    },
    errorText: {
        fontFamily: Fonts.Regular,
        fontSize: Metrics.moderateScale(12),
        color: Colors.Error,
        marginTop: Metrics.verticalScale(4),
    },
});

export default CustomInput;
