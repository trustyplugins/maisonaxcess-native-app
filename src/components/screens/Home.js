import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import axios from "axios";
import { API_BASE_URL } from '@env';
import Loader from "../common/Loader";
const Home = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);
    const iconData = [
        { id: 84, title: 'Famille', image: require("../../assets/image/FAMILLE.png") },
        { id: 90, title: 'MAISON', image: require("../../assets/image/MAISON.png") },
        { id: 108, title: 'AU QUOTIDIEN', image: require("../../assets/image/AU QUOTIDIEN.png") },
        { id: 98, title: 'ASSISTANT PERSONNEL', image: require("../../assets/image/ASSISTANT PERSONNEL.png") },
        { id: 107, title: 'INSTANTS GOURMANDS', image: require("../../assets/image/INSTANTS GOURMANDS.png") },
        { id: 118, title: 'BEAUTÉ & BIEN-ÊTRE', image: require("../../assets/image/BEAUTÉ.png") },
    ];
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

    }, [])

    const handlePress = (item, icon) => {
        navigation.navigate("service_types", { data: item, iconData: icon });
    };

    if (loading) {
        return (<Loader loading={loading} />)
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <View style={styles.container}>
                    {serviceType?.length > 0 && iconData.map((item) => {
                        const matchingData = serviceType.find(dataItem => dataItem.id === item.id);
                        // if (item.id !== '70' && item.id !== '69' && matchingData) {
                        return (
                            <View key={item.id} style={styles.cardWrapper}>
                                <View style={styles.card}>
                                    <TouchableOpacity onPress={() => handlePress(matchingData, item)}>
                                        <Image source={item.image} style={styles.image} />
                                    </TouchableOpacity>
                                    <Text style={styles.title}>{matchingData.name}</Text>
                                </View>
                            </View>
                        );
                        // }
                        // return null;
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Home;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    scrollView: {
        padding: 10,
    },
    container: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    cardWrapper: {
        width: '48%', // Two items per row with space between
        marginBottom: 6,
    },
    card: {
        padding: 10,
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    title: {
        marginTop: 10,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});