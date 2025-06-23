import { z } from 'zod';

import type { JsonSchemaObject } from '../types';
import { extendSchemaWithMessage } from '../utils/extend-schema';

export const parseNumber = (jsonSchema: JsonSchemaObject & { type: 'number' | 'integer' }) => {
	let zodSchema = z.number();

	if (jsonSchema.type === 'integer') {
		zodSchema = zodSchema.int();
	}

	// Cast to appropriate type for min/max methods
	const numberSchema = zodSchema as z.ZodNumber;

	zodSchema = extendSchemaWithMessage(zodSchema, jsonSchema, 'minimum', (zs, minimum, errorMsg) =>
		numberSchema.gte(minimum, errorMsg),
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'exclusiveMinimum',
		(zs, exclusiveMinimum, errorMsg) => {
			if (typeof exclusiveMinimum === 'boolean') {
				const minimum = jsonSchema.minimum;
				if (exclusiveMinimum && minimum !== undefined) {
					return numberSchema.gt(minimum, errorMsg);
				}
				return zs;
			}
			return numberSchema.gt(exclusiveMinimum, errorMsg);
		},
	);
	zodSchema = extendSchemaWithMessage(zodSchema, jsonSchema, 'maximum', (zs, maximum, errorMsg) =>
		numberSchema.lte(maximum, errorMsg),
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'exclusiveMaximum',
		(zs, exclusiveMaximum, errorMsg) => {
			if (typeof exclusiveMaximum === 'boolean') {
				const maximum = jsonSchema.maximum;
				if (exclusiveMaximum && maximum !== undefined) {
					return numberSchema.lt(maximum, errorMsg);
				}
				return zs;
			}
			return numberSchema.lt(exclusiveMaximum, errorMsg);
		},
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'multipleOf',
		(zs, multipleOf, errorMsg) => {
			// Use type casting to ensure TypeScript understands the return type
			return z.number().refine((value) => value % multipleOf === 0, {
				message: errorMsg ?? `value must be a multiple of ${multipleOf}`,
			}) as unknown as z.ZodTypeAny;
		},
	);

	return zodSchema;
};
