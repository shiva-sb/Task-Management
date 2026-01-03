const dotenv = require('dotenv');
dotenv.config();

const { createClient } = require('@supabase/supabase-js');

async function testSupabase() {
  console.log('🔍 Testing Supabase Connection...\n');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('❌ Supabase credentials missing in .env file');
    return;
  }
  
  console.log('Supabase URL:', process.env.SUPABASE_URL);
  console.log('Supabase Anon Key:', process.env.SUPABASE_ANON_KEY ? '***' : 'Missing');
  console.log('Supabase Service Key:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '***' : 'Missing');
  
  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  
  try {
    // Test connection
    console.log('\n1. Testing connection...');
    const { data: health, error: healthError } = await supabase.from('_health').select('*').limit(1);
    
    if (healthError && healthError.message.includes('relation "_health" does not exist')) {
      console.log('✅ Connected to Supabase (alternative check)');
    } else if (healthError) {
      throw healthError;
    } else {
      console.log('✅ Connected to Supabase');
    }
    
    // Test query
    console.log('\n2. Testing query...');
    const { data: tables, error: tablesError } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public')
      .limit(5);
    
    if (tablesError) {
      console.log('⚠️  Could not list tables (normal for non-admin)');
    } else {
      console.log('✅ Tables found:', tables.map(t => t.tablename).join(', '));
    }
    
    // Create test data
    console.log('\n3. Creating test user...');
    const bcrypt = require('bcryptjs');
    const testPassword = await bcrypt.hash('test123', 10);
    
    const { data: testUser, error: userError } = await supabase
      .from('users')
      .insert([
        {
          username: 'testuser_' + Date.now(),
          email: `test${Date.now()}@example.com`,
          password: testPassword
        }
      ])
      .select()
      .single();
    
    if (userError) {
      if (userError.code === '23505') {
        console.log('✅ Users table exists (duplicate key error)');
      } else {
        console.log('⚠️  Could not insert test user:', userError.message);
      }
    } else {
      console.log('✅ Test user created:', testUser.id);
      
      // Clean up
      await supabase.from('users').delete().eq('id', testUser.id);
    }
    
    console.log('\n🎉 Supabase connection test completed!');
    console.log('\nNext steps:');
    console.log('1. Run: npm run dev');
    console.log('2. Test API endpoints with Postman');
    console.log('3. Update frontend API calls if needed');
    
  } catch (error) {
    console.error('\n❌ Supabase test failed:', error.message);
    console.error('\nCheck:');
    console.log('1. Your .env file has correct Supabase credentials');
    console.log('2. You created the tables in Supabase SQL Editor');
    console.log('3. Your project is active on Supabase dashboard');
  }
}

testSupabase();