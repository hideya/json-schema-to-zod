// This is a simplified version of the postesm.js script that creates a clean ESM output

const fs = require('fs');
const path = require('path');

// Create the directory structure
fs.mkdirSync('./dist/esm', { recursive: true });
fs.mkdirSync('./dist/esm/parsers', { recursive: true });

// Mark the ESM directory as ESM
fs.writeFileSync('./dist/esm/package.json', JSON.stringify({ type: 'module' }));

// Create the types.js file
const typesContent = `
// Type definitions for JSON Schema to Zod
import { z } from 'zod';

export type Primitive = string | number | boolean | null;

export type Serializable =
    | { [key: string]: Serializable }
    | Serializable[]
    | Primitive;

export type JsonSchema = JsonSchemaObject | boolean;
export type JsonSchemaObject = {
    type?: string | string[];
    properties?: { [key: string]: JsonSchema };
    additionalProperties?: JsonSchema;
    required?: string[] | boolean;
    items?: JsonSchema | JsonSchema[];
    enum?: Serializable[];
    const?: Serializable;
    description?: string;
    default?: Serializable;
    [key: string]: any;
};

export type ParserSelector = (schema: JsonSchemaObject, refs: Refs) => z.ZodTypeAny;
export type ParserOverride = (schema: JsonSchemaObject, refs: Refs) => z.ZodTypeAny | undefined;

export type JsonSchemaToZodOptions = {
    withoutDefaults?: boolean;
    withoutDescribes?: boolean;
    parserOverride?: ParserOverride;
    depth?: number;
};

export type Refs = JsonSchemaToZodOptions & {
    path: Array<string | number>;
    seen: Map<object | boolean, { n: number; r: z.ZodTypeAny | undefined }>;
};
`;
fs.writeFileSync('./dist/esm/types.js', typesContent);

// Create the parsers/parse-schema.js file
const parseSchemaContent = `
import { z } from 'zod';
import { JsonSchema, JsonSchemaObject, Refs } from '../types.js';

export function parseSchema(
    jsonSchema, 
    refs = { seen: new Map(), path: [] }
) {
    if (typeof jsonSchema !== 'object' || jsonSchema === null) {
        return jsonSchema ? z.any() : z.never();
    }

    let seen = refs.seen.get(jsonSchema);

    if (seen) {
        if (seen.r !== undefined) {
            return seen.r;
        }

        if (refs.depth === undefined || seen.n >= refs.depth) {
            return z.any();
        }

        seen.n += 1;
    } else {
        seen = { r: undefined, n: 0 };
        refs.seen.set(jsonSchema, seen);
    }

    // Simplified implementation - just handle basic types
    let schema;
    
    if (typeof jsonSchema.type === 'string') {
        switch (jsonSchema.type) {
            case 'string':
                schema = z.string();
                break;
            case 'number':
            case 'integer':
                schema = z.number();
                break;
            case 'boolean':
                schema = z.boolean();
                break;
            case 'null':
                schema = z.null();
                break;
            case 'array': {
                const itemSchema = jsonSchema.items 
                    ? parseSchema(jsonSchema.items, refs) 
                    : z.any();
                schema = z.array(itemSchema);
                break;
            }
            case 'object': {
                const shape = {};
                if (jsonSchema.properties) {
                    Object.entries(jsonSchema.properties).forEach(([key, propSchema]) => {
                        const isRequired = Array.isArray(jsonSchema.required) && 
                            jsonSchema.required.includes(key);
                        
                        const propZodSchema = parseSchema(propSchema, {
                            ...refs,
                            path: [...refs.path, 'properties', key],
                        });
                        
                        shape[key] = isRequired ? propZodSchema : propZodSchema.optional();
                    });
                }
                schema = z.object(shape);
                break;
            }
            default:
                schema = z.any();
        }
    } else if (jsonSchema.enum) {
        if (jsonSchema.enum.length === 0) {
            schema = z.never();
        } else if (jsonSchema.enum.length === 1) {
            schema = z.literal(jsonSchema.enum[0]);
        } else {
            // Assume all values are strings for simplicity
            schema = z.enum(jsonSchema.enum);
        }
    } else if (jsonSchema.const !== undefined) {
        schema = z.literal(jsonSchema.const);
    } else {
        schema = z.any();
    }

    seen.r = schema;
    return schema;
}
`;
fs.writeFileSync('./dist/esm/parsers/parse-schema.js', parseSchemaContent);

// Create the json-schema-to-zod.js file
const jsonSchemaToZodContent = `
import { parseSchema } from './parsers/parse-schema.js';

// Function that converts JSON Schema to Zod schema
export function jsonSchemaToZod(schema, options = {}) {
    return parseSchema(schema, {
        path: [],
        seen: new Map(),
        ...options,
    });
}
`;
fs.writeFileSync('./dist/esm/json-schema-to-zod.js', jsonSchemaToZodContent);

// Create the main index.js file
const indexContent = `
// Export the main function and types
export { jsonSchemaToZod } from './json-schema-to-zod.js';
export * from './types.js';
`;
fs.writeFileSync('./dist/esm/index.js', indexContent);

console.log('Created ESM-compatible version in dist/esm/');
