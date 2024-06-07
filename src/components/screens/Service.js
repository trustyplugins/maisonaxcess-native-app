import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, TextInput, ScrollView, Modal, Switch, Keyboard, Platform } from 'react-native';
import { API_BASE_URL } from '@env';
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import formatDate from '../../utils/formatDate';
import parseFromHtml from '../../utils/parseHtml';
import { FontAwesome } from '@expo/vector-icons';
import Snackbar from '../Snackbar';
import CustomButton from '../common/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Loader from "../common/Loader";
import { CardField, createToken } from '@stripe/stripe-react-native';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const Service = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const route = useRoute();
    const { userid, service_provider_id } = route.params;
    let service = [{ ...userid.article }];
    const userData = useSelector(state => state.user.user);
    const serviceDetails = useSelector(state => state.user.serviceDetail);
    let serviceDetail = "";
    if (serviceDetails != null && serviceDetails != undefined) {
        serviceDetail = serviceDetails?.find(ele => ele?.id == userid.id);
    }
    const userCredential = userData?.user_data;
    const [loading, setLoading] = useState(false);
    const [appointmentDates, setAppointmentDates] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [error, setError] = useState(false);
    const [modalVisible, setModalVisible] = useState(serviceDetail?.services?.length > 0 ? false : true);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [cardInfo, setCardInfo] = useState(null);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const [customerAddress, setCustomerAddress] = useState({
        id: userid.id,
        email: userCredential?.email || '',
        phone: serviceDetail?.phone || '',
        state: serviceDetail?.state || '',
        country: serviceDetail?.country || '',
        postalCode: serviceDetail?.postalCode || '',
        address: serviceDetail?.address || '',
        card_number: serviceDetail?.card_number || '',
        expiry: serviceDetail?.expiry || '',
        cvv_number: serviceDetail?.cvv_number || '',
        appointment_date: serviceDetail?.appointment_date || 'dd-mm-yyyy',
        services: serviceDetail?.services ? [...serviceDetail.services] : [],
        total_price: serviceDetail?.total_price || 0.0,
        cancelComment: serviceDetail?.cancelComment || '',
        location: serviceDetail?.location || '',
        stripeToken: ''
    });

    const calTotalOrder = () => {
        if (customerAddress.services.length > 0) {
            return customerAddress.services.reduce((total, item) => total + parseFloat(item.price) * parseInt(item.quantity), 0);
        }
    };
    const totalOrderMemoized = useMemo(calTotalOrder, [customerAddress.services]);
    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                setKeyboardVisible(true); // Keyboard is visible
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardVisible(false); // Keyboard is hidden
            }
        );

        // Cleanup listeners on component unmount
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);
    useEffect(() => {
        if (service[0]?.payment_mode == 'online' && customerAddress?.stripeToken) {
            bookAppointment();
        }
    }, [customerAddress?.stripeToken]);

    useEffect(() => {
        setCustomerAddress(prev => ({
            ...prev,
            total_price: totalOrderMemoized == undefined ? 0 : totalOrderMemoized
        }));

    }, [totalOrderMemoized]);

    useEffect(() => {
        dispatch({ type: 'ADD_SERVICE', payload: customerAddress });
    }, [customerAddress])

    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/appointments/${userid.id}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                if (response.data.appointments?.length > 0) {
                    setAppointmentDates(response.data.appointments);
                }

            } catch (error) {
                // setLoading(false);
                // setService([])
            }
        }
        getAppointments();
    }, [userid.id])

    const ReverseDate = (dateString) => {
        if (dateString) {
            const [day, month, year] = dateString.split(' ')[0]?.split('-');
            return `${year}-${month}-${day}`;
        }
    };

    const toggleService = (item) => {
        let listItem = {
            title: item.name,
            price: item.price,
            quantity: '1'
        }
        let isItemPresent = customerAddress.services.some((ele) => ele.title == item.name);
        if (isItemPresent) {
            let updateList = customerAddress.services.filter(ele => ele.title != item.name);
            setCustomerAddress(prev => ({
                ...prev,
                services: updateList
            }))
        } else {
            setCustomerAddress(prev => ({
                ...prev,
                services: [...prev.services, listItem]

            }))
        }
        setError(false)

    };
    const bookAppointment = async () => {
        const { phone, state, country, postalCode, address } = customerAddress;

        if (!phone || !state || !country || !postalCode || !address) {
            setShowError('Veuillez remplir les détails ci-dessus');
            setError(true);
            return;
        }
        if (customerAddress.appointment_date == 'dd-mm-yyyy') {
            setShowError("Veuillez sélectionner la date du rendez-vous!");
            setError(true);
            return;
        }
        if (customerAddress.services?.length == 0) {
            setShowError("Veuillez ajouter les services!");
            setError(true);
            return;
        }
        setLoading(true);

        const bookData = {
            service_provider_id: service_provider_id,
            main_service_id: userid.id,
            email: customerAddress.email,
            phone_number: customerAddress.phone,
            state: customerAddress.state,
            country: customerAddress.country,
            postal_code: customerAddress.postalCode,
            service_image: service[0].image,
            address: customerAddress.address,
            services_detail: customerAddress.services,
            payment_info: service[0].payment_mode == 'online' ? 'stripe' : 'cod',
            appointment_date: ReverseDate(customerAddress.appointment_date),
            location_for_service: customerAddress.location,
            cancellation_comment: customerAddress.cancelComment,
            stripeToken: customerAddress.stripeToken
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/orders`, bookData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.token}`
                }
            });
            setCustomerAddress({
                id: userid.id,
                phone: '',
                state: '',
                country: '',
                postalCode: '',
                address: '',
                appointment_date: 'dd-mm-yyyy',
                services: [],
                total_price: 0.0,
                cancelComment: '',
                location: '',
                stripeToken: ''
            });
            navigation.navigate('order-success', { orderId: response.data.orderid });
            setLoading(false);

        } catch (error) {
            if (error.response) {
                setShowError(error.response.data.message);
                setError(true);
                setLoading(false);
            }
        }
    }
    const createTokenHandle = async () => {
        if (cardInfo != null) {
            try {
                const res = await createToken({ ...cardInfo, type: 'Card' });
                setCustomerAddress(prev => ({
                    ...prev,
                    stripeToken: res.token?.id
                }));

            } catch (error) {
                setShowError("Détails invalides");
                setError(true);
            }
        } else {
            setShowError("Détails invalides");
            setError(true);
        }
    }

    const handleChange = (field, value) => {
        setCustomerAddress({
            ...customerAddress,
            [field]: value
        });

    };

    const resetError = () => {
        setError(false)
    }
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    const incrementQuantity = (title) => {
        setCustomerAddress(prevState => ({
            ...prevState,
            services: prevState.services.map(service =>
                service.title === title
                    ? { ...service, quantity: `${parseInt(service.quantity) + 1}` }
                    : service
            ),
        }));
    };

    const decrementQuantity = (title) => {
        setCustomerAddress(prevState => ({
            ...prevState,
            services: prevState.services.map(service =>
                service.title === title && parseInt(service.quantity) > 0
                    ? { ...service, quantity: service.quantity === '1' ? '1' : `${parseInt(service.quantity) - 1}` }
                    : service
            ),
        }));
    };

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        let formattedDate = formatDate(date);
        // if (appointmentDates?.length > 0) {
        //     appointmentDates.forEach(ele => {
        //         if (ele.date == formattedDate) {
        //             setSnackbarVisible(true);
        //             formattedDate = 'dd-mm-yyyy';
        //         }
        //     })
        // }
        if (formattedDate != 'dd-mm-yyyy') {
            setError(false);
        }
        setCustomerAddress({
            ...customerAddress,
            ['appointment_date']: formattedDate
        });
        hideDatePicker();
    };
    // const handlePay = () => { }
    const handlePaymentChange = (field) => {
        if (field.complete) {
            setCardInfo(field);
        } else {
            setCardInfo(null);
        }

    }

    if (loading) {
        return (<Loader loading={loading} />)
    }
    return (
        <ScrollView>
            <Snackbar
                visible={snackbarVisible}
                message="This date is already booked!"
                onDismiss={() => setSnackbarVisible(false)}
            />
            {service?.length > 0 && service.map((item, index) => {
                return (
                    <View key={index}>
                        <View style={Platform.OS == 'ios' && isKeyboardVisible ? styles.cardKeyboard : styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: `https://maisonaxcess.com/${item.image}` }} style={styles.image} />
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item?.title} </Text>
                            </View>
                            <Text style={styles.contentText}>{parseFromHtml(item.content)}</Text>
                            <View>
                                <TouchableOpacity onPress={toggleModal} style={styles.servicesContainer}>
                                    <Text style={styles.servicesText}>Ajouter des services</Text>
                                </TouchableOpacity>
                                {
                                    customerAddress?.services?.length > 0 && customerAddress.services.map((serviceItem, id) => (
                                        <View key={id} style={styles.serviceItem}>
                                            <View style={styles.serviceItemName}>
                                                <Text>{serviceItem.title}</Text>
                                                <Text>${serviceItem.price}</Text>
                                            </View>
                                            <View style={styles.quantity}>
                                                <TouchableOpacity onPress={() => decrementQuantity(serviceItem.title)}>
                                                    <Icon name="remove-circle-outline" size={30} color="#000" />
                                                </TouchableOpacity>
                                                <Text style={styles.quantityText}>{serviceItem.quantity}</Text>
                                                <TouchableOpacity onPress={() => incrementQuantity(serviceItem.title)}>
                                                    <Icon name="add-circle-outline" size={30} color="#000" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    ))
                                }

                            </View>
                            <View style={styles.dateSection}>
                                <View>
                                    <Text style={styles.dateLabelText}>Date de réalisation souhaitée:</Text>
                                    <View style={styles.dateContainer}>
                                        <Text style={styles.dateText}>{customerAddress.appointment_date}</Text>
                                        <TouchableOpacity onPress={showDatePicker}>
                                            <FontAwesome name="calendar" size={20} color="black" />
                                        </TouchableOpacity>
                                        <DateTimePickerModal
                                            isVisible={isDatePickerVisible}
                                            mode="date"
                                            onConfirm={handleConfirm}
                                            onCancel={hideDatePicker}
                                            minimumDate={new Date()}
                                        />
                                    </View>
                                </View>
                                <View style={styles.totalPrice}>
                                    <Text style={styles.dateLabelText}>Total Order:</Text>
                                    {service[0]?.payment_mode != 'online' ? <Text style={styles.price}>Sur devis
                                    </Text> : <Text style={styles.price}>€{customerAddress.total_price || 0.0}</Text>}
                                </View>
                            </View>
                            <View style={styles.customerFormContainer}>
                                <Text style={styles.customerHeading}>Adresse du client</Text>
                                <Text style={styles.customerLabel}>Téléphone</Text>
                                <TextInput
                                    style={styles.customerInput}
                                    placeholder="Téléphone"
                                    value={customerAddress.phone}
                                    onChangeText={(value) => handleChange('phone', value)}
                                    keyboardType="phone-pad"
                                    onPress={resetError}
                                />
                                <Text style={styles.customerLabel}>Ville</Text>
                                <TextInput
                                    style={styles.customerInput}
                                    placeholder="Ville"
                                    value={customerAddress.state}
                                    onChangeText={(value) => handleChange('state', value)}
                                    onPress={resetError}
                                />
                                <Text style={styles.customerLabel}>Pays</Text>
                                <TextInput
                                    style={styles.customerInput}
                                    placeholder="Pays"
                                    value={customerAddress.country}
                                    onChangeText={(value) => handleChange('country', value)}
                                    onPress={resetError}
                                />
                                <Text style={styles.customerLabel}>Code Postal</Text>
                                <TextInput
                                    style={styles.customerInput}
                                    placeholder="Code Postal"
                                    value={customerAddress.postalCode}
                                    onChangeText={(value) => handleChange('postalCode', value)}
                                    keyboardType="numeric"
                                    onPress={resetError}
                                />
                                <Text style={styles.customerLabel}>Adresse</Text>
                                <TextInput
                                    style={styles.customerInput}
                                    placeholder="Adresse"
                                    value={customerAddress.address}
                                    onChangeText={(value) => handleChange('address', value)}
                                    multiline
                                    onPress={resetError}
                                />
                                {service[0]?.payment_mode != 'online' &&
                                    <>
                                        <View style={styles.radioContainer}>
                                            <Text style={styles.customerLabelLoc}>Lieu de réservation du service?</Text>
                                            <TouchableOpacity
                                                style={styles.radioButton}
                                                onPress={() => handleChange('location', 'Maison')}
                                            >
                                                <View style={[styles.radioCircle, customerAddress.location === 'Maison' && styles.selectedRadio]} />
                                                <Text style={styles.radioText}>Maison</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                style={styles.radioButton}
                                                onPress={() => handleChange('location', 'Bureau')}
                                            >
                                                <View style={[styles.radioCircle, customerAddress.location === 'Bureau' && styles.selectedRadio]} />
                                                <Text style={styles.radioText}>Bureau</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.customerLabelLoc}>Délai d'annulation de la commande:</Text>
                                        <Text style={styles.customerLabelLoc}>Commentaire:</Text>
                                        <Text style={styles.customerLabelLoc}>48 heures</Text>
                                        <TextInput
                                            style={styles.customerInput}
                                            placeholder="comment"
                                            value={customerAddress.cancelComment}
                                            onChangeText={(value) => handleChange('cancelComment', value)}
                                            multiline
                                            onPress={resetError}
                                        />
                                    </>
                                }
                            </View>

                            {service[0].payment_mode == 'online' &&
                                <CardField
                                    postalCodeEnabled={false}
                                    placeholders={{
                                        number: '4242 4242 4242 4242',
                                    }}
                                    cardStyle={{
                                        backgroundColor: '#FFFFFF',
                                        textColor: '#000000',
                                    }}
                                    style={{
                                        width: '100%',
                                        height: 50,
                                        marginVertical: 30,
                                    }}
                                    onCardChange={handlePaymentChange}
                                />}
                            {error && <Text style={styles.errorMessage}>{showError ? showError : "Veuillez remplir les détails ci-dessus"}</Text>}

                            <View style={styles.payNow}>
                                <CustomButton title="Demander un devis" onPress={service[0].payment_mode == 'online' ? createTokenHandle : bookAppointment} />
                            </View>
                        </View>
                        <Modal
                            visible={modalVisible}
                            animationType="slide"
                            transparent={true}
                            onRequestClose={toggleModal}
                        >
                            <View style={styles.modalContainer}>
                                <View style={styles.modalContent}>
                                    <TouchableOpacity onPress={toggleModal} style={styles.closeButton} accessible={true}
                                        accessibilityRole="button">
                                        <FontAwesome name="close" size={30} color="#11696A" />
                                    </TouchableOpacity>
                                    <Text style={styles.modalHeading}>Prestations de service</Text>
                                    <ScrollView style={styles.scrollView}>
                                        {item.services.map((service, id) => (
                                            <View key={id} style={styles.serviceItem}>
                                                <View style={styles.serviceItemName}>
                                                    <Text style={styles.serviceName}>{service.name}</Text>
                                                    <Text style={styles.servicePrice}>{service.price}</Text>
                                                </View>
                                                <Switch
                                                    value={customerAddress.services?.some((ele) => ele.title === service?.name)}
                                                    onValueChange={() => toggleService(service)}
                                                />
                                            </View>
                                        ))}
                                    </ScrollView>
                                </View>
                            </View>
                        </Modal>
                    </View>
                )
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: responsiveWidth(2.5),
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: responsiveWidth(2.5),
        marginVertical: responsiveHeight(1.25),
        padding: responsiveWidth(2.5),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: responsiveHeight(0.625),
        },
        paddingBottom: responsiveHeight(3.125),
    },
    cardKeyboard: {
        backgroundColor: '#fff',
        borderRadius: responsiveWidth(2.5),
        borderWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: responsiveWidth(2.5),
        marginVertical: responsiveHeight(1.25),
        padding: responsiveWidth(2.5),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: responsiveHeight(0.625),
        },
        paddingBottom: responsiveHeight(3.125),
        marginBottom: responsiveHeight(27.5),
    },
    imageContainer: {
        borderRadius: responsiveWidth(2.5),
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: responsiveHeight(37.5),
        borderRadius: responsiveWidth(2.5),
    },
    textContainer: {
        marginTop: responsiveHeight(0.875),
        marginHorizontal: 0,
        padding: 0,
    },
    title: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        color: '#116969',
        marginTop: responsiveHeight(0.625),
    },
    contentText: {
        fontSize: responsiveFontSize(2),
        color: 'gray',
        marginVertical: responsiveHeight(1.25),
    },
    servicesContainer: {
        marginVertical: responsiveHeight(1.25),
    },
    servicesText: {
        fontSize: responsiveFontSize(2.2),
        fontWeight: 'bold',
        color: '#11696A',
    },
    dateSection: {
        marginVertical: responsiveHeight(1.25),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateLabelText: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(0.625),
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: responsiveFontSize(2),
        marginRight: responsiveWidth(2.5),
    },
    price: {
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(0.625),
        textAlign: 'right',
    },
    customerHeading: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.25),
    },
    customerLabel: {
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(0.625),
    },
    customerLabelLoc: {
        fontSize: responsiveFontSize(2),
        marginBottom: responsiveHeight(0.625),
        fontWeight: '500', // Added fontWeight
    },
    customerInput: {
        height: responsiveHeight(5),
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: responsiveHeight(1.25),
        paddingHorizontal: responsiveWidth(2.5),
    },
    radioContainer: {
        marginTop: responsiveHeight(0.3125),
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: responsiveHeight(0.3125),
    },
    radioCircle: {
        height: responsiveHeight(2.5),
        width: responsiveHeight(2.5),
        borderRadius: responsiveHeight(1.25),
        borderWidth: 1,
        borderColor: '#11696A',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: responsiveWidth(2.5),
    },
    selectedRadio: {
        backgroundColor: '#11696A',
    },
    radioText: {
        fontSize: responsiveFontSize(2),
    },
    errorMessage: {
        color: 'red',
        paddingBottom: responsiveHeight(0.3125),
        textAlign: 'center',
    },
    payNow: {
        paddingTop: responsiveHeight(0.625),
    },
    //service modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // semi-transparent background
    },
    modalContent: {
        width: responsiveWidth(85),
        height: responsiveHeight(70),
        backgroundColor: '#fff',
        borderRadius: responsiveWidth(2.5),
        padding: responsiveWidth(3.75),
        position: 'relative',
    },
    closeButton: {
        position: 'absolute',
        right: responsiveWidth(2),
        padding: responsiveWidth(2.5),
        top:5,
        zIndex:999
    },
    modalHeading: {
        fontSize: responsiveFontSize(2.5),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.25),
        textAlign: 'left',
        
    },
    scrollView: {
        flex: 1,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: responsiveHeight(1.875),
        paddingVertical: responsiveHeight(1.25),
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    serviceItemName: {
        flex: 1,
        marginRight: responsiveWidth(2.5),
    },
    serviceName: {
        fontSize: responsiveFontSize(2),
        fontWeight: '500',
    },
    servicePrice: {
        fontSize: responsiveFontSize(1.75),
        color: '#888',
    },
    quantity: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: responsiveWidth(0.9375),
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 5,
        color: '#007bff',
        textAlign: 'center',
        width: responsiveWidth(7.5),
        height: responsiveWidth(7.5),
        lineHeight: responsiveWidth(7.5),
    },
    quantityText: {
        marginHorizontal: responsiveWidth(2.5),
        fontSize: responsiveFontSize(2),
    },
});

export default Service;
