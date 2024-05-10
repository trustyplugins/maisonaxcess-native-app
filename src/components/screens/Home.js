import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
// import { StackNavigationProp } from "@react-navigation/stack";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { RouteProp } from "@react-navigation/native";
import axios from "axios";
const Home = ({ navigation }) => {
    useEffect(() => {
        const fetchData = async () => {
            // try {
            //     const response = await axios.get('https://maisonaxcess.com/api/users');
            //     console.log(response.data);
            // } catch (error) {
            //     console.error('Error fetching data:', error);
            // }
        };

        fetchData();
    }, []);

    const handleClearStorage = async () => {
        try {
            await AsyncStorage.removeItem('userData');
            console.log('User data removed from local storage');
            console.log(route.params, route)
            route.params.onHomeSuccess();
            navigation.navigate('Login');
        } catch (error) {
            console.error('Error removing user data from local storage:', error);
        }
    };
    return (
        <View>
            <Text>Home Page</Text>
            <TouchableOpacity onPress={() => navigation.navigate('About')}>
                <Text>Go to About</Text>
            </TouchableOpacity>
            <Button title="Logout" onPress={handleClearStorage} />
        </View>
    );
}

export default Home;
