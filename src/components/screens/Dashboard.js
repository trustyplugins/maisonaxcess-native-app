import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import { API_BASE_URL } from '@env';
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
const Dashboard = () => {
    const navigation = useNavigation();
    const userData = useSelector(state => state.user.user);
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const getOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orders/user/84`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                // console.log(response.data.orders);
                if (response.data.orders?.length > 0) {
                    setOrderData(response.data.orders);
                }
                setLoading(false);

            } catch (error) {
                console.log(error);
                setLoading(false);
                // setLoading(false);
                // setService([])
            }
        }
        getOrders();
    }, [])
    const formatDate = (dateString) => {
        return dateString.split(' ')[0];
    };

    if (loading) {
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }
    return (
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.container}>
                <Text style={styles.heading}>Your Orders</Text>
                <ScrollView >
                    <ScrollView horizontal>
                        <View>
                            {/* Table Header */}
                            <View style={styles.tableRow}>
                                <Text style={[styles.tableCell, styles.tableHeader]}>Order No.</Text>
                                <Text style={[styles.tableCell, styles.tableHeader]}>Services</Text>
                                <Text style={[styles.tableCell, styles.tableHeader]}>Total Price</Text>
                                <Text style={[styles.tableCell, styles.tableHeader]}>Service Provider</Text>
                                <Text style={[styles.tableCell, styles.tableHeader]}>Appointment Date</Text>
                                <Text style={[styles.tableCell, styles.tableHeader]}>Action</Text>
                            </View>


                            {orderData?.length > 0 && orderData.map((item, index) => (
                                <View key={index} style={styles.tableRow}>
                                    <Text style={styles.tableCell}>{item.order_number}</Text>
                                    {/* convert string into array*/}
                                    <Text style={styles.tableCell} ellipsizeMode="tail">{JSON.parse(item.services_with_price).length > 1 ? JSON.parse(item.services_with_price)[0].name + ` + ${JSON.parse(item.services_with_price).length - 1}` : JSON.parse(item.services_with_price)[0].name}</Text>
                                    <Text style={styles.tableCell}>${item.total_price}</Text>
                                    <Text style={styles.tableCell}>{item.service_provider_id}</Text>
                                    <Text style={styles.tableCell}>{formatDate(item.appointment_date)}</Text>
                                    <TouchableOpacity onPress={() => { navigation.navigate("order-details", { id: item.id }) }} style={styles.actionButton}>
                                        <Text style={styles.actionButtonText}>View</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        padding: 10,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 15,

    },
    tableCell: {
        flex: 1,
        padding: 5,
        // textAlign: 'center',
        maxWidth: 100
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
    },
    actionButton: {
        // backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    actionButtonText: {
        color: 'blue',
        fontWeight: 'bold',
    },
});

export default Dashboard;
