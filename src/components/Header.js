import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Snackbar from '../components/Snackbar';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Menu } from 'react-native-paper';
import { API_BASE_URL } from '@env';
import { removeCache } from '../redux/actions/serviceAction';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

const Header = ({ navigation, back }) => {
    const [modalMessage, setModalMessage] = useState('');
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [menuVisible, setMenuVisible] = useState(false);
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(state => state.user);

    const handleLogout = async () => {
        setMenuVisible(false);
        setSnackbarVisible(true);
        try {
            const res = await axios.post(`${API_BASE_URL}/logout`, { ...isAuthenticated.user?.email }, {
                headers: {
                    "Accept": "application/json",
                    Authorization: `Bearer ${isAuthenticated.user?.token}`
                }
            });
            setModalMessage(res.data.message);
            dispatch({ type: 'REMOVE_SERVICE', payload: null });
            dispatch({ type: 'LOGIN', payload: null });
            dispatch({ type: 'SIGNUP', payload: null });
            dispatch({ type: 'REMOVE_SERVICES', payload: null });
            dispatch(removeCache());
            setSnackbarVisible(false);
            navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
            });
        } catch (error) {
            if (error.response.data.message === 'Unauthenticated.') {
                dispatch({ type: 'REMOVE_SERVICE', payload: null });
                dispatch({ type: 'LOGIN', payload: null });
                dispatch({ type: 'SIGNUP', payload: null });
                navigation.navigate('login');
            }
            setModalMessage(error.response.data.message);
            showError();
            setSnackbarVisible(false);
        }
    };

    const showError = () => {
        setSnackbarVisible(true);
    };

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
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={styles.backButton}
                            accessibilityLabel="Go back"
                            accessible={true}
                        >
                            <Icon name="arrow-left" size={20} color="#000" />
                        </TouchableOpacity>
                    )}
                    <TouchableOpacity
                        onPress={() => navigation.navigate('home')}
                        accessibilityLabel="Go to Home"
                        accessible={true}
                    >
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
                        {isAuthenticated?.user?.token ? (
                            <>
                                <Menu.Item
                                    onPress={() => {
                                        navigation.navigate('profile');
                                        setMenuVisible(false);
                                    }}
                                    title="Profil"
                                />
                                <Menu.Item
                                    onPress={() => {
                                        navigation.navigate('dashboard');
                                        setMenuVisible(false);
                                    }}
                                    title="Ordres"
                                />
                                <Menu.Item onPress={handleLogout} title="Se déconnecter" />
                            </>
                        ) : (
                            <>
                                <Menu.Item
                                    onPress={() => {
                                        navigation.navigate('signup');
                                        setMenuVisible(false);
                                    }}
                                    title="Inscription"
                                />
                                <Menu.Item
                                    onPress={() => {
                                        navigation.navigate('login');
                                        setMenuVisible(false);
                                    }}
                                    title="Se connecter"
                                />
                            </>
                        )}
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
        paddingHorizontal: responsiveWidth(2.5),
        paddingVertical: responsiveHeight(1.25),
        backgroundColor: '#f2f2f2',
        marginTop: responsiveHeight(3.125),
    },
    leftHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logo: {
        fontSize: responsiveFontSize(2.25),
        fontWeight: 'bold',
        color: '#000', // Ensure good contrast
    },
    buttonsContainer: {
        flexDirection: 'row',

    },
    backButton: {
        marginRight: responsiveWidth(2),
        padding: responsiveWidth(2), // Increase touchable area
    },
    menu: {
        marginTop: responsiveHeight(3.125),
    },
    menuButton: {
        padding: responsiveWidth(2.5),
        zIndex: 9999
    },
});

export default Header;
