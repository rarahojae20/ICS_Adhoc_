export interface IUspsDelivery {
    shipment: {
      service: string; // parcel밑으로 갈수도
      to_address: {
        company?: string | null;
        first_name: string;
        last_name: string;
        street1: string;
        street2?: string | null;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone?: string | null;
        email?: string | null;
        is_residential?: boolean;
      };
      from_address: { //default instead return_address 
        company?: string | null;
        first_name: string;
        last_name: string;
        street1: string;
        street2?: string | null;
        city: string;
        state: string;
        zip: string;
        country: string;
        phone?: string | null;
      };
      parcel: {
        length: number;
        width: number;
        height: number;
        weight: number;
        package_type?: string | null;
      };
      reference1?: string;
      service_options?: {
        verify_address?: boolean;
        confirmation?: boolean;
        label_type?: string;
      };
    };
  }
  