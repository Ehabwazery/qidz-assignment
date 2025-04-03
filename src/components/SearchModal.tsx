import React, { useEffect } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Platform,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import theme from "../theme";

const { height } = Dimensions.get("window");

interface SearchModalProps {
  visible: boolean;
  searchQuery: string;
  onChangeText: (text: string) => void;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  searchQuery,
  onChangeText,
  onClose,
}) => {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });
    } else {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    }
  }, [visible]);

  const closeSearch = () => {
    translateY.value = withTiming(-100, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const searchAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    };
  });

  return (
    <View style={styles.container} pointerEvents={visible ? "auto" : "none"}>
      <TouchableWithoutFeedback onPress={closeSearch}>
        <Animated.View style={[styles.overlay, overlayAnimatedStyle]} />
      </TouchableWithoutFeedback>

      <Animated.View style={[styles.searchContainer, searchAnimatedStyle]}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={theme.palette.mediumGray} />

          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            value={searchQuery}
            onChangeText={onChangeText}
            autoFocus={visible}
            placeholderTextColor={theme.palette.mediumGray}
          />

          <TouchableOpacity onPress={closeSearch}>
            <Ionicons name="close" size={20} color={theme.palette.mediumGray} />
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 998,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  searchContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.light,
    paddingVertical: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + theme.spacing.base,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.veryLightGray,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    marginHorizontal: theme.spacing.sm,
    color: theme.palette.text.primary.light,
  },
});

export default SearchModal;
