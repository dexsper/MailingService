import { ApiProperty } from '@nestjs/swagger';

class ValidationErrorItem {
  @ApiProperty()
  property: string;

  @ApiProperty({ type: [String] })
  messages: string[];
}

export class ValidationErrorResponse {
  @ApiProperty({ example: 422 })
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty({ type: [ValidationErrorItem] })
  errors: ValidationErrorItem[];

  @ApiProperty()
  error: string;
}
