import React, { useEffect, useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, 
  StyleSheet, Alert, ActivityIndicator 
} from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function EasypaisaPaymentScreen({ route, navigation }) {
  const { gameTypeId } = route.params;
  const [token, setToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadToken = async () => {
      const storedToken = await SecureStore.getItemAsync('jwt_token');
      if (!storedToken) {
        Alert.alert('Error', 'User not logged in');
        navigation.goBack();
        return;
      }
      setToken(storedToken);
    };
    loadToken();
  }, []);

  const handlePayment = async () => {
    if (!amount || !phone) {
      Alert.alert('Validation', 'Please enter amount and phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('YOUR_BACKEND_API/easypaisa/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ gameTypeId, amount, phone }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('✅ Success', 'Payment initiated successfully!');
      } else {
        Alert.alert('❌ Error', data.message || 'Payment failed');
      }
    } catch (error) {
      Alert.alert('⚠️ Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#ff3d9b" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Easypaisa Payment</Text>

      <TextInput
        placeholder="Enter amount"
        placeholderTextColor="#888"
        keyboardType="numeric"
        style={styles.input}
        value={amount}
        onChangeText={setAmount}
      />

      <TextInput
        placeholder="Enter phone number"
        placeholderTextColor="#888"
        keyboardType="phone-pad"
        style={styles.input}
        value={phone}
        onChangeText={setPhone}
      />

      <TouchableOpacity 
        style={[styles.payButton, loading && { opacity: 0.7 }]} 
        onPress={handlePayment} 
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.payButtonText}>
          {loading ? 'Processing...' : 'Pay Now'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#0d0d0d' 
  },

  container: { 
    flex: 1, 
    padding: 24, 
    backgroundColor: '#0d0d0d', 
    justifyContent: 'center' 
  },

  heading: { 
    fontSize: 28, 
    fontWeight: '900', 
    color: '#ff3d9b', 
    textAlign: 'center', 
    marginBottom: 40,
    textShadowColor: '#8b3dff', 
    textShadowRadius: 12,
    textTransform: 'uppercase',
  },

  input: {
    backgroundColor: '#141414',
    borderWidth: 1,
    borderColor: 'rgba(139,61,255,0.4)',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    marginBottom: 22,
    shadowColor: '#8b3dff',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 5,
  },

  payButton: {
    backgroundColor: '#141414',
    borderWidth: 1.2,
    borderColor: 'rgba(255,61,155,0.6)',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    shadowColor: '#ff3d9b',
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },

  payButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    textShadowColor: 'rgba(255,255,255,0.3)',
    textShadowRadius: 4,
  },
});
