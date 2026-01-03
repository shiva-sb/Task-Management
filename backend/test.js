console.log('🧪 Enhanced Supabase Test with Fallback\n');

require('dotenv').config();

// Check what's in .env
console.log('Checking environment:');
console.log('SUPABASE_URL exists:', !!process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY exists:', !!process.env.SUPABASE_ANON_KEY);

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  console.log('\n⚠️  Supabase credentials missing!');
  console.log('\nYou have two options:');
  console.log('1. Get Supabase credentials (recommended)');
  console.log('   - Go to: https://supabase.com');
  console.log('   - Create free account and project');
  console.log('   - Get credentials from Settings -> API');
  console.log('\n2. Use SQLite instead (for quick testing)');
  console.log('   - Install: npm install sqlite3 sequelize');
  console.log('   - Change database config to use SQLite');
  
  console.log('\nFor now, creating sample .env file...');
  
  // Create sample .env in current directory
  const fs = require('fs');
  const path = require('path');
  
  const envContent = `PORT=5000
# Get these from https://supabase.com -> Settings -> API
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
JWT_SECRET=your_secret_key_here_change_this`;
  
  fs.writeFileSync(path.join(__dirname, '.env'), envContent);
  console.log('✅ Created .env file with instructions');
  console.log('📍 Location:', path.join(__dirname, '.env'));
} else {
  console.log('\n✅ Supabase credentials found!');
  console.log('\nTesting connection...');
  
  // Rest of your test code here
  const { createClient } = require('@supabase/supabase-js');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  // Test the connection
  supabase.from('_health').select('*').limit(1)
    .then(response => {
      console.log('✅ Connected to Supabase!');
    })
    .catch(error => {
      console.log('❌ Connection failed:', error.message);
    });
}