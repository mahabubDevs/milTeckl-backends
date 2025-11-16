import { model, Schema } from "mongoose";
import { ISalesRep, SalesRepModel } from "./salesRep.interface";

const salesRepSchema = new Schema<ISalesRep, SalesRepModel>(
  {
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    acknowledged: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Rule = model<ISalesRep, SalesRepModel>("SelesRep", salesRepSchema);
