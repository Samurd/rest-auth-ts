export class PaginationDto {
  private constructor(
    public readonly page: number,
    public readonly limit: number
  ) {}

  public static create(page: number, limit: number): [string?, PaginationDto?] {
    if (isNaN(page) || isNaN(limit))
      return ["Invalid page or limit", undefined];

    if (page <= 0 || limit <= 0) return ["Invalid page or limit", undefined];

    return [undefined, new PaginationDto(page, limit)];
  }
}
