import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TuiButton, TuiDialog, TuiIcon, TuiInput, TuiNotificationService } from '@taiga-ui/core';
import { TuiTable } from '@taiga-ui/addon-table';
import { TuiBadge, TuiInputNumber } from '@taiga-ui/kit';
import { DEFAULT_VAT_RATE } from '../../core/constants/vat';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-dashboard-page',
  imports: [
    CurrencyPipe,
    DecimalPipe,
    ReactiveFormsModule,
    TuiBadge,
    TuiButton,
    TuiDialog,
    TuiIcon,
    TuiInput,
    TuiInputNumber,
    TuiTable,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage {
  private readonly productsService = inject(ProductsService);
  private readonly notifications = inject(TuiNotificationService);

  protected readonly products = this.productsService.products;
  protected readonly totalValue = computed(() =>
    this.products().reduce((sum, item) => sum + item.price, 0),
  );
  protected readonly averagePrice = computed(() =>
    this.products().length ? this.totalValue() / this.products().length : 0,
  );

  protected productDialogOpen = false;
  protected confirmDialogOpen = false;
  protected editingProduct: Product | null = null;
  protected pendingDelete: Product | null = null;

  protected readonly productForm = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(80)],
    }),
    price: new FormControl<number | null>(null, [Validators.required, Validators.min(0.01)]),
    vat: new FormControl<number | null>(DEFAULT_VAT_RATE, [
      Validators.required,
      Validators.min(0),
      Validators.max(100),
    ]),
  });

  protected openCreate(): void {
    this.editingProduct = null;
    this.productForm.reset({ name: '', price: null, vat: DEFAULT_VAT_RATE });
    this.productDialogOpen = true;
  }

  protected openEdit(product: Product): void {
    this.editingProduct = product;
    this.productForm.reset({ name: product.name, price: product.price, vat: product.vat });
    this.productDialogOpen = true;
  }

  protected saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const raw = this.productForm.getRawValue();
    const draft = { name: raw.name.trim(), price: Number(raw.price), vat: Number(raw.vat) };
    if (!draft.name) {
      this.productForm.controls.name.setErrors({ required: true });
      return;
    }

    if (this.editingProduct) {
      this.productsService.update(this.editingProduct.id, draft);
    } else {
      this.productsService.add(draft);
    }

    this.productDialogOpen = false;
    this.notifications
      .open(this.editingProduct ? 'Изменения сохранены.' : 'Новый товар добавлен в каталог.', {
        label: this.editingProduct ? 'Товар обновлён' : 'Товар добавлен',
        appearance: 'positive',
      })
      .subscribe();
  }

  protected askDelete(product: Product): void {
    this.pendingDelete = product;
    this.confirmDialogOpen = true;
  }

  protected confirmDelete(): void {
    if (!this.pendingDelete) return;
    this.productsService.remove(this.pendingDelete.id);
    this.confirmDialogOpen = false;
    this.pendingDelete = null;
    this.notifications.open('Товар удалён из каталога.', { label: 'Готово' }).subscribe();
  }
}
