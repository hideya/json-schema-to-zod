#!/bin/bash

# Test script for mcp-client-langchain-ts with the fixed json-schema-to-zod package

# First build the project
echo "Building mcp-client-langchain-ts..."
cd /Users/hideya/Desktop/WS/AT/mcp-client-langchain-ts
npm run build

# Test running the built output
echo ""
echo "Testing the built output..."
node dist/index.js -h

echo ""
echo "If no module resolution errors appear, and you see the help message,"
echo "then the fix was successful! 🎉"
