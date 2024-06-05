// Layout.js
import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';

const Layout = ({ children }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                {children}
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
    },
});

export default Layout;
