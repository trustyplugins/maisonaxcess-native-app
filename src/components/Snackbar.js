import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

const Snackbar = ({ visible, message, onDismiss }) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View style={styles.container}>
        <View style={styles.snackbar}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity onPress={onDismiss} style={styles.dismissButton}>
            <Text style={styles.dismissButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
   
  },
  snackbar: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:45,
  },
  message: {
    flex: 1,
    fontSize: 16,
    color: 'black',
  },
  dismissButton: {
    marginLeft: 10,
  },
  dismissButtonText: {
    color: 'blue',
    fontSize: 16,
  },
});

export default Snackbar;
