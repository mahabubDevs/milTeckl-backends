import { JwtPayload } from "jsonwebtoken";
import { SalesRep } from "./salesRep.model";
import { User } from "../user/user.model";
import QueryBuilder from "../../../util/queryBuilder";

const createSalesRepData = async (user: JwtPayload) => {
  await SalesRep.create({
    customerId: user.id,
  });
};
const getSalesRepData = async (query: Record<string, unknown>) => {
  const baseQuery = SalesRep.find();

  const salesRepQuery = new QueryBuilder(baseQuery, query)
    .paginate()
    .filter()
    .sort()
    .search(["firstName", "lastName", "email"]);

  const [salesRep, pagination] = await Promise.all([
    salesRepQuery.modelQuery.lean(),
    salesRepQuery.getPaginationInfo(),
  ]);

  return {
    salesRep,
    pagination,
  };
};

export const SalesRepService = {
  createSalesRepData,
  getSalesRepData,
};
