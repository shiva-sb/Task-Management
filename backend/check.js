console.log('🔍 Checking Environment Variables...\n');

// Load .env file
require('dotenv').config();

console.log('Current .env values:');
console.log('='.repeat(50));
console.log('PORT:', process.env.PORT);
console.log('SUPABASE_URL:', process.env.SUPABASE_URL || '❌ NOT SET');
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY ? '✅ Set (length: ' + process.env.SUPABASE_ANON_KEY.length + ')' : '❌ NOT SET');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set (length: ' + process.env.SUPABASE_SERVICE_ROLE_KEY.length + ')' : '❌ NOT SET');
console.log('JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ NOT SET');
console.log('='.repeat(50));

// Check if .env file exists
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

if (fs.existsSync(envPath)) {
  console.log('\n✅ .env file exists at:', envPath);
  console.log('\n.env file content preview:');
  console.log('='.repeat(50));
  
  const content = fs.readFileSync(envPath, 'utf8');
  const lines = content.split('\n').slice(0, 10); // Show first 10 lines
  lines.forEach(line => {
    if (line.includes('KEY') || line.includes('SECRET')) {
      // Hide sensitive parts
      const [key, value] = line.split('=');
      if (value && value.length > 10) {
        console.log(`${key}=${value.substring(0, 10)}...`);
      } else {
        console.log(line);
      }
    } else {
      console.log(line);
    }
  });
  console.log('='.repeat(50));
} else {
  console.log('\n❌ .env file NOT FOUND at:', envPath);
  console.log('\nCreating sample .env file...');
  
  const sampleEnv = `PORT=5000
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
JWT_SECRET=your_jwt_secret_here`;
  
  fs.writeFileSync(envPath, sampleEnv);
  console.log('✅ Sample .env file created. Please update with real values!');
}

// Verify Supabase URL format
if (process.env.SUPABASE_URL) {
  if (!process.env.SUPABASE_URL.includes('supabase.co')) {
    console.log('\n⚠️  Warning: SUPABASE_URL should contain "supabase.co"');
  }
}

// Verify JWT secret
if (process.env.JWT_SECRET && process.env.JWT_SECRET.includes('change_this')) {
  console.log('\n⚠️  Warning: Please change the default JWT_SECRET for security!');
}

console.log('\n' + '='.repeat(50));
console.log('Next Steps:');
console.log('1. Update .env with real Supabase credentials');
console.log('2. Run: node test-supabase.js');
console.log('3. If still issues, run: node check-env.js');