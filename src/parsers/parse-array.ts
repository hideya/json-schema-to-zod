import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';
import { extendSchemaWithMessage } from '../utils/extend-schema';

export const parseArray = (jsonSchema: JsonSchemaObject & { type: 'array' }, refs: Refs) => {
	const itemsSchema = jsonSchema.items;

	let zodSchema: z.ZodTypeAny;

	if (Array.isArray(itemsSchema)) {
		// Tuple validation
		const innerSchemas = itemsSchema.map((innerSchema, i) =>
			parseSchema(innerSchema, {
				...refs,
				path: [...refs.path, 'items', i],
			}),
		);

		zodSchema = z.tuple(innerSchemas as [z.ZodTypeAny, ...z.ZodTypeAny[]]);

		if (jsonSchema.additionalItems !== undefined && jsonSchema.additionalItems !== false) {
			const additionalSchema = parseSchema(jsonSchema.additionalItems, {
				...refs,
				path: [...refs.path, 'additionalItems'],
			});
			// We need to cast zodSchema to allow the .rest() method
			const tupleSchemaCast = zodSchema as any;
			zodSchema = tupleSchemaCast.rest(additionalSchema);
		}
	} else {
		// List validation
		const innerSchema = parseSchema(itemsSchema ?? true, {
			...refs,
			path: [...refs.path, 'items'],
		});
		zodSchema = z.array(innerSchema);
	}

	// Cast to ZodArray for method access
	const arraySchemaCast = zodSchema as any;

	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'minItems',
		(zs, minItems, errorMsg) => arraySchemaCast.min(minItems, errorMsg),
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'maxItems',
		(zs, maxItems, errorMsg) => arraySchemaCast.max(maxItems, errorMsg),
	);

	if (jsonSchema.uniqueItems) {
		zodSchema = zodSchema.refine(
			(value: any[]) => new Set(value.map((v: any) => JSON.stringify(v))).size === value.length,
			{
				message: 'Array items must be unique',
			},
		);
	}

	return zodSchema;
};
