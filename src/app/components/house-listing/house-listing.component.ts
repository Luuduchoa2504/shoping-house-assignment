import { Component, OnInit, inject, signal, computed, effect, Signal, input, model } from '@angular/core';
import { House, HouseModel } from '../../models/house.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-house-listing',
  standalone: true,
  imports: [CommonModule, FilterComponent],
  templateUrl: './house-listing.component.html',
  styleUrls: ['./house-listing.component.scss'],
})
export class HouseListingComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  houseModels = input<HouseModel[]>();
  selectedModel = input<HouseModel | null>();
  houses = input<House[]>();
  isLoading = input<boolean>();
  errorModel = input<unknown>();
  errorHouse = input<unknown>();
  modelSelectedCallback = input<(model: HouseModel) => void>();

  filterHouseNumber = model<string>('');
  filterBlock = model<string>('');
  filterLand = model<string>('');
  minPrice = model<number | null>(null);
  maxPrice = model<number | null>(null);

  showDetails = signal(false);
  isLoggedIn = this.authService.isLoggedIn;

  currentPage = signal<number>(1);
  modelsPerPage = signal<number>(6);
  totalPages = computed(() =>
    Math.ceil((this.houseModels() ?? []).length / this.modelsPerPage())
  );

  paginatedHouseModels = computed(() => {
    const models = this.houseModels() ?? [];
    const startIndex = (this.currentPage() - 1) * this.modelsPerPage();
    const endIndex = startIndex + this.modelsPerPage();
    return models.slice(startIndex, endIndex);
  });

  filteredHouses = computed(() => {
    const allHouses = this.houses() ?? [];
    const selectedModelValue = this.selectedModel();
    const filterHouseNumberValue = this.filterHouseNumber();
    const filterBlockValue = this.filterBlock();
    const filterLandValue = this.filterLand();
    const minPriceValue = this.minPrice();
    const maxPriceValue = this.maxPrice();

    if (!selectedModelValue?.model) {
      return [];
    }

    return allHouses.filter(house => {
      const matchesSelectedModel = house.model === selectedModelValue.model;
      if (!matchesSelectedModel) return false;
      const houseNumberStr = house.houseNumber?.toString() ?? '';
      const matchesHouseNumber = !filterHouseNumberValue || houseNumberStr.includes(filterHouseNumberValue);
      const blockNumberStr = house.blockNumber?.toString() ?? '';
      const matchesBlock = !filterBlockValue || blockNumberStr.includes(filterBlockValue);
      const landNumberStr = house.landNumber?.toString() ?? '';
      const matchesLand = !filterLandValue || landNumberStr.includes(filterLandValue);
      const priceValue = house.price ?? 0;
      const matchesMinPrice = minPriceValue == null || priceValue >= minPriceValue;
      const matchesMaxPrice = maxPriceValue == null || priceValue <= maxPriceValue;
      return matchesHouseNumber && matchesBlock && matchesLand && matchesMinPrice && matchesMaxPrice;
    });
  });

  constructor() {
    effect(() => {
      const selected = this.selectedModel();
      if (selected) {
        this.showDetails.set(true);
      }
    });
  }

  ngOnInit(): void {}

  selectModel(model: HouseModel) {
    const currentSelected = this.selectedModel();
    if (currentSelected?.id === model.id) {
      this.showDetails.update(show => !show);
    } else {
      this.showDetails.set(true);
      const callback = this.modelSelectedCallback();
      if (callback) {
        callback(model);
      } else {
        console.error('modelSelectedCallback is undefined');
      }
    }
  }

  editHouse(house: House) {
    this.router.navigate(['/detail', house.id], {
      state: { house },
    });
  }

  createHouse() {
    this.router.navigate(['/create']);
  }

  onResetFilters() {
    this.filterHouseNumber.set('');
    this.filterBlock.set('');
    this.filterLand.set('');
    this.minPrice.set(null);
    this.maxPrice.set(null);
  }

  goToPreviousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  goToNextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }
}
