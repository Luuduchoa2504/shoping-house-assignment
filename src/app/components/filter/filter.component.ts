import { Component, Output, EventEmitter, Input } from '@angular/core';
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

  @Output() filterChanged = new EventEmitter<any>();
  @Output() resetFilters = new EventEmitter<void>();

  applyFilters() {
    this.filterChanged.emit({
      houseNumber: this.filterHouseNumber,
      block: this.filterBlock,
      land: this.filterLand,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }

  onReset() {
    // Reset local values
    this.filterHouseNumber = '';
    this.filterBlock = '';
    this.filterLand = '';
    this.minPrice = null;
    this.maxPrice = null;

    // Emit reset event with null values
    this.resetFilters.emit();

    // Also emit the changed filter with reset values
    this.applyFilters();
  }
}
