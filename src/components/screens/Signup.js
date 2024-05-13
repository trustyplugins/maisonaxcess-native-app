import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
import CustomModal from "../CustomModal";
function Signup({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
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
            user_role: 'user'
        }
        try {
            const req = await axios.post('https://maisonaxcess.com/api/register', data);
            console.log('Response:', req.data.message);
            setModalMessage(req.data.message);
            setModalVisible(true);
            // navigation.navigate('Login');
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

                <Text style={styles.heading}>Register</Text>
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
                {error && <Text style={styles.errorMessage}>Please fill the above details</Text>}
                <Button title="Sign up" onPress={handleSignup} />
                <View>
                    <Text>
                        If you are already Register then{" "}
                        <Button onPress={() => navigation.navigate("Login")} title="Login" />
                    </Text>
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
    }
});

export default Signup;
