import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { House, HouseMedia, HouseModel } from '../../models/house.model';

// Dummy response data
const dummyHouseModelsResponse = {
  data: [
    {
      id: '1',
      type: 'house_models',
      attributes: {
        model: 'Luxury Penthouse',
        media: {
          title: 'Luxury Penthouse Media',
          description: 'Experience luxury living with stunning city views.',
          banner: 'https://www.montgomeryhomes.com.au/wp-content/uploads/2020/10/Montgomery-Homes-Cayman-349-Home-Design-Facade-600x400.jpg',
          video: 'https://example.com/videos/luxury-penthouse.mp4'
        }
      }
    },
    {
      id: '2',
      type: 'house_models',
      attributes: {
        model: 'Suburban Townhouse',
        media: {
          title: 'Model media title',
          description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          banner: 'https://www.montgomeryhomes.com.au/wp-content/uploads/2020/10/Montgomery-Homes-Cayman-349-Home-Design-Facade-600x400.jpg',
          video: 'https://example.com/videos/suburban-townhouse.mp4'
        }
      }
    },
    {
      id: '3',
      type: 'house_models',
      attributes: {
        model: 'Beachfront Cottage',
        media: {
          title: 'Beachfront Cottage Media',
          description: 'Relax by the ocean in this charming cottage.',
          banner: 'https://www.montgomeryhomes.com.au/wp-content/uploads/2020/10/Montgomery-Homes-Cayman-349-Home-Design-Facade-600x400.jpg',
          video: 'https://example.com/videos/beachfront-cottage.mp4'
        }
      }
    }
  ]
};

const dummyHousesResponse = {
  data: [
    {
      id: '1',
      type: 'houses',
      attributes: {
        house_number: 1001,
        price: 4500000000,
        block_number: 1,
        land_number: 1,
        house_type: 'townhouse',
        model: 'Suburban Townhouse'
      }
    },
    {
      id: '2',
      type: 'houses',
      attributes: {
        house_number: 1002,
        price: 4500000000,
        block_number: 1,
        land_number: 1,
        house_type: 'townhouse',
        model: 'Suburban Townhouse'
      }
    },
    {
      id: '3',
      type: 'houses',
      attributes: {
        house_number: 3003,
        price: 4000000000,
        block_number: 3,
        land_number: 3,
        house_type: 'cottage',
        model: 'Beachfront Cottage'
      }
    },
    {
      id: '4',
      type: 'houses',
      attributes: {
        house_number: 4001,
        price: 5000000000,
        block_number: 4,
        land_number: 4,
        house_type: 'penthouse',
        model: 'Luxury Penthouse'
      }
    }
  ]
};

@Injectable({
  providedIn: 'root'
})
export class HouseService {
  private readonly apiUrl = ''; // Base URL handled by proxy
  private readonly authToken = 'Aa123456'; // Static authentication token from API doc

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'authentication': this.authToken,
      'Content-Type': 'application/vnd.api+json'
    });
  }

  // GET /house_models - Fetch list of house models
      // return this.http.get<any>(`${this.apiUrl}/house_models`, { headers: this.getHeaders() }).pipe(
  getHouseModelsList(): Observable<HouseModel[]> {
    return of(dummyHouseModelsResponse).pipe(
      map(response => {
        return response.data.map((item: any) => {
          const model = new HouseModel();
          model.id = item.id;
          model.model = item.attributes.model;
          model.media = new HouseMedia(item.attributes.media);
          return model;
        });
      })
    );
  }

  // GET /houses - Fetch list of houses
      // return this.http.get<any>(`${this.apiUrl}/houses`, { headers: this.getHeaders() }).pipe(
  // In HouseService
  // In HouseService
  getListHouses(): Observable<House[]> {
    return of(dummyHousesResponse).pipe(
      map(response => {
        return response.data.map((item: any) => {
          // Find matching model from house models
          const modelData = dummyHouseModelsResponse.data.find(m =>
            m.attributes.model === item.attributes.model
          );

          const model = new HouseModel();
          model.id = modelData?.id || '';
          model.model = item.attributes.model;

          return new House({
            id: item.id,
            houseNumber: item.attributes.house_number,
            price: item.attributes.price,
            blockNumber: item.attributes.block_number,
            landNumber: item.attributes.land_number,
            houseType: item.attributes.house_type,
            model: model
          });
        });
      })
    );
  }

  // POST /houses - Create a new house
  createHouse(house: Omit<House, 'id'>): Observable<House> {
    const body = {
      data: {
        type: 'houses',
        attributes: {
          house_number: house.houseNumber,
          block_number: house.blockNumber,
          land_number: house.landNumber,
          model: house.model,
          house_type: house.houseType,
          price: house.price
        }
      }
    };

    return this.http.post<any>(`${this.apiUrl}/houses`, body, { headers: this.getHeaders() }).pipe(
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

  // PATCH /houses/:id - Update an existing house
  updateHouse(house: House): Observable<House> {
    const body = {
      data: {
        type: 'houses',
        id: house.id,
        attributes: {
          house_number: house.houseNumber,
          block_number: house.blockNumber,
          land_number: house.landNumber,
          model: house.model,
          house_type: house.houseType,
          price: house.price
        }
      }
    };

    return this.http.patch<any>(`${this.apiUrl}/houses/${house.id}`, body, { headers: this.getHeaders() }).pipe(
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
