import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Image, Dimensions, StyleSheet, TouchableOpacity, Text, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
const { width } = Dimensions.get('window');

const images = [
    { id: '1', image: require("../../assets/image/banner 1.png") },
    { id: '2', image: require("../../assets/image/banner 2.png") },
    { id: '3', image: require("../../assets/image/banner 2-1.png") },
];

const CarouselScreen = () => {
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
        // flex: 1,
        // justifyContent: 'center',
        marginTop: Platform.OS == 'ios' ? 50 : 30
    },
    imageContainer: {
        width,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '88%',
        height: Platform.OS == 'ios' ? 430 : 400,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 25,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    activeIndicator: {
        backgroundColor: '#000',
    },
    inactiveIndicator: {
        backgroundColor: '#ccc',
    },
    button: {
        backgroundColor: '#11696a',
        paddingVertical: 15,
        marginHorizontal: 28,
        borderRadius: 5,
        marginTop: Platform.OS == 'ios' ? 40 : 33
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

export default CarouselScreen;
