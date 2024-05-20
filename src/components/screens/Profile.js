import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
const Profile = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Profile Information</Text>
      <Text style={styles.text}>Update your account's profile information and email address.</Text>
    </View>
  )
}

export default Profile;
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1,
    paddingHorizontal: 20
  },
  heading: {
    fontSize: 22,
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  text: {
    fontSize: 15,
    marginTop:5
  }
})