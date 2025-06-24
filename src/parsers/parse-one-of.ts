import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';

export const parseOneOf = (
	jsonSchema: JsonSchemaObject & { oneOf: JsonSchemaObject['oneOf'] },
	refs: Refs,
): z.ZodTypeAny => {
	const innerSchemas = jsonSchema.oneOf!.map((innerSchema, i) =>
		parseSchema(innerSchema, {
			...refs,
			path: [...refs.path, 'oneOf', i],
		}),
	);

	return z.union(innerSchemas as [z.ZodTypeAny, z.ZodTypeAny]);
};
