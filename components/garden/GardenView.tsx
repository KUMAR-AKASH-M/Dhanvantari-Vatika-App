import React, { useState, useEffect, useRef, useMemo, useCallback, memo } from 'react';
import { 
  View, 
  StyleSheet, 
  PanResponder, 
  TouchableOpacity, 
  Text, 
  Dimensions,
  ImageBackground,
  Alert,
  Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Define the plant type - updated to match HerbDetailModal expectations
interface Plant {
  id: string;
  name: string;
  scientificName: string;
  description: string;
  benefits: string[];
  howToUse?: string[];
  growingTips?: string[];
  position: { x: number; z: number };
  color: string;
  size: number;
  image?: any;
}

interface GardenViewProps {
  plants: Plant[];
  onPlantSelected: (plant: Plant) => void;
  onSceneLoaded: () => void;
  onSceneError: (error: Error) => void;
  isDarkMode: boolean;
  controlMode: 'joystick' | 'buttons';
}

// Memoized tree component to prevent unnecessary re-renders
const Tree = memo(({ plant, screenPos, size }: { 
  plant: Plant, 
  screenPos: { x: number, y: number }, 
  size: number 
}) => {
  return (
    <View 
      key={plant.id}
      style={[
        styles.tree,
        {
          left: screenPos.x - size/2, 
          top: screenPos.y - size/2,
          width: size,
          height: size * 1.5
        }
      ]}
    >
      {plant.image ? (
        // Render plant image when available
        <Image
          source={plant.image}
          style={{
            width: size,
            height: size * 1.2,
            resizeMode: 'contain'
          }}
        />
      ) : (
        // Fallback to geometric representation when no image
        <>
          <View style={[styles.trunk, { height: size * 0.7, width: size * 0.2 }]} />
          <View 
            style={[
              styles.foliage, 
              { 
                backgroundColor: plant.color,
                width: size,
                height: size,
                bottom: size * 0.4
              }
            ]}
          />
        </>
      )}
    </View>
  );
});

// We'll use a 2.5D approach instead of full 3D for better compatibility
const GardenView = ({ 
  plants, 
  onPlantSelected, 
  onSceneLoaded, 
  onSceneError, 
  isDarkMode,
  controlMode 
}: GardenViewProps) => {
  // Garden state - use refs for position updates to prevent unnecessary re-renders
  const playerPositionRef = useRef({ x: 0, z: 0 });
  // We still need a state for the UI to update when needed
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0 });
  const [moving, setMoving] = useState({ forward: false, back: false, left: false, right: false });
  const [joystickPosition, setJoystickPosition] = useState({ x: 0, y: 0 });
  const [showJoystick, setShowJoystick] = useState(false);
  const [joystickBasePosition, setJoystickBasePosition] = useState({ x: 0, y: 0 });
  const [nearbyPlant, setNearbyPlant] = useState<Plant | null>(null);
  const [viewScale, setViewScale] = useState(1);
  const animationFrameId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);
  const lastPositionUpdateTime = useRef<number>(0);
  const movingRef = useRef(moving);
  
  // Constants
  const MOVEMENT_SPEED = 0.1;
  const INTERACTION_DISTANCE = 2;
  const UI_UPDATE_INTERVAL = 100; // Only update UI position every 100ms
  
  // Garden boundaries
  const GARDEN_SIZE = 50; // Garden size
  const BOUNDARY = GARDEN_SIZE / 2 - 5; // Boundary offset
  
  // Convert garden world coordinates to screen coordinates
  const gardenToScreenCoords = useCallback((x: number, z: number) => {
    const { width, height } = Dimensions.get('window');
    const centerX = width / 2;
    const centerY = height / 2;
    
    // Calculate position relative to player
    const relX = x - playerPositionRef.current.x;
    const relZ = z - playerPositionRef.current.z;
    
    // Apply perspective and convert to screen coordinates
    const scale = 20 * viewScale; // Adjust scale as needed
    const screenX = centerX + relX * scale;
    const screenY = centerY + relZ * scale;
    
    return { x: screenX, y: screenY };
  }, [viewScale]);
  
  // Memoize tree positions to prevent recalculation on every render
  const treePositions = useMemo(() => plants.map(plant => ({
    plant,
    screenPos: gardenToScreenCoords(plant.position.x, plant.position.z),
    size: plant.size * 20 * viewScale // Scale the tree size for the screen
  })), [plants, gardenToScreenCoords, viewScale, playerPosition]);
  
  // Update movingRef when moving state changes to avoid closure issues
  useEffect(() => {
    movingRef.current = moving;
  }, [moving]);
  
  // Set up joystick pan responder
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      
      onPanResponderGrant: (evt) => {
        const { locationX, locationY } = evt.nativeEvent;
        setJoystickBasePosition({ x: locationX, y: locationY });
        setJoystickPosition({ x: 0, y: 0 });
        setShowJoystick(true);
      },
      
      onPanResponderMove: (evt, gestureState) => {
        // Calculate joystick offset from base position
        const maxDistance = 50; // Maximum joystick distance from center
        
        // Calculate distance and angle
        const dx = gestureState.dx;
        const dy = gestureState.dy;
        const distance = Math.min(Math.sqrt(dx*dx + dy*dy), maxDistance);
        const angle = Math.atan2(dy, dx);
        
        // Update joystick position
        const newX = Math.cos(angle) * distance;
        const newY = Math.sin(angle) * distance;
        setJoystickPosition({ x: newX, y: newY });
        
        // Update movement based on joystick position
        const threshold = 10;
        setMoving({
          forward: newY < -threshold,
          back: newY > threshold,
          left: newX < -threshold,
          right: newX > threshold
        });
      },
      
      onPanResponderRelease: () => {
        setMoving({ forward: false, back: false, left: false, right: false });
        setShowJoystick(false);
      },
    })
  ).current;
  
  // Animate player movement
  useEffect(() => {
    // Initialize scene
    console.log('Starting 2.5D garden initialization');
    lastUpdateTime.current = Date.now();
    lastPositionUpdateTime.current = Date.now();
    
    const animate = () => {
      const now = Date.now();
      const deltaTime = now - lastUpdateTime.current;
      lastUpdateTime.current = now;
      
      // Update player position based on movement
      if (movingRef.current.forward || movingRef.current.back || 
          movingRef.current.left || movingRef.current.right) {
        
        const moveSpeed = MOVEMENT_SPEED * (deltaTime / 16); // Normalize by 60fps
        
        let newX = playerPositionRef.current.x;
        let newZ = playerPositionRef.current.z;
        
        // Forward/backward movement
        if (movingRef.current.forward) {
          newZ -= moveSpeed;
        } else if (movingRef.current.back) {
          newZ += moveSpeed;
        }
        
        // Left/right movement
        if (movingRef.current.left) {
          newX -= moveSpeed;
        } else if (movingRef.current.right) {
          newX += moveSpeed;
        }
        
        // Enforce garden boundaries
        newX = Math.max(-BOUNDARY, Math.min(BOUNDARY, newX));
        newZ = Math.max(-BOUNDARY, Math.min(BOUNDARY, newZ));
        
        // Update player position ref (doesn't trigger re-render)
        playerPositionRef.current = { x: newX, z: newZ };
        
        // Only update UI position occasionally to reduce renders
        if (now - lastPositionUpdateTime.current > UI_UPDATE_INTERVAL) {
          setPlayerPosition({ x: newX, z: newZ });
          lastPositionUpdateTime.current = now;
          
          // Check for nearby plants
          checkNearbyPlants();
        }
      }
      
      // Schedule next frame
      animationFrameId.current = requestAnimationFrame(animate);
    };
    
    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);
    
    // Scene is loaded
    onSceneLoaded();
    
    // Cleanup animation on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []); // Empty dependency array so this only runs once
  
  // Check if player is near any plants - extracted as a function
  const checkNearbyPlants = useCallback(() => {
    // Find closest plant
    let closestPlant = null;
    let closestDistance = INTERACTION_DISTANCE;
    
    plants.forEach(plant => {
      const dx = playerPositionRef.current.x - plant.position.x;
      const dz = playerPositionRef.current.z - plant.position.z;
      const distance = Math.sqrt(dx*dx + dz*dz);
      
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPlant = plant;
      }
    });
    
    // Update nearby plant only if it changed
    if (closestPlant?.id !== nearbyPlant?.id) {
      setNearbyPlant(closestPlant);
    }
  }, [plants, nearbyPlant]);
  
  // Button press handlers for directional control
  const handleMovePress = useCallback((direction, isPressed) => {
    setMoving(current => ({
      ...current,
      [direction]: isPressed
    }));
  }, []);
  
  // Handle info button press - no changes needed as it passes the plant object as is
  const handleInfoPress = useCallback(() => {
    if (nearbyPlant) {
      onPlantSelected(nearbyPlant);
    }
  }, [nearbyPlant, onPlantSelected]);
  
  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      {/* Garden background */}
      <ImageBackground
        source={isDarkMode 
          ? require('../../assets/images/garden-bg.png')
          : require('../../assets/images/garden-bg.png')
        }
        style={styles.background}
        resizeMode="cover"
      >
        {/* Trees - use memo to prevent unnecessary re-renders */}
        {treePositions.map(({ plant, screenPos, size }) => (
          <Tree 
            key={plant.id} 
            plant={plant} 
            screenPos={screenPos} 
            size={size} 
          />
        ))}
        
        {/* Player character */}
        <View style={styles.playerContainer}>
          <View style={styles.player} />
        </View>
        
        {/* Debug info */}
        <View style={styles.debugInfo}>
          <Text style={styles.debugText}>
            Position: {playerPosition.x.toFixed(1)}, {playerPosition.z.toFixed(1)}
          </Text>
        </View>
      </ImageBackground>
      
      {/* Button controls */}
      {controlMode === 'buttons' && (
        <View style={styles.controls}>
          <View style={styles.dPad}>
            <TouchableOpacity
              style={[styles.button, styles.upButton]}
              onPressIn={() => handleMovePress('forward', true)}
              onPressOut={() => handleMovePress('forward', false)}
            >
              <Ionicons name="chevron-up" size={30} color="#fff" />
            </TouchableOpacity>
            
            <View style={styles.middleRow}>
              <TouchableOpacity
                style={[styles.button, styles.leftButton]}
                onPressIn={() => handleMovePress('left', true)}
                onPressOut={() => handleMovePress('left', false)}
              >
                <Ionicons name="chevron-back" size={30} color="#fff" />
              </TouchableOpacity>
              
              <View style={styles.centerButton} />
              
              <TouchableOpacity
                style={[styles.button, styles.rightButton]}
                onPressIn={() => handleMovePress('right', true)}
                onPressOut={() => handleMovePress('right', false)}
              >
                <Ionicons name="chevron-forward" size={30} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity
              style={[styles.button, styles.downButton]}
              onPressIn={() => handleMovePress('back', true)}
              onPressOut={() => handleMovePress('back', false)}
            >
              <Ionicons name="chevron-down" size={30} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {/* Joystick controls */}
      {controlMode === 'joystick' && (
        <View 
          style={styles.joystickContainer}
          {...panResponder.panHandlers}
        >
          {showJoystick && (
            <>
              <View 
                style={[styles.joystickBase,
                  {
                    left: joystickBasePosition.x - 35,
                    top: joystickBasePosition.y - 35,
                  }
                ]}
              />
              <View 
                style={[styles.joystickHandle,
                  {
                    left: joystickBasePosition.x - 25 + joystickPosition.x,
                    top: joystickBasePosition.y - 25 + joystickPosition.y,
                  }
                ]}
              />
            </>
          )}
        </View>
      )}
      
      {/* Plant info button */}
      {nearbyPlant && (
        <TouchableOpacity 
          style={styles.infoButton}
          onPress={handleInfoPress}
        >
          <Ionicons name="information-circle" size={30} color="#fff" />
          <Text style={styles.infoButtonText}>{nearbyPlant.name}</Text>
        </TouchableOpacity>
      )}
      
      {/* Zoom controls */}
      <View style={styles.zoomControls}>
        <TouchableOpacity 
          style={styles.zoomButton} 
          onPress={() => setViewScale(prev => Math.min(prev + 0.1, 2))}
        >
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.zoomButton} 
          onPress={() => setViewScale(prev => Math.max(prev - 0.1, 0.5))}
        >
          <Ionicons name="remove" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
  darkContainer: {
    backgroundColor: '#1A3A1A',
  },
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  tree: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 10,
  },
  trunk: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#8B4513',
    borderRadius: 3,
    alignSelf: 'center',
  },
  foliage: {
    position: 'absolute',
    borderRadius: 50,
  },
  playerContainer: {
    position: 'absolute',
    left: width / 2 - 10,
    top: height / 2 - 10,
    zIndex: 100,
  },
  player: {
    width: 20,
    height: 20,
    backgroundColor: '#3f51b5',
    borderRadius: 10,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    width: 150,
    height: 150,
  },
  dPad: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  upButton: {
    marginBottom: 5,
  },
  middleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leftButton: {
    marginRight: 5,
  },
  centerButton: {
    width: 40,
    height: 40,
  },
  rightButton: {
    marginLeft: 5,
  },
  downButton: {
    marginTop: 5,
  },
  joystickContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height * 0.5,
  },
  joystickBase: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  joystickHandle: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(50, 50, 200, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoButton: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 150, 50, 0.8)',
    borderRadius: 20,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 18,
  },
  debugInfo: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 5,
    borderRadius: 5,
  },
  debugText: {
    color: 'white',
    fontSize: 12,
  },
  zoomControls: {
    position: 'absolute',
    top: 100,
    right: 20,
    flexDirection: 'column',
  },
  zoomButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  }
});

export default GardenView;
