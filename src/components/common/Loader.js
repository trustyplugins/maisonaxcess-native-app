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
        backgroundColor: 'transparent', 
        borderRadius: 10,
        padding: 10,
    },
});

export default Loader;
