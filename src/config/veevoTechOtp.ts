// src/utils/sendOtp.ts
import axios from "axios";
import config from "../config";
export const sendOtp = async (phone: string, otp: string) => {
  const url = "https://api.veevotech.com/v3/sendsms";

  const payload = {
   hash: config.veevoTech.apiKey, // তোমার VeevoTech hash
    receivernum: phone,
    sendernum: "Default",
    textmessage: `Your OTP is ${otp}`,
  };

  const response = await axios.post(url, payload);
 
  return response.data;
};
