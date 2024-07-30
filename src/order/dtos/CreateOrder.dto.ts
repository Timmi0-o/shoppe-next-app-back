export class ProductListDto {
  title: string;
  totalPrice: number;
}

export class CreateOrderDto {
  user: string;

  number: string;

  email: string;

  paymentMethod: string;

  // date: string;

  deliveryOptions: string;

  deliveryAddress: string;

  contactPhone: string;

  shipping: string;

  productList: ProductListDto[];
}
