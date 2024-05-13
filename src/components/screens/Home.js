import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Button,StyleSheet } from "react-native";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Header from "../Header";
import { SafeAreaView } from 'react-native';
const Home = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    useEffect(() => {
        if (userData == null || undefined) {
            navigation.navigate('Login');
        }
    }, [])
    const dispatch = useDispatch();

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Header navigation={navigation}/>
                <Text>Home Page</Text>
            </View>
        </SafeAreaView>
    );
}

export default Home;

const styles = StyleSheet.create({
    container:{
        marginTop:40,
        paddingHorizontal: 10,
    }
})