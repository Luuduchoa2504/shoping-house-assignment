import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HouseService } from '../../services/house/house.service';
import { House, HouseModel } from '../../models/house.model';
import {Observable, switchMap, tap} from 'rxjs';
import {tapResponse} from '@ngrx/operators';

export interface HouseState {
  isLoading: boolean;
  houseModelListSuccess: HouseModel[];
  errorHouseModelList: unknown;
  houseListSuccess: House[];
  errorHouseList: unknown;
  houseDetailSuccess: House;
  errorHouseDetail: unknown;
  selectedModel: HouseModel | null;
}

const defaultState: HouseState = {
  isLoading: false,
  houseModelListSuccess: [],
  errorHouseModelList: null,
  houseListSuccess: [],
  errorHouseList: null,
  houseDetailSuccess: {} as House,
  errorHouseDetail: null,
  selectedModel: null,
};

@Injectable()
export class HomepageState extends ComponentStore<HouseState> {
  private readonly houseService = inject(HouseService);

  constructor() {
    super(defaultState);
    this.loadHouseModelList();
    this.loadHouseList();
  }

  readonly isLoading = this.select((state) => state.isLoading);
  readonly houseModelListSuccess = this.select((state) => state.houseModelListSuccess);
  readonly houseListSuccess = this.select((state) => state.houseListSuccess);
  readonly selectedModel = this.select((state) => state.selectedModel);
  readonly errorHouseModelList = this.select((state) => state.errorHouseModelList);
  readonly errorHouseList = this.select((state) => state.errorHouseList);
  readonly selectedModelHouses = this.select(
    this.houseListSuccess,
    this.selectedModel,
    (houses, selectedModel) => {
      if (!selectedModel?.model) {
        return [];
      }
      return houses.filter(house => house.model === selectedModel.model);
    }
  );

  readonly setSelectedModel = this.updater((state, model: HouseModel | null) => ({
    ...state,
    selectedModel: model,
  }));

  readonly loadHouseModelList = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.houseService.getHouseModelsList().pipe(
          tapResponse(
            (resp) => {
              this.patchState({
                houseModelListSuccess: resp.map(item => new HouseModel(item)),
                errorHouseModelList: null,
                isLoading: false,
              });
            },
            (error) => {
              this.patchState({
                houseModelListSuccess: [],
                errorHouseModelList: error,
                isLoading: false,
              });
            }
          )
        )
      )
    );
  });

  readonly loadHouseList = this.effect((trigger$: Observable<void>) => {
    return trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.houseService.getListHouses().pipe(
          tapResponse(
            (resp) => {
              this.patchState({
                houseListSuccess: resp.map(item => new House(item)),
                errorHouseList: null,
                isLoading: false,
              });
            },
            (error) => {
              this.patchState({
                houseListSuccess: [],
                errorHouseList: error,
                isLoading: false,
              });
            }
          )
        )
      )
    );
  });
}
