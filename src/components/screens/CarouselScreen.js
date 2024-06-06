import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
const { width } = Dimensions.get('window');
import {
    responsiveHeight,
    responsiveWidth,
    responsiveFontSize
} from "react-native-responsive-dimensions";
const images = [
    { id: '1', image: require("../../assets/image/banner 1.png") },
    { id: '2', image: require("../../assets/image/banner 2.png") },
    { id: '3', image: require("../../assets/image/banner 2-1.png") },
];

const CarouselScreen = () => {
    const userData = useSelector(state => state.user.user);
    useEffect(() => {
        if (!userData?.token) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'login' }],
            });
        }
    }, [])

    const [activeIndex, setActiveIndex] = useState(0);
    const flatListRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        const interval = setInterval(() => {
            const nextIndex = (activeIndex + 1) % images.length;
            setActiveIndex(nextIndex);
            flatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
        }, 3000);

        return () => clearInterval(interval);
    }, [activeIndex]);

    const renderItem = ({ item }) => (
        <View style={styles.imageContainer}>
            <Image source={item.image} style={styles.image} />
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                ref={flatListRef}
                data={images}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(event) => {
                    const index = Math.floor(event.nativeEvent.contentOffset.x / width);
                    setActiveIndex(index);
                }}
            />
            <View style={styles.indicatorContainer}>
                {images.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            index === activeIndex ? styles.activeIndicator : styles.inactiveIndicator,
                        ]}
                    />
                ))}
            </View>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('home')}>
                <Text style={styles.buttonText}>ACCEDEZ AUX SERVICES</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: Platform.OS === 'ios' ? responsiveHeight(6.25) : responsiveHeight(4),
    },
    imageContainer: {
        width: width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: responsiveWidth(92),
        height: Platform.OS === 'ios' ? responsiveHeight(53.75) : responsiveHeight(58),
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: responsiveHeight(3.125),
    },
    indicator: {
        width: responsiveWidth(2.5),
        height: responsiveWidth(2.5),
        borderRadius: responsiveWidth(1.25),
        marginHorizontal: responsiveWidth(1.25),
    },
    activeIndicator: {
        backgroundColor: '#000',
    },
    inactiveIndicator: {
        backgroundColor: '#ccc',
    },
    button: {
        backgroundColor: '#11696a',
        paddingVertical: responsiveHeight(1.875),
        marginHorizontal: responsiveWidth(7),
        borderRadius: 5,
        marginTop: Platform.OS === 'ios' ? responsiveHeight(5) : responsiveHeight(4.125),
    },
    buttonText: {
        color: '#fff',
        fontSize: responsiveFontSize(2),
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default CarouselScreen;
