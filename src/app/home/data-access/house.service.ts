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
    return this.http.get<any>(`${this.apiUrl}/house_models`).pipe(  // Xóa { headers }
      map(response => {
        return response.data.map((item: any) => {
          return item;
        });
      })
    );
  }

  getListHouses(): Observable<House[]> {
    return this.http.get<any>(`${this.apiUrl}/houses`).pipe(  // Xóa { headers }
      map(response => {
        return response.data.map((item: any) => {
          return item;
        });
      })
    );
  }

  getHouseDetail(id: string): Observable<House> {
    return this.http.get<any>(`${this.apiUrl}/houses/${id}`).pipe(  // Xóa { headers }
      map(response => {
        const data = response.data;
        return new House({
          id: data.id,
          houseNumber: data.attributes.house_number,
          blockNumber: data.attributes.block_number,
          landNumber: data.attributes.land_number,
          model: data.attributes.model,
          houseType: data.attributes.house_type,
          price: data.attributes.price,
          attributes: data.attributes,
          links: data.links
        });
      })
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
    return this.http.post<any>(`${this.apiUrl}/houses`, body).pipe(  // Xóa { headers }
      map(response => ({
        id: response.data.id,
        houseNumber: response.data.attributes.house_number,
        blockNumber: response.data.attributes.block_number,
        landNumber: response.data.attributes.land_number,
        model: response.data.attributes.model,
        houseType: response.data.attributes.house_type,
        price: response.data.attributes.price
      }))
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
    return this.http.patch<any>(`${this.apiUrl}/houses/${house.id}`, body).pipe(  // Xóa { headers }
      map(response => ({
        id: response.data.id,
        houseNumber: response.data.attributes.house_number,
        blockNumber: response.data.attributes.block_number,
        landNumber: response.data.attributes.land_number,
        model: response.data.attributes.model,
        houseType: response.data.attributes.house_type,
        price: response.data.attributes.price
      }))
    );
  }
}
