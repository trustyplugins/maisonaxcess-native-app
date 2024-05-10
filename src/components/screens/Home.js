import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Button } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { useDispatch } from 'react-redux';
const Home = ({ navigation }) => {
    const dispatch = useDispatch();
    const handleClearStorage = () => {
            dispatch({ type: 'LOGIN', payload: null });
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
