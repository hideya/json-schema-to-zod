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
	
	// The multipleOf validation is causing type issues
	// We need to modify the approach to ensure type compatibility
	if (jsonSchema.multipleOf !== undefined) {
		const multipleOf = jsonSchema.multipleOf;
		const errorMessage = jsonSchema.errorMessage?.multipleOf;
		
		// First get the base schema with all previous validations
		const baseSchema = zodSchema as z.ZodNumber;
		
		// Create a refined schema with the multipleOf validation
		const refinedSchema = baseSchema.refine((value) => value % multipleOf === 0, {
			message: errorMessage ?? `value must be a multiple of ${multipleOf}`,
		});
		
		// Use the refined schema
		zodSchema = refinedSchema;
	}

	return zodSchema;
};
