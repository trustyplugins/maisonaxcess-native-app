import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Image } from "react-native";
import { useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native';
import SubServices from "./SubServices";
import UserCategory from "./UserCategory";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
const ServiceTypes = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);
    const route = useRoute();
    const { data, iconData } = route.params;
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
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#11696A" /></View>)
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    {iconData ? <View style={styles.parent}>
                        <Image source={iconData.image} style={styles.image} />
                        <Text style={styles.parentHeading}>{data.name}</Text>
                    </View> : <SubServices data={data} />}
                    {
                        serviceType?.length > 0 ? (
                            <>
                                {
                                    serviceType.map((item, index) => (
                                        <View key={index}>
                                            <SubServices data={item} />
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
        // paddingHorizontal: 10,
    },
    parent: {
        flexDirection: 'row',
        gap: 15,
        alignItems: 'center',
        height: 90,
        backgroundColor: '#D3D3D3',
        paddingLeft: 20
    },
    // parent: {
    //     flexDirection: 'row',
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     height: 80,
    //     backgroundColor: '#D3D3D3'
    // },
    image: {
        width: '18%',
        height: 60,
        borderRadius: 8,
    },
    parentHeading: {
        fontSize: 20,
        marginBottom: 12,
        marginTop: 10,
        fontWeight: 'bold',
        textAlign: "center",
        color: "#11696A"
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