import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsBoolean,
  IsArray,
  ValidateNested,
  Min,
  Max,
  Length,
} from 'class-validator';

import { Expose, Type } from 'class-transformer';

export class MessagePreviewDto {
  @Expose()
  @ApiProperty()
  uid: number;

  @Expose()
  @ApiProperty()
  subject: string;
}

export class MessageDto extends MessagePreviewDto {
  @Expose()
  @ApiProperty()
  from: string;

  @Expose()
  @ApiProperty()
  to?: string;

  @Expose()
  @ApiProperty()
  date: string;

  @Expose()
  @ApiProperty()
  htmlBody?: string;
}

export class MailboxFilterDto {
  @Expose()
  @IsString({ message: 'string_required' })
  @ApiProperty({ example: 'from:example@domain.com' })
  pattern: string;
}

export class MailboxDto {
  @Expose()
  @IsString({ message: 'string_required' })
  @ApiProperty({ example: 'imap.gmail.com' })
  host: string;

  @Expose()
  @IsNumber({}, { message: 'number_required' })
  @Min(1, { message: 'number_min 1' })
  @Max(65535, { message: 'number_max 993' })
  @ApiProperty({ example: 993 })
  port: number;

  @Expose()
  @IsBoolean({ message: 'boolean_required' })
  @ApiProperty({ example: true })
  secure: boolean;

  @Expose()
  @IsString({ message: 'string_required' })
  @Length(1, 255, { message: 'length_min_max 1 255' })
  @ApiProperty({ example: 'password123' })
  password: string;
}

export class MailboxFiltersDto {
  @Expose()
  @IsArray({ message: 'array_required' })
  @ValidateNested({ each: true })
  @Type(() => MailboxFilterDto)
  @ApiProperty({ type: MailboxFilterDto, isArray: true })
  filters: MailboxFilterDto[];
}
