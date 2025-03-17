import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  TextInput,
  ActivityIndicator 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CardField } from '@stripe/stripe-react-native';

interface PaymentFormProps {
  cartItems: any[];
  cartTotal: string;
  setCardDetails: (details: any) => void;
  handleBackToShipping: () => void;
  handlePayment: () => void;
  isProcessing: boolean;
  isDarkMode: boolean;
}

const PaymentForm = ({
  cartItems,
  cartTotal,
  setCardDetails,
  handleBackToShipping,
  handlePayment,
  isProcessing,
  isDarkMode
}: PaymentFormProps) => {
  return (
    <ScrollView contentContainerStyle={styles.formContainer}>
      <View style={[styles.orderSummary, isDarkMode && styles.darkOrderSummary]}>
        <Text style={[styles.orderSummaryTitle, isDarkMode && styles.darkText]}>Order Summary</Text>
        <View style={styles.orderSummaryRow}>
          <Text style={[styles.orderSummaryText, isDarkMode && styles.darkText]}>
            {cartItems.length} items
          </Text>
          <Text style={[styles.orderSummaryText, isDarkMode && styles.darkText]}>
            {cartTotal}
          </Text>
        </View>
      </View>
      
      <View style={styles.paymentHeader}>
        <Text style={[styles.paymentTitle, isDarkMode && styles.darkText]}>Payment Details</Text>
        <View style={styles.securePaymentInfo}>
          <Ionicons name="lock-closed" size={14} color={isDarkMode ? "#8bc34a" : "#3e7d32"} />
          <Text style={[styles.securePaymentText, isDarkMode && { color: "#8bc34a" }]}>
            Secure Payment
          </Text>
        </View>
      </View>
      
      <View style={[styles.paymentMethods, isDarkMode && styles.darkPaymentMethods]}>
        <View style={styles.paymentLogos}>
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/196/196578.png' }} 
            style={styles.paymentLogo} 
          />
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/196/196565.png' }} 
            style={styles.paymentLogo} 
          />
          <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/196/196581.png' }} 
            style={styles.paymentLogo} 
          />
        </View>
      </View>
      
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Card Information</Text>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={{
          backgroundColor: isDarkMode ? '#2a2a2a' : '#f5f5f5',
          textColor: isDarkMode ? '#ffffff' : '#333333',
          borderWidth: 1,
          borderColor: isDarkMode ? '#444444' : '#e0e0e0',
          borderRadius: 8,
        }}
        style={{
          width: '100%',
          height: 50,
          marginVertical: 10,
        }}
        onCardChange={setCardDetails}
      />
      
      <Text style={[styles.testCardHint, isDarkMode && styles.darkMutedText]}>
        For testing, use: 4242 4242 4242 4242, any future expiry date, any CVC
      </Text>
      
      <Text style={[styles.formLabel, isDarkMode && styles.darkText]}>Name on Card</Text>
      <TextInput 
        style={[styles.input, isDarkMode && styles.darkInput]} 
        placeholder="Name on Card"
        placeholderTextColor={isDarkMode ? "#777" : "#999"}
      />
      
      <View style={styles.buttonsContainer}>
        <TouchableOpacity 
          style={[styles.backButton, isDarkMode && styles.darkBackButton]}
          onPress={handleBackToShipping}
        >
          <Text style={[styles.backButtonText, isDarkMode && styles.darkBackButtonText]}>Back</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.payButton}
          onPress={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.payButtonText}>Pay {cartTotal}</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
  },
  orderSummary: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  darkOrderSummary: {
    backgroundColor: '#2a2a2a',
  },
  orderSummaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  orderSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderSummaryText: {
    fontSize: 14,
    color: '#555',
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  securePaymentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securePaymentText: {
    fontSize: 12,
    color: '#3e7d32',
    marginLeft: 4,
  },
  paymentMethods: {
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 10,
  },
  darkPaymentMethods: {
    backgroundColor: '#2a2a2a',
    borderRadius: 8,
  },
  paymentLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paymentLogo: {
    width: 40,
    height: 30,
    resizeMode: 'contain',
    marginHorizontal: 5,
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
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  backButton: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '48%',
  },
  darkBackButton: {
    backgroundColor: '#333',
  },
  backButtonText: {
    color: '#555',
    fontSize: 16,
    fontWeight: '600',
  },
  darkBackButtonText: {
    color: '#f0f0f0',
  },
  payButton: {
    backgroundColor: '#3e7d32',
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    width: '48%',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#f0f0f0',
  },
  testCardHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 5,
    marginBottom: 15,
    fontStyle: 'italic',
  },
});

export default PaymentForm;
