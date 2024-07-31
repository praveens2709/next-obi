export interface PaymentResponse {
    responsecode: number;
    authorizationnumber: string;
    originalresponsecode: number;
    cardnumber: string;
    referencenumber: string;
    reasoncode: string;
    reasoncodedescription: string;
  };
  
  export interface ResolveData  {
    success: boolean;
    statusMessage: string;
    data: PaymentResponse | {};
  };
  
  export type HtmlData = string;
  
  export interface cartSlice {
    cartData: any,
    cartItemId: Number,
    error: boolean,
  }