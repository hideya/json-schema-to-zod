import { z } from 'zod';

import { parseSchema } from './parse-schema';
import type { JsonSchemaObject, Refs } from '../types';

export const parseMultipleType = (
	jsonSchema: JsonSchemaObject & { type: string[] },
	refs: Refs,
): z.ZodTypeAny => {
	const types = jsonSchema.type;
	const schemas = types.map(type => {
		return parseSchema({...jsonSchema, type}, refs);
	});

	return z.union(schemas as [z.ZodTypeAny, z.ZodTypeAny]);
};
