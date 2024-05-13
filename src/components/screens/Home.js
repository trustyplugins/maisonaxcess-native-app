import React, { useEffect,useState } from "react";
import { View, Text, TouchableOpacity, Button, StyleSheet, ScrollView,ActivityIndicator } from "react-native";
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import Header from "../Header";
import { SafeAreaView } from 'react-native';
import Card from "../common/Card";
import axios from "axios";
const Home = ({ navigation }) => {
    const userData = useSelector(state => state.user.user);
    const [serviceType,setServiceType]=useState([]);
    const [loading,setLoading]=useState(false);
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const response = await axios.get('https://maisonaxcess.com/api/servicetypes', {
                    headers: {
                        Authorization: `Bearer ${userData?.token}`,
                    },
                });
                setServiceType(response.data.servicetypes);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        })()

    }, [userData?.token])
    const dispatch = useDispatch();
    if(loading){
        return(<View style={styles.loader}><ActivityIndicator size="large" color="#0000ff" /></View>)
    }
    return (
        <SafeAreaView>
            <ScrollView>
                <View style={styles.container}>
                    <Header navigation={navigation} />
                    <Text style={styles.heading}>Service Types</Text>
                    {serviceType?.length > 0 ? serviceType?.map((item,index)=>(
                        <Card data={item} id={index}/>
                    ))
                : <Text style={styles.errorMessage}>No Data Found !</Text>}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Home;

const styles = StyleSheet.create({
    container: {
        marginTop: 40,
        paddingHorizontal: 10,
    },
    heading: {
        fontSize: 20,
        marginBottom: 12,
        marginTop:10,
        fontWeight:'semibold',
        textAlign:"center",
        textDecorationLine:'underline'
    },
    errorMessage: {
        color: 'red',
        fontSize:20
    },
    loader:{
        marginTop:25,
    }
})