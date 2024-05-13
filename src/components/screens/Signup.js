import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import Snackbar from '../Snackbar';
import CustomButton from "../common/CustomButton";
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
            const req = await axios.post('https://maisonaxcess.com/api/register', data);
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
            <View style={styles.container}>

                <Text style={styles.heading}>SignUp</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    onPress={resetError}
                />
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
                    placeholder="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    keyboardType="phone-pad"
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
                    <CustomButton title="Sign up" onPress={handleSignup} />
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.text}>
                    If you are already Register then {" "}
                    </Text>
                </View>
                <View style={styles.buttonContainer}>
                <CustomButton onPress={() => navigation.navigate("Login")} title="Login" />
                </View>
            </View>
        </>
    );
}

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
    errorMessage: {
        color: 'red'
    },
    buttonContainer: {
        width: '100%',
        marginBottom: 10,
        backgroundColor: '#11696a',
    },
    textContainer: {
        textAlign: 'center',
        marginBottom: 10,
    },
    text: {
        fontSize: 15
    },
});

export default Signup;
