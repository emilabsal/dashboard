export interface Product {
  readonly id: number;
  readonly name: string;
  readonly price: number;
  readonly vat: number;
}

export type ProductDraft = Omit<Product, 'id'>;
