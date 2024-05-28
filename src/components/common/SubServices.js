import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import axios from "axios";
import { useSelector } from 'react-redux';
const SubServices = ({ data, parentDetail }) => {
    const userData = useSelector(state => state.user.user);
    const navigation = useNavigation();
    const [serviceType, setServiceType] = useState([]);
    const serviceProvider = async () => {

        try {
            const response = await axios.get(`${API_BASE_URL}/users/category/${parentDetail.id}`, {
                headers: {
                    Authorization: `Bearer ${userData?.token}`
                },
            });
            setServiceType(response.data.user[0]);

            fetch();
        } catch (error) {
            console.log('error', error)
        }
    }

    const handlePress = () => {
        navigation.navigate("service_types", { data });
    };
    const handleClick = async () => {
        serviceProvider();
    };
    const fetch = () => {
        setTimeout(async () => {
            if (serviceType?.id != undefined) {
                try {
                    const response = await axios.get(`${API_BASE_URL}/services/${data.id}`, {
                        headers: {
                            Authorization: `Bearer ${userData?.token}`
                        },
                    });
                    if (response.data.services?.length > 0) {
                        navigation.navigate("service", { userid: `${data.id}`, service_provider_id: `${serviceType.id}` });
                    }

                } catch (error) {
                    console.log(error)
                }
            }
        }, 500)



    }

    return (<>
        {(parentDetail?.name != undefined) && (parentDetail?.name == 'COORDONNERIE' || parentDetail?.name == "LAVAGE AUTO-MOTO" || parentDetail?.name == "Pressing et blanchisserie") ?
            <View style={styles.cardQuo}>
                <View style={styles.textContainerQuo}>
                    <Text style={styles.titleQuo}> {data.name}</Text>
                </View>
                <TouchableOpacity onPress={() => { handleClick(data.id) }}>
                    <Text style={styles.btnQuo}> Commander</Text>
                </TouchableOpacity>
            </View>
            :
            <TouchableOpacity onPress={handlePress}>
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <ImageBackground source={{ uri: `https://maisonaxcess.com/${data.image}` }} style={styles.image} >
                            <View style={styles.overlay} />
                        </ImageBackground>
                    </View>
                </View>
            </TouchableOpacity>
        }
    </>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        position: 'relative',
    },
    imageContainer: {
        overflow: 'hidden',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // Semi-transparent black overlay
    },
    image: {
        width: '100%',
        height: 100,
        borderRadius: 10,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '40%',
        left: '28%',
    },
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
    },
    //
    cardQuo: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        padding: 10
    },
    textContainerQuo: {
        paddingBottom: 10
    },
    titleQuo: {
        fontSize: 17,
        fontWeight: '500',
        color: 'gray',
    },
    btnQuo: {
        fontSize: 17,
        fontWeight: '500',
        color: "#11696A",
    }

});

export default SubServices;
