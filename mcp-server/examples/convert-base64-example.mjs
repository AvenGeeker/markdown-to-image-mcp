#!/usr/bin/env node

/**
 * Example script demonstrating how to use the convertBase64ToImage tool
 * This can be run directly or used as a reference for MCP client implementations
 */

import { ConvertBase64ToImageTool } from '../dist/tools/convertBase64ToImage.js';

// Example Base64 PNG data (1x1 pixel transparent PNG)
const examplePngBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';

async function main() {
  console.log('Base64 to Image Conversion Example');
  console.log('==================================\n');
  
  const tool = new ConvertBase64ToImageTool();
  
  // Example 1: Convert PNG to JPEG
  console.log('Example 1: Converting PNG to JPEG');
  try {
    const result = await tool.execute({
      base64Data: examplePngBase64,
      format: 'jpeg',
      quality: 85
    });
    
    if (result.success) {
      console.log('✅ Conversion successful!');
      console.log(`   Format: ${result.metadata.format}`);
      console.log(`   Size: ${result.metadata.size} bytes`);
      console.log(`   Output Base64 length: ${result.imageData.length} characters`);
      console.log(`   Output preview: ${result.imageData.substring(0, 50)}...`);
    } else {
      console.log('❌ Conversion failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during conversion:', error.message);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Example 2: Convert PNG to PNG (re-encode)
  console.log('Example 2: Re-encoding PNG');
  try {
    const result = await tool.execute({
      base64Data: examplePngBase64,
      format: 'png'
    });
    
    if (result.success) {
      console.log('✅ Re-encoding successful!');
      console.log(`   Format: ${result.metadata.format}`);
      console.log(`   Size: ${result.metadata.size} bytes`);
      console.log(`   Output Base64 length: ${result.imageData.length} characters`);
    } else {
      console.log('❌ Re-encoding failed:', result.error);
    }
  } catch (error) {
    console.error('❌ Error during re-encoding:', error.message);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Example 3: Error case - invalid Base64
  console.log('Example 3: Handling invalid Base64 data');
  try {
    const result = await tool.execute({
      base64Data: 'this is not valid base64 data!',
      format: 'png'
    });
    
    if (!result.success) {
      console.log('✅ Error handling works correctly!');
      console.log(`   Error message: ${result.error}`);
    } else {
      console.log('❌ Should have failed but succeeded');
    }
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
  }
}

// Run the example
main().catch(console.error);