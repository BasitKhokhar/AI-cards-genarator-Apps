import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PaymentSelectionScreen({ navigation, route }) {
  const { gameTypeId } = route.params;
  console.log("gametypeid in paymentscreen", gameTypeId);

  const handleSelectPayment = (paymentMethod) => {
    navigation.navigate(
      paymentMethod === 'jazzcash' ? 'jazzcashscreenScreen' : 'easypaisaScreen',
      { gameTypeId }
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Select Payment Method</Text>

      <TouchableOpacity
        style={[styles.button, styles.jazzcashButton]}
        onPress={() => handleSelectPayment('jazzcash')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>JazzCash</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.easypaisaButton]}
        onPress={() => handleSelectPayment('easypaisa')}
        activeOpacity={0.85}
      >
        <Text style={styles.buttonText}>Easypaisa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#0d0d0d', // same dark background as notifications
  },
  heading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#ff3d9b',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: '#8b3dff',
    textShadowRadius: 10,
    textTransform: 'uppercase',
  },
  button: {
    paddingVertical: 18,
    borderRadius: 14,
    marginBottom: 25,
    alignItems: 'center',
    borderWidth: 1,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  jazzcashButton: {
    backgroundColor: '#141414',
    borderColor: 'rgba(255, 61, 155, 0.5)',
    shadowColor: '#ff3d9b',
  },
  easypaisaButton: {
    backgroundColor: '#141414',
    borderColor: 'rgba(139, 61, 255, 0.5)',
    shadowColor: '#8b3dff',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowRadius: 4,
  },
});
