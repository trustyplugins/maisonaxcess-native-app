import React from 'react';
import { Modal, Text, View, Button } from 'react-native';

function CustomModal({ visible, message, onClose }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={{ marginTop:50 }}>
        <View style={{ backgroundColor: 'white', padding: 20 }}>
          <Text style={{ color:'red' }}>{message}</Text>
          <Button title="Close" onPress={onClose} />
        </View>
      </View>
    </Modal>
  );
}

export default CustomModal;
