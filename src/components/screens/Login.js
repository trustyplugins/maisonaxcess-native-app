import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Modal, Image, TouchableOpacity, ScrollView, Keyboard, Platform } from "react-native";
import CheckBox from 'expo-checkbox';
import CustomButton from "../common/CustomButton";
import axios from "axios";
import Snackbar from '../Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import Icon from 'react-native-vector-icons/FontAwesome';
import Loader from "../common/Loader";
import { Formik } from 'formik';
import * as Yup from 'yup';

const Login = ({ navigation }) => {
    const dispatch = useDispatch();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const userCredential = useSelector(state => state.user.credentials);
    const [resetEmail, setResetEmail] = useState('');
    const [resetSucc, setResetSucc] = useState(false);
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

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleLogin = async (values, { setSubmitting, setErrors, setStatus }) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_BASE_URL}/login`, values, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            setModalMessage(response.data.message);
            dispatch({ type: 'LOGIN', payload: response.data });
            dispatch({ type: 'SIGNUP', payload: response.data.user_data });
            if (values.rememberMe) {
                dispatch({ type: 'SAVE_CREDENTIALS', payload: values });
            } else {
                dispatch({ type: 'SAVE_CREDENTIALS', payload: null });
            }
            navigation.navigate('carousel');
        } catch (error) {
            if (error.response) {
                setShowError(error.response.data.message);
                setError(true);
            }
        } finally {
            setLoading(false);
            setSubmitting(false);
        }
    };

    const forgetPassword = async () => {
        setModalVisible(true);
    }
    const handleResetPassword = async () => {
        if (!resetEmail) {
            setShowError('Entrer E-mail');
            setError(true);
            return;
        }
        const data = { email: resetEmail };
        try {
            const response = await axios.post(`${API_BASE_URL}/password/email`, data, {
                headers: { "Content-Type": "application/json" }
            });
            if (response.data.success) {
                setShowError('Nous vous avons envoyé par e-mail un lien de réinitialisation de votre mot de passe.');
                setResetSucc(true);
            }
        } catch (error) {
            if (error.response) {
                setShowError(error.response.data.message);
                setError(true)
            }
        }
    }

    const resetError = () => {
        setShowError('');
        setError(false);
    }

    if (loading) {
        return <Loader loading={loading} />;
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
                    <View style={Platform.OS == 'ios' && isKeyboardVisible ? styles.formContainerKeyword : styles.formContainer}>
                        <Formik
                            initialValues={{
                                email: userCredential?.email || '',
                                password: userCredential?.password || '',
                                rememberMe: !!userCredential,
                            }}
                            validationSchema={Yup.object({
                                email: Yup.string().email('Invalid email address').required('Required'),
                                password: Yup.string().required('Required'),
                            })}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue, isSubmitting, status }) => (
                                <View>
                                    <Text style={styles.heading}>Se connecter</Text>
                                    <Text style={styles.label}>E-mail</Text>
                                    <TextInput
                                        style={{ ...styles.input, color: values.email != '' ? '#000' : 'gray' }}
                                        placeholder="E-mail"
                                        value={values.email}
                                        onChangeText={handleChange('email')}
                                        onBlur={handleBlur('email')}
                                        keyboardType="email-address"
                                        onFocus={resetError}
                                    />
                                    {touched.email && errors.email ? (
                                        <Text style={styles.errorMessage}>{errors.email}</Text>
                                    ) : null}

                                    <Text style={styles.label}>Mot de passe</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Mot de passe"
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        onBlur={handleBlur('password')}
                                        secureTextEntry
                                        onFocus={resetError}
                                    />
                                    {touched.password && errors.password ? (
                                        <Text style={styles.errorMessage}>{errors.password}</Text>
                                    ) : null}

                                    {error && <Text style={styles.errorMessage}>{showError}</Text>}
                                    <View style={styles.checkboxContainer}>
                                        <CheckBox
                                            value={values.rememberMe}
                                            onValueChange={value => setFieldValue('rememberMe', value)}
                                            color="#11696a"
                                        />
                                        <Text style={styles.labelRem}>Souviens-toi de moi</Text>
                                    </View>
                                    <TouchableOpacity onPress={forgetPassword}>
                                        <Text style={styles.forgetPassword}>Mot de passe oublié?</Text>
                                    </TouchableOpacity>
                                    <CustomButton title="Se connecter" onPress={handleSubmit} disabled={isSubmitting} />

                                    <View style={styles.actionButton}>
                                        <Text style={styles.labelRem}>Vous n'avez pas encore de compte ?</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate("signup")}>
                                            <Text style={styles.actionButtonText}>Inscription</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                                setResetSucc(false);
                                setShowError('');
                                setResetEmail('');
                            }} style={styles.modalCloseButton}>
                                <Icon name="close" size={24} color="#11696A" />
                            </TouchableOpacity>
                            <Text style={{ ...styles.label, color: "#11696A" }}>Indiquez-nous simplement votre adresse e-mail et nous vous enverrons par e-mail un lien de réinitialisation de mot de passe qui vous permettra d'en choisir un nouveau.</Text>
                            <Text style={styles.label}>E-mail</Text>
                            <TextInput
                                style={{ ...styles.input, fontWeight: 'bold' }}
                                placeholder="Entrer E-mail"
                                value={resetEmail}
                                onChangeText={setResetEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onFocus={resetError}
                            />
                            {resetSucc && <Text style={{ paddingHorizontal: 5, color: '#11696A', paddingBottom: 8 }}>{showError}</Text>}
                            {error && <Text style={{ ...styles.errorMessage, paddingBottom: 8 }}>{showError}</Text>}
                            <CustomButton title="Mot de passe oublié" onPress={resetSucc ? null : handleResetPassword} />
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
        height: Platform.OS == 'ios' ? 70 : 65,
    },
    formContainer: {
        flex: 1,
        marginTop: screenHeight * 0.1,
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: Platform.OS == 'ios' ? 40 : 25,
        height: Platform.OS == 'ios' ? 650 : 500,
    },
    formContainerKeyword: {
        flex: 1,
        marginTop: screenHeight * 0.1,
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 25,
        height: 800
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
        color: 'gray'
    },
    errorMessage: {
        color: 'red',
        paddingHorizontal: 5
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
        width: '90%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
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
