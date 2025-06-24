import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';

export const parseNot = (
	jsonSchema: JsonSchemaObject & { not: JsonSchemaObject['not'] },
	refs: Refs,
): z.ZodTypeAny => {
	const notSchema = parseSchema(jsonSchema.not!, {
		...refs,
		path: [...refs.path, 'not'],
	});

	// Zod doesn't directly support negation schemas
	// This is a simplified approach - we return any() with a refinement
	return z.any().refine(
		(value) => {
			const result = notSchema.safeParse(value);
			return !result.success;
		},
		{
			message: 'Value must not match the forbidden schema',
		}
	);
};
