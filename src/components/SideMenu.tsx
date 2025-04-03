import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  useAnimatedGestureHandler,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import { PanGestureHandler } from "react-native-gesture-handler";
import theme from "../theme";
import { useAuthStore } from "../context/StoreContext";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");
const MENU_WIDTH = width * 0.7;

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
}

const SideMenu: React.FC<SideMenuProps> = ({ visible, onClose }) => {
  const translateX = useSharedValue(-MENU_WIDTH);
  const opacity = useSharedValue(0);
  const authStore = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (visible) {
      translateX.value = withSpring(0, {
        damping: 15,
        stiffness: 90,
      });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateX.value = withTiming(-MENU_WIDTH, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const closeMenu = () => {
    translateX.value = withTiming(-MENU_WIDTH, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      const newValue = ctx.startX + event.translationX;
      translateX.value = Math.min(0, Math.max(-MENU_WIDTH, newValue));
      // Calculate opacity based on the menu position
      opacity.value = interpolate(
        translateX.value,
        [-MENU_WIDTH, 0],
        [0, 1],
        Extrapolate.CLAMP
      );
    },
    onEnd: (event) => {
      // If swiped left enough, close the menu
      if (event.velocityX < -20 || translateX.value < -MENU_WIDTH / 2) {
        translateX.value = withTiming(-MENU_WIDTH, { duration: 300 });
        opacity.value = withTiming(0, { duration: 300 }, () => {
          runOnJS(onClose)();
        });
      } else {
        // Otherwise spring back to open position
        translateX.value = withSpring(0, {
          damping: 15,
          stiffness: 90,
        });
        opacity.value = withTiming(1, { duration: 300 });
      }
    },
  });

  const menuAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleLogout = async () => {
    closeMenu();
    // Small delay to allow animation to start before logout
    setTimeout(async () => {
      await authStore.signOut();
      router.replace('/login');
    }, 300);
  };

  return (
    <View style={styles.container} pointerEvents={visible ? "auto" : "none"}>
      <TouchableWithoutFeedback onPress={closeMenu}>
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
      </TouchableWithoutFeedback>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.menuContainer, menuAnimatedStyle]}>
          <View style={styles.menuHeader}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity onPress={closeMenu}>
              <Ionicons
                name="close"
                size={24}
                color={theme.palette.text.primary.light}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {authStore.user?.displayName || "User"}
            </Text>
            <Text style={styles.userEmail}>{authStore.user?.email || "No email available"}</Text>
          </View>

          <View style={styles.menuItems}>
            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="home-outline"
                size={20}
                color={theme.palette.primary}
              />
              <Text style={styles.menuItemText}>Home</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="heart-outline"
                size={20}
                color={theme.palette.primary}
              />
              <Text style={styles.menuItemText}>Favorites</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Ionicons
                name="settings-outline"
                size={20}
                color={theme.palette.primary}
              />
              <Text style={styles.menuItemText}>Settings</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
              <Ionicons
                name="log-out-outline"
                size={20}
                color={theme.palette.error}
              />
              <Text
                style={[styles.menuItemText, { color: theme.palette.error }]}
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: MENU_WIDTH,
    height: height,
    backgroundColor: theme.palette.background.light,
    paddingHorizontal: theme.spacing.base,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.xxxl : (StatusBar.currentHeight || 0) + theme.spacing.xl,
    paddingBottom: theme.spacing.xxxl,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.veryLightGray,
  },
  menuTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.palette.text.primary.light,
  },
  userInfo: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.xxl,
    paddingBottom: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.veryLightGray,
  },
  userName: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    color: theme.palette.text.primary.light,
  },
  userEmail: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.palette.text.secondary.light,
    marginTop: theme.spacing.xs,
  },
  menuItems: {
    marginTop: theme.spacing.base,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.veryLightGray,
  },
  menuItemText: {
    fontSize: theme.typography.fontSize.md,
    marginLeft: theme.spacing.md,
    color: theme.palette.text.primary.light,
  },
});

export default SideMenu;
