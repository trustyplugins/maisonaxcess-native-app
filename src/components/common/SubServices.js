import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Modal, Image, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import parseFromHtml from '../../utils/parseHtml';
import { FontAwesome } from '@expo/vector-icons';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const SubServices = ({ data, parentDetail }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [tarifVisible, setTarifVisible] = useState(false);

    const handleClick = () => {
        let id = '';
        if (data.users?.length > 0) {
            id = data.users[0].id;
        } else {
            id = parentDetail.users[0].id;
        }
        navigation.navigate("service", {
            userid: data,
            service_provider_id: id
        });

    }

    const handlePress = () => {
        navigation.navigate("service_types", { data });
    };

    const handleCloseModal = () => {
        setModalVisible(!modalVisible);
    };
    const handleCloseTarif = () => {
        setTarifVisible(!tarifVisible);
    };
    return (<ScrollView>
        {(parentDetail?.name != undefined) && (parentDetail?.name == 'COORDONNERIE' || parentDetail?.name == "LAVAGE AUTO-MOTO" || parentDetail?.name == "Pressing et blanchisserie" || parentDetail?.name == "Esthéticienne") ?
            <View>
                <View style={styles.cardQuo}>
                    <View style={styles.textContainerQuo}>
                        <Text style={styles.titleQuo}> {data.name}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={() => { handleCloseModal() }}>
                    <Text style={styles.detail}> Détails</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleCloseTarif() }}>
                    <Text style={styles.detail}> Tarifs</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { handleClick() }}>
                    <Text style={styles.btnQuo}> Commander</Text>
                </TouchableOpacity>

            </View>
            :
            <TouchableOpacity onPress={handlePress}
                accessible={true}
                accessibilityRole="button">
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <ImageBackground source={{ uri: `https://maisonaxcess.com/${data.image}` }} style={styles.image} accessible={false}>
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
            accessibilityLabel="Details Modal"
            accessible={true}
        >
            <View style={styles.modalContainer}>
                {data?.article &&
                    <View style={styles.modalView}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalHeaderTitle}>Details</Text>
                            <TouchableOpacity onPress={handleCloseModal}
                                style={styles.closeButton}
                                accessibilityLabel="Close Modal"
                                accessible={true}
                                accessibilityRole="button" >
                                <FontAwesome name="close" size={30} color="#11696A" />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.modalImageContainer}>
                            <Image
                                style={styles.modalImage}
                                source={{ uri: `https://maisonaxcess.com/${data?.article?.image}` }}
                                resizeMode="contain"
                                accessibilityLabel="Article Image"
                                accessible={true}
                            />
                        </View>
                        <Text style={styles.modalBottomTitle}>{data?.article?.title}</Text>
                        <Text style={styles.modalContentText}>{parseFromHtml(data?.article?.content)}</Text>
                    </View>
                }
            </View>
        </Modal>

        <Modal
            visible={tarifVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={handleCloseTarif}
            accessibilityLabel="Details Modal"
            accessible={true}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <View style={styles.modalHeaderTarif}>
                        <TouchableOpacity onPress={handleCloseTarif} style={styles.closeButton} accessibilityLabel="Close Modal"
                            accessible={true}
                            accessibilityRole="button" >
                            <FontAwesome name="close" size={30} color="#11696A" />
                        </TouchableOpacity>
                        <Text style={styles.modalHeading}>Tarifs</Text>
                    </View>
                    <View style={styles.modalSubHeader}>
                        <Text style={styles.serviceName}>Prestation sur devis</Text>
                        <Text style={styles.serviceName}>Sur devis uniquement</Text>
                    </View>
                    <ScrollView style={styles.scrollView}>
                        {data?.article?.services?.map((service, id) => (
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
export default SubServices;

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
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    image: {
        width: '100%',
        height: responsiveHeight(12.5),
        borderRadius: 10,
    },
    title: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#ffffff',
    },
    cardQuo: {
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingHorizontal: responsiveWidth(2.5),
        paddingTop: responsiveHeight(1),
    },
    textContainerQuo: {
        paddingBottom: responsiveHeight(1),
    },
    titleQuo: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: '500',
        color: 'gray',
    },
    detail: {
        fontSize: responsiveFontSize(2.3),
        fontWeight: '400',
        color: "#000",
        paddingBottom: responsiveHeight(0.9),
        paddingTop: responsiveHeight(0.9),
        backgroundColor: '#f4f4f4',
        borderBottomColor: '#d9d9d9',
        borderBottomWidth: 1,
        paddingHorizontal: responsiveWidth(2.5),
    },
    btnQuo: {
        fontSize: responsiveFontSize(2.3),
        fontWeight: '500',
        color: "#11696A",
        backgroundColor: '#f4f4f4',
        paddingBottom: responsiveHeight(0.625),
        paddingTop: responsiveHeight(0.625),
        paddingHorizontal: responsiveWidth(2.5),
    },
    // modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: responsiveWidth(85),
        backgroundColor: 'white',
        borderRadius: 10,
        padding: responsiveWidth(5),
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
        marginBottom: responsiveHeight(1.875),
    },
    modalHeaderTitle: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: '500',
    },
    modalCloseButton: {
        backgroundColor: '#f00',
        borderRadius: 20,
        padding: responsiveWidth(1.25),
        paddingHorizontal: responsiveWidth(2.5),
    },
    modalImageContainer: {
        width: '100%',
        height: responsiveHeight(25),
        marginBottom: responsiveHeight(1.25),
    },
    modalImage: {
        width: '100%',
        height: '100%',
    },
    modalBottomTitle: {
        fontSize: responsiveFontSize(2.25),
        fontWeight: 'bold',
    },
    modalContentText: {
        fontSize: responsiveFontSize(2),
        color: 'gray',
        marginTop: responsiveHeight(0.625),
    },
    modalContent: {
        width: responsiveWidth(90),
        height: '70%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: responsiveWidth(3.5),
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        top: responsiveHeight(-1),
        right: 0,
        padding: responsiveWidth(2),
    },
    modalHeaderTarif: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        marginBottom: responsiveHeight(0.625),
        borderColor: '#0e3f407a'
    },
    modalSubHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingVertical: responsiveHeight(1.2),
        marginBottom: responsiveHeight(2.2),
    },
    modalHeading: {
        fontSize: responsiveFontSize(3),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.25),
        textAlign: 'center',
    },
    scrollView: {
        flex: 1,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.9),
        paddingVertical: responsiveHeight(0.625),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    serviceName: {
        fontSize: responsiveFontSize(2),
        fontWeight: '500',
        flexWrap: 'wrap',
        flex: 1
    },
    servicePrice: {
        fontSize: responsiveFontSize(1.75),
        color: '#888',
    },
});


