import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Platform, Keyboard } from "react-native";
import axios from "axios";
import Snackbar from '../Snackbar';
import CustomButton from "../common/CustomButton";
import { API_BASE_URL } from '@env';
import { useDispatch } from 'react-redux';
function Signup({ navigation }) {
    const dispatch = useDispatch();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // Keyboard is visible
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // Keyboard is hidden
            }
        );

        // Cleanup listeners on component unmount
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleSignup = async () => {
        if (!name || !email || !password || !phone) {
            setError(true);
            return;
        }
        const data = {
            api_otp: '',
            otp: '',
            name: name,
            email: email,
            password: password,
            phone_number: phone,
            user_role: '3'
        }
        try {
            const req = await axios.post(`${API_BASE_URL}/register`, data);
            data.api_otp = req.data.api_otp;
            dispatch({ type: 'SIGNUP', payload: data });
            navigation.navigate('verify-otp');

        } catch (error) {
            if (error.response) {
                setShowError(error.response.data.message);
                setError(true);
            }
        }

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
            <ScrollView>
                <View style={styles.container}>
                    <View style={styles.imgContainer}>
                        <Image source={require('../../assets/image/AXCESS_Logo.png')} style={styles.headerLogo} />
                    </View>
                    <View style={Platform.OS == 'ios' && isKeyboardVisible ? styles.formContainerKeyboard : styles.formContainer}>
                        <Text style={styles.heading}>Inscription</Text>
                        <Text style={styles.label}>Nom</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Nom"
                            value={name}
                            onChangeText={setName}
                            onPress={resetError}
                        />
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            onPress={resetError}
                        />
                        <Text style={styles.label}>Portable</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Portable"
                            value={phone}
                            onChangeText={setPhone}
                            keyboardType="phone-pad"
                            onPress={resetError}
                        />
                        <Text style={styles.label}>Mot de passe</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mot de passe"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            onPress={resetError}
                        />
                        {error && <Text style={styles.errorMessage}>{showError ? showError : "Veuillez remplir les détails ci-dessus"}</Text>}
                        <View style={{ marginTop: 10 }}>
                            <CustomButton title="Inscription" onPress={handleSignup} />
                        </View>
                        <View style={styles.actionButton}>
                            <Text style={styles.labelRem}>Déjà inscrit?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("login")}>
                                <Text style={styles.actionButtonText}>Se connecter</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </>
    );
}
const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 80
    },
    headerLogo: {
        width: '65%',
        height: Platform.OS == 'ios' ? 70 : 65,
    },
    formContainer: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? screenHeight * 0.1 : screenHeight * 0.1 / 2,
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: Platform.OS == 'ios' ? 50 : 20,
        height: Platform.OS == 'ios' ? 650 : 600,
    },
    formContainerKeyboard: {
        flex: 1,
        marginTop: screenHeight * 0.1 / 2,
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: Platform.OS == 'ios' ? 50 : 20,
        height: 900
    },
    heading: {
        fontSize: 24,
        marginBottom: 5,
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
        marginBottom: 12,
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
        marginBottom: 5,
        fontWeight: '500',
        margin: 8
    },
    labelRem: {
        fontSize: 16,
        color: '#000',
        fontWeight: '500'
    },
    actionButton: {
        paddingTop: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 10,
    },
    actionButtonText: {
        color: "#11696A",
        fontWeight: 'bold',
        fontSize: 16,
    },
});

export default Signup;
