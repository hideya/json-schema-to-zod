import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';

export const parseAllOf = (
	jsonSchema: JsonSchemaObject & { allOf: JsonSchemaObject['allOf'] },
	refs: Refs,
): z.ZodTypeAny => {
	const allSchemas = jsonSchema.allOf!.map((innerSchema, i) =>
		parseSchema(innerSchema, {
			...refs,
			path: [...refs.path, 'allOf', i],
		}),
	);

	return allSchemas.reduce((acc, schema) => acc.and(schema));
};
