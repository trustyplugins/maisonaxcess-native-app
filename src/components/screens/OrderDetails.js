import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import axios from "axios";
import formatDate from '../../utils/formatDate';
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
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#11696A" /></View>)
    }
    return (
        <ScrollView contentContainerStyle={styles.container}>

            <View style={styles.detailsContainer}>
                <Text style={styles.heading}>Order Details</Text>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Order Number:</Text>
                    <Text>{orderData?.order_number}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Service Provider:</Text>
                    <Text>{orderData?.service_provider_name}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Appointment Date:</Text>
                    <Text>{formatAppointmentDate(orderData?.appointment_date)}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Address:</Text>
                    <Text>{orderData?.customer_address}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Phone Number:</Text>
                    <Text>{orderData?.phone_number}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Payment Method:</Text>
                    <Text>{orderData?.payment_info}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Order Status:</Text>
                    <Text>{orderData?.status}</Text>
                </View>
                <View style={styles.detailRow}>
                    <Text style={styles.label}>Booking Date:</Text>
                    <Text>{formatDate(orderData?.created_at)}</Text>
                </View>
                <View >
                    <Text style={styles.tableHeading}>Order Details</Text>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Item</Text>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Quantity</Text>
                        <Text style={[styles.tableCell, styles.tableHeader]}>Price</Text>
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
                        <Text style={[styles.tableCell, styles.totalLabel]}>Order Total:</Text>
                        <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default OrderDetails;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    detailsContainer: {
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        elevation: 3,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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