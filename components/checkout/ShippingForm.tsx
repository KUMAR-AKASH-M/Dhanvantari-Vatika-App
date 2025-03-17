import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView 
} from 'react-native';

interface ShippingFormProps {
  shippingInfo: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
  };
  handleInputChange: (field: string, value: string) => void;
  handleContinueToPayment: () => void;
  isDarkMode: boolean;
}

const ShippingForm = ({
  shippingInfo,
  handleInputChange,
  handleContinueToPayment,
  isDarkMode
}: ShippingFormProps) => {
  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Full Name</Text>
      <TextInput 
        style={[styles.input, isDarkMode && styles.darkInput]} 
        placeholder="Full Name"
        placeholderTextColor={isDarkMode ? "#777" : "#999"}
        value={shippingInfo.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />
      
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Email</Text>
      <TextInput 
        style={[styles.input, isDarkMode && styles.darkInput]} 
        placeholder="Email Address"
        placeholderTextColor={isDarkMode ? "#777" : "#999"}
        keyboardType="email-address"
        value={shippingInfo.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />
      
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Phone Number</Text>
      <TextInput 
        style={[styles.input, isDarkMode && styles.darkInput]} 
        placeholder="Phone Number"
        placeholderTextColor={isDarkMode ? "#777" : "#999"}
        keyboardType="phone-pad"
        value={shippingInfo.phone}
        onChangeText={(text) => handleInputChange('phone', text)}
      />
      
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Shipping Address</Text>
      <TextInput 
        style={[styles.input, isDarkMode && styles.darkInput]} 
        placeholder="Address Line"
        placeholderTextColor={isDarkMode ? "#777" : "#999"}
        value={shippingInfo.address}
        onChangeText={(text) => handleInputChange('address', text)}
      />
      
      <View style={styles.rowInputs}>
        <View style={styles.halfInput}>
          <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>City</Text>
          <TextInput 
            style={[styles.input, isDarkMode && styles.darkInput]} 
            placeholder="City"
            placeholderTextColor={isDarkMode ? "#777" : "#999"}
            value={shippingInfo.city}
            onChangeText={(text) => handleInputChange('city', text)}
          />
        </View>
        <View style={styles.halfInput}>
          <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>State</Text>
          <TextInput 
            style={[styles.input, isDarkMode && styles.darkInput]} 
            placeholder="State"
            placeholderTextColor={isDarkMode ? "#777" : "#999"}
            value={shippingInfo.state}
            onChangeText={(text) => handleInputChange('state', text)}
          />
        </View>
      </View>
      
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Zip Code</Text>
      <TextInput 
        style={[styles.input, isDarkMode && styles.darkInput]} 
        placeholder="Zip Code"
        placeholderTextColor={isDarkMode ? "#777" : "#999"}
        keyboardType="number-pad"
        value={shippingInfo.zipCode}
        onChangeText={(text) => handleInputChange('zipCode', text)}
      />
      
      <TouchableOpacity 
        style={styles.continueButton}
        onPress={handleContinueToPayment}
      >
        <Text style={styles.continueButtonText}>Continue to Payment</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    fontSize: 15,
    color: '#333',
  },
  darkInput: {
    backgroundColor: '#2a2a2a',
    borderColor: '#444',
    color: '#f0f0f0',
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  continueButton: {
    backgroundColor: '#3e7d32',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    marginTop: 30,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#f0f0f0',
  },
});

export default ShippingForm;
