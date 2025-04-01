import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, Text } from 'react-native';
import WebView from 'react-native-webview';
import { useRoute, useNavigation } from '@react-navigation/native';

export default function VRGardenView() {
  const route = useRoute();
  const navigation = useNavigation();
  const { gardenName } = route.params || { gardenName: 'Garden 1' };
  
  // YouTube video ID - make sure this is a 360-degree video
  const videoId = "S-yau0rcVVc";
  
  // Get screen dimensions
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isLandscape, setIsLandscape] = useState(
    dimensions.width > dimensions.height
  );

  // Update dimensions on screen rotation
  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
      setIsLandscape(window.width > window.height);
    });
    return () => subscription.remove();
  }, []);

  // Calculate box sizes based on orientation
  // In landscape: taller boxes that take up more horizontal space
  const boxWidth = isLandscape 
    ? dimensions.width * 0.45  // wider in landscape
    : dimensions.width * 0.4;
    
  const boxHeight = isLandscape
    ? dimensions.height * 0.9   // taller in landscape
    : dimensions.height * 0.4;
  
  // Common JS to inject into both WebViews
  const injectedJS = `
    var player;
    function onYouTubeIframeAPIReady() {
      player = new YT.Player('player', {
        events: {
          'onReady': onPlayerReady
        }
      });
    }
    function onPlayerReady(event) {
      // Enable VR mode with stereoscopic view
      if (player.setSphericalProperties) {
        player.setSphericalProperties({ 
          enableOrientationSensor: true,
          stereoMode: 'cardboard'  
        });
      }
      
      // Force stereoscopic mode
      if (player && player.getIframe) {
        const iframe = player.getIframe();
        if (iframe && iframe.contentWindow && iframe.contentWindow.postMessage) {
          iframe.contentWindow.postMessage('{"event":"command","func":"setStereoscopic","args":[true]}', '*');
        }
      }
    }
    true;
  `;
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>← Back</Text>
      </TouchableOpacity>
      
      <Text style={styles.title}>{gardenName} VR View</Text>
      
      <View style={[
        styles.videoContainer,
        isLandscape ? styles.landscapeContainer : styles.portraitContainer
      ]}>
        {/* Left video */}
        <View style={[styles.videoWrapper, { width: boxWidth, height: boxHeight }]}>
          <WebView
            source={{ 
              uri: `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&rel=0&showinfo=0&controls=1&vq=hd1080&enablejsapi=1&widgetid=1&vr=1&stereo=1` 
            }}
            allowsFullscreenVideo
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.video}
            injectedJavaScript={injectedJS}
            onMessage={(event) => console.log(event.nativeEvent.data)}
          />
        </View>
        
        {/* Right video */}
        <View style={[styles.videoWrapper, { width: boxWidth, height: boxHeight }]}>
          <WebView
            source={{ 
              uri: `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}&rel=0&showinfo=0&controls=1&vq=hd1080&enablejsapi=1&widgetid=1&vr=1&stereo=1` 
            }}
            allowsFullscreenVideo
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.video}
            injectedJavaScript={injectedJS}
            onMessage={(event) => console.log(event.nativeEvent.data)}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 5,
  },
  backButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  landscapeContainer: {
    flexDirection: 'row',
  },
  portraitContainer: {
    flexDirection: 'column',
  },
  videoWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});
