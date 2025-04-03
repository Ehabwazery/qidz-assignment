import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  ActivityIndicator, 
  Dimensions 
} from 'react-native';
import { Movie } from '../stores/MoviesStore';
import MovieCard from './MovieCard';
import theme from '../theme';

const { width } = Dimensions.get('window');

interface MovieSectionProps {
  title: string;
  movies: Movie[];
  isLoading: boolean;
  error?: string | null;
  showTitles?: boolean;
  largeCards?: boolean;
  customCardWidth?: number;
}

const MovieSection: React.FC<MovieSectionProps> = ({
  title,
  movies,
  isLoading,
  error,
  showTitles = false,
  largeCards = false,
  customCardWidth,
}) => {
  // Calculate card width based on whether we're using large cards or a custom width
  const cardWidth = customCardWidth 
    ? customCardWidth 
    : largeCards 
      ? width * 0.65 
      : width * 0.33;
  
  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={theme.palette.primary} />
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <FlatList
        data={movies}
        keyExtractor={(item) => item.imdbID}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <MovieCard 
            movie={item} 
            cardWidth={cardWidth} 
            showTitle={showTitles}
            largeCard={largeCards || !!customCardWidth}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: 'bold',
    marginBottom: theme.spacing.md,
    marginLeft: theme.spacing.base,
    color: theme.palette.text.primary.light,
  },
  listContent: {
    paddingHorizontal: theme.spacing.base,
  },
  loadingContainer: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: theme.palette.error,
    marginLeft: theme.spacing.base,
  },
});

export default MovieSection;