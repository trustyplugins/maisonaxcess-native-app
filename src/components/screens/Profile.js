import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Keyboard, Platform } from "react-native";
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import { API_BASE_URL } from '@env';
import { Formik } from 'formik';
import * as Yup from 'yup';
import CustomButton from "../common/CustomButton";
import Snackbar from '../Snackbar';


const Profile = ({ navigation }) => {
  const userDetails = useSelector(state => state.user.userDetails);
  const userData = useSelector(state => state.user.user);
  const dispatch = useDispatch();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const profileValidationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    phone: Yup.string().required('Phone number is required'),
  });

  const passwordValidationSchema = Yup.object().shape({
    curr: Yup.string().required('Current password is required'),
    newPassword: Yup.string().required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // Keyboard is visible
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // Keyboard is hidden
      }
    );

    // Cleanup listeners on component unmount
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const handleUpdate = async (values, { setErrors, setStatus }) => {
    const data = {
      name: values.name,
      email: userDetails.email,
      phone_number: values.phone,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userDetails.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        }
      });
      setModalMessage(response.data.message);
      dispatch({ type: 'SIGNUP', payload: response.data.user });
      showSnackbar();
    } catch (error) {
      if (error.response) {
        setStatus(error.response.data.message);
        setErrors(error.response.data.errors || {});
      }
    }
  };
  const handleUpdatePassword = async (values, { setErrors, setStatus }) => {
    const data = {
      name: userDetails.name,
      email: userDetails.email,
      password: values.curr,
      phone_number: userDetails.phone_number,
    };

    try {
      const response = await axios.put(`${API_BASE_URL}/users/${userDetails.id}`, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.token}`,
        }
      });
      setModalMessage(response.data.message);
      dispatch({ type: 'SIGNUP', payload: response.data.user });
      showSnackbar();
    } catch (error) {
      if (error.response) {
        setStatus(error.response.data.message);
        setErrors(error.response.data.errors || {});
      }
    }
  };

  const showSnackbar = () => {
    setSnackbarVisible(true);
    setTimeout(() => {
      setSnackbarVisible(false);
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
        <View style={Platform.OS == 'ios' && isKeyboardVisible ? styles.containerKeyboard : styles.container}>
          <Formik
            initialValues={{
              name: userDetails.name || '',
              phone: userDetails.phone_number || ''
            }}
            validationSchema={profileValidationSchema}
            onSubmit={handleUpdate}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, status }) => (
              <View style={styles.container1}>
                <Text style={styles.heading}>Informations sur le profil</Text>
                <Text style={styles.subHeading}>Mettez à jour les informations de profil et l'adresse e-mail de votre compte.</Text>
                <Text style={styles.label}>Nom</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nom"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                {errors.name && touched.name && (
                  <Text style={styles.errorMessage}>{errors.name}</Text>
                )}
                <Text style={styles.label}>E-mail</Text>
                <TextInput
                  style={styles.input}
                  placeholder="E-mail"
                  value={userDetails.email}
                  editable={false}
                />
                <Text style={styles.label}>Numéro de téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Numéro de téléphone"
                  onChangeText={handleChange('phone')}
                  onBlur={handleBlur('phone')}
                  value={values.phone}
                />
                {errors.phone && touched.phone && (
                  <Text style={styles.errorMessage}>{errors.phone}</Text>
                )}
                {status && (
                  <Text style={styles.errorMessage}>{status}</Text>
                )}
                <CustomButton title="Sauvegarder" onPress={handleSubmit} />
              </View>
            )}
          </Formik>
          <Formik
            initialValues={{
              curr: '',
              newPassword: '',
              confirmPassword: ''
            }}
            validationSchema={passwordValidationSchema}
            onSubmit={handleUpdatePassword}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, status }) => (
              <View style={styles.container2}>
                <Text style={styles.heading}>Mettre à jour le mot de passe</Text>
                <Text style={styles.subHeading}>Assurez-vous que votre compte utilise un mot de passe long et aléatoire pour rester en sécurité.</Text>
                <Text style={styles.label}>Mot de passe actuel</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe actuel"
                  secureTextEntry
                  onChangeText={handleChange('curr')}
                  onBlur={handleBlur('curr')}
                  value={values.curr}
                />
                {errors.curr && touched.curr && (
                  <Text style={styles.errorMessage}>{errors.curr}</Text>
                )}
                <Text style={styles.label}>nouveau mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="nouveau mot de passe"
                  secureTextEntry
                  onChangeText={handleChange('newPassword')}
                  onBlur={handleBlur('newPassword')}
                  value={values.newPassword}
                />
                {errors.newPassword && touched.newPassword && (
                  <Text style={styles.errorMessage}>{errors.newPassword}</Text>
                )}
                <Text style={styles.label}>Confirmez le mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmez le mot de passe"
                  secureTextEntry
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                />
                {errors.confirmPassword && touched.confirmPassword && (
                  <Text style={styles.errorMessage}>{errors.confirmPassword}</Text>
                )}
                {status && (
                  <Text style={styles.errorMessage}>{status}</Text>
                )}
                <CustomButton title="Sauvegarder" onPress={handleSubmit} />
              </View>
            )}
          </Formik>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  containerKeyboard: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 250
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    marginBottom: 0
  },
  container1: {
    marginTop: 10,
  },
  container2: {
    marginVertical: 30,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    color: '#11696a',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  subHeading: {
    fontSize: 18,
    marginBottom: 20,
    color: '#000',
    fontWeight: '450',
  },
  input: {
    width: "100%",
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 14,
    padding: 10,
    backgroundColor: '#fff',
    color: 'gray',
  },
  errorMessage: {
    color: 'red',
    paddingBottom: 10
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
    fontWeight: '500',
  },
  checkboxContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 18,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 25,
  },
  actionButtonText: {
    color: "#11696A",
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default Profile;
