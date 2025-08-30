import { ConvertBase64ToImageTool } from '../dist/tools/convertBase64ToImage.js';

// Test Base64 data for a small PNG image (1x1 pixel)
const testPngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

async function runTests() {
  const tool = new ConvertBase64ToImageTool();
  
  console.log('Testing ConvertBase64ToImageTool...\n');
  
  // Test 1: Convert PNG to PNG
  console.log('Test 1: Converting PNG to PNG');
  try {
    const result1 = await tool.execute({
      base64Data: testPngBase64,
      format: 'png'
    });
    
    console.log('Success:', result1.success);
    if (result1.success) {
      console.log('Output format:', result1.metadata.format);
      console.log('Output size:', result1.metadata.size, 'bytes');
      console.log('Image data length:', result1.imageData.length);
    } else {
      console.log('Error:', result1.error);
    }
  } catch (error) {
    console.error('Test 1 failed with exception:', error);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Test 2: Convert PNG to JPEG
  console.log('Test 2: Converting PNG to JPEG');
  try {
    const result2 = await tool.execute({
      base64Data: testPngBase64,
      format: 'jpeg',
      quality: 80
    });
    
    console.log('Success:', result2.success);
    if (result2.success) {
      console.log('Output format:', result2.metadata.format);
      console.log('Output size:', result2.metadata.size, 'bytes');
      console.log('Image data length:', result2.imageData.length);
    } else {
      console.log('Error:', result2.error);
    }
  } catch (error) {
    console.error('Test 2 failed with exception:', error);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Test 3: Invalid Base64 data
  console.log('Test 3: Invalid Base64 data');
  try {
    const result3 = await tool.execute({
      base64Data: 'invalid_base64_data!!',
      format: 'png'
    });
    
    console.log('Success:', result3.success);
    if (!result3.success) {
      console.log('Error (expected):', result3.error);
    }
  } catch (error) {
    console.error('Test 3 failed with exception:', error);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Test 4: Missing Base64 data
  console.log('Test 4: Missing Base64 data');
  try {
    const result4 = await tool.execute({
      format: 'png'
    });
    
    console.log('Success:', result4.success);
    if (!result4.success) {
      console.log('Error (expected):', result4.error);
    }
  } catch (error) {
    console.error('Test 4 failed with exception:', error);
  }
  
  console.log('\nTesting completed.');
}

runTests().catch(console.error);