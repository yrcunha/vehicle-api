import { ApiProperty } from "@nestjs/swagger";
import { IsString, Length, Matches, MaxLength } from "class-validator";

export class VehicleDto {
  @ApiProperty({ description: "Placa do veículo (formato Mercosul ou antigo)", example: "ABC1D23" })
  @IsString({ message: "Placa deve ser um texto" })
  @Length(7, 8, { message: "Placa deve ter 7 ou 8 caracteres" })
  @Matches(/^[A-Z0-9]+$/, { message: "Placa deve conter apenas letras maiúsculas e números" })
  plate!: string;

  @ApiProperty({
    description: "Chassi do veículo (17 caracteres conforme ISO 3779:2009)",
    example: "9BWZZZ377VT004251",
  })
  @IsString({ message: "Chassi deve ser um texto" })
  @MaxLength(17, { message: "Chassi deve ter exatamente 17 caracteres" })
  @Matches(/^[A-HJ-NPR-Z0-9]+$/, {
    message: "Chassi deve conter apenas letras maiúsculas (exceto I, O, Q) e números",
  })
  chassi!: string;

  @ApiProperty({ description: "RENAVAM do veículo (9 ou 11 dígitos)", example: "12345678901" })
  @IsString({ message: "RENAVAM deve ser um texto" })
  @Length(9, 11, { message: "RENAVAM deve ter 9 ou 11 dígitos" })
  @Matches(/^\d+$/, { message: "RENAVAM deve conter apenas números" })
  renavam!: string;

  @ApiProperty({ description: "Modelo do veículo", example: "Civic" })
  @IsString({ message: "Modelo deve ter o formato de texto" })
  @MaxLength(250, { message: "Modelo não pode exceder 250 caracteres" })
  model!: string;

  @ApiProperty({ description: "Marca/fabricante do veículo", example: "Honda" })
  @IsString({ message: "Marca deve ter o formato de texto" })
  @MaxLength(250, { message: "Marca não pode exceder 250 caracteres" })
  make!: string;

  @ApiProperty({ description: "Ano de fabricação (4 dígitos)", example: "2024" })
  @IsString({ message: "Ano deve ter o formato de texto" })
  @Matches(/^\d{4}$/, { message: "Ano deve ter 4 dígitos (ex: 2026)" })
  year!: string;

  @ApiProperty({ description: "Ano do modelo (4 dígitos)", example: "2024" })
  @IsString({ message: "Ano modelo deve ter o formato de texto" })
  @Matches(/^\d{4}$/, { message: "Ano modelo deve ter 4 dígitos (ex: 2026)" })
  modelYear!: string;
}
