import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HTML from 'react-native-render-html';
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const UserCategory = ({ data }) => {
    const navigation = useNavigation();
    const { width: contentWidth } = useWindowDimensions();

    const handlePress = async (id) => {
        if (data?.article) {
            navigation.navigate("service", { userid: `${data}`, service_provider_id: `${id}` });
        }
    };

    return (<>
        <Text style={styles.heading}>Détails de l'utilisateur</Text>
        {data.users?.length > 0 ? data.users.map((item, index) => {
            return (
                <View key={index}>
                    <TouchableOpacity onPress={() => handlePress(item.id)} >
                        <View style={styles.card}>
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: item?.profile_photo_url }} style={styles.image} />
                            </View>
                            <View style={styles.textContainer}>
                                <HTML source={{ html: item?.description }} contentWidth={contentWidth} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
            )
        }) : <Text style={styles.errorMessage}>Aucune donnée disponible !</Text>}
    </>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: responsiveWidth(2.5),
        borderWidth: 1,
        borderColor: '#ddd',
        margin: responsiveWidth(2.5),
        padding: responsiveWidth(2.5),
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: responsiveHeight(0.25),
        },
    },
    imageContainer: {
        borderRadius: responsiveWidth(2.5),
        overflow: 'hidden',
    },
    heading: {
        fontSize: responsiveFontSize(2.5),
        marginBottom: responsiveHeight(1.5),
        marginTop: responsiveHeight(1.25),
        fontWeight: '600',  // 'semibold' is not a valid value, using '600' instead
        textAlign: "center",
        textDecorationLine: 'underline',
    },
    image: {
        width: '100%',
        height: responsiveHeight(18.75),
        borderRadius: responsiveWidth(2.5),
    },
    textContainer: {
        marginTop: responsiveHeight(0.875),
    },
    description: {
        fontSize: responsiveFontSize(1.875),
        fontWeight: '500',
        textAlign: 'left',
        color: '#000',
        paddingLeft: responsiveWidth(2.5),
    },
    errorMessage: {
        color: 'red',
        fontSize: responsiveFontSize(2.5),
    },
});

export default UserCategory;
