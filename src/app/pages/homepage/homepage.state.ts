import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HouseService } from '../../services/house/house.service';
import { House, HouseModel } from '../../models/house.model';
import { catchError, Observable, of, switchMap, tap } from 'rxjs';

export interface HouseState {
  isLoading: boolean;
  houseModelListSuccess: HouseModel[];
  errorHouseModelList: unknown;
  houseListSuccess: House[];
  errorHouseList: unknown;
  selectedModel: HouseModel | null;
}

const defaultState: HouseState = {
  isLoading: false,
  houseModelListSuccess: [],
  errorHouseModelList: null,
  houseListSuccess: [],
  errorHouseList: null,
  selectedModel: null,
};

@Injectable()
export class HomepageState extends ComponentStore<HouseState> {
  private readonly houseService = inject(HouseService);

  constructor() {
    super(defaultState);
  }

  // Selectors
  readonly isLoading$ = this.select(({ isLoading }) => isLoading);
  readonly houseModelListSuccess$ = this.select(({ houseModelListSuccess }) => houseModelListSuccess);
  readonly houseListSuccess$ = this.select(({ houseListSuccess }) => houseListSuccess);
  readonly selectedModel$ = this.select(({ selectedModel }) => selectedModel);
  readonly errorHouseModelList$ = this.select(({ errorHouseModelList }) => errorHouseModelList);
  readonly errorHouseList$ = this.select(({ errorHouseList }) => errorHouseList);

  // Computed selector for filtered houses
  // In HomepageState
  // In HomepageState
  readonly selectModel = this.updater((state, model: HouseModel) => {
    console.log('Selecting model:', model);
    return {
      ...state,
      selectedModel: model
    };
  });

  readonly selectedModelHouses$ = this.select(
    this.selectedModel$,
    this.houseListSuccess$,
    (selectedModel, houses) => {
      console.log('Filtering - Selected Model:', selectedModel);
      console.log('Filtering - All Houses:', houses);
      if (!selectedModel?.id) {
        console.log('No selected model ID');
        return [];
      }

      const filtered = houses.filter(house => {
        const match = house.model?.id === selectedModel.id;
        console.log(`House ${house.id} match:`, match);
        return match;
      });

      console.log('Filtered Houses:', filtered);
      return filtered;
    }
  );

  // Effects
  readonly loadHouseModelList = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.houseService.getHouseModelsList().pipe(
          tap((houseModels: HouseModel[]) => {
            this.patchState({
              houseModelListSuccess: houseModels,
              errorHouseModelList: null,
              isLoading: false,
            });
          }),
          catchError((error) => {
            this.patchState({
              houseModelListSuccess: [],
              errorHouseModelList: error,
              isLoading: false,
            });
            return of([]);
          })
        )
      )
    )
  );

  readonly loadHouseList = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() =>
        this.houseService.getListHouses().pipe(
          tap((houses: House[]) => {
            this.patchState({
              houseListSuccess: houses,
              errorHouseList: null,
              isLoading: false,
            });
          }),
          catchError((error) => {
            this.patchState({
              houseListSuccess: [],
              errorHouseList: error,
              isLoading: false,
            });
            return of([]);
          })
        )
      )
    )
  );

  // Updater for selecting a model
  // readonly selectModel = this.updater((state, model: HouseModel) => ({
  //   ...state,
  //   selectedModel: model,
  // }));

  // Effect to trigger house filtering (no longer needed as we use computed selector)
}
