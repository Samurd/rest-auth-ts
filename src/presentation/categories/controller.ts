import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";
import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";

export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.message);
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  getCategories = (req: Request, res: Response) => {
    const { page = 1, limit = 5 } = req.query;
    const [error, pagination] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });


    this.categoryService.getCategories(pagination!)
    .then(categories => res.json(categories))
    .catch(err => this.handleError(err, res));
  };

  createCategory = (req: Request, res: Response) => {
    const [error, category] = CreateCategoryDto.create(req.body);
    if (error) return res.status(400).json(error);

    this.categoryService
      .createCategory(category!, req.body.user)
      .then((category) => res.json(category))
      .catch((err) => this.handleError(err, res));
  };
}
