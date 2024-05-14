import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Snackbar from '../components/Snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
const Header = ({ navigation, back }) => {
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const dispatch = useDispatch();
    //   const logoImage = require('../assets/logo.png');
    const isAuthenticated = useSelector(state => state.user);
    // console.log(isAuthenticated.user.token)
    const handleLogout = async () => {

        try {
            const res = await axios.post('https://maisonaxcess.com/api/logout', { ...isAuthenticated.user.email },
                {
                    headers: {
                        "Accept": "application/json",
                        Authorization: `Bearer ${isAuthenticated.user.token}`

                    }
                }
            );
            setModalMessage(res.data.message);
            showSnackbar();
        } catch (error) {
            setModalMessage(error.response.data.message);
            showError();
        }
    }
    const showSnackbar = () => {
        setSnackbarVisible(true);
        setTimeout(() => {
            setSnackbarVisible(false);
            dispatch({ type: 'LOGIN', payload: null });
            navigation.navigate('Login');
        }, 2000);
    };
    const showError = () => {
        setSnackbarVisible(true);
    }
    return (<>
        <Snackbar
            visible={snackbarVisible}
            message={modalMessage}
            onDismiss={() => setSnackbarVisible(false)}
        />
        <View style={styles.container}>
            <View style={styles.leftHeader}>
                {back && (
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-left" size={20} color="#000" />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                    {/* <Image source={logoImage} style={styles.logo} /> */}
                    <Text style={styles.logo}>Maisonaxcess</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.buttonsContainer}>
                {isAuthenticated?.user?.token ? (<>
                    {/* <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.button}>Profile</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => { handleLogout() }}>
                        <Text style={styles.button}>Logout</Text>
                    </TouchableOpacity>
                </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.button}>Login</Text>
                        </TouchableOpacity>
                        <Text>/</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.button}>Signup</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#f2f2f2',
        marginTop: 30
    },
    leftHeader:{
        flexDirection: 'row',
        gap:8,
        alignItems: 'center',
    },
    logo: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        marginHorizontal: 10,
        fontSize: 16,
        color: "#11696a"
    },
    backButton: {
        marginRight: 0,
    },
});

export default Header;
