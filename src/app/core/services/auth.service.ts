import {computed, inject, Injectable, signal} from '@angular/core';
import {StorageService} from './storage.service';

const AUTH_KEY = 'dashboard.auth';
const CREDENTIALS = {username: 'test', password: 'Test1234'} as const;

@Injectable({providedIn: 'root'})
export class AuthService {
  private readonly storage = inject(StorageService);
  private readonly session = signal(this.storage.get<{username: string}>(AUTH_KEY));

  readonly isAuthenticated = computed(() => this.session() !== null);
  readonly username = computed(() => this.session()?.username ?? '');

  login(username: string, password: string): boolean {
    if (username !== CREDENTIALS.username || password !== CREDENTIALS.password) {
      return false;
    }

    const session = {username};
    this.storage.set(AUTH_KEY, session);
    this.session.set(session);
    return true;
  }

  logout(): void {
    this.storage.remove(AUTH_KEY);
    this.session.set(null);
  }
}
