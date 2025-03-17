import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const CHECKOUT_STEPS = {
  SHIPPING: 'shipping',
  PAYMENT: 'payment',
  CONFIRMATION: 'confirmation'
};

interface StepIndicatorProps {
  currentStep: string;
  isDarkMode: boolean;
}

const StepIndicator = ({ currentStep, isDarkMode }: StepIndicatorProps) => {
  return (
    <View style={styles.stepIndicator}>
      <View style={[
        styles.stepCircle, 
        currentStep === CHECKOUT_STEPS.SHIPPING && styles.activeStepCircle,
        isDarkMode && styles.darkStepCircle,
        currentStep === CHECKOUT_STEPS.SHIPPING && isDarkMode && styles.darkActiveStepCircle
      ]}>
        <Text style={styles.stepNumber}>1</Text>
      </View>
      <View style={[styles.stepLine, isDarkMode && styles.darkStepLine]} />
      <View style={[
        styles.stepCircle,
        currentStep === CHECKOUT_STEPS.PAYMENT && styles.activeStepCircle,
        isDarkMode && styles.darkStepCircle,
        currentStep === CHECKOUT_STEPS.PAYMENT && isDarkMode && styles.darkActiveStepCircle
      ]}>
        <Text style={styles.stepNumber}>2</Text>
      </View>
      <View style={[styles.stepLine, isDarkMode && styles.darkStepLine]} />
      <View style={[
        styles.stepCircle,
        currentStep === CHECKOUT_STEPS.CONFIRMATION && styles.activeStepCircle,
        isDarkMode && styles.darkStepCircle,
        currentStep === CHECKOUT_STEPS.CONFIRMATION && isDarkMode && styles.darkActiveStepCircle
      ]}>
        <Text style={styles.stepNumber}>3</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeStepCircle: {
    backgroundColor: '#3e7d32',
  },
  darkStepCircle: {
    backgroundColor: '#444',
  },
  darkActiveStepCircle: {
    backgroundColor: '#8bc34a',
  },
  stepNumber: {
    color: '#fff',
    fontWeight: '600',
  },
  stepLine: {
    height: 2,
    width: 40,
    backgroundColor: '#e0e0e0',
  },
  darkStepLine: {
    backgroundColor: '#444',
  },
});

export default StepIndicator;
