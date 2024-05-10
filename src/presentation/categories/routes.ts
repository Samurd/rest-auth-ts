import { Router } from "express";
import { CategoryService } from "../services/category.service";
import { CategoryController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();
        
        const categoryService =  new CategoryService();
        const categoryController = new CategoryController(categoryService);
        
        router.get("/", categoryController.getCategories);
        router.post("/", [AuthMiddleware.validateJWT], categoryController.createCategory);
        
        return router;
    }
}