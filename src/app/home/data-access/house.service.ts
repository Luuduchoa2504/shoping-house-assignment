import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { House, HouseModel } from './models/house.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private readonly apiUrl = environment.apiUrl;

  private http = inject(HttpClient);

  getHouseModelsList(): Observable<HouseModel[]> {
    return this.http.get<{ data: HouseModel[] }>(`${this.apiUrl}/house_models`).pipe(
      map(response => response.data.map(item => new HouseModel(item)))
    );
  }

  getListHouses(): Observable<House[]> {
    return this.http.get<{ data: House[] }>(`${this.apiUrl}/houses`).pipe(
      map(response => response.data.map(item => new House(item)))
    );
  }

  getHouseDetail(id: string): Observable<House> {
    return this.http.get<{ data: House }>(`${this.apiUrl}/houses/${id}`).pipe(
      map(response => new House(response.data))
    );
  }

  createHouse(house: Omit<House, 'id'>): Observable<House> {
    if (!house.model) {
      throw new Error('model is required');
    }

    const body = {
      data: {
        type: 'houses',
        attributes: {
          house_number: house.houseNumber?.replace(/\s+/g, '-') || '',
          block_number: house.blockNumber || '',
          land_number: house.landNumber || '',
          model: house.model,
          house_type: house.houseType?.toLowerCase() || '',
          price: Number(house.price)
        }
      }
    };
    return this.http.post<{ data: House }>(`${this.apiUrl}/houses`, body).pipe(
      map(response => new House(response.data))
    );
  }

  updateHouse(house: House): Observable<House> {
    if (!house?.model) {
      throw new Error('model is required');
    }

    const body = {
      data: {
        type: 'houses',
        id: house.id,
        attributes: {
          house_number: house.houseNumber?.replace(/\s+/g, '-') || '',
          block_number: house.blockNumber || '',
          land_number: house.landNumber || '',
          model: house?.model,
          house_type: house.houseType?.toLowerCase() || '',
          price: Number(house.price)
        }
      }
    };
    return this.http.patch<{ data: House }>(`${this.apiUrl}/houses/${house.id}`, body).pipe(
      map(response => new House(response.data))
    );
  }
}
