import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import CustomButton from "../common/CustomButton";
import axios from "axios";
import Snackbar from '../Snackbar';
import { useDispatch } from 'react-redux';
import { API_BASE_URL } from '@env';
const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
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
            navigation.navigate('Home');
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
                <Text style={styles.heading}>Login</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    onPress={resetError}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    onPress={resetError}
                />
                {error && <Text style={styles.errorMessage}>{showError ? showError : "Please fill the above details"}</Text>}
                <View style={styles.buttonContainer}>
                    <CustomButton title="Login" onPress={handleLogin} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                        If account is not created then {" "}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                    <CustomButton title="Register" onPress={() => navigation.navigate("Signup")} />
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
    },
    text: {
        fontSize: 15
    },
    errorMessage: {
        color: 'red'
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#11696a',
    },
    textContainer: {
        textAlign:'center',
        marginBottom: 10,
    },
});

export default Login;
