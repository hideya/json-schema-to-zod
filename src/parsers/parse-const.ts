import { z } from 'zod';

import type { JsonSchemaObject, Serializable } from '../types';

export const parseConst = (jsonSchema: JsonSchemaObject & { const: Serializable }) => {
	const value = jsonSchema.const;
	return z.literal(value);
};
