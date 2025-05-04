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

  readonly selectModel = this.updater((state, model: HouseModel) => {
    return {
      ...state,
      selectedModel: model
    };
  });

  readonly selectedModelHouses$ = this.select(
    this.selectedModel$,
    this.houseListSuccess$,
    (selectedModel, houses) => {
      if (!selectedModel?.id) {
        return [];
      }
      const filtered = houses.filter(house => {
        const match = house.model?.id === selectedModel.id;
        return match;
      });
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
}
