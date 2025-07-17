const fs = require('fs');
const path = require('path');

// Performance: Generate build info at build time
const generateBuildInfo = () => {
  const buildDate = new Date().toISOString();
  const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  const version = packageJson.version || '1.0.0';
  
  // Create .env.local with build info
  const envContent = `# Auto-generated build info - DO NOT EDIT MANUALLY
REACT_APP_BUILD_DATE=${buildDate}
REACT_APP_VERSION=${version}
REACT_APP_BUILD_TIMESTAMP=${Date.now()}
`;

  fs.writeFileSync(path.join(__dirname, '.env.local'), envContent);
  
  console.log('🚀 Build info generated:');
  console.log(`   Version: ${version}`);
  console.log(`   Build Date: ${buildDate}`);
  console.log(`   Timestamp: ${Date.now()}`);
};

// Run if called directly
if (require.main === module) {
  generateBuildInfo();
}

module.exports = generateBuildInfo;
