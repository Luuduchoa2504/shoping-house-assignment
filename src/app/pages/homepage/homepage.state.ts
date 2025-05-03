import { inject, Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { HouseService } from '../../services/house/house.service';
import { House, HouseModel } from '../../models/house.model';
import { catchError, finalize, Observable, of, switchMap, tap } from 'rxjs';

export interface HouseState {
  isLoading: boolean;
  houseModelListSuccess: HouseModel[];
  errorHouseModelList: unknown;
  houseListSuccess: House[];
  errorHouseList: unknown;
  selectedModel: HouseModel | null;
  selectedModelHouses: House[];
}

const defaultState: HouseState = {
  isLoading: false,
  houseModelListSuccess: [],
  errorHouseModelList: null,
  houseListSuccess: [],
  errorHouseList: null,
  selectedModel: null,
  selectedModelHouses: [],
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
  readonly selectedModelHouses$ = this.select(({ selectedModelHouses }) => selectedModelHouses);
  readonly errorHouseModelList$ = this.select(({ errorHouseModelList }) => errorHouseModelList);
  readonly errorHouseList$ = this.select(({ errorHouseList }) => errorHouseList);

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
          }),
          finalize(() => this.patchState({ isLoading: false }))
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
          }),
          finalize(() => this.patchState({ isLoading: false }))
        )
      )
    )
  );

  readonly loadHousesForSelectedModel = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ isLoading: true })),
      switchMap(() => {
        const state = this.get();
        const selectedModel = state.selectedModel;
        const houses = state.houseListSuccess; // Use already loaded houses
        console.log('Selected Model:', selectedModel?.model);
        console.log('All Houses:', houses);
        if (!selectedModel || !selectedModel.model || !houses) {
          this.patchState({
            selectedModelHouses: [],
            isLoading: false,
          });
          return of([]);
        }

        const filteredHouses = houses.filter((house) => house.model?.model === selectedModel.model);
        console.log('Filtered Houses:', filteredHouses);
        this.patchState({
          selectedModelHouses: filteredHouses,
          errorHouseList: null,
          isLoading: false,
        });
        return of(filteredHouses);
      }),
      catchError((error) => {
        this.patchState({
          selectedModelHouses: [],
          errorHouseList: error,
          isLoading: false,
        });
        return of([]);
      }),
      finalize(() => this.patchState({ isLoading: false }))
    )
  );

  // Updater for selecting a model
  readonly selectModel = this.updater((state, model: HouseModel) => ({
    ...state,
    selectedModel: model,
  }));
}
