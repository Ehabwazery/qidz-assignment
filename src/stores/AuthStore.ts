import { makeAutoObservable, runInAction } from "mobx";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface User {
  id: string;
  username: string;
  displayName: string;
  email: string;
}

class AuthStore {
  isLoggedIn: boolean = false;
  isLoading: boolean = true;
  user: User | null = null;

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  async initialize() {
    try {
      const storedLoginState = await AsyncStorage.getItem("isLoggedIn");
      const storedUserData = await AsyncStorage.getItem("userData");

      runInAction(() => {
        this.isLoggedIn = storedLoginState === "true";
        if (storedUserData) {
          this.user = JSON.parse(storedUserData);
        }
        this.isLoading = false;
      });
    } catch (error) {
      console.error("Error loading auth state:", error);
      runInAction(() => {
        this.isLoading = false;
      });
    }
  }

  async login(username: string, password: string): Promise<boolean> {
    // Check credentials
    if (username === "ivaldi" && password === "testtest") {
      const userData: User = {
        id: "1",
        username: "ivaldi",
        displayName: "Ivaldi",
        email: "user@example.com",
      };

      runInAction(() => {
        this.isLoggedIn = true;
        this.user = userData;
      });

      // Store login state and user data
      await AsyncStorage.setItem("isLoggedIn", "true");
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
      return true;
    }
    return false;
  }

  async logout() {
    await this.signOut();
  }

  async signOut() {
    runInAction(() => {
      this.isLoggedIn = false;
      this.user = null;
    });

    // Clear login state and user data
    await AsyncStorage.multiRemove(["isLoggedIn", "userData"]);
  }
}

export default AuthStore;
