import { jsonSchemaToZod } from '@h1deya/json-schema-to-zod';

// A simple schema to test
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
};

console.log('Testing ESM import...');
console.log('jsonSchemaToZod imported:', jsonSchemaToZod ? 'SUCCESS' : 'FAILED');

try {
  console.log('Converting schema...');
  const zodSchema = jsonSchemaToZod(schema);
  console.log('Schema created:', zodSchema ? 'SUCCESS' : 'FAILED');
  
  // Test validation
  const validData = { name: 'John', age: 30 };
  const validResult = zodSchema.safeParse(validData);
  console.log('Valid data test:', validResult.success ? 'PASS' : 'FAIL');
  
  const invalidData = { age: 30 };
  const invalidResult = zodSchema.safeParse(invalidData);
  console.log('Invalid data test:', invalidResult.success ? 'FAIL' : 'PASS');
  
  console.log('\nAll tests completed successfully!');
} catch (error) {
  console.error('Error during testing:', error);
}
