import {
  ApiOperation,
  ApiTags as SwgApiTags,
  ApiBearerAuth,
  ApiProperty,
  ApiHeader,
  ApiExtraModels,
} from '@nestjs/swagger';
import { ApiOperationOptions } from '@nestjs/swagger/dist/decorators/api-operation.decorator';
import { ApiPropertyOptions } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { applyDecorators, Type } from '@nestjs/common';
import { ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { envService } from '@app/env';
// import { PaginatedResult } from '@/base/api/paginated';

export * from '@nestjs/swagger';

const createApiOperation = (defaultOptions: ApiOperationOptions) => {
  return (options?: ApiOperationOptions): MethodDecorator =>
    ApiOperation({
      ...defaultOptions,
      ...options,
    });
};

export const ApiListOperation = createApiOperation({ summary: 'List all' });
export const ApiRetrieveOperation = createApiOperation({
  summary: 'Get information a record',
});
export const ApiCreateOperation = createApiOperation({ summary: 'Create new' });
export const ApiUpdateOperation = createApiOperation({
  summary: 'Edit a record',
});
export const ApiDeleteOperation = createApiOperation({
  summary: 'Delete a record',
});
export const ApiBulkDeleteOperation = createApiOperation({
  summary: 'Delete multiple records',
});

const header =
  envService.NODE_ENV === envService.PROD
    ? ApiBearerAuth()
    : ApiHeader({
        name: 'Authorization',
        enum: envService.BEARER_TEST,
        description: JSON.stringify(envService.BEARER_TEST),
      });

export function ApiTagsAndBearer(...tags: string[]) {
  return applyDecorators(ApiBearerAuth(), SwgApiTags(...tags), header);
}

// export const ApiPaginatedResponse = <TModel extends Type>(model: TModel) => {
//   return applyDecorators(
//     ApiExtraModels(PaginatedResult),
//     ApiOkResponse({
//       schema: {
//         title: `PaginatedResponseOf ${model?.name}`,
//         allOf: [
//           { $ref: getSchemaPath(PaginatedResult) },
//           {
//             properties: {
//               data: {
//                 type: 'array',
//                 items: { $ref: getSchemaPath(model) },
//               },
//             },
//           },
//         ],
//       },
//     }),
//   );
// };
