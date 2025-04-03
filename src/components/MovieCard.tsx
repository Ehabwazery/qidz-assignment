import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useRouter } from "expo-router";
import { Movie } from "../stores/MoviesStore";
import theme from "../theme";

const { width } = Dimensions.get("window");

interface MovieCardProps {
  movie: Movie;
  cardWidth?: number;
  showTitle?: boolean;
  largeCard?: boolean;
}

const DEFAULT_POSTER = "https://via.placeholder.com/300x450?text=No+Poster";

const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  cardWidth = width * 0.4,
  showTitle = false,
  largeCard = false,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/movie/${movie.imdbID}`);
  };

  const imageSource =
    movie.Poster && movie.Poster !== "N/A"
      ? { uri: movie.Poster }
      : { uri: DEFAULT_POSTER };

  // Calculate card height based on aspect ratio (2:3 for movie posters)
  const cardHeight = (cardWidth / 2) * 3;

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      style={[
        styles.container,
        {
          width: cardWidth,
          marginRight: largeCard ? 8 : 12,
        },
      ]}
    >
      <View
        style={[styles.cardContainer, { width: cardWidth, height: cardHeight }]}
      >
        <Image source={imageSource} style={styles.poster} resizeMode="cover" />
        {showTitle && (
          <View style={styles.titleContainer}>
            <Text style={styles.title} numberOfLines={1}>
              {movie.Title}
            </Text>
            <Text style={styles.year}>{movie.Year}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  cardContainer: {
    borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    backgroundColor: theme.palette.veryLightGray,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  titleContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    padding: theme.spacing.sm,
  },
  title: {
    color: theme.palette.white,
    fontWeight: "bold",
    fontSize: theme.typography.fontSize.sm,
  },
  year: {
    color: theme.palette.lightGray,
    fontSize: theme.typography.fontSize.xs,
    marginTop: 2,
  },
});

export default MovieCard;