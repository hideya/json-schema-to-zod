import { z } from 'zod';

import type { JsonSchemaObject, Primitive } from '../types';

export const parseConst = (jsonSchema: JsonSchemaObject & { const: any }) => {
	const value = jsonSchema.const;
	// Cast to Primitive to satisfy TypeScript
	return z.literal(value as Primitive);
};
