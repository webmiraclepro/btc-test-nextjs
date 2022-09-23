import {
  IsNotEmpty,
  IsString,
  IsAlphanumeric,
  IsEthereumAddress,
} from 'class-validator';

export class QueryDto {
  @IsNotEmpty()
  @IsString()
  @IsAlphanumeric()
  @IsEthereumAddress()
  address: string;
}
