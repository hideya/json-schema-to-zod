import { z } from 'zod';

import type { JsonSchemaObject } from '../types';
import { parseSchema } from './parse-schema';

export const parseNullable = (jsonSchema: JsonSchemaObject & { nullable: true }, refs: any) => {
	// Remove nullable flag to avoid infinite recursion
	const { nullable, ...schemaWithoutNullable } = jsonSchema;

	// Parse the schema without the nullable flag
	const nonNullableSchema = parseSchema(schemaWithoutNullable, refs);

	// Return the schema with nullable option
	return z.union([nonNullableSchema, z.null()]);
};
