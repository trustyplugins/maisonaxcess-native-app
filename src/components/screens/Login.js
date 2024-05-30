import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Modal, Image, TouchableOpacity, ScrollView } from "react-native";
import CheckBox from 'expo-checkbox';
import CustomButton from "../common/CustomButton";
import axios from "axios";
import Snackbar from '../Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const userCredential = useSelector(state => state.user.credentials);
    const user = useSelector(state => state.user.userDetails);
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
            if (error.response) {
                setShowError(error.response.data.message);
                setError(true);
            }
        }
    };
    const forgetPassword = async () => {
        if (user == null || user == undefined) {
            setShowError('non authentifié');
            setError(true);
        }
        const data = {
            email: user.email,
        }
        setModalVisible(true)
        try {
            const response = await axios.post(`${API_BASE_URL}/password/email`, data, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            console.log(response.data)
            if (response.data.success == true) {
                setModalVisible(true);
            }
        } catch (error) {
            if (error.response) {
                setShowError(error.response.data.message);
                setError(true);
            }
        }
    }
    const resetError = () => {
        setError(false)
    }
    const showSnackbar = () => {
        setSnackbarVisible(true);
        setTimeout(() => {
            setSnackbarVisible(false);
            navigation.navigate('carousel');
        }, 1000);
    };
    const closeModal = () => {
        setModalVisible(false);
    };

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
                    <View style={styles.formContainer}>
                        <Text style={styles.heading}>Se connecter</Text>
                        <Text style={styles.label}>E-mail</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="E-mail"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
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

                        <View style={styles.checkboxContainer}>
                            <CheckBox
                                value={rememberMe}
                                onValueChange={setRememberMe}
                                color="#11696a"
                            />
                            <Text style={styles.labelRem}>Souviens-toi de moi</Text>
                        </View>
                        <TouchableOpacity onPress={() => forgetPassword()}>
                            <Text style={styles.forgetPassword}>Mot de passe oublié?</Text>
                        </TouchableOpacity>
                        <CustomButton title="Se connecter" onPress={handleLogin} />

                        <View style={styles.actionButton}>
                            <Text style={styles.labelRem}>Vous n'avez pas encore de compte ?</Text>
                            <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                                <Text style={styles.actionButtonText}>Inscription</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={closeModal} style={styles.modalCloseButton}>
                                <Icon name="close" size={24} color="#11696A" />
                            </TouchableOpacity>
                            <Text style={styles.modalText}>Lien de réinitialisation envoyé à votre e-mail.</Text>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
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
        paddingTop: 25,
        height: screenHeight * 1
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
        marginBottom: 15,
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
        marginBottom: 7,
        gap: 10
    },
    forgetPassword: {
        fontSize: 16,
        textAlign: 'right',
        paddingVertical: 10,
        color: "#11696A",
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
    //modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        position: 'relative',
    },
    modalCloseButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    modalText: {
        marginTop: 20,
        fontSize: 16,
        textAlign: 'center',
        color: "#11696A",
    },
});

export default Login;
