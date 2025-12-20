import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ParamIdDto {
    @IsMongoId({ message: 'Invalid MongoDB ID format' })
    @IsNotEmpty({ message: 'ID is required' })
    id: string;
}