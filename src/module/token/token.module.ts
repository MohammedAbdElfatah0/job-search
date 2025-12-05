import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenRepository, tokenSchema } from '../../DB/model';
import { TokenService } from './token.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Token.name, schema: tokenSchema }
    ]),
  ],
  providers: [TokenService,TokenRepository],
  exports: [TokenService,TokenRepository],
})
export class TokenModule {}
