import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, ImageBackground, Image } from "react-native";
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
        if(userCredential !=null){
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
            }else{
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
            <ImageBackground
                source={require('../../assets/image/bg1.webp')}
                style={styles.backgroundImage}
            >
                <View style={styles.container}>
                    <Image source={require('../../assets/image/AXCESS_Logo.png')} style={styles.headerLogo} />
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
                            />
                            <Text style={styles.label}>Remember Me</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            <CustomButton title="Login" onPress={handleLogin} />
                            <CustomButton title="Register" onPress={() => navigation.navigate("Signup")} />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
};
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
    },
    container: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: 30,
        padding: 20,
        height: 30,
    },
    headerLogo: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: '70%',
        height: 60
    },
    formContainer: {
        marginTop: screenHeight * 0.2,
        backgroundColor: '#040404',
        borderRadius: 25,
        padding: 20,
        opacity: 0.7
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
        color: '#fff',
        fontWeight: 'bold'
    },
    input: {
        width: "100%",
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        color: '#000'
    },
    errorMessage: {
        color: 'red'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
        marginBottom: 10
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 18,
        gap: 10
    },
});

export default Login;
