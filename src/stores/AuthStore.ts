import { makeAutoObservable, runInAction } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';

class AuthStore {
  isLoggedIn: boolean = false;
  isLoading: boolean = true;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  async initialize() {
    try {
      const storedLoginState = await AsyncStorage.getItem('isLoggedIn');
      runInAction(() => {
        this.isLoggedIn = storedLoginState === 'true';
        this.isLoading = false;
      });
    } catch (error) {
      console.error('Error loading auth state:', error);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    // Check credentials
    if (username === 'ivaldi' && password === 'testtest') {
      runInAction(() => {
        this.isLoggedIn = true;
      });
      // Store login state
      await AsyncStorage.setItem('isLoggedIn', 'true');
      return true;
    }
    return false;
  }

  async logout() {
    runInAction(() => {
      this.isLoggedIn = false;
    });
    // Clear login state
    await AsyncStorage.setItem('isLoggedIn', 'false');
  }
}

export default AuthStore;
