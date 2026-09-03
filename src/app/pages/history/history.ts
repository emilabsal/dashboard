import {CurrencyPipe, DatePipe} from '@angular/common';
import {ChangeDetectionStrategy, Component, computed, inject} from '@angular/core';
import {TuiIcon} from '@taiga-ui/core';
import {TuiTable} from '@taiga-ui/addon-table';
import {PurchasesService} from '../../core/services/purchases.service';

@Component({
  selector: 'app-history-page',
  imports: [CurrencyPipe, DatePipe, TuiIcon, TuiTable],
  templateUrl: './history.html',
  styleUrl: './history.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryPage {
  private readonly purchasesService = inject(PurchasesService);
  protected readonly purchases = this.purchasesService.purchases;
  protected readonly total = computed(() => this.purchases().reduce((sum, item) => sum + item.amount, 0));
}
