export class House {
  id?: string;
  data?: object;
  houseNumber?: string;
  price?: number;
  blockNumber?: string;
  landNumber?: string;
  houseType?: string;
  attributes?: any;
  links?: any;
  model?: string;
  status?: string;

  constructor(object = {} as House) {
    Object.assign(this, object);
    if (this.attributes) {
      this.houseNumber = this.attributes.house_number;
      this.price = this.attributes.price;
      this.blockNumber = this.attributes.block_number;
      this.landNumber = this.attributes.land_number;
      this.houseType = this.attributes.house_type;
      this.model = this.attributes.model;
    }
  }
}

export class HouseModel {
  id?: string;
  model?: string;
  media?: HouseMedia;
  attributes?: any;
  links?: any;
  type?: string;

  constructor(object = {} as HouseModel) {
    Object.assign(this, object);
    if (this.attributes) {
      this.media = this.attributes.media;
      this.model = this.attributes.model;
    }
  }
}

export class HouseMedia {
  title?: string;
  description?: string;
  banner?: string;
  video?: string;

  constructor(object = {} as HouseMedia) {
    Object.assign(this, object);
  }
}
