export interface IPromotion {
    name: string;
    customerReach: number;
    discountPercentage: number;
    promotionType: string;
    customerSegment: string;
    startDate: Date;
    endDate: Date;
    image?: string;
    isActive: boolean;
    createdBy: string;
    createdAt?: Date;
    updatedAt?: Date;
    
}
