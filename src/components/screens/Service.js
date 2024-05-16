import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, Platform, TextInput, ScrollView, Modal } from 'react-native';
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
const Service = () => {
    const route = useRoute();
    const { userid } = route.params;
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
    const [modalVisible, setModalVisible] = useState(false);
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
    const toggleService = (id) => {
        if (serviceList.includes(id)) {
            let aserviceList = serviceList.filter(ele => ele != id);
            setServiceList([...aserviceList]);
        } else {
            setServiceList([...serviceList, id]);
        }

    };

    const showDatepicker = () => {
        setShow(true);
    };

    const handleChange = (field, value) => {
        setCustomerAddress({
            ...customerAddress,
            [field]: value
        });
    };
    const bookAppointment = () => {
        console.log(customerAddress)
    }
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
                                <Text style={styles.dateLabelText}>$0.0</Text>
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
                                style={styles.customerInput}
                                placeholder="Card Number"
                                value={formatCardNumber(customerAddress.card_number)}
                                onChangeText={(value) => handleChange('card_number', value)}
                                keyboardType="numeric"
                                maxLength={19}
                                onPress={resetError}
                            />
                            <Text style={styles.customerLabel}>Expiry</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="MM/YY"
                                value={formatExpiry(customerAddress.expiry)}
                                onChangeText={(value) => handleChange('expiry', value)}
                                keyboardType="numeric"
                                maxLength={5}
                                onPress={resetError}
                            />
                            <Text style={styles.customerLabel}>CVV</Text>
                            <TextInput
                                style={styles.customerInput}
                                placeholder="CVV Number"
                                value={formatCVV(customerAddress.cvv_number)}
                                onChangeText={(value) => handleChange('cvv_number', value)}
                                keyboardType="numeric"
                                maxLength={3}
                                onPress={resetError}
                            />
                        </View>
                        {error && <Text style={styles.errorMessage}>{showError ? showError : "Please fill the above details"}</Text>}

                        <View >
                            <CustomButton title="Book Appointment" onPress={bookAppointment} />
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
                                        <TouchableOpacity onPress={(e) => toggleService(id)}>
                                            <Text style={styles.toggleButton}>{serviceList.includes(id) ? 'ON' : 'OFF'}</Text>
                                        </TouchableOpacity>
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
        gap: 2
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
});

export default Service;
