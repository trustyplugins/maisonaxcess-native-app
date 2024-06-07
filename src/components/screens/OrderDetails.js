import React from 'react'
import { View, Text, StyleSheet, ScrollView } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { useSelector } from 'react-redux';
import formatDate from '../../utils/formatDate';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const OrderDetails = () => {
    const route = useRoute();
    const { orderData } = route.params;

    const formatAppointmentDate = (dateString) => {
        return dateString?.split(' ')[0];
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.detailsContainer}>
                <Text style={styles.heading}>Détails de la commande({orderData?.order_number})</Text>
                <View style={styles.details}>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Numéro de commande :</Text>
                        <Text>{orderData?.order_number}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Fournisseur de services :</Text>
                        <Text>{orderData?.service_provider_name}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Date de réservation :</Text>
                        <Text>{formatAppointmentDate(orderData?.appointment_date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Adresse :</Text>
                        <Text>{orderData?.customer_address}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Numéro de téléphone :</Text>
                        <Text>{orderData?.phone_number}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Mode de paiement :</Text>
                        <Text>{orderData?.payment_info}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Statut de la commande :</Text>
                        <Text>{orderData?.status}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.label}>Date de réservation :</Text>
                        <Text>{formatDate(orderData?.created_at)}</Text>
                    </View>
                    <View >
                        <Text style={styles.tableHeading}>Prestations de service :</Text>
                        <View style={styles.tableRow}>
                            <Text style={[styles.tableCell, styles.tableHeader]}>Nom</Text>
                            <Text style={[styles.tableCell, styles.tableHeader]}>Quantité</Text>
                            <Text style={[styles.tableCell, styles.tableHeader]}>Prix</Text>
                        </View>
                        {orderData && JSON.parse(orderData.services_with_price)?.map((service, index) => (
                            <View key={index} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{service.name}</Text>
                                <Text style={styles.tableCell}>{service.quantity}</Text>
                                <Text style={styles.tableCell}>€{service.price}</Text>
                            </View>
                        ))}
                        <View style={styles.tableRow}>
                            <Text style={styles.tableCell}></Text>
                            <Text style={[styles.tableCell, styles.totalLabel]}>Total de la commande :</Text>
                            <Text style={[styles.tableCell, styles.totalValue]}>${orderData.total_price}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

export default OrderDetails;

const styles = StyleSheet.create({
    detailsContainer: {
        backgroundColor: '#fff',
        padding: responsiveWidth(2.5),
        borderRadius: responsiveWidth(2.5),
        elevation: 3,
        marginVertical: responsiveHeight(2.5),
        paddingVertical: responsiveHeight(2.5),
        paddingHorizontal: responsiveWidth(1.75),
        marginHorizontal: responsiveWidth(2.5),
    },
    details: {
        padding: responsiveWidth(2.5),
        marginVertical: responsiveHeight(1.25),
    },
    heading: {
        fontSize: responsiveFontSize(2.25),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.875),
        textAlign: 'center',
        color:'#11696A'
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: responsiveHeight(1.25),
    },
    label: {
        fontWeight: 'bold',
    },
    tableHeading: {
        fontSize: responsiveFontSize(2.25),
        fontWeight: 'bold',
        marginBottom: responsiveHeight(1.25),
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: responsiveHeight(1.25),
    },
    tableCell: {
        flex: 1,
        padding: responsiveWidth(1.25),
        textAlign: 'center',
    },
    tableHeader: {
        fontWeight: 'bold',
        backgroundColor: '#f5f5f5',
    },
    totalLabel: {
        fontWeight: 'bold',
    },
    totalValue: {
        fontWeight: 'bold',
    },
});