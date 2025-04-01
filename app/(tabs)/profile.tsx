import React, { useState, useEffect, useRef } from "react";
import { 
  Text, 
  View, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Switch,
  Animated,
  Dimensions,
  Platform,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { useTheme } from "../../context/ThemeContext";
import { useWishlist } from "../../context/WishlistContext";
import { useSavedRemedies } from "../../context/RemedyContext";
import { useSavedArticles } from "../../context/ArticleContext";
import { useSavedHerbs } from "../../context/HerbContext";
import { useOrders } from "../../context/OrderContext";
import * as ImagePicker from 'expo-image-picker';

import Header from "../../components/Header";
import ProfileHeader from "../../components/profile/ProfileHeader";
import MenuSection from "../../components/profile/MenuSection";
import OrdersModal from "../../components/profile/OrdersModal";
import SavedItemsModal from "../../components/profile/SavedItemsModal";
import SavedRemediesModal from "../../components/profile/SavedRemediesModal";
import SavedArticlesModal from "../../components/profile/SavedArticlesModal";
import SavedHerbsModal from "../../components/profile/SavedHerbsModal";
import EditProfileModal from "../../components/profile/EditProfileModal";
import HelpCenterModal from "../../components/profile/HelpCenterModal";
import ContactUsModal from "../../components/profile/ContactUsModal";
import PrivacyPolicyModal from "../../components/profile/PrivacyPolicyModal";

const PROFILE_IMAGE = { uri: 'https://randomuser.me/api/portraits/men/65.jpg' };
const { height } = Dimensions.get('window');

// Sample profile data
const USER_DATA = {
  name: "Kumar Akash",
  email: "kumar.akash@example.com",
  phone: "+91 98765 43210",
  memberSince: "June 2022",
  address: "123 Park Street, Mumbai, Maharashtra",
};

// Initial sample data
const INITIAL_SAVED_ITEMS = [
  {
    id: 'item1',
    name: 'Ashwagandha Root Powder',
    category: 'Herbs & Supplements',
    price: '₹450',
    discount: '10% off',
    stock: 'In Stock',
    image: 'https://placehold.co/60x60/png?text=Herb'
  },
  {
    id: 'item2',
    name: 'Tulsi Drops',
    category: 'Herbal Supplements',
    price: '₹320',
    discount: '15% off',
    stock: 'In Stock',
    image: 'https://placehold.co/60x60/png?text=Drops'
  }
];

const INITIAL_SAVED_REMEDIES = [
  {
    id: 'remedy1',
    name: 'Herbal Tea for Cold & Cough',
    ingredients: 'Ginger, Tulsi, Honey, Lemon',
    condition: 'Cold & Cough',
    saved: '2 weeks ago',
    image: 'https://placehold.co/60x60/png?text=Tea'
  }
];

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function ProfileScreen() {
  const { isDarkMode } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [savedItemsModalVisible, setSavedItemsModalVisible] = useState(false);
  const [remediesModalVisible, setRemediesModalVisible] = useState(false);
  const [articlesModalVisible, setArticlesModalVisible] = useState(false);
  const [herbsModalVisible, setHerbsModalVisible] = useState(false);
  const [editProfileModalVisible, setEditProfileModalVisible] = useState(false);
  const [helpCenterModalVisible, setHelpCenterModalVisible] = useState(false);
  const [contactUsModalVisible, setContactUsModalVisible] = useState(false);
  const [privacyPolicyModalVisible, setPrivacyPolicyModalVisible] = useState(false);
  
  const [userData, setUserData] = useState(USER_DATA);
  const [profileImage, setProfileImage] = useState(PROFILE_IMAGE);
  const [slideAnimation] = useState(new Animated.Value(height));
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();
  
  // Use contexts for all saved data
  const { savedItems, removeFromWishlist } = useWishlist();
  const { savedRemedies, removeFromSavedRemedies } = useSavedRemedies();
  const { savedArticles, removeFromSavedArticles } = useSavedArticles();
  const { savedHerbs, removeFromSavedHerbs } = useSavedHerbs();
  const { orders } = useOrders();

  // Function to add item to cart from saved items
  const addToCart = (item) => {
    console.log(`Added ${item.name} to cart`);
    // Here you would add the item to your cart state or context
    // For this example, we'll just show an alert
    alert(`Added ${item.name} to cart!`);
  };

  const toggleModal = (modalSetter, visible) => {
    if (visible) {
      modalSetter(true);
      Animated.spring(slideAnimation, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7
      }).start();
    } else {
      Animated.timing(slideAnimation, {
        toValue: height,
        duration: 250,
        useNativeDriver: true
      }).start(() => {
        modalSetter(false);
      });
    }
  };

  const handleSaveUserData = (updatedData) => {
    setUserData(prev => ({
      ...prev,
      name: updatedData.name,
      email: updatedData.email,
      phone: updatedData.phone,
      address: updatedData.address
    }));
    
    // Update profile image if changed
    if (updatedData.profileImage && updatedData.profileImage.uri !== profileImage.uri) {
      setProfileImage(updatedData.profileImage);
    }
    
    // Here you would typically make an API call to update the user data
    console.log("Profile updated:", updatedData);
  };

  // Register for push notifications
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // Listen for incoming notifications
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    // Listen for user interactions with notifications
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification response:', response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  // Toggle push notifications
  const togglePushNotifications = async (value) => {
    if (value) {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert(
            'Permission Required',
            'Please enable notification permissions to receive updates.',
            [{ text: 'OK' }]
          );
          return;
        }
      }
      
      // Send a test notification when enabled
      await schedulePushNotification();
    }
    
    setNotifications(value);
    // In a real app, you would store this preference on your backend
    console.log(`Push notifications ${value ? 'enabled' : 'disabled'}`);
  };

  // Menu items for profile
  const accountMenuItems = [
    { 
      id: 'orders', 
      title: 'My Orders', 
      icon: 'cart-outline',
      badge: orders.length > 0 ? orders.length.toString() : undefined,  // Convert to string
      onPress: () => toggleModal(setOrdersModalVisible, true)
    },
    { 
      id: 'saved', 
      title: 'Saved Items', 
      icon: 'heart-outline',
      badge: savedItems.length > 0 ? savedItems.length.toString() : undefined,  // Convert to string
      onPress: () => toggleModal(setSavedItemsModalVisible, true)
    },
    { 
      id: 'remedies', 
      title: 'Saved Remedies', 
      icon: 'flask-outline',
      badge: savedRemedies.length,
      onPress: () => toggleModal(setRemediesModalVisible, true)
    },
    { 
      id: 'herbs', 
      title: 'Saved Herbs', 
      icon: 'leaf-outline',
      badge: savedHerbs.length,
      onPress: () => toggleModal(setHerbsModalVisible, true)
    },
    { 
      id: 'articles', 
      title: 'Saved Articles', 
      icon: 'book-outline',
      badge: savedArticles.length,
      onPress: () => toggleModal(setArticlesModalVisible, true)
    },
  ];

  const settingsMenuItems = [
    {
      id: 'notifications',
      title: 'Push Notifications',
      icon: 'notifications-outline',
      switch: (
        <Switch
          trackColor={{ false: "#ddd", true: "#c8e6c9" }}
          thumbColor={notifications ? "#3e7d32" : isDarkMode ? "#888" : "#f4f3f4"}
          ios_backgroundColor="#ddd"
          onValueChange={togglePushNotifications}
          value={notifications}
        />
      )
    },
    {
      id: 'email',
      title: 'Email Updates',
      icon: 'mail-outline',
      switch: (
        <Switch
          trackColor={{ false: "#ddd", true: "#c8e6c9" }}
          thumbColor={emailUpdates ? "#3e7d32" : isDarkMode ? "#888" : "#f4f3f4"}
          ios_backgroundColor="#ddd"
          onValueChange={setEmailUpdates}
          value={emailUpdates}
        />
      )
    },
    {
      id: 'language',
      title: 'Language',
      icon: 'language-outline',
      value: 'English'
    }
  ];

  const supportMenuItems = [
    {
      id: 'help',
      title: 'Help Center',
      icon: 'help-circle-outline',
      onPress: () => toggleModal(setHelpCenterModalVisible, true)
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: 'chatbox-ellipses-outline',
      onPress: () => toggleModal(setContactUsModalVisible, true)
    },
    {
      id: 'privacy',
      title: 'Privacy Policy',
      icon: 'document-text-outline',
      onPress: () => toggleModal(setPrivacyPolicyModalVisible, true)
    }
  ];

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      <Header title="My Profile" />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <ProfileHeader 
          userData={userData}
          profileImage={profileImage}  // Now passing the state version
          isDarkMode={isDarkMode}
          onEdit={() => toggleModal(setEditProfileModalVisible, true)}
        />
        
        {/* Account Menu Section */}
        <MenuSection 
          title="My Account"
          items={accountMenuItems}
          isDarkMode={isDarkMode}
        />
        
        {/* Settings Section */}
        <MenuSection 
          title="Settings"
          items={settingsMenuItems}
          isDarkMode={isDarkMode}
        />
        
        {/* Support Section */}
        <MenuSection 
          title="Support"
          items={supportMenuItems}
          isDarkMode={isDarkMode}
        />
        
        {/* Logout Button */}
        <TouchableOpacity style={[styles.logoutButton, isDarkMode && styles.darkLogoutButton]}>
          <Ionicons name="log-out-outline" size={20} color="#fff" style={styles.logoutIcon} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
        
        <Text style={[styles.versionText, isDarkMode && styles.darkMutedText]}>
          Version 1.0.0
        </Text>
      </ScrollView>

      {/* Orders Modal */}
      <OrdersModal
        visible={ordersModalVisible}
        toggleModal={(visible) => toggleModal(setOrdersModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
        orders={orders}  // Pass orders from context
      />

      {/* Saved Items Modal */}
      <SavedItemsModal
        visible={savedItemsModalVisible}
        toggleModal={(visible) => toggleModal(setSavedItemsModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
        savedItems={savedItems} // Use items from wishlist context
        onAddToCart={addToCart}
        onRemoveItem={removeFromWishlist} // Add ability to remove items
      />

      {/* Saved Remedies Modal */}
      <SavedRemediesModal
        visible={remediesModalVisible}
        toggleModal={(visible) => toggleModal(setRemediesModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
        savedRemedies={savedRemedies}
        onRemoveRemedy={removeFromSavedRemedies}
      />

      {/* Saved Articles Modal */}
      <SavedArticlesModal
        visible={articlesModalVisible}
        toggleModal={(visible) => toggleModal(setArticlesModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
        savedArticles={savedArticles}
        onRemoveArticle={removeFromSavedArticles}
      />

      {/* Add Saved Herbs Modal */}
      <SavedHerbsModal
        visible={herbsModalVisible}
        toggleModal={(visible) => toggleModal(setHerbsModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
        savedHerbs={savedHerbs}
        onRemoveHerb={removeFromSavedHerbs}
        onViewHerb={(herb) => {
          toggleModal(setHerbsModalVisible, false);
          // You could navigate to herb detail here if needed
        }}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        visible={editProfileModalVisible}
        toggleModal={(visible) => toggleModal(setEditProfileModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
        userData={userData}
        profileImage={profileImage}  // Pass current profile image
        onSaveChanges={handleSaveUserData}
      />

      {/* Help Center Modal */}
      <HelpCenterModal
        visible={helpCenterModalVisible}
        toggleModal={(visible) => toggleModal(setHelpCenterModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
      />

      {/* Contact Us Modal */}
      <ContactUsModal
        visible={contactUsModalVisible}
        toggleModal={(visible) => toggleModal(setContactUsModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        visible={privacyPolicyModalVisible}
        toggleModal={(visible) => toggleModal(setPrivacyPolicyModalVisible, visible)}
        slideAnimation={slideAnimation}
        isDarkMode={isDarkMode}
      />
    </View>
  );
}

// Schedule a notification
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Notifications Enabled ✅",
      body: "You will now receive updates from Dhanvantari Vatika",
      data: { screen: 'profile' },
    },
    trigger: { seconds: 2 },
  });
}

// Register for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3e7d32',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Permission Required',
        'Failed to get push token for notification permissions.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    })).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  return token;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 100, // Space for header
    paddingBottom: 30,
  },
  darkText: {
    color: '#f0f0f0',
  },
  darkMutedText: {
    color: '#aaa',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d32f2f',
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 14,
    borderRadius: 12,
  },
  darkLogoutButton: {
    backgroundColor: '#8b0000',
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
    marginBottom: 20,
  }
});