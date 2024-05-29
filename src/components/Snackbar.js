import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const Snackbar = ({ visible, message, onDismiss }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.snackbar}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <MaterialIcons name="close" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  snackbar: {
    backgroundColor: '#323232',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 30,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 10, // For Android
    shadowColor: '#000', // For iOS
    shadowOffset: { width: 0, height: 2 }, // For iOS
    shadowOpacity: 0.8, // For iOS
    shadowRadius: 4, // For iOS
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: 'white',
  },
  dismissButton: {
    marginLeft: 10,
  },
});

export default Snackbar;
