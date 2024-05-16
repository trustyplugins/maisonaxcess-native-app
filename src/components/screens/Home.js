import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import Card from "../common/Card";
import axios from "axios";
import { API_BASE_URL } from '@env';
const Home = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/servicetypes`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                });
                setServiceType(response.data.servicetypes);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setServiceType([])
                if (userData == null) {
                    navigation.navigate('login');
                }
            } finally {
                setLoading(false);
            }
        })()

    }, [userData?.token])

    if (loading) {
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }

    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Text style={styles.heading}>Service Types</Text>
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

export default Home;

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