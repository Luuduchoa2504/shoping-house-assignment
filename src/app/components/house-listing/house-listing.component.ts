import { Component, EventEmitter, Input, Output, ElementRef, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { House, HouseModel } from '../../models/house.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FilterComponent } from '../filter/filter.component';

@Component({
  selector: 'app-house-listing',
  standalone: true,
  imports: [CommonModule, FilterComponent],
  templateUrl: './house-listing.component.html',
  styleUrls: ['./house-listing.component.scss']
})
export class HouseListingComponent implements OnInit, OnDestroy {
  @Input() houseModels: HouseModel[] = [];
  @Input() selectedModel: HouseModel | null = null;
  @Input() houses: House[] = [];
  @Input() isLoading: boolean = false;
  @Input() errorModel: unknown = null;
  @Input() errorHouse: unknown = null;
  @Output() modelSelected = new EventEmitter<HouseModel>();
  @ViewChildren('modelItem') modelItems!: QueryList<ElementRef>;

  showDetails: boolean = false;
  isLoggedIn: boolean = false;
  private authSubscription: Subscription | undefined;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.getUserInfo().subscribe((userInfo) => {
      this.isLoggedIn = !!userInfo && !!userInfo.username;
    });

    if (this.selectedModel) {
      this.showDetails = true;
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  selectModel(model: HouseModel) {
    if (this.selectedModel?.id === model.id) {
      this.showDetails = !this.showDetails;
    } else {
      this.selectedModel = model;
      this.showDetails = true;
    }
    this.modelSelected.emit(model);
  }

  editHouse(house: House) {
    if (this.isLoggedIn) {
      this.router.navigate(['/edit-house', house.id]);
    }
  }

  createHouse() {
    if (this.isLoggedIn) {
      this.router.navigate(['/create-house']);
    }
  }
}
