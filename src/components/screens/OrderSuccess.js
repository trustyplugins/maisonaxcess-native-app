import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const OrderSuccess = ({ orderDetails }) => {
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.successMessage}>Thank you for confirming your appointment. We will contact you soon!</Text>
            <View style={styles.detailsContainer}>
                <Text style={styles.heading}>Order Details:</Text>
                <Text style={styles.detail}><Text style={styles.label}>Order Number:</Text> 49</Text>
                <Text style={styles.detail}><Text style={styles.label}>Appointment Date:</Text> 2024-05-21</Text>
                <Text style={styles.detail}><Text style={styles.label}>Service Provider:</Text> abcd</Text>
                <Text style={styles.detail}><Text style={styles.label}>Address:</Text> Frankland-Cranbrook Road,Western Australia,Australia,6321</Text>
                <Text style={styles.detail}><Text style={styles.label}>Phone Number:</Text> 1234567894</Text>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    successMessage: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
        color: '#4caf50',
    },
    detailsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detail: {
        fontSize: 16,
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
    },
});

export default OrderSuccess;
