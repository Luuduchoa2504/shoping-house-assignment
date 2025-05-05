import { Component, OnInit, Output, EventEmitter, model } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  filterHouseNumber = model<string>('');
  filterBlock = model<string>('');
  filterLand = model<string>('');
  minPrice = model<number | null>(null);
  maxPrice = model<number | null>(null);

  @Output() resetFilters = new EventEmitter<void>();

  filterForm = new FormGroup({
    houseNumber: new FormControl<string>('', { nonNullable: true }),
    filterBlock: new FormControl<string>('', { nonNullable: true }),
    filterLand: new FormControl<string>('', { nonNullable: true }),
    minPrice: new FormControl<number | null>(null),
    maxPrice: new FormControl<number | null>(null),
  });

  constructor() {}

  ngOnInit() {
    this.filterForm.patchValue({
      houseNumber: this.filterHouseNumber(),
      filterBlock: this.filterBlock(),
      filterLand: this.filterLand(),
      minPrice: this.minPrice(),
      maxPrice: this.maxPrice(),
    });

    this.filterForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr))
    ).subscribe(values => {
      this.applyFilters();
    });

    this.filterForm.get('houseNumber')!.valueChanges.subscribe(value => {
      this.filterHouseNumber.update(() => value || '');
    });

    this.filterForm.get('filterBlock')!.valueChanges.subscribe(value => {
      this.filterBlock.update(() => value || '');
    });

    this.filterForm.get('filterLand')!.valueChanges.subscribe(value => {
      this.filterLand.update(() => value || '');
    });

    this.filterForm.get('minPrice')!.valueChanges.subscribe(value => {
      this.minPrice.update(() => value);
    });

    this.filterForm.get('maxPrice')!.valueChanges.subscribe(value => {
      this.maxPrice.update(() => value);
    });
  }

  applyFilters() {
    const values = this.filterForm.value;
    this.filterHouseNumber.update(() => values.houseNumber || '');
    this.filterBlock.update(() => values.filterBlock || '');
    this.filterLand.update(() => values.filterLand || '');
    this.minPrice.update(() => values.minPrice ?? null);
    this.maxPrice.update(() => values.maxPrice ?? null);
  }

  onReset() {
    this.filterForm.reset({
      houseNumber: '',
      filterBlock: '',
      filterLand: '',
      minPrice: null,
      maxPrice: null,
    });

    this.resetFilters.emit();
  }
}
