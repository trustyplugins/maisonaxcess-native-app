import React, { useEffect, useState } from "react";
import { View, Text,  StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import Card from "../common/Card";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
const ServiceTypes = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { parentid } = route.params;
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/servicetypes/${parentid}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                setServiceType(response.data.servicetypes);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setServiceType([])
            } finally {
                setLoading(false);
            }
        })();
    }, [parentid])
    if (loading) {
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.heading}>Sub Services</Text>
                    {serviceType?.length > 0 ? serviceType?.map((item, index) => (
                        <View key={index}>
                            <Card data={item} id={index} />
                        </View>
                    ))
                        : <Text style={styles.errorMessage}>No Data Found !</Text>}
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
    errorMessage: {
        color: 'red',
        fontSize: 20
    },
    loader: {
        marginTop: 25,
    }
})