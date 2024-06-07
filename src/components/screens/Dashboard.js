import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView,  Image } from 'react-native';
import { API_BASE_URL } from '@env';
import axios from "axios";
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Loader from "../common/Loader";
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const Dashboard = () => {
    const navigation = useNavigation();
    let userID = '';
    const userData = useSelector(state => state.user.user);
    userID = userData?.user_data;
    const [orderData, setOrderData] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        const getOrders = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/orders/user/${userID?.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
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
        return (<Loader loading={loading} />)
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                <Text style={styles.heading}>Vos commandes</Text>
                <ScrollView contentContainerStyle={styles.scrollViewContent}>
                    {orderData?.length > 0 && orderData.map((item, index) => (
                        <View style={styles.card} key={index}>
                            <View style={styles.header}>
                                <View style={styles.logo}>
                                    <Image source={{ uri: `https://maisonaxcess.com/${item?.service_image}` }} style={styles.image} />
                                    <View style={styles.titleContainer}>
                                        <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>{item?.service_provider_name}</Text>
                                    </View>
                                </View>
                                <TouchableOpacity style={styles.actionButton} onPress={() => { navigation.navigate("order-details", { orderData: item }) }}>
                                    <Text style={styles.actionButtonText}>Voir</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.body}>
                                {JSON.parse(item.services_with_price).map((order, id) => (
                                    <View style={styles.servicesData} key={id}>
                                        <View style={styles.services}>
                                            <Text style={styles.qnty}>{order.quantity}</Text>
                                            <Text style={styles.qnty}>x</Text>
                                            <Text style={styles.service}>{order.name}</Text>
                                        </View>
                                        <View>
                                            <Text style={styles.service}>€ {order.price}</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                            <View style={styles.footer}>
                                <View>
                                    <Text style={styles.footerText}>Date de rendez-vous</Text>
                                    <Text style={styles.footerText}> {formatDate(item.appointment_date)}</Text>
                                </View>
                                <Text style={styles.footerText}> € {item.total_price}</Text>
                            </View>
                        </View>
                    ))
                    }
                </ScrollView>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f8f8f8',
    },
    container: {
        flex: 1,
        padding: responsiveWidth(4),
    },
    heading: {
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(2),
        textAlign: 'center'
    },
    scrollViewContent: {
        paddingBottom: responsiveHeight(2),
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: responsiveWidth(2),
        marginBottom: responsiveHeight(2),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        paddingVertical: responsiveHeight(1.25)
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(2),
    },
    logo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: responsiveWidth(1),
    },
    image: {
        width: responsiveWidth(15),
        height: responsiveWidth(15),
        borderRadius: responsiveWidth(10),
    },
    titleContainer: {
        justifyContent: 'center',
        maxWidth: "100%",
    },
    title: {
        fontSize: responsiveFontSize(2.25),
        fontWeight: 'bold',
    },
    address: {
        fontSize: responsiveFontSize(1.75),
        color: '#666',
        maxWidth: "75%",
    },
    actionButton: {
        paddingVertical: responsiveHeight(0.625),
        borderRadius: responsiveWidth(1.25),
        paddingRight: responsiveWidth(3),
    },
    actionButtonText: {
        color: "#11696A",
        fontWeight: 'bold',
    },
    body: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(2.5),
    },
    servicesData: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    services: {
        flexDirection: 'row',
        gap: responsiveWidth(1),
        paddingTop: responsiveHeight(0.625),
    },
    qnty: {
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1),
        color: 'gray'
    },
    service: {
        fontWeight: '500'
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: responsiveHeight(2),
        marginTop: responsiveHeight(1.5),
        paddingHorizontal: responsiveWidth(2.5),
    },
    footerText: {
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(1),
        fontWeight: '500'
    },
});


export default Dashboard;