import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const Loader = ({ loading }) => {
    return (
        loading ?
            <View style={styles.container}>
                <View style={styles.loader}>
                    <ActivityIndicator size="large" color="#11696A" />
                </View>
            </View>
            : null
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loader: {
        backgroundColor: 'rgba(255,255,255,0.5)', // Semi-transparent background
        borderRadius: 10,
        padding: 20,
    },
});

export default Loader;
