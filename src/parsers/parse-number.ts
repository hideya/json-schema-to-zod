import { z } from 'zod';

import type { JsonSchemaObject } from '../types';
import { extendSchemaWithMessage } from '../utils/extend-schema';

export const parseNumber = (jsonSchema: JsonSchemaObject & { type: 'number' | 'integer' }) => {
	let zodSchema = z.number();

	if (jsonSchema.type === 'integer') {
		zodSchema = zodSchema.int();
	}

	zodSchema = extendSchemaWithMessage(zodSchema, jsonSchema, 'minimum', (zs, minimum, errorMsg) =>
		zs.gte(minimum, errorMsg),
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'exclusiveMinimum',
		(zs, exclusiveMinimum, errorMsg) => {
			if (typeof exclusiveMinimum === 'boolean') {
				const minimum = jsonSchema.minimum;
				if (exclusiveMinimum && minimum !== undefined) {
					return zs.gt(minimum, errorMsg);
				}
				return zs;
			}
			return zs.gt(exclusiveMinimum, errorMsg);
		},
	);
	zodSchema = extendSchemaWithMessage(zodSchema, jsonSchema, 'maximum', (zs, maximum, errorMsg) =>
		zs.lte(maximum, errorMsg),
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'exclusiveMaximum',
		(zs, exclusiveMaximum, errorMsg) => {
			if (typeof exclusiveMaximum === 'boolean') {
				const maximum = jsonSchema.maximum;
				if (exclusiveMaximum && maximum !== undefined) {
					return zs.lt(maximum, errorMsg);
				}
				return zs;
			}
			return zs.lt(exclusiveMaximum, errorMsg);
		},
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'multipleOf',
		(zs, multipleOf, errorMsg) =>
			zs.refine((value) => value % multipleOf === 0, {
				message: errorMsg ?? `value must be a multiple of ${multipleOf}`,
			}),
	);

	return zodSchema;
};
