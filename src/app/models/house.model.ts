export class House {
  id?: string;
  houseNumber?: number;
  price?: number;
  blockNumber?: number;
  landNumber?: number;
  houseType?: string;
  model?: HouseModel;

  constructor(object = {} as House) {
    Object.assign(this, object);
  }
}

export class HouseModel {
  id?: string;
  model?: string;
  media?: HouseMedia;

  constructor(object = {} as HouseModel) {
    Object.assign(this, object);
  }
}

export class HouseMedia {
  title?: string;
  description?: string;
  banner?: string;
  video?: string

  constructor(object = {} as HouseMedia) {
    Object.assign(this, object);
  }
}

