import { Request, Response } from "express";
import { CustomError, CreateProductDto, PaginationDto } from "../../domain";
import { ProductService } from "../services/product.service";

export class ProductController {
  constructor(private readonly productService: ProductService) {}

  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json(error.message);
    }

    return res.status(500).json({ error: "Internal server error" });
  };

  getProducts = (req: Request, res: Response) => {
    const { page = 1, limit = 5 } = req.query;
    const [error, pagination] = PaginationDto.create(+page, +limit);
    if (error) return res.status(400).json({ error });


    this.productService.getProducts(pagination!)
    .then(categories => res.json(categories))
    .catch(err => this.handleError(err, res));
  };

  createProduct = (req: Request, res: Response) => {
    const [error, product] = CreateProductDto.create({
      ...req.body,
      user: req.body.user.id,
    });
    if (error) return res.status(400).json(error);

    this.productService
      .createProduct(product!)
      .then((product) => res.status(201).json(product))
      .catch((err) => this.handleError(err, res));
  };
}
