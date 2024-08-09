export class ProductListDto {
  title: string;
  totalPrice: number;
}

export class CreateOrderDto {
  user: string;
  email: string;
  paymentMethod: string;
  deliveryOptions: string;
  deliveryAddress: string;
  contactPhone: string;
  shipping: string;
  productList: ProductListDto[];
}
