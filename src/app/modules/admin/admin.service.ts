import { StatusCodes } from "http-status-codes";
import { IUser } from "../user/user.interface";
import { User } from "../user/user.model";
import { USER_ROLES, USER_STATUS } from "../../../enums/user";
import ApiError from "../../../errors/ApiErrors";
import QueryBuilder from "../../../util/queryBuilder";

const createAdminToDB = async (payload: IUser): Promise<IUser> => {
  const createAdmin: any = await User.create(payload);
  if (!createAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to create Admin");
  }
  if (createAdmin) {
    await User.findByIdAndUpdate(
      { _id: createAdmin?._id },
      { verified: true },
      { new: true }
    );
  }
  return createAdmin;
};

const deleteAdminFromDB = async (id: any): Promise<IUser | undefined> => {
  const isExistAdmin = await User.findByIdAndDelete(id);
  if (!isExistAdmin) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Failed to delete Admin");
  }
  return;
};

const getAdminFromDB = async (): Promise<IUser[]> => {
  const admins = await User.find({ role: "ADMIN" }).select(
    "name email profile contact location"
  );
  return admins;
};
const updateUserStatus = async (id: string, status: USER_STATUS) => {
  await User.findByIdAndUpdate(
    { id },
    {
      status,
      lastStatusChanged: new Date(),
    }
  );
};

const getAllCustomers = async (query: Record<string, unknown>) => {
  const baseQuery = User.find({ role: "USER" }).select(
    "firstName lastName phone email status address "
  );

  const allCusomtersQuery = new QueryBuilder(baseQuery, query)
    .search(["firstName", "lastName", "email", "phone"])
    .filter()
    .paginate()
    .sort();

  const [allcustomers, pagination] = await Promise.all([
    allCusomtersQuery.modelQuery.lean(),
    allCusomtersQuery.getPaginationInfo(),
  ]);
  return {
    allcustomers,
    pagination,
  };
};
const getAllMerchants = async (query: Record<string, unknown>) => {
  const baseQuery = User.find({ role: USER_ROLES.MERCENT }).select(
    "firstName lastName phone email status address  "
  );

  const allMerchantsQuery = new QueryBuilder(baseQuery, query)
    .search(["firstName", "lastName", "email", "phone"])
    .filter()
    .paginate()
    .sort();

  const [allmerchants, pagination] = await Promise.all([
    allMerchantsQuery.modelQuery.lean(),
    allMerchantsQuery.getPaginationInfo(),
  ]);
  return {
    allmerchants,
    pagination,
  };
};

export const AdminService = {
  createAdminToDB,
  deleteAdminFromDB,
  getAdminFromDB,
  updateUserStatus,
  getAllCustomers,
  getAllMerchants,
};
