import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Platform, Keyboard } from "react-native";
import axios from "axios";
import Snackbar from '../Snackbar';
import CustomButton from "../common/CustomButton";
import { API_BASE_URL } from '@env';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';

const Signup = ({ navigation }) => {
    const dispatch = useDispatch();
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

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    const handleSignup = async (values, { setSubmitting, setErrors }) => {
        const data = {
            api_otp: '',
            otp: '',
            name: values.name,
            email: values.email,
            password: values.password,
            phone_number: values.phone,
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
                setErrors({ api: error.response.data.message });
            } else {
                setErrors({ api: "An unexpected error occurred." });
            }
        } finally {
            setSubmitting(false);
        }
    };

    const resetError = () => {
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
                        <Formik
                            initialValues={{
                                name: '',
                                email: '',
                                phone: '',
                                password: ''
                            }}
                            validationSchema={Yup.object({
                                name: Yup.string().required('Required'),
                                email: Yup.string().email('Invalid email address').required('Required'),
                                phone: Yup.string().required('Required'),
                                password: Yup.string().required('Required'),
                            })}
                            onSubmit={handleSignup}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View>
                                    <Text style={styles.heading}>Inscription</Text>
                                    <Text style={styles.label}>Nom</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nom"
                                        value={values.name}
                                        onChangeText={handleChange('name')}
                                        onBlur={handleBlur('name')}
                                        onFocus={resetError}
                                    />
                                    {touched.name && errors.name ? (
                                        <Text style={styles.errorMessage}>{errors.name}</Text>
                                    ) : null}

                                    <Text style={styles.label}>E-mail</Text>
                                    <TextInput
                                        style={styles.input}
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

                                    <Text style={styles.label}>Portable</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Portable"
                                        value={values.phone}
                                        onChangeText={handleChange('phone')}
                                        onBlur={handleBlur('phone')}
                                        keyboardType="phone-pad"
                                        onFocus={resetError}
                                    />
                                    {touched.phone && errors.phone ? (
                                        <Text style={styles.errorMessage}>{errors.phone}</Text>
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

                                    {errors.api && <Text style={styles.errorMessage}>{errors.api}</Text>}

                                    <View style={{ marginTop: 10 }}>
                                        <CustomButton title="Inscription" onPress={handleSubmit} disabled={isSubmitting} />
                                    </View>

                                    <View style={styles.actionButton}>
                                        <Text style={styles.labelRem}>Déjà inscrit?</Text>
                                        <TouchableOpacity onPress={() => navigation.navigate("login")}>
                                            <Text style={styles.actionButtonText}>Se connecter</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </Formik>
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
        height: Platform.OS == 'ios' ? 650 : 610,
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
        color: 'red',
        paddingLeft: 5
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
