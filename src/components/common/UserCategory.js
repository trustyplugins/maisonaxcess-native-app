import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import axios from "axios";
const UserCategory = ({ data }) => {
    const navigation = useNavigation();
    const userData = useSelector(state => state.user.user);
    const [serviceType, setServiceType] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/users/category/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                setServiceType(response.data.user);
                setLoading(false);
            } catch (error) {
                console.log(error)
                setLoading(false);
                setServiceType([])
            } finally {
                setLoading(false);
            }
        })();
    }, [data?.id])

    const handlePress = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/services/${data.id}`, {
                headers: {
                    Authorization: `Bearer ${userData?.token}`
                },
            });
            // console.log(response.data.services)
            
        } catch (error) {
            // console.log(error)
        } 
        // navigation.navigate("ServiceTypes", { data });
    };

    if (loading) {
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }
    return (<>
        <Text style={styles.heading}>User details</Text>
        {serviceType?.length > 0 ? serviceType.map((item, index) => {
            return (
                <View key={index}>
                    <TouchableOpacity onPress={handlePress} >
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item?.profile_photo_url }} style={styles.image} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.description}> {item?.description} </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }) : <Text style={styles.errorMessage}>No Data Found !</Text>}
    </>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        margin: 10,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
    },
    imageContainer: {
        borderRadius: 10,
        overflow: 'hidden',
    },
    heading: {
        fontSize: 20,
        marginBottom: 12,
        marginTop: 10,
        fontWeight: 'semibold',
        textAlign: "center",
        textDecorationLine: 'underline'
    },
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    textContainer: {
        marginTop: 7
    },
    description: {
        fontSize: 13,
        fontWeight: '500',
        textAlign: 'center',
        color: '#000',
    },
    errorMessage: {
        color: 'red',
        fontSize: 20
    },
});

export default UserCategory;
