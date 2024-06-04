import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, useWindowDimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import HTML from 'react-native-render-html';
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
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'left',
        color: '#000',
        paddingLeft: 10
    },
    errorMessage: {
        color: 'red',
        fontSize: 20
    },
});

export default UserCategory;
