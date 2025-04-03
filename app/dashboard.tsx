import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { observer } from "mobx-react";
import { useRouter } from "expo-router";
import { useStore } from "../src/context/StoreContext";
import MovieSection from "../src/components/MovieSection";
import theme from "../src/theme";
import { Ionicons } from "@expo/vector-icons";
import SideMenu from "../src/components/SideMenu";

const Dashboard = observer(() => {
  const router = useRouter();
  const { authStore, moviesStore } = useStore();
  const [refreshing, setRefreshing] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuPress = () => {
    setMenuVisible(true);
  };

  const handleSearchPress = () => {
    router.push("/search");
  };

  const closeMenu = () => {
    setMenuVisible(false);
  };

  useEffect(() => {
    // Load movies when component mounts
    moviesStore.fetchAllMovies();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await moviesStore.fetchAllMovies();
    setRefreshing(false);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.palette.white}
      />

      {/* Safe area to handle status bar */}
      <View style={styles.statusBarSpacing} />

      {/* Custom Header */}
      <View style={styles.headerBar}>
        <TouchableOpacity onPress={handleMenuPress} style={styles.headerIcon}>
          <Ionicons
            name="menu-outline"
            size={24}
            color={theme.palette.primary}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Movies</Text>

        <TouchableOpacity onPress={handleSearchPress} style={styles.headerIcon}>
          <Ionicons
            name="search-outline"
            size={24}
            color={theme.palette.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Main content */}
      <View style={{ flex: 1 }}>
        <ScrollView
          style={styles.container}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[theme.palette.primary]}
            />
          }
        >
          {/* Welcome section */}
          <View style={styles.header}>
            <Text style={styles.welcomeText}>
              Hello, {authStore.user?.displayName || "Movie Fan"}!
            </Text>
            <Text style={styles.subtitleText}>Discover amazing movies</Text>
          </View>

          {/* Main section - Car movies */}
          <MovieSection
            title="Car Movies"
            movies={moviesStore.movies}
            isLoading={moviesStore.isLoading}
            error={moviesStore.error}
            showTitles={true}
          />

          {/* Trending section with smaller cards */}
          <MovieSection
            title="Trending Now"
            movies={moviesStore.trendingMovies}
            isLoading={moviesStore.isTrendingLoading}
            error={moviesStore.error}
            customCardWidth={160}
          />

          {/* Upcoming section with titles */}
          <MovieSection
            title="Upcoming Movies"
            movies={moviesStore.upcomingMovies}
            isLoading={moviesStore.isUpcomingLoading}
            error={moviesStore.error}
            showTitles={true}
          />

          {/* Top Rated section with titles */}
          <MovieSection
            title="Top Rated"
            movies={moviesStore.topRatedMovies}
            isLoading={moviesStore.isTopRatedLoading}
            error={moviesStore.error}
            showTitles={true}
          />

          {/* Add some padding at the bottom for better scrolling experience */}
          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>

      <SideMenu visible={menuVisible} onClose={closeMenu} />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
  statusBarSpacing: {
    height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.veryLightGray,
  },
  headerIcon: {
    padding: theme.spacing.xs,
  },
  headerTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: "bold",
    color: theme.palette.text.primary.light,
  },
  header: {
    padding: theme.spacing.base,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  welcomeText: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: "bold",
    color: theme.palette.text.primary.light,
  },
  subtitleText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.palette.text.secondary.light,
    marginTop: theme.spacing.xs,
  },
  bottomPadding: {
    height: theme.spacing.xl,
  },
});

export default Dashboard;
