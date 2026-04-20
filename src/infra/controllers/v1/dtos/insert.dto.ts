import { ApiProperty } from "@nestjs/swagger";

export class InsertDto {
  @ApiProperty({
    description: "ID do veículo criado (UUIDv7)",
    example: "01234567-89ab-7def-0123-456789abcdef",
  })
  insertId: string;

  constructor(id: string) {
    this.insertId = id;
  }
}
