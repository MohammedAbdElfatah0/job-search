import { IsMongoId, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class ParamIdDto {
    @IsMongoId({ message: 'Invalid MongoDB ID format' })
    @IsNotEmpty({ message: 'ID is required' })
    @Transform(({ value }) => value?.trim()) 
    id: string;
}