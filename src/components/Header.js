import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Snackbar from '../components/Snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu, Provider } from 'react-native-paper';
import { API_BASE_URL } from '@env';
const Header = ({ navigation, back }) => {
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const dispatch = useDispatch();
    //   const logoImage = require('../assets/logo.png');
    const isAuthenticated = useSelector(state => state.user);
    // console.log(isAuthenticated.user.token)
    const handleLogout = async () => {
        setMenuVisible(false)
        try {
            const res = await axios.post(`${API_BASE_URL}/logout`, { ...isAuthenticated.user.email },
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
            navigation.navigate('login');
        }, 2000);
    };
    const showError = () => {
        setSnackbarVisible(true);
    }
    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);
    return (
        <>

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
                    <TouchableOpacity onPress={() => navigation.navigate('home')}>
                        {/* <Image source={logoImage} style={styles.logo} /> */}
                        <Text style={styles.logo}>Maisonaxcess</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.buttonsContainer}>
                    <Menu
                        visible={menuVisible}
                        onDismiss={closeMenu}
                        style={styles.menu}
                        anchor={
                            <TouchableOpacity onPress={openMenu} style={styles.menuButton}>
                                <Icon name="bars" size={24} color="#000" />
                            </TouchableOpacity>
                        }
                    >
                        {isAuthenticated?.user?.token ? <>
                            <Menu.Item onPress={() => {
                                navigation.navigate('profile')
                                setMenuVisible(false)
                            }} title="Profile" />
                            <Menu.Item onPress={() => {
                                navigation.navigate('dashboard')
                                setMenuVisible(false)
                            }} title="Orders" />
                            <Menu.Item onPress={handleLogout} title="Logout" />
                        </> :
                            <>
                                <Menu.Item onPress={() => {
                                    navigation.navigate('signup')
                                    setMenuVisible(false)
                                }} title="SignUp" />
                                <Menu.Item onPress={() => {
                                    navigation.navigate('login')
                                    setMenuVisible(false)
                                }} title="Login" />
                            </>
                        }
                    </Menu>


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
    leftHeader: {
        flexDirection: 'row',
        gap: 8,
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
        // marginHorizontal: 10,
        // fontSize: 16,
        color: "#11696a"
    },
    backButton: {
        marginRight: 0,
        paddingLeft: 4
    },
    menu: {
        // padding: 10,
        marginTop: 25
    },
    menuButton: {
        padding: 10,
    },
});

export default Header;
