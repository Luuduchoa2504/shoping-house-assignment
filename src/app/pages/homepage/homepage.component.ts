import { Component, OnInit } from '@angular/core';
import { HomepageState } from './homepage.state';
import { House, HouseModel } from '../../models/house.model';
import { Observable } from 'rxjs';
import { HouseListingComponent } from '../../components/house-listing/house-listing.component';
import { HeaderComponent } from '../../components/header/header.component';
import { FilterComponent } from '../../components/filter/filter.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    HouseListingComponent,
    HeaderComponent,
  ],
  standalone: true,
  providers: [HomepageState],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent implements OnInit {
  houseModelListSuccess$: Observable<HouseModel[]>;
  selectedModel$: Observable<HouseModel | null>;
  selectedModelHouses$: Observable<House[]>;
  isLoading$: Observable<boolean>;
  errorHouseModelList$: Observable<unknown>;
  errorHouseList$: Observable<unknown>;

  constructor(private homepageState: HomepageState) {
    this.houseModelListSuccess$ = this.homepageState.houseModelListSuccess$;
    this.selectedModel$ = this.homepageState.selectedModel$;
    this.selectedModelHouses$ = this.homepageState.selectedModelHouses$;
    this.isLoading$ = this.homepageState.isLoading$;
    this.errorHouseModelList$ = this.homepageState.errorHouseModelList$;
    this.errorHouseList$ = this.homepageState.errorHouseList$;
  }

  ngOnInit() {
    this.homepageState.loadHouseModelList();
    this.homepageState.loadHouseList();
  }

  onModelSelected(model: HouseModel) {
    this.homepageState.selectModel(model);
  }
}
