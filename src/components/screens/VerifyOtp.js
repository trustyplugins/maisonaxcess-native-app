import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, Dimensions, Platform } from 'react-native';
import CustomButton from '../common/CustomButton';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import Snackbar from '../Snackbar';
import axios from "axios";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const VerifyOtp = ({ navigation }) => {
    const userData = useSelector(state => state.user.userDetails);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [showError, setShowError] = useState('');
    const [error, setError] = useState(false);
    const [otp, setOtp] = useState('');
    const handleVerifyOtp = async () => {
        if (!otp) {
            setError(true);
            return;
        }
        const data = { ...userData };
        data.otp = otp;
        try {
            const req = await axios.post(`${API_BASE_URL}/verifyOtp`, data);
            setModalMessage(req.data.message);
            showSnackbar();
        } catch (error) {
            setShowError(error.response.data.message);
            setError(true);
        }

    };

    const showSnackbar = () => {
        setSnackbarVisible(true);
        setTimeout(() => {
            setSnackbarVisible(false);
            navigation.navigate('login');
        }, 1000);
    };
    const resetError = () => {
        setError(false)
        setShowError('');
    }

    return (
        <>
            <Snackbar
                visible={snackbarVisible}
                message={modalMessage}
                onDismiss={() => setSnackbarVisible(false)}
            />
            <View style={styles.container}>
                <View style={styles.imgContainer}>
                    <Image source={require('../../assets/image/AXCESS_Logo.png')} style={styles.headerLogo} />
                </View>
                <View style={styles.formContainer}>
                    <Text style={styles.heading}>Vérifier OTP</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Entrez OTP"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        onPress={resetError}
                    />
                    {error && <Text style={styles.errorMessage}>{showError ? showError : "Le champ otp est obligatoire."}</Text>}
                    <CustomButton title="Vérifier" onPress={handleVerifyOtp} />
                </View>
            </View>
        </>
    );
};
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: responsiveHeight(12.75),
    },
    heading: {
        fontSize: responsiveFontSize(3),
        marginBottom: responsiveHeight(2.5),
        textAlign: 'center',
        color: '#11696a',
        fontWeight: 'bold',
    },
    headerLogo: {
        width: Platform.OS === 'ios' ? responsiveWidth(70) : responsiveWidth(72),
        height: Platform.OS === 'ios' ? responsiveHeight(9) : responsiveHeight(10)
    },
    formContainer: {
        flex: 1,
        marginTop: screenHeight * 0.1,
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: responsiveWidth(7.5),
        borderTopRightRadius: responsiveWidth(7.5),
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(3.75),
    },
    input: {
        width: "100%",
        height: responsiveHeight(5.625),
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: responsiveWidth(12.5),
        marginBottom: responsiveHeight(2.5),
        padding: responsiveWidth(2.5),
        backgroundColor: '#fff',
        color: 'gray',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginBottom: responsiveHeight(1.25),
    },
});

export default VerifyOtp;
