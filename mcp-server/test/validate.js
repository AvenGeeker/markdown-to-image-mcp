#!/usr/bin/env node

async function validateMCPServer() {
  console.log('🔍 Validating MCP Markdown-to-Image Server...');
  
  try {
    // Test imports
    console.log('\\n📦 Testing module imports...');
    
    const { themes } = await import('../dist/themes/index.js');
    console.log(`✓ Themes loaded: ${themes.length} themes`);
    
    const { templates } = await import('../dist/templates/index.js');
    console.log(`✓ Templates loaded: ${templates.length} templates`);
    
    const { ListThemesTool } = await import('../dist/tools/listThemes.js');
    console.log('✓ ListThemesTool imported');
    
    const { ListTemplatesTool } = await import('../dist/tools/listTemplates.js');
    console.log('✓ ListTemplatesTool imported');
    
    const { PreviewMarkdownTool } = await import('../dist/tools/previewMarkdown.js');
    console.log('✓ PreviewMarkdownTool imported');
    
    const { GeneratePosterTool } = await import('../dist/tools/generatePoster.js');
    console.log('✓ GeneratePosterTool imported');
    
    // Test tool definitions
    console.log('\\n🛠️ Testing tool definitions...');
    
    const generateDef = GeneratePosterTool.getToolDefinition();
    console.log(`✓ generateMarkdownPoster tool defined with ${Object.keys(generateDef.inputSchema.properties).length} parameters`);
    
    const themesDef = ListThemesTool.getToolDefinition();
    console.log('✓ listThemes tool defined');
    
    const templatesDef = ListTemplatesTool.getToolDefinition();
    console.log('✓ listTemplates tool defined');
    
    const previewDef = PreviewMarkdownTool.getToolDefinition();
    console.log('✓ previewMarkdown tool defined');
    
    // Test tool execution (without browser)
    console.log('\\n⚙️ Testing tool execution...');
    
    const listThemesTool = new ListThemesTool();
    const themesResult = await listThemesTool.execute();
    console.log(`✓ listThemes executed: ${themesResult.length} themes returned`);
    
    const listTemplatesTool = new ListTemplatesTool();
    const templatesResult = await listTemplatesTool.execute();
    console.log(`✓ listTemplates executed: ${templatesResult.length} templates returned`);
    
    // Test preview (SSR without browser)
    const previewTool = new PreviewMarkdownTool();
    const previewResult = await previewTool.execute({
      markdown: '# Test\\n\\nThis is a **test** markdown.',
      theme: 'blue'
    });
    console.log(`✓ previewMarkdown executed: HTML generated (${previewResult.html.length} chars)`);
    
    // Test resources
    console.log('\\n📚 Testing resources...');
    
    const { ThemesResource } = await import('../dist/resources/themes.js');
    const themeResources = await ThemesResource.listResources();
    console.log(`✓ ThemesResource: ${themeResources.length} resources listed`);
    
    const blueTheme = await ThemesResource.handleRequest('markdown-poster://themes/blue');
    console.log(`✓ ThemesResource: blue theme retrieved (${blueTheme.name})`);
    
    const { TemplatesResource } = await import('../dist/resources/templates.js');
    const templateResources = await TemplatesResource.listResources();
    console.log(`✓ TemplatesResource: ${templateResources.length} resources listed`);
    
    // Test configuration
    console.log('\\n⚙️ Testing configuration...');
    
    const { ConfigManager } = await import('../dist/core/configManager.js');
    const configManager = new ConfigManager();
    
    const allThemes = configManager.getAllThemes();
    console.log(`✓ ConfigManager: ${allThemes.length} themes configured`);
    
    const allTemplates = configManager.getAllTemplates();
    console.log(`✓ ConfigManager: ${allTemplates.length} templates configured`);
    
    const blueThemeConfig = configManager.getTheme('blue');
    console.log(`✓ ConfigManager: blue theme config retrieved (${blueThemeConfig?.name})`);
    
    // Validate theme data
    console.log('\\n🎨 Validating theme configurations...');
    for (const theme of allThemes) {
      if (!theme.id || !theme.name || !theme.className) {
        throw new Error(`Invalid theme configuration: ${theme.id}`);
      }
    }
    console.log('✓ All theme configurations valid');
    
    // Validate template data
    console.log('\\n📋 Validating template configurations...');
    for (const template of allTemplates) {
      if (!template.id || !template.name || !template.supportedAspectRatios) {
        throw new Error(`Invalid template configuration: ${template.id}`);
      }
    }
    console.log('✓ All template configurations valid');
    
    console.log('\\n🎉 All validations passed!');
    console.log('\\n📝 Summary:');
    console.log(`   • ${allThemes.length} themes available`);
    console.log(`   • ${allTemplates.length} templates available`);
    console.log(`   • 4 MCP tools implemented`);
    console.log(`   • ${themeResources.length + templateResources.length} MCP resources available`);
    console.log('\\n✅ MCP Markdown-to-Image Server is ready to use!');
    console.log('\\n📌 Note: To test image generation, install Chrome browser:');
    console.log('   npx puppeteer browsers install chrome');
    
  } catch (error) {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  }
}

// Run validation
validateMCPServer().catch(console.error);