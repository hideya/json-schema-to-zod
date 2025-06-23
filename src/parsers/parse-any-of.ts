import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';

export const parseAnyOf = (
	jsonSchema: JsonSchemaObject & { anyOf: JsonSchemaObject['anyOf'] },
	refs: Refs,
): z.ZodTypeAny => {
	const innerSchemas = jsonSchema.anyOf!.map((innerSchema, i) =>
		parseSchema(innerSchema, {
			...refs,
			path: [...refs.path, 'anyOf', i],
		}),
	);

	return z.union(innerSchemas as [z.ZodTypeAny, z.ZodTypeAny]);
};
