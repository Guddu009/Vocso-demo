import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors } from './Colors';
import { Fonts } from './Fonts';
import { Metrics } from './Metrics';
import Ionicons from '@expo/vector-icons/Ionicons';
import CustomButton from './CustomButton';

interface Props {
    visible: boolean;
    type?: 'success' | 'error' | 'info';
    title: string;
    message: string;
    onClose: () => void;
    onConfirm?: () => void;
    confirmText?: string;
    cancelText?: string;
}

const CustomAlert: React.FC<Props> = ({
    visible,
    type = 'info',
    title,
    message,
    onClose,
    onConfirm,
    confirmText = 'OK',
    cancelText = 'Cancel'
}) => {
    const getIcon = () => {
        switch (type) {
            case 'success': return { name: 'checkmark-circle' as any, color: Colors.Success };
            case 'error': return { name: 'alert-circle' as any, color: Colors.Error };
            default: return { name: 'information-circle' as any, color: Colors.Info };
        }
    };

    const { name, color } = getIcon();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.iconContainer}>
                        <Ionicons name={name} size={Metrics.moderateScale(48)} color={color} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {onConfirm && (
                            <CustomButton
                                title={cancelText}
                                onPress={onClose}
                                variant="outline"
                                style={styles.cancelButton}
                            />
                        )}
                        <CustomButton
                            title={confirmText}
                            onPress={onConfirm || onClose}
                            style={onConfirm ? styles.confirmButton : styles.fullWidthButton}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.Overlay,
        justifyContent: 'center',
        alignItems: 'center',
        padding: Metrics.horizontalScale(24),
    },
    container: {
        backgroundColor: Colors.Background,
        borderRadius: Metrics.moderateScale(20),
        padding: Metrics.moderateScale(24),
        width: '100%',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    iconContainer: {
        marginBottom: Metrics.verticalScale(16),
    },
    title: {
        fontFamily: Fonts.Bold,
        fontSize: Metrics.moderateScale(20),
        color: Colors.Text,
        marginBottom: Metrics.verticalScale(8),
        textAlign: 'center',
    },
    message: {
        fontFamily: Fonts.Regular,
        fontSize: Metrics.moderateScale(16),
        color: Colors.TextSecondary,
        marginBottom: Metrics.verticalScale(24),
        textAlign: 'center',
        lineHeight: Metrics.moderateScale(22),
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        gap: Metrics.horizontalScale(12),
    },
    cancelButton: {
        flex: 1,
    },
    confirmButton: {
        flex: 1,
    },
    fullWidthButton: {
        width: '100%',
    }
});

export default CustomAlert;
