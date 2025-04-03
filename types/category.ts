export interface ICategory extends Document {
    _id: string;
    name: string;
    image: string;
    active: boolean;
    order: number;
  }
  