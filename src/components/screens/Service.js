import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Platform, TextInput, ScrollView, Modal, Switch } from 'react-native';
import { useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
import axios from "axios";
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import formatDate from '../../utils/formatDate';
import parseFromHtml from '../../utils/parseHtml';
import { FontAwesome } from '@expo/vector-icons';
import Snackbar from '../Snackbar';
import CustomButton from '../common/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
const Service = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { userid, service_provider_id } = route.params;
    const userData = useSelector(state => state.user.user);
    const userCredential = useSelector(state => state.user.credentials);
    const [service, setService] = useState([]);
    const [loading, setLoading] = useState(false);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);
    const [selectedDate, setSelectedDate] = useState('dd-mm-yyyy');
    const [appointmentDates, setAppointmentDates] = useState([]);
    const [snackbarVisible, setSnackbarVisible] = useState(false);
    const [showError, setShowError] = useState('');
    const [error, setError] = useState(false);
    const [serviceList, setServiceList] = useState([]);
    const [modalVisible, setModalVisible] = useState(true);
    const [totalPrice, setTotalPrice] = useState(0);
    const [customerAddress, setCustomerAddress] = useState({
        name: '',
        email: userCredential.email || '',
        phone: '',
        state: '',
        country: '',
        postalCode: '',
        address: '',
        card_number: '',
        expiry: '',
        cvv_number: ''
    });
    useEffect(() => {
        const getAppointments = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/appointments/${userid}`, {
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
    }, [userid])

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${API_BASE_URL}/services/${userid}`, {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`
                    },
                });
                setService(response.data.services);
                setLoading(false);
            } catch (error) {
                setLoading(false);
                setService([])
            } finally {
                setLoading(false);
            }
        })();
    }, [userid])
    
    const ReverseDate = (dateString) => {
        const [year, month, day] = dateString.split(' ')[0].split('-');
        return `${year}-${month}-${day}`;
    };


    const onChange = (event, selectedDate) => {
        let currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        let formattedDate = formatDate(currentDate);
        if (appointmentDates?.length > 0) {
            appointmentDates.forEach(ele => {
                if (ele.date == formattedDate) {
                    setSnackbarVisible(true);
                    formattedDate = 'dd-mm-yyyy';
                }
            })
        }
        setSelectedDate(formattedDate);
    };
    const toggleService = (item) => {
        let listItem = {
            title: item.name,
            price: item.price,
            quantity: '1'
        }
        let isItemPresent = serviceList.some((ele) => ele.title == item.name);
        if (isItemPresent) {
            let aserviceList = serviceList.filter(ele => ele.title != item.name);
            setServiceList([...aserviceList]);
        } else {
            setServiceList([...serviceList, listItem]);
        }

    };
    const bookAppointment = async () => {
        const bookData = {
            service_provider_id: service_provider_id,
            name: customerAddress.name,
            email: customerAddress.email,
            phone: customerAddress.phone,
            state: customerAddress.state,
            country: customerAddress.country,
            postalCode: customerAddress.postalCode,
            address: customerAddress.address,
            services_detail: serviceList,
            payment_info: "cod",
            appointment_date: ReverseDate(selectedDate),
            total_price: totalPrice
            // card_number: customerAddress.card_number,
            // expiry: customerAddress.expiry,
            // cvv_number: customerAddress.cvv_number,
        }
        try {
            const response = await axios.post(`${API_BASE_URL}/orders`, bookData, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userData?.token}`
                }
            });
            navigation.navigate('order-success', { orderId: response.data.orderid });
            // console.error('response:', response.data);
            // setModalMessage(response.data.message);
            // showSnackbar();
        } catch (error) {
            // console.error('Error:', error.response);
            if (error.response) {
                console.log('Response data:', error.response.data);
                // setShowError(error.response.data.message);
                // setError(true);
            }
        }
        // console.log(customerAddress)
    }

    const showDatepicker = () => {
        setShow(true);
    };

    const handleChange = (field, value) => {
        setCustomerAddress({
            ...customerAddress,
            [field]: value
        });
    };

    const formatCardNumber = (value) => {
        return value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    };

    const formatExpiry = (value) => {
        return value.replace(/[^0-9]/g, '').replace(/(\d{2})(\d{2})/, '$1/$2').trim();
    };

    const formatCVV = (value) => {
        return value.replace(/[^0-9]/g, '').slice(0, 3);
    };
    const resetError = () => {
        setError(false)
    }
    const toggleModal = () => {
        setModalVisible(!modalVisible);
    };
    const incrementQuantity = (title) => {
        setServiceList(serviceList.map(service =>
            service.title === title ? { ...service, quantity: `${parseInt(service.quantity) + 1}` } : service
        ));
    };

    const decrementQuantity = (title) => {
        setServiceList(serviceList.map(service =>
            service.title === title && service.quantity > 0 ? { ...service, quantity: service.quantity === '1' ? '1' : `${parseInt(service.quantity) - 1}` } : service
        ));
    };
    const calTotalOrder = () => {
        if (serviceList.length > 0) {
            return serviceList.reduce((total, item) => total + parseFloat(item.price) * parseInt(item.quantity), 0);
        }
    };
    const totalOrderMemoized = useMemo(calTotalOrder, [serviceList]);

    if (loading) {
        return (<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }
    return (<ScrollView>
        <Snackbar
            visible={snackbarVisible}
            message="This date is already booked!"
            onDismiss={() => setSnackbarVisible(false)}
        />
        {service?.length > 0 && service.map((item, index) => {
            return (
                <View key={index}>
                    <View style={styles.card}>
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: `https://maisonaxcess.com/${item.image}` }} style={styles.image} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.title}> {item?.title} </Text>
                        </View>
                        <Text style={styles.contentText}>{parseFromHtml(item.content)}</Text>
                        <TouchableOpacity onPress={toggleModal} style={styles.servicesContainer}>
                            <Text style={styles.servicesText}>Add Services</Text>
                            {
                                serviceList?.length > 0 && serviceList.map((serviceItem, id) => (
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
                        </TouchableOpacity>
                        <View style={styles.dateSection}>
                            <View>
                                <Text style={styles.dateLabelText}>Select Appointment Date:</Text>
                                <View style={styles.dateContainer}>
                                    <Text style={styles.dateText}>{selectedDate}</Text>
                                    <TouchableOpacity onPress={showDatepicker}>
                                        <FontAwesome name="calendar" size={20} color="black" />
                                    </TouchableOpacity>
                                    {show && (
                                        <DateTimePicker
                                            testID="dateTimePicker"
                                            value={date}
                                            mode="date"
                                            display="default"
                                            onChange={onChange}
                                            minimumDate={new Date()}
                                        />
                                    )}
                                </View>
                            </View>
                            <View>
                                <Text style={styles.dateLabelText}>Total Order:</Text>
                                <Text style={styles.dateLabelText}>${totalOrderMemoized || 0.0}</Text>
                            </View>
                        </View>
                        <View style={styles.customerFormContainer}>
                            <Text style={styles.customerHeading}>Customer Address</Text>
                            <Text style={styles.customerLabel}>Name</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="Name"
                                value={customerAddress.name}
                                onChangeText={(value) => handleChange('name', value)}
                            />
                            <Text style={styles.customerLabel}>Email</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="Email"
                                value={customerAddress.email}
                                onChangeText={(value) => handleChange('email', value)}
                                keyboardType="email-address"
                                editable={false}
                            />
                            <Text style={styles.customerLabel}>Phone</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="Phone"
                                value={customerAddress.phone}
                                onChangeText={(value) => handleChange('phone', value)}
                                keyboardType="phone-pad"
                            />
                            <Text style={styles.customerLabel}>State</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="State"
                                value={customerAddress.state}
                                onChangeText={(value) => handleChange('state', value)}
                                onPress={resetError}
                            />
                            <Text style={styles.customerLabel}>Country</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="Country"
                                value={customerAddress.country}
                                onChangeText={(value) => handleChange('country', value)}
                                onPress={resetError}
                            />
                            <Text style={styles.customerLabel}>Postal Code</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="Postal Code"
                                value={customerAddress.postalCode}
                                onChangeText={(value) => handleChange('postalCode', value)}
                                keyboardType="numeric"
                                onPress={resetError}
                            />
                            <Text style={styles.customerLabel}>Address</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="Address"
                                value={customerAddress.address}
                                onChangeText={(value) => handleChange('address', value)}
                                multiline
                                onPress={resetError}
                            />
                            <Text style={styles.customerLabel}>Payment Method</Text>
                            <TextInput
                                style={styles.customerInputCard}
                                placeholder="Card Number"
                                value={formatCardNumber(customerAddress.card_number)}
                                onChangeText={(value) => handleChange('card_number', value)}
                                keyboardType="numeric"
                                maxLength={19}
                                onPress={resetError}
                            />

                            <View style={styles.accInfo}>
                                <View >
                                    <Text style={styles.customerLabel}>Expiry</Text>
                                    <TextInput
                                        style={styles.customerInputCard}
                                        placeholder="MM/YY"
                                        value={formatExpiry(customerAddress.expiry)}
                                        onChangeText={(value) => handleChange('expiry', value)}
                                        keyboardType="numeric"
                                        maxLength={5}
                                        onPress={resetError}
                                    />
                                </View>
                                <View >
                                    <Text style={styles.customerLabel}>CVV</Text>
                                    <TextInput
                                        style={styles.customerInputCard}
                                        placeholder="CVV Number"
                                        value={formatCVV(customerAddress.cvv_number)}
                                        onChangeText={(value) => handleChange('cvv_number', value)}
                                        keyboardType="numeric"
                                        maxLength={3}
                                        onPress={resetError}
                                    />
                                </View>
                            </View>
                        </View>
                        {error && <Text style={styles.errorMessage}>{showError ? showError : "Please fill the above details"}</Text>}

                        <View >
                            <CustomButton title="Pay Now" onPress={bookAppointment} />
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
                                <Text style={styles.modalHeading}>Services</Text>
                                {item.services.map((service, id) => (
                                    <View key={id} style={styles.serviceItem}>
                                        <View style={styles.serviceItemName}>
                                            <Text>{service.name}</Text>
                                            <Text>{service.price}</Text>
                                        </View>
                                        <Switch
                                            value={serviceList.some((ele) => ele.title == service?.name)}
                                            onValueChange={() => toggleService(service)}
                                        />
                                    </View>
                                ))}
                                <TouchableOpacity onPress={toggleModal}>
                                    <Text style={styles.closeButton}>Close</Text>
                                </TouchableOpacity>
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
    image: {
        width: '100%',
        height: 150,
        borderRadius: 10,
    },
    textContainer: {
        marginTop: 7
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#116969',
        marginTop: 5
    },
    contentText: {
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
    },
    servicesContainer: {
        marginVertical: 10,
    },
    servicesText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#007BFF',
    },
    dateSection: {
        marginVertical: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dateLabelText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateText: {
        fontSize: 16,
        marginRight: 10,
    },
    //customer form
    customerFormContainer: {
        padding: 10,
    },
    customerHeading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    customerLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    customerInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    customerInputCard: {
        height: 40,
        border: 'none',
        marginBottom: 10,
        borderBottomWidth: 2,
        borderColor: 'gray',
    },
    accInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    customerCheckboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    errorMessage: {
        color: 'red'
    },
    //service modal
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 5,
        width: '90%',
    },
    modalHeading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    serviceItemName: {
        flexDirection: 'row',
        gap: 4,
        width: '50%'
    },
    toggleButton: {
        borderWidth: 1,
        borderColor: '#007bff',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
        color: '#007bff',
    },
    closeButton: {
        color: '#007bff',
        textAlign: 'center',
        marginTop: 20,
    },
    //quantity
    quantity: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    quantityButton: {
        padding: 3,
        borderWidth: 1,
        borderColor: '#007bff',
        borderRadius: 5,
        color: '#007bff',
        textAlign: 'center',
        width: 30,
        height: 30,
        lineHeight: 30,
    },
    quantityText: {
        marginHorizontal: 10,
        fontSize: 16,
    },
});

export default Service;
