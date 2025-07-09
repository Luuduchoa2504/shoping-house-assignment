import { Component, inject } from '@angular/core';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { HomeState } from '../../data-access/home.state';
import { HouseModel } from '../../data-access/models/house.model';
import { toSignal } from '@angular/core/rxjs-interop';
import { HomeListingComponent } from '../home-listing/home-listing.component';

@Component({
  selector: 'app-homepage',
  imports: [
    CommonModule,
    HeaderComponent,
    HomeListingComponent
  ],
  standalone: true,
  providers: [HomeState],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.scss'
})
export class HomepageComponent {
  private homepageState = inject(HomeState);

  readonly houseModels = toSignal(this.homepageState.houseModelListSuccess);
  readonly selectedModel = toSignal(this.homepageState.selectedModel);
  readonly houses = toSignal(this.homepageState.houseListSuccess);
  readonly isLoading = toSignal(this.homepageState.isLoading);
  readonly errorHouseModel = toSignal(this.homepageState.errorHouseModelList);
  readonly errorHouseList = toSignal(this.homepageState.errorHouseList);

  constructor() {
    this.onModelSelected = this.onModelSelected.bind(this);
  }

  onModelSelected(model: HouseModel) {
    this.homepageState.setSelectedModel(model);
  }
}
