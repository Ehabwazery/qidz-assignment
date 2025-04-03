import { makeAutoObservable } from 'mobx';
import AuthStore from './AuthStore';
import MoviesStore from './MoviesStore';

class RootStore {
  authStore: AuthStore;
  moviesStore: MoviesStore;

  constructor() {
    this.authStore = new AuthStore();
    this.moviesStore = new MoviesStore();
    makeAutoObservable(this);
  }
}

export default RootStore;
