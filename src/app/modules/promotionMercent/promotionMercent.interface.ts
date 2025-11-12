export interface IPromotion {
  _id?: string;
  name: string;
  discountPercentage: number;
  promotionType: string;
  customerSegment: string;
  startDate: Date;
  endDate: Date;
  image?: string;
  isActive?: boolean;

  // New field: availableDays
  availableDays?: ("all" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat")[];
  
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
