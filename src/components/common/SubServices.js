import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SubServices = ({ data, parentName }) => {
    const navigation = useNavigation();

    const handlePress = () => {
        navigation.navigate("service_types", { data });
    };

    return (
        <TouchableOpacity onPress={handlePress}>
            {(parentName != undefined) && (parentName == 'COORDONNERIE' || parentName == "LAVAGE AUTO-MOTO" || parentName == "Pressing et blanchisserie") ? <View style={styles.card}>
                <View style={styles.imageContainer}>
                    <ImageBackground source={{ uri: `https://maisonaxcess.com/${data.image}` }} style={styles.image} >
                        <View style={styles.overlay} />
                    </ImageBackground>
                </View>
                <View style={styles.textContainer}>
                    <Text style={styles.title}> {data.name}</Text>
                </View>
            </View> : 
                <View style={styles.card}>
                    <View style={styles.imageContainer}>
                        <ImageBackground source={{ uri: `https://maisonaxcess.com/${data.image}` }} style={styles.image} >
                            <View style={styles.overlay} />
                        </ImageBackground>
                    </View>
                </View>}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        // borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        // margin: 10,
        // padding: 10,
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
        // borderRadius: 10,
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
});

export default SubServices;
