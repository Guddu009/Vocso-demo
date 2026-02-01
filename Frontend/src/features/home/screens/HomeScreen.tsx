import React, { useState } from 'react';
import { View, Text } from 'react-native';
import CSafeAreaView from '../../../constants/CSafeAreaView';
import CustomButton from '../../../constants/CustomButton';
import CustomInput from '../../../constants/CustomInput';
import CustomAlert from '../../../constants/CustomAlert';

export const HomeScreen = () => {
    const [alertVisible, setAlertVisible] = useState(false);

    return (
        <CSafeAreaView>
            <View className="px-5">
                <Text className="font-bold text-3xl text-primary mt-5">Demo</Text>
                <Text className="font-regular text-lg text-textSecondary mb-10">Welcome to the app!</Text>

                <View className="gap-4">
                    <CustomInput label="Test Input" placeholder="Type something..." />

                    <CustomButton
                        title="Show Alert"
                        onPress={() => setAlertVisible(true)}
                        style={{ marginTop: 10 }}
                    />

                    <CustomButton
                        title="Secondary Action"
                        variant="outline"
                        onPress={() => { }}
                        style={{ marginTop: 10 }}
                    />
                </View>

                <CustomAlert
                    visible={alertVisible}
                    type="success"
                    title="Success!"
                    message="You have successfully set up the project foundation."
                    onClose={() => setAlertVisible(false)}
                    confirmText="Awesome"
                />
            </View>
        </CSafeAreaView>
    );
};
