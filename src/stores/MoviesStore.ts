import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Movie {
  imdbID: string;
  Title: string;
  Year: string;
  Poster: string;
  Type: string;
}

export interface MovieDetails extends Movie {
  Rated?: string;
  Released?: string;
  Runtime?: string;
  Genre?: string;
  Director?: string;
  Writer?: string;
  Actors?: string;
  Plot?: string;
  Language?: string;
  Country?: string;
  Awards?: string;
  Ratings?: { Source: string; Value: string }[];
  Metascore?: string;
  imdbRating?: string;
  imdbVotes?: string;
  DVD?: string;
  BoxOffice?: string;
  Production?: string;
  Website?: string;
  Response?: string;
}

const RECENT_SEARCHES_KEY = 'recentSearches';
const MAX_RECENT_SEARCHES = 10;

class MoviesStore {
  // Movies arrays for different categories
  movies: Movie[] = [];
  trendingMovies: Movie[] = [];
  upcomingMovies: Movie[] = [];
  topRatedMovies: Movie[] = [];
  searchResults: Movie[] = [];
  
  // Search related
  recentSearches: string[] = [];
  searchQuery: string = '';
  
  // All movies for pagination
  allCarMovies: Movie[] = [];
  allTrendingMovies: Movie[] = [];
  allUpcomingMovies: Movie[] = [];
  allTopRatedMovies: Movie[] = [];
  
  // Selected movie for details page
  selectedMovie: MovieDetails | null = null;
  
  // Loading states
  isLoading: boolean = false;
  isTrendingLoading: boolean = false;
  isUpcomingLoading: boolean = false;
  isTopRatedLoading: boolean = false;
  isSearchLoading: boolean = false;
  isSearching: boolean = false;
  isMovieDetailsLoading: boolean = false;
  isLoadingMore: boolean = false;
  
  // Pagination info
  currentPage: { [key: string]: number } = {
    car: 1,
    trending: 1,
    upcoming: 1,
    topRated: 1
  };
  
  totalResults: { [key: string]: number } = {
    car: 0,
    trending: 0,
    upcoming: 0,
    topRated: 0
  };
  
  hasMore: { [key: string]: boolean } = {
    car: true,
    trending: true,
    upcoming: true,
    topRated: true
  };
  
  // Search pagination
  searchPage: number = 1;
  totalSearchResults: number = 0;
  hasMoreSearchResults: boolean = false;
  
  error: string | null = null;
  
  constructor() {
    makeAutoObservable(this);
    this.loadRecentSearches();
  }
  
  async loadRecentSearches() {
    try {
      const storedSearches = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
      if (storedSearches) {
        runInAction(() => {
          this.recentSearches = JSON.parse(storedSearches);
        });
      }
    } catch (error) {
      console.log('Error loading recent searches:', error);
    }
  }
  
  async saveRecentSearches() {
    try {
      await AsyncStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(this.recentSearches));
    } catch (error) {
      console.log('Error saving recent searches:', error);
    }
  }
  
  addToRecentSearches(query: string) {
    if (!query.trim()) return;
    
    // Remove the query if it already exists (to move it to the top)
    const filteredSearches = this.recentSearches.filter(s => s !== query);
    
    // Add the new query to the beginning
    const newSearches = [query, ...filteredSearches].slice(0, MAX_RECENT_SEARCHES);
    
    runInAction(() => {
      this.recentSearches = newSearches;
    });
    
    this.saveRecentSearches();
  }
  
  clearRecentSearches() {
    runInAction(() => {
      this.recentSearches = [];
    });
    
    this.saveRecentSearches();
  }
  
  async fetchAllMovies() {
    await Promise.all([
      this.fetchCarMovies(1, false),
      this.fetchTrendingMovies(1, false),
      this.fetchUpcomingMovies(1, false),
      this.fetchTopRatedMovies(1, false)
    ]);
  }
  
  async fetchCarMovies(page = 1, loadMore = false) {
    if (page === 1) {
      this.isLoading = true;
    } else if (loadMore) {
      this.isLoadingMore = true;
    }
    this.error = null;
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=741fd8d3&s=car&type=movie&page=${page}`
      );
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        runInAction(() => {
          if (page === 1) {
            this.movies = data.Search || [];
            this.allCarMovies = data.Search || [];
          } else if (loadMore) {
            this.allCarMovies = [...this.allCarMovies, ...(data.Search || [])];
          }
          
          this.totalResults.car = parseInt(data.totalResults, 10) || 0;
          this.currentPage.car = page;
          this.hasMore.car = this.allCarMovies.length < this.totalResults.car;
          
          this.isLoading = false;
          this.isLoadingMore = false;
        });
      } else {
        runInAction(() => {
          this.error = data.Error || 'Failed to fetch movies';
          if (page === 1) {
            this.movies = [];
            this.allCarMovies = [];
          }
          this.isLoading = false;
          this.isLoadingMore = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = 'Network error';
        if (page === 1) {
          this.movies = [];
          this.allCarMovies = [];
        }
        this.isLoading = false;
        this.isLoadingMore = false;
      });
    }
  }
  
  async fetchTrendingMovies(page = 1, loadMore = false) {
    if (page === 1) {
      this.isTrendingLoading = true;
    } else if (loadMore) {
      this.isLoadingMore = true;
    }
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=741fd8d3&s=fast&type=movie&page=${page}`
      );
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        runInAction(() => {
          if (page === 1) {
            this.trendingMovies = data.Search || [];
            this.allTrendingMovies = data.Search || [];
          } else if (loadMore) {
            this.allTrendingMovies = [...this.allTrendingMovies, ...(data.Search || [])];
          }
          
          this.totalResults.trending = parseInt(data.totalResults, 10) || 0;
          this.currentPage.trending = page;
          this.hasMore.trending = this.allTrendingMovies.length < this.totalResults.trending;
          
          this.isTrendingLoading = false;
          this.isLoadingMore = false;
        });
      } else {
        runInAction(() => {
          this.error = data.Error || 'Failed to fetch trending movies';
          if (page === 1) {
            this.trendingMovies = [];
            this.allTrendingMovies = [];
          }
          this.isTrendingLoading = false;
          this.isLoadingMore = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = 'Network error';
        if (page === 1) {
          this.trendingMovies = [];
          this.allTrendingMovies = [];
        }
        this.isTrendingLoading = false;
        this.isLoadingMore = false;
      });
    }
  }
  
  async fetchUpcomingMovies(page = 1, loadMore = false) {
    if (page === 1) {
      this.isUpcomingLoading = true;
    } else if (loadMore) {
      this.isLoadingMore = true;
    }
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=741fd8d3&s=2023&type=movie&page=${page}`
      );
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        runInAction(() => {
          if (page === 1) {
            this.upcomingMovies = data.Search || [];
            this.allUpcomingMovies = data.Search || [];
          } else if (loadMore) {
            this.allUpcomingMovies = [...this.allUpcomingMovies, ...(data.Search || [])];
          }
          
          this.totalResults.upcoming = parseInt(data.totalResults, 10) || 0;
          this.currentPage.upcoming = page;
          this.hasMore.upcoming = this.allUpcomingMovies.length < this.totalResults.upcoming;
          
          this.isUpcomingLoading = false;
          this.isLoadingMore = false;
        });
      } else {
        runInAction(() => {
          this.error = data.Error || 'Failed to fetch upcoming movies';
          if (page === 1) {
            this.upcomingMovies = [];
            this.allUpcomingMovies = [];
          }
          this.isUpcomingLoading = false;
          this.isLoadingMore = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = 'Network error';
        if (page === 1) {
          this.upcomingMovies = [];
          this.allUpcomingMovies = [];
        }
        this.isUpcomingLoading = false;
        this.isLoadingMore = false;
      });
    }
  }
  
  async fetchTopRatedMovies(page = 1, loadMore = false) {
    if (page === 1) {
      this.isTopRatedLoading = true;
    } else if (loadMore) {
      this.isLoadingMore = true;
    }
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=741fd8d3&s=best&type=movie&page=${page}`
      );
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        runInAction(() => {
          if (page === 1) {
            this.topRatedMovies = data.Search || [];
            this.allTopRatedMovies = data.Search || [];
          } else if (loadMore) {
            this.allTopRatedMovies = [...this.allTopRatedMovies, ...(data.Search || [])];
          }
          
          this.totalResults.topRated = parseInt(data.totalResults, 10) || 0;
          this.currentPage.topRated = page;
          this.hasMore.topRated = this.allTopRatedMovies.length < this.totalResults.topRated;
          
          this.isTopRatedLoading = false;
          this.isLoadingMore = false;
        });
      } else {
        runInAction(() => {
          this.error = data.Error || 'Failed to fetch top rated movies';
          if (page === 1) {
            this.topRatedMovies = [];
            this.allTopRatedMovies = [];
          }
          this.isTopRatedLoading = false;
          this.isLoadingMore = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = 'Network error';
        if (page === 1) {
          this.topRatedMovies = [];
          this.allTopRatedMovies = [];
        }
        this.isTopRatedLoading = false;
        this.isLoadingMore = false;
      });
    }
  }
  
  async searchMovies(query: string, page = 1) {
    if (!query.trim()) return;
    
    this.error = null;
    
    if (page === 1) {
      this.isSearching = true;
      this.searchResults = [];
      this.searchQuery = query;
      this.searchPage = 1;
      
      // Add to recent searches
      this.addToRecentSearches(query);
    } else {
      this.isLoadingMore = true;
    }
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=741fd8d3&s=${encodeURIComponent(query)}&type=movie&page=${page}`
      );
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        runInAction(() => {
          if (page === 1) {
            this.searchResults = data.Search || [];
          } else {
            this.searchResults = [...this.searchResults, ...(data.Search || [])];
          }
          
          this.totalSearchResults = parseInt(data.totalResults, 10) || 0;
          this.searchPage = page;
          this.hasMoreSearchResults = this.searchResults.length < this.totalSearchResults;
          
          this.isSearching = false;
          this.isLoadingMore = false;
        });
      } else {
        runInAction(() => {
          this.error = data.Error || 'No movies found';
          
          if (page === 1) {
            this.searchResults = [];
          }
          
          this.isSearching = false;
          this.isLoadingMore = false;
          this.hasMoreSearchResults = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = 'Network error';
        
        if (page === 1) {
          this.searchResults = [];
        }
        
        this.isSearching = false;
        this.isLoadingMore = false;
        this.hasMoreSearchResults = false;
      });
    }
  }
  
  async loadMoreSearchResults() {
    if (this.isLoadingMore || !this.hasMoreSearchResults) return;
    
    const nextPage = this.searchPage + 1;
    await this.searchMovies(this.searchQuery, nextPage);
  }
  
  resetSearch() {
    runInAction(() => {
      this.searchResults = [];
      this.searchQuery = '';
      this.error = null;
      this.isSearching = false;
      this.isLoadingMore = false;
      this.searchPage = 1;
      this.totalSearchResults = 0;
      this.hasMoreSearchResults = false;
    });
  }
  
  async getMovieDetails(id: string) {
    this.isMovieDetailsLoading = true;
    
    try {
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=741fd8d3&i=${id}&plot=full`
      );
      
      const data = await response.json();
      
      if (data.Response === 'True') {
        runInAction(() => {
          this.selectedMovie = data;
          this.isMovieDetailsLoading = false;
        });
      } else {
        runInAction(() => {
          this.error = data.Error || 'Movie details not found';
          this.selectedMovie = null;
          this.isMovieDetailsLoading = false;
        });
      }
    } catch (error) {
      runInAction(() => {
        this.error = 'Network error';
        this.selectedMovie = null;
        this.isMovieDetailsLoading = false;
      });
    }
  }
  
  clearSelectedMovie() {
    this.selectedMovie = null;
  }
  
  async loadMoreMovies(type: string) {
    if (this.isLoadingMore || !this.hasMore[type]) return;
    
    const nextPage = this.currentPage[type] + 1;
    
    switch(type) {
      case 'car':
        await this.fetchCarMovies(nextPage, true);
        break;
      case 'trending':
        await this.fetchTrendingMovies(nextPage, true);
        break;
      case 'upcoming':
        await this.fetchUpcomingMovies(nextPage, true);
        break;
      case 'topRated':
        await this.fetchTopRatedMovies(nextPage, true);
        break;
      default:
        break;
    }
  }
  
  getMoviesByType(type: string): Movie[] {
    switch(type) {
      case 'car':
        return this.allCarMovies;
      case 'trending':
        return this.allTrendingMovies;
      case 'upcoming':
        return this.allUpcomingMovies;
      case 'topRated':
        return this.allTopRatedMovies;
      default:
        return [];
    }
  }
  
  isLoadingByType(type: string): boolean {
    switch(type) {
      case 'car':
        return this.isLoading;
      case 'trending':
        return this.isTrendingLoading;
      case 'upcoming':
        return this.isUpcomingLoading;
      case 'topRated':
        return this.isTopRatedLoading;
      default:
        return false;
    }
  }
  
  hasMoreByType(type: string): boolean {
    return this.hasMore[type] || false;
  }
}

export default MoviesStore;