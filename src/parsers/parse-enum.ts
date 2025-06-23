import { z } from 'zod';

import type { JsonSchemaObject, Serializable } from '../types';

export const parseEnum = (jsonSchema: JsonSchemaObject & { enum: Serializable[] }) => {
	if (jsonSchema.enum.length === 0) {
		return z.never();
	}

	if (jsonSchema.enum.length === 1) {
		return z.literal(jsonSchema.enum[0]);
	}

	// Check if all enum values are of the same type
	const firstType = typeof jsonSchema.enum[0];
	const allSameType = jsonSchema.enum.every((value) => typeof value === firstType);

	if (allSameType) {
		// Strongly typed enum
		if (firstType === 'string') {
			return z.enum(jsonSchema.enum as [string, ...string[]]);
		} else if (firstType === 'number') {
			return z.union(
				jsonSchema.enum.map((value) => z.literal(value)) as [z.ZodLiteral<any>, z.ZodLiteral<any>],
			);
		} else if (firstType === 'boolean') {
			return z.union(
				jsonSchema.enum.map((value) => z.literal(value)) as [z.ZodLiteral<any>, z.ZodLiteral<any>],
			);
		}
	}

	// Mixed-type enum, use union of literals
	return z.union(
		jsonSchema.enum.map((value) => z.literal(value)) as [z.ZodLiteral<any>, z.ZodLiteral<any>],
	);
};
