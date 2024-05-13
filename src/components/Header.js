import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';

const Header = ({ navigation }) => {
    const dispatch=useDispatch();
    //   const logoImage = require('../assets/logo.png');
    const isAuthenticated = useSelector(state => state.user);
    const handleLogout=()=>{
        dispatch({ type: 'LOGIN', payload: null });
        navigation.navigate('Login');
    }
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                {/* <Image source={logoImage} style={styles.logo} /> */}
                <Text style={styles.logo}>Maisonaxcess</Text>
            </TouchableOpacity>
            <View style={styles.buttonsContainer}>
                {isAuthenticated ? (<>
                    {/* <TouchableOpacity onPress={() => { }}>
                        <Text style={styles.button}>Profile</Text>
                    </TouchableOpacity> */}
                    <TouchableOpacity onPress={() => {handleLogout()}}>
                        <Text style={styles.button}>Logout</Text>
                    </TouchableOpacity>
                </>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={styles.button}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                            <Text style={styles.button}>Signup</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: '#f2f2f2',
    },
    logo: {
        // width: 120,
        // height: 30,
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
});

export default Header;
