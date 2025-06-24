import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';

export const parseIfThenElse = (
	jsonSchema: JsonSchemaObject & { if: JsonSchemaObject; then: JsonSchemaObject; else: JsonSchemaObject },
	refs: Refs,
): z.ZodTypeAny => {
	const ifSchema = parseSchema(jsonSchema.if, {
		...refs,
		path: [...refs.path, 'if'],
	});
	const thenSchema = parseSchema(jsonSchema.then, {
		...refs,
		path: [...refs.path, 'then'],
	});
	const elseSchema = parseSchema(jsonSchema.else, {
		...refs,
		path: [...refs.path, 'else'],
	});

	// This is a best-effort implementation as Zod doesn't have direct conditional validation
	return z.union([thenSchema, elseSchema]);
};
