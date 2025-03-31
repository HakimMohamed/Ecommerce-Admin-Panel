export interface IItem extends Document {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  discount?: {
    active: boolean;
    value: number;
  };
  active: boolean;
}
