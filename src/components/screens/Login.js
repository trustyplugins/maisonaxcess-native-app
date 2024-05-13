import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import CustomModal from "../CustomModal";
import { useDispatch } from 'react-redux';
const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
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
            const response = await axios.post('https://maisonaxcess.com/api/login', data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log('Response:', response.data);
            setModalMessage(response.data.message);
            setModalVisible(true);
            dispatch({ type: 'LOGIN', payload: response.data });
        } catch (error) {
            // console.error('Error:', error);
            if (error.response) {
                // console.log('Response data:', error.response.data);
                setModalMessage(error.response.data.message);
                setModalVisible(true);
            }
        }
    };
    const resetError = () => {
        setError(false)
    }

    return (
        <>
            <CustomModal
                visible={modalVisible}
                message={modalMessage}
                onClose={() => setModalVisible(false)}
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
                {error && <Text style={styles.errorMessage}>Please fill the above details</Text>}
                <Button title="Login" onPress={handleLogin} />
                <View>
                    <Text style={styles.text}>
                        If account is not created then {" "}
                        <Button onPress={() => navigation.navigate("Signup")} title="Register" />
                    </Text>
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
    }
});

export default Login;
