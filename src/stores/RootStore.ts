import { makeAutoObservable } from 'mobx';
import AuthStore from './AuthStore';

class RootStore {
  authStore: AuthStore;

  constructor() {
    this.authStore = new AuthStore();
    makeAutoObservable(this);
  }
}

export default RootStore;
