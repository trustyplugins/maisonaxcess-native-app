import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity } from "react-native";
import CheckBox from 'expo-checkbox';
import CustomButton from "../common/CustomButton";
import axios from "axios";
import Snackbar from '../Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const userCredential = useSelector(state => state.user.credentials);
    useEffect(() => {
        if (userCredential != null) {
            setEmail(userCredential.email);
            setPassword(userCredential.password);
            setRememberMe(true);
        }
    }, [userCredential])

    const handleLogin = async () => {

        if (!email || !password) {
            setError(true);
            return;
        }
        const data = {
            email: email,
            password: password
            // password: 'password@123'
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setModalMessage(response.data.message);
            dispatch({ type: 'LOGIN', payload: response.data });
            if (rememberMe) {
                dispatch({ type: 'SAVE_CREDENTIALS', payload: data });
            } else {
                dispatch({ type: 'SAVE_CREDENTIALS', payload: null });
            }
            showSnackbar();
        } catch (error) {
            // console.error('Error:', error);
            if (error.response) {
                // console.log('Response data:', error.response.data);
                setShowError(error.response.data.message);
                setError(true);
            }
        }
    };
    const resetError = () => {
        setError(false)
    }
    const showSnackbar = () => {
        setSnackbarVisible(true);
        setTimeout(() => {
            setSnackbarVisible(false);
            navigation.navigate('carousel');
        }, 2000);
    };

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
                    <Text style={styles.heading}>Login</Text>
                    <Text style={styles.label}>Email</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        onPress={resetError}
                    />
                    <Text style={styles.label}>Password</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                        onPress={resetError}
                    />
                    {error && <Text style={styles.errorMessage}>{showError ? showError : "Please fill the above details"}</Text>}

                    <View style={styles.checkboxContainer}>
                        <CheckBox
                            value={rememberMe}
                            onValueChange={setRememberMe}
                            color="#11696a"
                        />
                        <Text style={styles.labelRem}>Remember Me</Text>
                    </View>
                    <CustomButton title="Login" onPress={handleLogin} />
                    <View style={styles.actionButton}>
                        <Text style={styles.labelRem}>Dont't have an Account?</Text>
                        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                            <Text style={styles.actionButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
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
    headerLogo: {
        width: '60%',
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
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#11696a',
        fontWeight: 'bold'
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
        color: 'red'
    },
    label: {
        fontSize: 16,
        color: '#000',
        marginBottom: 10,
        fontWeight: '500',
        margin: 8
    },
    labelRem: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500'
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 18,
        gap: 10
    },
    actionButton: {
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
        paddingVertical: 25
    },
    actionButtonText: {
        color: "#11696A",
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Login;
