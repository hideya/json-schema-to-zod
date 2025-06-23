import { z } from 'zod';

import type { JsonSchemaObject, Primitive, Serializable } from '../types';

export const parseEnum = (jsonSchema: JsonSchemaObject & { enum: Serializable[] }) => {
	if (jsonSchema.enum.length === 0) {
		return z.never();
	}

	if (jsonSchema.enum.length === 1) {
		return z.literal(jsonSchema.enum[0] as Primitive);
	}

	// Check if all enum values are of the same type
	const firstType = typeof jsonSchema.enum[0];
	const allSameType = jsonSchema.enum.every((value) => typeof value === firstType);

	if (allSameType) {
		// Strongly typed enum
		if (firstType === 'string') {
			return z.enum(jsonSchema.enum as unknown as [string, ...string[]]);
		} else if (firstType === 'number' || firstType === 'boolean') {
			return z.union(
				jsonSchema.enum.map((value) => z.literal(value as Primitive)) as [z.ZodLiteral<any>, z.ZodLiteral<any>],
			);
		}
	}

	// Mixed-type enum, use union of literals
	return z.union(
		jsonSchema.enum.map((value) => z.literal(value as Primitive)) as [z.ZodLiteral<any>, z.ZodLiteral<any>],
	);
};
