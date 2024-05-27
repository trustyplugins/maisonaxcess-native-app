// Layout.js
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Keyboard, Platform } from 'react-native';
import Footer from './Footer';

const Layout = ({ children }) => {
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            setKeyboardVisible(true);
        });

        const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            setKeyboardVisible(false);
        });

        // Cleanup listeners on component unmount
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    return (
        <View style={styles.container}>
            {/* <View style={[styles.content, isKeyboardVisible && styles.contentKeyboardVisible]}> */}
            {children}
            {/* </View> */}
            {/* {!isKeyboardVisible && <Footer />} */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginBottom: Platform.OS === 'ios' ? 40 : 0,
    },
    content: {
        flex: 1,
        marginBottom: 10,
    },
    contentKeyboardVisible: {
        marginBottom: 0,
    },
});

export default Layout;
