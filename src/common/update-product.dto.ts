import { IsOptional, IsString, IsUUID } from "class-validator";
import { CreateProductDto } from "./create-product.dto";
import { PartialType } from '@nestjs/swagger';

export class UpdateProductDto extends PartialType(CreateProductDto) {
	@IsString()
	@IsUUID()
	id: string;
}