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
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
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
            navigation.reset({
                index: 0,
                routes: [{ name: 'carousel' }]
            });
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
                                    {/* <Text style={styles.heading}>Se connecter</Text> */}
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
                                            accessibilityLabel="Remember me"
                                            accessibilityRole="checkbox"
                                            accessibilityState={{ checked: values.rememberMe }}
                                        />
                                        <Text style={styles.labelRem}>Souviens-toi de moi</Text>
                                    </View>
                                    <TouchableOpacity onPress={forgetPassword} accessibilityRole="button">
                                        <Text style={styles.forgetPassword}>Mot de passe oublié?</Text>
                                    </TouchableOpacity>
                                    <CustomButton title="Se connecter" onPress={handleSubmit} disabled={isSubmitting} />

                                    <View style={styles.actionButton}>
                                        <Text style={styles.labelRem}>Vous n'avez pas encore de compte ?</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate("signup")} accessibilityRole="button">
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
                    accessibilityLabel="Details Modal"
                    accessible={true}
                >
                    <View style={Platform.OS == 'ios' && isKeyboardVisible ? styles.modalOverlayKeyboard : styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity onPress={() => {
                                setModalVisible(false)
                                setResetSucc(false);
                                setShowError('');
                                setResetEmail('');
                            }} style={styles.modalCloseButton} accessibilityLabel="Close Modal">
                                <Icon name="close" size={30} color="#11696A" />
                            </TouchableOpacity>
                            <Text style={{ ...styles.label, color: "#11696A", paddingTop: 20 }}>Indiquez-nous simplement votre adresse e-mail et nous vous enverrons par e-mail un lien de réinitialisation de mot de passe qui vous permettra d'en choisir un nouveau.</Text>
                            <Text style={styles.label}>Entrer votre E-mail</Text>
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

// const screenHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: responsiveHeight(15),
    },
    headerLogo: {
        width: Platform.OS === 'ios' ? responsiveWidth(70) : responsiveWidth(72),
        height: Platform.OS === 'ios' ? responsiveHeight(9) : responsiveHeight(10)
    },
    formContainer: {
        flex: 1,
        marginTop: responsiveHeight(10),
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(3),
        height: responsiveHeight(70),
    },
    formContainerKeyword: {
        flex: 1,
        marginTop: responsiveHeight(10),
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(3),
        height: responsiveHeight(85),
    },
    heading: {
        fontSize: responsiveFontSize(3),
        marginBottom: responsiveHeight(2.5),
        textAlign: 'center',
        color: '#11696a',
        fontWeight: 'bold',
    },
    input: {
        width: "100%",
        height: responsiveHeight(6),
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 50,
        marginBottom: responsiveHeight(2),
        padding: 10,
        backgroundColor: '#fff',
        color: 'gray',
    },
    errorMessage: {
        color: 'red',
        paddingHorizontal: responsiveWidth(1.25),
    },
    label: {
        fontSize: responsiveFontSize(2),
        color: '#000',
        marginBottom: responsiveHeight(1.25),
        fontWeight: '500',
        margin: responsiveHeight(1),
    },
    labelRem: {
        fontSize: responsiveFontSize(2),
        color: '#000',
        fontWeight: '500',
    },
    checkboxContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: responsiveHeight(1),
        gap: responsiveWidth(2.5),
    },
    forgetPassword: {
        fontSize: responsiveFontSize(2),
        textAlign: 'right',
        paddingVertical: responsiveHeight(1.25),
        paddingBottom: responsiveHeight(2.55),
        color: "#11696A",
        fontWeight: 'bold',
    },
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: responsiveWidth(2.5),
        alignItems: 'center',
        paddingVertical: responsiveHeight(3),
    },
    actionButtonText: {
        color: "#11696A",
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.5),
        lineHeight: responsiveHeight(3)
    },
    //modal
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalOverlayKeyboard: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        marginBottom: responsiveHeight(15)
    },
    modalContent: {
        width: responsiveWidth(90),
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: responsiveWidth(5),
        position: 'relative',
    },
    modalCloseButton: {
        position: 'absolute',
        top: responsiveHeight(1),
        right: responsiveWidth(2.5),
        padding: 5
    },
    modalText: {
        marginTop: responsiveHeight(2.5),
        fontSize: responsiveFontSize(2),
        textAlign: 'center',
        color: "#11696A",
    },
});

export default Login;
