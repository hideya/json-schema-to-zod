#!/usr/bin/env node

// Try both import styles to see which one works
try {
  // CommonJS import style
  const { jsonSchemaToZod } = require('@h1deya/json-schema-to-zod');
  console.log('Successfully imported jsonSchemaToZod using CommonJS require()');
  
  // A simple schema to test
  const schema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      age: { type: 'number' }
    },
    required: ['name']
  };

  console.log('Converting JSON schema to Zod schema...');
  const zodSchema = jsonSchemaToZod(schema);

  console.log('Testing the schema with valid data...');
  const validData = { name: 'John', age: 30 };
  const validResult = zodSchema.safeParse(validData);
  console.log('Valid data result:', validResult.success ? 'PASS' : 'FAIL');

  console.log('Testing the schema with invalid data...');
  const invalidData = { age: 30 }; // Missing required 'name' field
  const invalidResult = zodSchema.safeParse(invalidData);
  console.log('Invalid data result:', invalidResult.success ? 'FAIL' : 'PASS');

  console.log('\nIf both tests show PASS, the package is working correctly!');
} catch (e) {
  console.error('Error with CommonJS import:', e.message);
}
