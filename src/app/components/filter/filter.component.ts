import {Component, Output, EventEmitter, Input} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @Input() filterHouseNumber: string = '';
  @Input() filterBlock: string = '';
  @Input() filterLand: string = '';
  @Input() minPrice: number | null = null;
  @Input() maxPrice: number | null = null;

  @Output() filterChange = new EventEmitter<void>();
  @Output() resetFilters = new EventEmitter<void>();
  @Output() filterChanged = new EventEmitter<any>();

  // filterHouseNumber = '';
  // filterBlock = '';
  // filterLand = '';
  // minPrice = 0;
  // maxPrice = 0;

  applyFilters() {
    this.filterChanged.emit({
      houseNumber: this.filterHouseNumber,
      block: this.filterBlock,
      land: this.filterLand,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }

  onInputChange() {
    this.filterChange.emit();
  }

  onReset() {
    this.resetFilters.emit();
  }
}
