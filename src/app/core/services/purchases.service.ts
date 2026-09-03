import {inject, Injectable, signal} from '@angular/core';
import {DEFAULT_VAT_RATE} from '../constants/vat';
import {INITIAL_PURCHASES} from '../../data/initial-data';
import {Purchase} from '../../models/purchase';
import {StorageService} from './storage.service';

const PURCHASES_KEY = 'dashboard.purchases';
const LEGACY_VAT_RATE = 20;
const VAT_MIGRATION_KEY = `dashboard.purchases.vat${DEFAULT_VAT_RATE}-migrated`;

@Injectable({providedIn: 'root'})
export class PurchasesService {
  private readonly storage = inject(StorageService);
  readonly purchases = signal<readonly Purchase[]>(this.load()).asReadonly();

  private load(): readonly Purchase[] {
    const stored = this.storage.get<Purchase[]>(PURCHASES_KEY);
    if (stored) {
      if (this.storage.get<boolean>(VAT_MIGRATION_KEY)) return stored;

      const migrated = stored.map((purchase) => ({
        ...purchase,
        amount:
          Math.round(
            (purchase.amount / (1 + LEGACY_VAT_RATE / 100)) *
              (1 + DEFAULT_VAT_RATE / 100) *
              100,
          ) / 100,
      }));
      this.storage.set(PURCHASES_KEY, migrated);
      this.storage.set(VAT_MIGRATION_KEY, true);
      return migrated;
    }

    const initial = INITIAL_PURCHASES.map((purchase) => ({...purchase}));
    this.storage.set(PURCHASES_KEY, initial);
    this.storage.set(VAT_MIGRATION_KEY, true);
    return initial;
  }
}
