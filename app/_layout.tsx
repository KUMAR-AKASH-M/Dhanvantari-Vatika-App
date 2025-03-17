import { Stack } from "expo-router";
import { ThemeProvider } from "../context/ThemeContext";
import { WishlistProvider } from "../context/WishlistContext";
import { RemedyProvider } from "../context/RemedyContext";
import { OrderProvider } from "../context/OrderContext";
import { ArticleProvider } from "../context/ArticleContext";
import { HerbProvider } from "../context/HerbContext";
import { useFonts } from 'expo-font';
import { useCallback } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { StripeProvider } from '@stripe/stripe-react-native';

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // You can add custom fonts here if needed
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  // Replace 'pk_test_yourPublishableKey' with your actual publishable key
  const publishableKey = 'pk_test_yourPublishableKey';

  return (
    <ThemeProvider>
      <WishlistProvider>
        <RemedyProvider>
          <OrderProvider>
            <ArticleProvider>
              <HerbProvider>
                <StripeProvider
                  publishableKey={publishableKey}
                  merchantIdentifier="merchant.com.dhanvantarivatika" // Only required for Apple Pay
                >
                  <Stack
                    screenOptions={{
                      headerShown: false,
                    }}
                    onLayout={onLayoutRootView}
                  />
                </StripeProvider>
              </HerbProvider>
            </ArticleProvider>
          </OrderProvider>
        </RemedyProvider>
      </WishlistProvider>
    </ThemeProvider>
  );
}