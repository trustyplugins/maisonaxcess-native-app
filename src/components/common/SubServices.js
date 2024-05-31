import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from '@env';
import axios from "axios";
import { useSelector } from 'react-redux';
import parseFromHtml from '../../utils/parseHtml';
import { FontAwesome } from '@expo/vector-icons';
import Loader from './Loader';
const SubServices = ({ data, parentDetail }) => {
    const userData = useSelector(state => state.user.user);
    const navigation = useNavigation();
    const [serviceProviderId, setServiceProviderId] = useState('');
    const [services, setServices] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [tarifVisible, setTarifVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        if (serviceProviderId?.id != undefined) {
            fetch();
        }
    }, [serviceProviderId?.id])

    const serviceProvider = async (attempt = 1) => {
        const MAX_ATTEMPTS = 2; // Prevent infinite recursion
        let id = attempt === 1 ? data.id : parentDetail.id;
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/users/category/${id}`, {
                headers: {
                    Authorization: `Bearer ${userData?.token}`
                },
            });

            if (response.data.user?.length > 0) {
                setServiceProviderId(response.data.user[0]);
            } else if (attempt < MAX_ATTEMPTS) {
                serviceProvider(attempt + 1);
            } else {
                console.log('No service provider found after maximum attempts');
            }
            setLoading(false)

        } catch (error) {
            console.log('error', error);
            setLoading(false)
        }
    };


    const handleClick = async () => {
        serviceProvider();
    };
    const fetch = async (type) => {
        if (serviceProviderId != '' || type == 'detail' || type == 'tarif') {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/services/${data.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                if (response.data.services?.length > 0) {
                    if (type == 'detail') {
                        setServices(response.data.services);
                        setModalVisible(true);
                    }
                    else if (type == 'tarif') {
                        setServices(response.data.services);
                        setTarifVisible(true);
                    }
                    else {
                        navigation.navigate("service", { userid: `${data.id}`, service_provider_id: `${serviceProviderId.id}` });
                    }
                }
                setServiceProviderId('');
                setLoading(false)

            } catch (error) {
                console.log(error)
                setLoading(false)
            }
        }
    }

    const handlePress = () => {
        navigation.navigate("service_types", { data });
    };

    const handleCloseModal = () => {
        setModalVisible(false);
    };
    const handleCloseTarif = () => {
        setTarifVisible(false);
    };
    if (loading) {
        return (<Loader loading={loading} />)
    }
    return (<ScrollView>
        {(parentDetail?.name != undefined) && (parentDetail?.name == 'COORDONNERIE' || parentDetail?.name == "LAVAGE AUTO-MOTO" || parentDetail?.name == "Pressing et blanchisserie" || parentDetail?.name == "Esthéticienne") ?
            <View>
                <View style={styles.cardQuo}>
                    <View style={styles.textContainerQuo}>
                        <Text style={styles.titleQuo}> {data.name}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { fetch('detail') }}>
                    <Text style={styles.detail}> Détails</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { fetch('tarif') }}>
                    <Text style={styles.detail}> Tarifs</Text>
                </TouchableOpacity>
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
        <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseModal}
        >
            <View style={styles.modalContainer}>
                {services?.length > 0 && services?.map((item, index) => (
                    <View style={styles.modalView} key={index}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderTitle}>Details</Text>
                            <TouchableOpacity onPress={handleCloseModal} >
                                <FontAwesome name="close" size={24} color="#11696A" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalImageContainer}>
                            <Image
                                style={styles.modalImage}
                                source={{ uri: `https://maisonaxcess.com/${item.image}` }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.modalBottomTitle}>{item?.title}</Text>
                        <Text style={styles.modalContentText}>{parseFromHtml(item.content)}</Text>
                    </View>
                ))}
            </View>
        </Modal>

        <Modal
            visible={tarifVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseTarif}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeaderTarif}>
                        <TouchableOpacity onPress={handleCloseTarif} style={styles.closeButton}>
                            <FontAwesome name="close" size={24} color="#11696A" />
                        </TouchableOpacity>
                        <Text style={styles.modalHeading}>Tarifs</Text>
                    </View>
                    <View style={styles.modalSubHeader}>
                        <Text style={styles.serviceName}>Prestation sur devis</Text>
                        <Text style={styles.serviceName}>Sur devis uniquement</Text>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {services?.length > 0 && services[0].services?.map((service, id) => (
                            <View key={id} style={styles.serviceItem}>
                                <Text style={styles.serviceName}>{service.name}</Text>
                                <Text style={styles.servicePrice}>€{service.price}</Text>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    </ScrollView>
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
    title: {
        fontSize: 17,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
    },
    //
    cardQuo: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingHorizontal: 10,
        paddingTop: 10
    },
    textContainerQuo: {
        paddingBottom: 10
    },
    titleQuo: {
        fontSize: 17,
        fontWeight: '500',
        color: 'gray',
    },
    detail: {
        fontSize: 17,
        fontWeight: '400',
        color: "#000",
        paddingBottom: 8,
        paddingTop: 8,
        backgroundColor: '#f4f4f4',
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        paddingHorizontal: 10,
    },
    btnQuo: {
        fontSize: 17,
        fontWeight: '500',
        color: "#11696A",
        backgroundColor: '#f4f4f4',
        paddingBottom: 8,
        paddingTop: 8,
        paddingHorizontal: 10,
    },
    // modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        // alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
    },
    modalHeaderTitle: {
        fontSize: 20,
        fontWeight: '500',
    },
    modalCloseButton: {
        backgroundColor: '#f00',
        borderRadius: 20,
        padding: 5,
        paddingHorizontal: 10,
    },
    modalImageContainer: {
        width: '100%',
        height: 200,
        marginBottom: 10,
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalBottomTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContentText: {
        fontSize: 16,
        color: 'gray',
        marginTop: 5
    },
    // tarif
    modalContent: {
        width: '90%',
        height: '70%', // Adjust the height to leave space for scrolling
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 14,
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: 2,
        right: 0,
    },
    modalHeaderTarif: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: 10,
        borderColor: '#0e3f407a'
    },
    modalSubHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: 10,
        marginBottom: 15,
    },
    modalHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    serviceName: {
        fontSize: 15,
        fontWeight: '500',
    },
    servicePrice: {
        fontSize: 14,
        color: '#888',
    },
});

export default SubServices;
