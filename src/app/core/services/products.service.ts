import { inject, Injectable, signal } from '@angular/core';
import { DEFAULT_VAT_RATE } from '../constants/vat';
import { INITIAL_PRODUCTS } from '../../data/initial-data';
import { Product, ProductDraft } from '../../models/product';
import { StorageService } from './storage.service';

const PRODUCTS_KEY = 'dashboard.products';
const LEGACY_VAT_RATE = 20;
const VAT_MIGRATION_KEY = `dashboard.products.vat${DEFAULT_VAT_RATE}-migrated`;

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private readonly storage = inject(StorageService);
  private readonly state = signal<readonly Product[]>(this.load());

  readonly products = this.state.asReadonly();

  add(draft: ProductDraft): void {
    const nextId = Math.max(0, ...this.state().map(({ id }) => id)) + 1;
    this.save([...this.state(), { id: nextId, ...draft }]);
  }

  update(id: number, draft: ProductDraft): void {
    this.save(this.state().map((product) => (product.id === id ? { id, ...draft } : product)));
  }

  remove(id: number): void {
    this.save(this.state().filter((product) => product.id !== id));
  }

  private load(): readonly Product[] {
    const stored = this.storage.get<Product[]>(PRODUCTS_KEY);
    if (stored) {
      if (this.storage.get<boolean>(VAT_MIGRATION_KEY)) return stored;

      const migrated = stored.map((product) =>
        product.vat === LEGACY_VAT_RATE ? { ...product, vat: DEFAULT_VAT_RATE } : product,
      );
      this.storage.set(PRODUCTS_KEY, migrated);
      this.storage.set(VAT_MIGRATION_KEY, true);
      return migrated;
    }

    const initial = INITIAL_PRODUCTS.map((product) => ({ ...product }));
    this.storage.set(PRODUCTS_KEY, initial);
    this.storage.set(VAT_MIGRATION_KEY, true);
    return initial;
  }

  private save(products: readonly Product[]): void {
    this.storage.set(PRODUCTS_KEY, products);
    this.state.set(products);
  }
}
