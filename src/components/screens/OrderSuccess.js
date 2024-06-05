import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import axios from "axios";
import Loader from "../common/Loader";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const OrderSuccess = () => {
    const userData = useSelector(state => state.user.user);
    const route = useRoute();
    const { orderId } = route.params;
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const getOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orders/${orderId}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                if (response.data.orders?.length > 0) {
                    const order = response.data.orders[0];
                    order.services_with_price = JSON.parse(order.services_with_price); {/* convert string into array*/ }
                    setOrderData(order);
                }
                setLoading(false);

            } catch (error) {
                setLoading(false);
                // setLoading(false);
                // setService([])
            }
        }
        getOrders();
    }, [orderId])

    if (loading) {
        return (<Loader loading={loading} />)
    }
    const formatDate = (dateString) => {
        if (dateString) {
            return dateString.split(' ')[0];
        }
    };
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.successMessage}>Merci d'avoir confirmé votre rendez-vous. Nous vous contacterons bientôt!</Text>
            <View style={styles.detailsContainer}>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Numéro de commande :</Text>
                    <Text>{orderData?.order_number}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Fournisseur de services :</Text>
                    <Text>{orderData?.service_provider_name}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Date de réservation :</Text>
                    <Text>{formatDate(orderData?.appointment_date)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Adresse :</Text>
                    <Text>{orderData?.customer_address}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Numéro de téléphone :</Text>
                    <Text>{orderData?.phone_number}</Text>
                </View>
                <View >
                    <Text style={styles.tableHeading}>Prestations de service</Text>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Nom</Text>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Quantité</Text>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Prix</Text>
                    </View>
                    {orderData && orderData?.services_with_price?.map((service, index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.tableCell}>{service.name}</Text>
                            <Text style={styles.tableCell}>{service.quantity}</Text>
                            <Text style={styles.tableCell}>${service.price}</Text>
                        </View>
                    ))}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}></Text>
                        <Text style={[styles.tableCell, styles.totalLabel]}>Total de la commande :</Text>
                        <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                    </View>
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCell}></Text>
                        <Text style={[styles.tableCell, styles.totalLabel]}>Mode de paiement :</Text>
                        <Text style={[styles.tableCell, styles.totalValue]}>{orderData?.payment_info}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: responsiveWidth(5),
        backgroundColor: '#f5f5f5',
        borderRadius: responsiveWidth(2.5),
    },
    successMessage: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: responsiveHeight(2.5),
        color: '#4caf50',
    },
    detailsContainer: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        padding: responsiveWidth(2.5),
        borderRadius: responsiveWidth(2.5),
        elevation: 3,
    },
    heading: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.25),
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(1.25),
    },
    label: {
        fontWeight: 'bold',
    },
    tableHeading: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.25),
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: responsiveHeight(1.25),
    },
    tableCell: {
        flex: 1,
        padding: responsiveWidth(1.25),
        textAlign: 'center',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalValue: {
        fontWeight: 'bold',
    },
});

export default OrderSuccess;
