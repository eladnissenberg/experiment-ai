// C:\Users\Eli\Desktop\app3\api\tests\test-extraction.js
const DOMExtractionService = require('../services/domExtraction');

async function testExtraction() {
  try {
    console.log('Testing URL validation...');
    const testUrl = 'http://www.supporteam.io';
    console.log(`Testing URL: ${testUrl}`);
    
    console.log('Step 1: URL validation');
    const isValid = await DOMExtractionService.validateURL(testUrl);
    console.log('URL validation result:', isValid);

    if (isValid) {
      console.log('\nStep 2: DOM extraction');
      const result = await DOMExtractionService.extract(testUrl);
      console.log('Extraction successful:', {
        hasStructure: !!result.structure,
        hasStyles: !!result.styles,
        hasAssets: !!result.assets
      });
      console.log('\nExtracted data preview:', {
        structureType: typeof result.structure,
        topLevelKeys: Object.keys(result)
      });
    }
  } catch (error) {
    console.error('\nTest failed:', {
      message: error.message,
      stack: error.stack
    });
  }
}

console.log('Starting DOM extraction test...\n');
testExtraction().then(() => {
  console.log('\nTest completed');
  process.exit(0);
}).catch(error => {
  console.error('\nTest failed with error:', error);
  process.exit(1);
});
