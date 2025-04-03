import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { observer } from "mobx-react";
import { useStore } from "../../src/context/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import theme from "../../src/theme";

const { width, height } = Dimensions.get("window");

const DEFAULT_POSTER = "https://via.placeholder.com/300x450?text=No+Poster";

const MovieDetail = observer(() => {
  const { id } = useLocalSearchParams();
  const { moviesStore } = useStore();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      moviesStore.getMovieDetails(id as string);
    }

    // Clean up selected movie when unmounting
    return () => {
      moviesStore.clearSelectedMovie();
    };
  }, [id]);

  if (moviesStore.isMovieDetailsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.palette.primary} />
      </View>
    );
  }

  if (!moviesStore.selectedMovie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load movie details.</Text>
      </View>
    );
  }

  const movie = moviesStore.selectedMovie;

  const posterSource =
    movie.Poster && movie.Poster !== "N/A"
      ? { uri: movie.Poster }
      : { uri: DEFAULT_POSTER };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Back button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        activeOpacity={0.7}
      >
        <Ionicons name="chevron-back" size={28} color={theme.palette.white} />
      </TouchableOpacity>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        {/* Movie poster with gradient overlay */}
        <View style={styles.posterContainer}>
          <Image
            source={posterSource}
            style={styles.poster}
            resizeMode="cover"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.gradient}
          />
        </View>

        {/* Movie title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{movie.Title}</Text>
          <Text style={styles.year}>{movie.Year}</Text>
        </View>

        {/* Movie info */}
        <View style={styles.infoContainer}>
          {/* Rating */}
          {movie.imdbRating && movie.imdbRating !== "N/A" && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{movie.imdbRating}/10</Text>
            </View>
          )}

          {/* Runtime and Genre */}
          <View style={styles.metaContainer}>
            {movie.Runtime && movie.Runtime !== "N/A" && (
              <Text style={styles.metaText}>{movie.Runtime}</Text>
            )}
            {movie.Genre && movie.Genre !== "N/A" && (
              <Text style={styles.metaText}>{movie.Genre}</Text>
            )}
            {movie.Released && movie.Released !== "N/A" && (
              <Text style={styles.metaText}>Released: {movie.Released}</Text>
            )}
          </View>

          {/* Plot */}
          {movie.Plot && movie.Plot !== "N/A" && (
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>Synopsis</Text>
              <Text style={styles.plot}>{movie.Plot}</Text>
            </View>
          )}

          {/* Cast and crew */}
          <View style={styles.creditsContainer}>
            {movie.Director && movie.Director !== "N/A" && (
              <View style={styles.creditItem}>
                <Text style={styles.creditLabel}>Director</Text>
                <Text style={styles.creditValue}>{movie.Director}</Text>
              </View>
            )}

            {movie.Actors && movie.Actors !== "N/A" && (
              <View style={styles.creditItem}>
                <Text style={styles.creditLabel}>Cast</Text>
                <Text style={styles.creditValue}>{movie.Actors}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Add some padding at the bottom for better scrolling experience */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.dark,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.palette.background.dark,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.xl,
    backgroundColor: theme.palette.background.dark,
  },
  errorText: {
    color: theme.palette.error,
    textAlign: "center",
    fontSize: theme.typography.fontSize.md,
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 50 : StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 25,
    left: theme.spacing.md,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  posterContainer: {
    width: width,
    height: height * 0.55,
    position: "relative",
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 150,
  },
  titleContainer: {
    alignItems: "center",
    paddingHorizontal: theme.spacing.xl,
    marginTop: -40,
    marginBottom: theme.spacing.xl,
  },
  title: {
    color: theme.palette.white,
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: "bold",
    textAlign: "center",
  },
  year: {
    color: theme.palette.lightGray,
    fontSize: theme.typography.fontSize.md,
    marginTop: theme.spacing.xs,
  },
  infoContainer: {
    paddingHorizontal: theme.spacing.xl,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.md,
  },
  rating: {
    color: theme.palette.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    marginLeft: theme.spacing.xs,
  },
  metaContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: theme.spacing.xl,
  },
  metaText: {
    color: theme.palette.lightGray,
    fontSize: theme.typography.fontSize.sm,
    marginHorizontal: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  sectionContainer: {
    marginBottom: theme.spacing.xxl,
  },
  sectionTitle: {
    color: theme.palette.white,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: "bold",
    marginBottom: theme.spacing.sm,
  },
  plot: {
    color: theme.palette.lightGray,
    fontSize: theme.typography.fontSize.md,
    lineHeight: 22,
  },
  creditsContainer: {
    marginBottom: theme.spacing.xl,
  },
  creditItem: {
    marginBottom: theme.spacing.md,
  },
  creditLabel: {
    color: theme.palette.white,
    fontSize: theme.typography.fontSize.md,
    fontWeight: "bold",
    marginBottom: theme.spacing.xs,
  },
  creditValue: {
    color: theme.palette.lightGray,
    fontSize: theme.typography.fontSize.sm,
    lineHeight: 20,
  },
  bottomPadding: {
    height: theme.spacing.xxxl,
  },
});

export default MovieDetail;