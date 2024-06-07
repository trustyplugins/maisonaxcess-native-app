import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, Image, ScrollView, TouchableOpacity, Platform, Keyboard } from "react-native";
import axios from "axios";
import Snackbar from '../Snackbar';
import CustomButton from "../common/CustomButton";
import { API_BASE_URL } from '@env';
import { useDispatch } from 'react-redux';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Loader from "../common/Loader";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const Signup = ({ navigation }) => {
    const dispatch = useDispatch();
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [loading, setLoading] = useState(false);
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
        setLoading(true);
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
            setLoading(false)
        } catch (error) {
            if (error.response) {
                setShowError(error.response.data.message);
                setErrors({ api: error.response.data.message });
            } else {
                setErrors({ api: "An unexpected error occurred." });
            }
            setLoading(false)
        } finally {
            setSubmitting(false);
            setLoading(false)
        }
    };

    const resetError = () => {
        setShowError('');
    }
    if (loading) {
        return (<Loader loading={loading} />)
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
                                        <TouchableOpacity onPress={() => navigation.navigate("login")} accessibilityRole="button">
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
        justifyContent: 'center',
    },
    imgContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: Platform.OS === 'ios' ? responsiveHeight(5) : responsiveHeight(10),
    },
    headerLogo: {
        width: Platform.OS === 'ios' ? responsiveWidth(70) : responsiveWidth(72),
        height: Platform.OS === 'ios' ? responsiveHeight(9) : responsiveHeight(10)
    },
    formContainer: {
        flex: 1,
        marginTop: responsiveHeight(5),
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(2),
        height: Platform.OS === 'ios' ? responsiveHeight(75) : responsiveHeight(82),
    },
    formContainerKeyboard: {
        flex: 1,
        marginTop: responsiveHeight(5),
        backgroundColor: '#C7C7C7',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: responsiveWidth(5),
        paddingTop: responsiveHeight(2),
        height: responsiveHeight(105),
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
    actionButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: responsiveWidth(2.5),
        paddingVertical: responsiveHeight(3),
        alignItems: 'center'
    },
    actionButtonText: {
        color: "#11696A",
        fontWeight: 'bold',
        fontSize: responsiveFontSize(2.5),

    },
});

export default Signup;
