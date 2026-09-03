import {DEFAULT_VAT_RATE} from '../core/constants/vat';
import {Product} from '../models/product';
import {Purchase} from '../models/purchase';

export const INITIAL_PRODUCTS: readonly Product[] = [
  {id: 1, name: 'Ноутбук Pro 14', price: 124_990, vat: DEFAULT_VAT_RATE},
  {id: 2, name: 'Беспроводная мышь', price: 3_490, vat: DEFAULT_VAT_RATE},
  {id: 3, name: 'Монитор 27″', price: 39_990, vat: DEFAULT_VAT_RATE},
  {id: 4, name: 'Офисное кресло', price: 28_500, vat: DEFAULT_VAT_RATE},
  {id: 5, name: 'Клавиатура Compact', price: 7_990, vat: DEFAULT_VAT_RATE},
];

export const INITIAL_PURCHASES: readonly Purchase[] = [
  {id: 1048, productName: 'Ноутбук Pro 14', username: 'test', amount: 152_487.8, date: '2026-08-28T11:24:00.000Z'},
  {id: 1047, productName: 'Беспроводная мышь', username: 'test', amount: 4_257.8, date: '2026-08-24T09:15:00.000Z'},
  {id: 1046, productName: 'Монитор 27″', username: 'test', amount: 48_787.8, date: '2026-08-19T16:40:00.000Z'},
  {id: 1045, productName: 'Клавиатура Compact', username: 'test', amount: 9_747.8, date: '2026-08-12T08:05:00.000Z'},
];
