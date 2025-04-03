import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react";
import { Ionicons } from "@expo/vector-icons";
import { useStore } from "../src/context/StoreContext";
import MovieCard from "../src/components/MovieCard";
import theme from "../src/theme";

const { width } = Dimensions.get("window");

// Calculate card width for 3 items per row with consistent margins
const CARD_MARGIN = theme.spacing.xs;
// Ensure equal spacing on both sides by accounting for container padding and margins between cards
const CONTAINER_PADDING = theme.spacing.base; // Padding on both left and right sides
const CARD_WIDTH = (width - CONTAINER_PADDING * 2 - CARD_MARGIN * 6) / 3;

const SearchScreen = observer(() => {
  const { moviesStore } = useStore();
  const router = useRouter();
  const { query } = useLocalSearchParams();
  const [searchText, setSearchText] = useState(
    typeof query === "string" ? query : ""
  );

  useEffect(() => {
    // If query is provided in params, search for it
    if (typeof query === "string" && query) {
      performSearch(query);
    }

    // Reset search when leaving the page
    return () => {
      moviesStore.resetSearch();
    };
  }, [query]);

  const performSearch = (text: string) => {
    moviesStore.searchMovies(text);
  };

  const handleSearch = () => {
    performSearch(searchText);
  };

  const handleClearSearch = () => {
    setSearchText("");
    moviesStore.resetSearch();
  };

  const handleRecentSearch = (item: string) => {
    setSearchText(item);
    performSearch(item);
  };

  const handleClearAllRecent = () => {
    moviesStore.clearRecentSearches();
  };

  const handleBack = () => {
    router.back();
  };

  const handleLoadMore = () => {
    moviesStore.loadMoreSearchResults();
  };

  // Render footer for the search results list
  const renderFooter = () => {
    if (moviesStore.isSearching) {
      return (
        <View style={styles.footerContainer}>
          <ActivityIndicator size="small" color={theme.palette.primary} />
        </View>
      );
    }

    if (
      !moviesStore.hasMoreSearchResults &&
      moviesStore.searchResults.length > 0
    ) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.endListText}>No more results</Text>
        </View>
      );
    }

    return null;
  };

  // Render empty component
  const renderEmptyComponent = () => {
    if (moviesStore.isSearching) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={theme.palette.primary} />
        </View>
      );
    }

    if (moviesStore.error) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorText}>{moviesStore.error}</Text>
        </View>
      );
    }

    if (moviesStore.searchQuery && moviesStore.searchResults.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="search-outline"
            size={48}
            color={theme.palette.lightGray}
          />
          <Text style={styles.emptyText}>No results found</Text>
        </View>
      );
    }

    // Show recent searches if available
    if (moviesStore.recentSearches.length > 0 && !moviesStore.searchQuery) {
      return (
        <View style={styles.recentContainer}>
          <View style={styles.recentHeader}>
            <Text style={styles.recentTitle}>Recent Searches</Text>
            <TouchableOpacity onPress={handleClearAllRecent}>
              <Text style={styles.clearText}>Clear all</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={moviesStore.recentSearches}
            keyExtractor={(item, index) => `recent-${index}`}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.recentItem}
                onPress={() => handleRecentSearch(item)}
              >
                <Ionicons
                  name="time-outline"
                  size={16}
                  color={theme.palette.mediumGray}
                />
                <Text style={styles.recentText}>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      );
    }

    // Empty state for new search
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="search" size={48} color={theme.palette.lightGray} />
        <Text style={styles.emptyText}>Search for movies by title</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={theme.palette.white}
      />
      
      {/* Status bar spacing for Android */}
      {Platform.OS === 'android' && <View style={{ height: StatusBar.currentHeight }} />}

      {/* Search header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.palette.primary}
          />
        </TouchableOpacity>

        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color={theme.palette.mediumGray}
            onPress={handleSearch}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search movies..."
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            autoFocus
          />
          {searchText ? (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons
                name="close-circle"
                size={20}
                color={theme.palette.mediumGray}
              />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* Search results */}
      <FlatList
        data={moviesStore.searchResults}
        keyExtractor={(item) => item.imdbID}
        numColumns={3}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <MovieCard movie={item} cardWidth={CARD_WIDTH} showTitle={true} />
          </View>
        )}
      />
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.light,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.md,
    paddingTop: Platform.OS === 'ios' ? theme.spacing.lg : theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.veryLightGray,
  },
  backButton: {
    padding: theme.spacing.xs,
    marginRight: theme.spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.palette.veryLightGray,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.xs,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.typography.fontSize.md,
    marginHorizontal: theme.spacing.sm,
    padding: 0,
    color: theme.palette.text.primary.light,
  },
  listContent: {
    marginLeft: 3,
    paddingBottom: theme.spacing.xxxl,
    paddingTop: theme.spacing.base,
    flexGrow: 1,
  },
  cardContainer: {
    margin: CARD_MARGIN,
  },
  footerContainer: {
    paddingVertical: theme.spacing.xl,
    alignItems: "center",
  },
  endListText: {
    color: theme.palette.text.secondary.light,
    fontSize: theme.typography.fontSize.sm,
  },
  emptyContainer: {
    flex: 1,
    paddingTop: 100,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  emptyText: {
    color: theme.palette.text.secondary.light,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.md,
  },
  errorText: {
    color: theme.palette.error,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.md,
    textAlign: "center",
  },
  recentContainer: {
    flex: 1,
    padding: theme.spacing.base,
  },
  recentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  recentTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
    color: theme.palette.text.primary.light,
  },
  clearText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.palette.primary,
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.palette.veryLightGray,
  },
  recentText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.palette.text.primary.light,
    marginLeft: theme.spacing.sm,
  },
});

export default SearchScreen;