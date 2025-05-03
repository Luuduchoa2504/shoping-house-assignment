import { Component, EventEmitter, Input, Output, ElementRef, ViewChildren, QueryList, OnInit, OnDestroy } from '@angular/core';
import { House, HouseModel } from '../../models/house.model';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {FilterComponent} from '../filter/filter.component';

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
    // Always subscribe to getUserInfo() to check login status
    this.authSubscription = this.authService.getUserInfo().subscribe((userInfo) => {
      const userInfoFromStorage = localStorage.getItem('userInfo');
      if (userInfo && userInfo.username) {
        this.isLoggedIn = true;
        localStorage.setItem('userInfo', JSON.stringify(userInfo));
      } else if (!userInfoFromStorage) {
        this.isLoggedIn = false;
        localStorage.removeItem('userInfo');
      } else {
        this.isLoggedIn = true; // Use localStorage if authService returns null but data exists
      }
    });

    // Initial check from localStorage
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      this.isLoggedIn = true;
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  selectModel(model: HouseModel) {
    if (this.selectedModel && this.selectedModel.model === model.model) {
      this.showDetails = !this.showDetails;
    } else {
      this.selectedModel = model;
      this.showDetails = true;
      this.modelSelected.emit(model);
    }

    this.modelItems.forEach(item => item.nativeElement.classList.remove('active'));
    const selectedItem = this.modelItems.find(item => item.nativeElement.textContent?.includes(model.model));
    if (selectedItem) selectedItem.nativeElement.classList.add('active');
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
