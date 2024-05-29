import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Dimensions, ImageBackground, Image, TouchableOpacity, ScrollView } from "react-native";
import CheckBox from 'expo-checkbox';
import CustomButton from "../common/CustomButton";
import axios from "axios";
import Snackbar from '../Snackbar';
import { useDispatch, useSelector } from 'react-redux';
import { API_BASE_URL } from '@env';
const Profile = ({ navigation }) => {
  const userDetails = useSelector(state => state.user.userDetails);
  const dispatch = useDispatch();
  const [name, setName] = useState(userDetails.name || '');
  const [phone, setPhone] = useState(userDetails.phone_number || "");
  const [email, setEmail] = useState(userDetails.email || "");
  const [curr, setCurr] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [showError, setShowError] = useState('');
  console.log(userDetails)
  const handleUpdate = async () => {
    if (!email || !password || !name || !phone) {
      setError(true);
      return;
    }

    const data = {
      name: name,
      email: email,
      password: password,
      phone_number: phone
    }
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${userDetails.id}`, data, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      setModalMessage(response.data.message);
      dispatch({ type: 'SIGNUP', payload: response.data.user });
      showSnackbar();
    } catch (error) {
      // console.error('Error:', error);
      if (error.response) {
        // console.log('Response data:', error.response.data);
        setShowError(error.response.data.message);
        setError(true);
      }
    }
  };

  const resetError = () => {
    setError(false)
  }
  const showSnackbar = () => {
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
      navigation.navigate('carousel');
    }, 2000);
  };

  return (
    <>
      <Snackbar
        visible={snackbarVisible}
        message={modalMessage}
        onDismiss={() => setSnackbarVisible(false)}
      />
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.container1}>
            <Text style={styles.heading}>Profile information</Text>
            <Text style={styles.subHeading}>Update your account profile information and email address.</Text>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={name}
              onChangeText={setName}
              onPress={resetError}
            />
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={false}
              onPress={resetError}
            />
            <Text style={styles.label}>Phone number</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              value={phone}
              onChangeText={setPhone}
              onPress={resetError}
            />
            {error && <Text style={styles.errorMessage}>{showError ? showError : "Please fill the above details"}</Text>}
            <CustomButton title="Sauvegarder" onPress={() => { handleUpdate }} />
          </View>
          <View style={styles.container2}>
            <Text style={styles.heading}>Update password</Text>
            <Text style={styles.subHeading}>Make sure your account uses a long, random password to stay safe.</Text>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={curr}
              onChangeText={setCurr}
              secureTextEntry
              onPress={resetError}
            />
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry
              onPress={resetError}
            />
            <Text style={styles.label}>Confirm the password</Text>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              onPress={resetError}
            />
            {error && <Text style={styles.errorMessage}>{showError ? showError : "Please fill the above details"}</Text>}
            <CustomButton title="Sauvegarder" onPress={() => { handleUpdate }} />
          </View>
        </View>
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15
  },
  container1: {
    marginTop: 10
  },
  container2: {
    marginTop: 30
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#11696a',
    fontWeight: 'bold',
    textDecorationLine: 'underline'
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    fontWeight: '450'
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    color: 'gray',
  },
  errorMessage: {
    color: 'red'
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
    fontWeight: '500',
  },
  labelRem: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500'
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10
  },
  actionButton: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 25
  },
  actionButtonText: {
    color: "#11696A",
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
