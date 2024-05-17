// Footer.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Footer = () => {
  return (
    <View style={styles.footer}>
      <Text style={styles.footerText}>Maison Axcess © 2023. All Rights Reserved</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 13,
    backgroundColor: '#11696a',
    borderTopWidth: 1,
    borderTopColor: '#e7e7e7',
  },
  footerText: {
    fontSize: 12,
    color: '#fff',
    fontWeight:'bold'
  },
});

export default Footer;
