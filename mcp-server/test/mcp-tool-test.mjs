import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Test Base64 data for a small PNG image (1x1 pixel)
const testPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

// MCP request for convertBase64ToImage tool
const mcpRequest = {
  jsonrpc: '2.0',
  id: 1,
  method: 'tools/call',
  params: {
    name: 'convertBase64ToImage',
    arguments: {
      base64Data: testPngBase64,
      format: 'jpeg',
      quality: 80
    }
  }
};

console.log('Sending MCP request to convertBase64ToImage tool:');
console.log(JSON.stringify(mcpRequest, null, 2));

// In a real MCP client, this would be sent over the transport layer
// For this test, we'll just show the request format
console.log('\nIn a real MCP client, you would send this request to the server.');
console.log('The server should respond with the converted image data.');