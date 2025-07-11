  interface InsuranceFormValues {
    pollutionImage: File | null;
    insuranceImage: File | null;
    insuranceStartDate: string;
    insuranceExpiryDate: string;
    pollutionStartDate: string;
    pollutionExpiryDate: string;
  }

   interface VehicleFormValues {
  registrationID: string;
  model: string;
  rcFrontImage: File | null;
  rcBackImage: File | null;
  carFrontImage: File | null;
  carSideImage: File | null;
  rcStartDate: string;
  rcExpiryDate: string;
}

  export type {InsuranceFormValues,VehicleFormValues}