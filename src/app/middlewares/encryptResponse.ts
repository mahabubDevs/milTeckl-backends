import { Request, Response, NextFunction } from "express";
import { encryptData } from "../../util/encryption";


export const encryptResponse = (req: Request, res: Response, next: NextFunction) => {
  const oldSend = res.send;

  res.send = function (this: Response, body: any) {
    try {
      const encryptedBody = encryptData(body);
      return oldSend.call(this, encryptedBody);
    } catch (err) {
      console.error("Encryption Error:", err);
      return oldSend.call(this, body);
    }
  } as any;

  next();
};
