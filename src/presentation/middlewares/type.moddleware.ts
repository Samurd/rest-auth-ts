import { NextFunction, Request, Response } from "express";

export class TypeMiddleware {
  static validateTypes(validTypes: string[]) {
    return (req: Request, res: Response, next: NextFunction) => {

      // This is because the use of the Middleware in route.ts fileUpload  

      // const type = req.params.type;
      const type = req.url.split("/").at(2) ?? "";
      if (!validTypes.includes(type)) {
        return res
          .status(400)
          .json({ error: `Invalid type: ${type}, valid ones ${validTypes}` });
      }
      next();
    };
  }
}
