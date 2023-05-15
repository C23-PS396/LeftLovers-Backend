import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

const validation = (validations: any[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    await Promise.all(validations.map((v) => v.run(req)));
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    return res.status(400).send(errors);
  };
};

export default validation;
