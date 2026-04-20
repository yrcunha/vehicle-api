import { ApiProperty } from "@nestjs/swagger";

export class MetaDto {
  @ApiProperty({ description: "Página atual", example: 1 })
  page!: number;

  @ApiProperty({ description: "Quantidade de itens por página", example: 10 })
  limit!: number;

  @ApiProperty({ description: "Total de registros", example: 150 })
  total!: number;

  @ApiProperty({ description: "Total de páginas", example: 15 })
  totalPages!: number;

  constructor(page: number, limit: number, total: number, totalPages: number) {
    this.page = page;
    this.limit = limit;
    this.total = total;
    this.totalPages = totalPages;
  }
}
