import { Component, inject } from '@angular/core';
import { HouseListingComponent } from '../../components/house-listing/house-listing.component';
import { HeaderComponent } from '../../components/header/header.component';
import { CommonModule } from '@angular/common';
import { HomepageState } from './homepage.state';
import { HouseModel } from '../../models/house.model';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class HomepageComponent {
  private homepageState = inject(HomepageState);

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
