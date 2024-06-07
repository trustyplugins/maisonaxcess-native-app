import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Image, RefreshControl } from "react-native";
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native';
import SubServices from "./SubServices";
import UserCategory from "./UserCategory";
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import Loader from "../common/Loader";
import { setCachedServiceTypes } from "../../redux/actions/serviceAction";
import dayjs from 'dayjs';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";

const ServiceTypes = ({ navigation }) => {
    const dispatch = useDispatch();
    const userData = useSelector(state => state.user.user);
    const { cachedServiceTypes, cachedServiceTypesTimestamp } = useSelector(state => state.services);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const route = useRoute();
    const { data, iconData } = route.params;
    const fetchServiceTypes = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/servicetypes/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${userData?.token}`
                },
            });
            setServiceType(response.data.servicetypes);
            dispatch(setCachedServiceTypes(data.id, response.data.servicetypes));
        } catch (error) {
            console.log('error', error);
            setServiceType([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cachedData = cachedServiceTypes[data.id];
        const cachedTimestamp = cachedServiceTypesTimestamp[data.id];
        if (cachedData && cachedTimestamp && dayjs().diff(cachedTimestamp, 'hour') < 6) {
            setServiceType(cachedData);
        }
        else {
            fetchServiceTypes();
        }

    }, [data?.id])

    const onRefresh = () => {
        setRefreshing(true)
        fetchServiceTypes();
        setTimeout(() => {
            setRefreshing(false);

        }, 300)
    }

    if (loading) {
        return (<Loader loading={loading} />)
    }
    return (
        <SafeAreaView>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor='#11696A' colors={['blue']}
                        progressBackgroundColor="#fff" />
                }
            >
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
                                            <SubServices data={item} parentDetail={data} />
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
        paddingVertical: responsiveWidth(2),
    },
    parent: {
        flexDirection: 'row',
        gap: responsiveWidth(3.75),
        alignItems: 'center',
        height: responsiveHeight(11.25),
        backgroundColor: '#D3D3D3',
        paddingLeft: responsiveWidth(5),
    },
    image: {
        width: '18%',
        height: responsiveHeight(7.5),
        borderRadius: 8,
    },
    parentHeading: {
        fontSize: responsiveFontSize(2.5),
        marginBottom: responsiveHeight(3),
        marginTop: responsiveHeight(2.5),
        fontWeight: 'bold',
        textAlign: "center",
        color: "#11696A",
    },
    heading: {
        fontSize: responsiveFontSize(2.5),
        marginBottom: responsiveHeight(3),
        marginTop: responsiveHeight(2.5),
        fontWeight: '500',
        textAlign: "center",
        textDecorationLine: 'underline',
    },
})