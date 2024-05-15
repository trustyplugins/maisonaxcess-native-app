import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Image, ImageBackground } from "react-native";
import axios from "axios";
import Snackbar from '../Snackbar';
import CustomButton from "../common/CustomButton";
import { API_BASE_URL } from '@env';
function Signup({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const handleSignup = async () => {
        if (!name || !email || !password || !phone) {
            setError(true);
            return;
        }
        const data = {
            name: name,
            email: email,
            password: password,
            phone_number: phone,
            user_role: '3'
        }
        try {
            const req = await axios.post(`${API_BASE_URL}/register`, data);
            console.log('Response:', req.data.message);
            setModalMessage(req.data.message);
            showSnackbar();
        } catch (error) {
            if (error.response) {
                // console.log('Response data:', error.response.data);
                setShowError(error.response.data.message);
                setError(true);
            }
        }

    };
    const resetError = () => {
        setError(false)
        setShowError('');
    }
    const showSnackbar = () => {
        setSnackbarVisible(true);
        setTimeout(() => {
            setSnackbarVisible(false);
            navigation.navigate('Login');
        }, 3000);
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
                        <Text style={styles.heading}>SignUp</Text>
                        <Text style={styles.label}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Name"
                            value={name}
                            onChangeText={setName}
                            onPress={resetError}
                        />
                        <Text style={styles.label}>Email</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            onPress={resetError}
                        />
                        <Text style={styles.label}>Phone</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Phone"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
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
                        <View style={styles.buttonContainer}>
                            <CustomButton title="SignUp" onPress={handleSignup} />
                            <CustomButton title="Login" onPress={() => navigation.navigate("Login")} />
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </>
    );
}
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
    textContainer: {
        textAlign: 'center',
        marginBottom: 10,
    },
    // text: {
    //     fontSize: 15
    // },
    label: {
        fontSize: 16,
        marginBottom: 5,
        color: '#fff',
        marginBottom: 10
    },
});

export default Signup;
