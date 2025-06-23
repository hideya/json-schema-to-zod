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
			zodSchema = zodSchema.rest(additionalSchema);
		}
	} else {
		// List validation
		const innerSchema = parseSchema(itemsSchema ?? true, {
			...refs,
			path: [...refs.path, 'items'],
		});
		zodSchema = z.array(innerSchema);
	}

	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'minItems',
		(zs, minItems, errorMsg) => zs.min(minItems, errorMsg),
	);
	zodSchema = extendSchemaWithMessage(
		zodSchema,
		jsonSchema,
		'maxItems',
		(zs, maxItems, errorMsg) => zs.max(maxItems, errorMsg),
	);

	if (jsonSchema.uniqueItems) {
		zodSchema = zodSchema.refine(
			(value) => new Set(value.map((v) => JSON.stringify(v))).size === value.length,
			{
				message: 'Array items must be unique',
			},
		);
	}

	return zodSchema;
};
