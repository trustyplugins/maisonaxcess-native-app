import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Platform } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import axios from "axios";
import formatDate from '../../utils/formatDate';
import Loader from "../common/Loader";
const OrderDetails = () => {
    const userData = useSelector(state => state.user.user);
    const route = useRoute();
    const { id } = route.params;
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const getOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orders/${id}`, {
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
    }, [id])
    const formatAppointmentDate = (dateString) => {
        return dateString?.split(' ')[0];
    };

    if (loading) {
        return (<Loader loading={loading} />)
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.detailsContainer}>
                <Text style={styles.heading}>Détails de la commande({orderData?.order_number})</Text>
                <View style={styles.details}>
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
                        <Text>{formatAppointmentDate(orderData?.appointment_date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Adresse :</Text>
                        <Text>{orderData?.customer_address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Numéro de téléphone :</Text>
                        <Text>{orderData?.phone_number}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Mode de paiement :</Text>
                        <Text>{orderData?.payment_info}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Statut de la commande :</Text>
                        <Text>{orderData?.status}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Date de réservation :</Text>
                        <Text>{formatDate(orderData?.created_at)}</Text>
                    </View>
                    <View >
                        <Text style={styles.tableHeading}>Prestations de service :</Text>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.tableHeader]}>Nom</Text>
                            <Text style={[styles.tableCell, styles.tableHeader]}>Quantité</Text>
                            <Text style={[styles.tableCell, styles.tableHeader]}>Prix</Text>
                        </View>
                        {orderData && orderData?.services_with_price?.map((service, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{service.name}</Text>
                                <Text style={styles.tableCell}>{service.quantity}</Text>
                                <Text style={styles.tableCell}>€{service.price}</Text>
                            </View>
                        ))}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={[styles.tableCell, styles.totalLabel]}>Total de la commande :</Text>
                            <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={[styles.tableCell, styles.totalLabel]}>Total de la commande :</Text>
                            <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={[styles.tableCell, styles.totalLabel]}>Total de la commande :</Text>
                            <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                        </View>
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={[styles.tableCell, styles.totalLabel]}>Total de la commande :</Text>
                            <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default OrderDetails;

const styles = StyleSheet.create({
    // container: {
    //     paddingHorizontal: 20,
    //     backgroundColor: '#f5f5f5',
    //     flex: 1
    // },
    detailsContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
        marginVertical: 20,
        paddingVertical: 20,
        paddingHorizontal: 7,
        marginHorizontal: 10,
    },
    details: {
        padding: 10,
        marginVertical: 10
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center'
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    label: {
        fontWeight: 'bold',
    },
    tableHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 10,
    },
    tableCell: {
        flex: 1,
        padding: 5,
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