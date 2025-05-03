import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() filterChanged = new EventEmitter<any>();

  filterHouseNumber = '';
  filterBlock = '';
  filterLand = '';
  minPrice = 0;
  maxPrice = 0;

  applyFilters() {
    this.filterChanged.emit({
      houseNumber: this.filterHouseNumber,
      block: this.filterBlock,
      land: this.filterLand,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice
    });
  }
}
