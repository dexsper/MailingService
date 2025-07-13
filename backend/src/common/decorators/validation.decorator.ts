import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

import { ValidationErrorResponse } from './error.dto';

export function ApiValidationError() {
  return applyDecorators(
    ApiExtraModels(ValidationErrorResponse),
    ApiResponse({
      status: 422,
      description: 'Validation error',
      schema: {
        $ref: getSchemaPath(ValidationErrorResponse),
      },
    }),
  );
}
