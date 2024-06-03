import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import CustomButton from '../common/CustomButton';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import Snackbar from '../Snackbar';
import axios from "axios";
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
            console.log(error.response.data);
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
                    {error && <Text style={styles.errorMessage}>{showError ? showError : "Entrez OTP"}</Text>}
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
        marginTop: 110
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#11696a',
        fontWeight: 'bold'
    },
    headerLogo: {
        width: '65%',
        height: 65
    },
    formContainer: {
        flex: 1,
        marginTop: screenHeight * 0.1,
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 30
    },
    input: {
        width: "100%",
        height: 45,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 50,
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        color: 'gray',
    },
    errorMessage: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 10
    },
});

export default VerifyOtp;
