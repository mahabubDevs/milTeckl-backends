import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { ContactService } from "./contactUs.service";
import QueryBuilder from "../../../util/queryBuilder";
import { ContactUs } from "./contactUs.model";


const createContact = catchAsync(async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  const result = await ContactService.createContact({
    name,
    email,
    subject,
    message,
  });

  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    success: true,
    message: "Contact message submitted successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req: Request, res: Response) => {
  // 1️⃣ Start query
  const modelQuery = ContactUs.find();

  // 2️⃣ Initialize QueryBuilder
  const contactsQuery = new QueryBuilder(modelQuery, req.query)
    .search(['firstName', 'email', 'phone', 'message']) // যদি searchTerm থাকে
    .filter()   // filtering by query params
    .sort()     // sort by query param
    .paginate() // pagination
    .fields();  // fields selection

  // 3️⃣ Execute query
  const contacts = await contactsQuery.modelQuery;

  // 4️⃣ Get pagination info
  const pagination = await contactsQuery.getPaginationInfo();

  // 5️⃣ Send response
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All contact messages fetched successfully',
    data: contacts,
    pagination,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
};
