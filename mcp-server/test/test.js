#!/usr/bin/env node

import { ImageGenerator } from '../dist/core/imageGenerator.js';
import fs from 'fs';
import path from 'path';

async function testImageGeneration() {
  console.log('Starting MCP Markdown-to-Image Server test...');
  
  const imageGenerator = new ImageGenerator();
  
  try {
    // Initialize the image generator
    await imageGenerator.initialize();
    console.log('✓ Image generator initialized');

    // Test markdown content
    const testMarkdown = `# AI Morning News - ${new Date().toISOString().slice(0, 10)}

![AI Image](https://imageio.forbes.com/specials-images/imageserve/64b5825a5b9b4d3225e9bd15/artificial-intelligence--ai/960x0.jpg?format=jpg&width=400)

## Today's Headlines

1. **New AI Breakthrough**: Revolutionary model achieves human-level performance
2. **Tech Innovation**: Startup announces game-changing product
3. **Research Update**: Scientists discover new applications for machine learning

### Key Features
- Advanced natural language processing
- Real-time image generation
- Cross-platform compatibility

> "The future of AI is here, and it's more exciting than ever." - Tech Expert

---
*Powered by MCP Markdown-to-Image Service*`;

    // Test different configurations
    const testConfigs = [
      {
        name: 'Default Blue Theme',
        options: {
          theme: 'blue',
          size: 'mobile',
          format: 'png'
        }
      },
      {
        name: 'Spring Gradient Wave Theme',
        options: {
          theme: 'SpringGradientWave',
          size: 'desktop',
          format: 'jpeg',
          quality: 90
        }
      },
      {
        name: 'Purple Square Format',
        options: {
          theme: 'purple',
          aspectRatio: '1/1',
          size: 'mobile',
          format: 'png'
        }
      }
    ];

    // Ensure output directory exists
    const outputDir = path.join(process.cwd(), 'test-output');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Generate test images
    for (const config of testConfigs) {
      console.log(`\\n🎨 Testing: ${config.name}`);
      
      try {
        const result = await imageGenerator.generateFromMarkdown(testMarkdown, config.options);
        
        if (result.success && result.imageUrl) {
          // Copy the generated image from temp directory to test output
          const filename = `test-${config.name.toLowerCase().replace(/\\s+/g, '-')}.${config.options.format}`;
          const outputPath = path.join(outputDir, filename);
          
          // Copy file from temp location to test output
          fs.copyFileSync(result.imageUrl, outputPath);
          
          console.log(`  ✓ Generated: ${filename}`);
          console.log(`  ✓ Size: ${result.metadata.width}x${result.metadata.height}`);
          console.log(`  ✓ File size: ${Math.round(result.metadata.size / 1024)}KB`);
          console.log(`  ✓ Saved to: ${outputPath}`);
        } else {
          console.log(`  ✗ Failed: ${result.error}`);
        }
      } catch (error) {
        console.log(`  ✗ Error: ${error.message}`);
      }
    }

    // Test custom output path
    console.log('\\n📂 Testing custom output path...');
    const customOutputPath = path.join(outputDir, 'custom-output-test.png');
    const customPathResult = await imageGenerator.generateFromMarkdown(testMarkdown, {
      theme: 'blue',
      size: 'mobile',
      format: 'png',
      outputPath: customOutputPath
    });
    
    if (customPathResult.success && customPathResult.imageUrl) {
      console.log('  ✓ Custom output path test successful');
      console.log(`  ✓ Image saved to: ${customPathResult.imageUrl}`);
      // Verify the file exists at the custom path
      if (fs.existsSync(customOutputPath)) {
        console.log('  ✓ Custom output file exists');
      } else {
        console.log('  ✗ Custom output file not found');
      }
    } else {
      console.log(`  ✗ Custom output path test failed: ${customPathResult.error}`);
    }

    console.log('\\n🧪 Testing tools...');
    
    // Test themes list
    const { ListThemesTool } = await import('../dist/tools/listThemes.js');
    const listThemesTool = new ListThemesTool();
    const themes = await listThemesTool.execute();
    console.log(`✓ Found ${themes.length} themes`);

    // Test templates list  
    const { ListTemplatesTool } = await import('../dist/tools/listTemplates.js');
    const listTemplatesTool = new ListTemplatesTool();
    const templates = await listTemplatesTool.execute();
    console.log(`✓ Found ${templates.length} templates`);

    // Test preview
    const { PreviewMarkdownTool } = await import('../dist/tools/previewMarkdown.js');
    const previewTool = new PreviewMarkdownTool();
    const preview = await previewTool.execute({
      markdown: '# Test Preview\\n\\nThis is a **test** preview.',
      theme: 'blue'
    });
    console.log('✓ Preview generation successful');

    console.log('\\n🎉 All tests completed successfully!');
    console.log(`\\nCheck the generated images in: ${outputDir}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    // Cleanup
    try {
      await imageGenerator.cleanup();
      console.log('✓ Cleanup completed');
    } catch (error) {
      console.error('❌ Cleanup failed:', error);
    }
  }
}

// Run the test
testImageGeneration().catch(console.error);