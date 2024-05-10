import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";
function Signup({ navigation }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");

    const handleSignup = async () => {
        const data = {
            name: name,
            email: email,
            password: 'password@123',
            phone_number: '8745698578',
            user_role: 'user'
        }
        try {
            const req = await axios.post('https://maisonaxcess.com/api/register', data);
            console.log('Response:', req.data.message);
            // navigation.navigate('Login');
        } catch (error) {
            console.error('Error:', error);
            if (error.response) {
                console.log('Response data:', error.response.data);
            }
        }
        
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Phone"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Sign up" onPress={handleSignup} />
            <View>
                <Text>
                    If you are already Register then{" "}
                    <Button onPress={() => navigation.navigate("Login")} title="Login" />
                </Text>
            </View>
        </View>
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
});

export default Signup;
