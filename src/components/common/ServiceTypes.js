import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import Card from "../common/Card";
import UserCategory from "./UserCategory";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
const ServiceTypes = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { data } = route.params;
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/servicetypes/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                setServiceType(response.data.servicetypes);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setServiceType([])
            } finally {
                setLoading(false);
            }
        })();
    }, [data?.id])

    if (loading) {
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Card data={data} />
                    {
                        serviceType?.length > 0 ? (
                            <>
                                <Text style={styles.heading}>Sub Services</Text>
                                {
                                    serviceType.map((item, index) => (
                                        <View key={index}>
                                            <Card data={item} />
                                        </View>
                                    ))
                                }
                            </>
                        )
                            : <UserCategory data={data} />}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default ServiceTypes;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        marginBottom: 12,
        marginTop: 10,
        fontWeight: 'semibold',
        textAlign: "center",
        textDecorationLine: 'underline'
    },
    loader: {
        marginTop: 25,
    }
})