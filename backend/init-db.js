const dotenv = require('dotenv');
const { exec } = require('child_process');
const { promisify } = require('util');

dotenv.config();
const execAsync = promisify(exec);

async function setupDatabase() {
  console.log('Setting up PostgreSQL database...\n');
  
  try {
    // Test if PostgreSQL is installed and running
    console.log('1. Testing PostgreSQL connection...');
    
    // Try to connect using createdb command (Windows)
    const createDbCmd = `createdb -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} ${process.env.DB_NAME}`;
    
    // Set password in environment for psql
    process.env.PGPASSWORD = process.env.DB_PASSWORD;
    
    try {
      await execAsync(`psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -c "SELECT 1"`);
      console.log('✅ PostgreSQL is running');
    } catch (error) {
      console.error('❌ PostgreSQL is not running or not installed');
      console.log('\nPlease ensure:');
      console.log('1. PostgreSQL is installed (https://www.postgresql.org/download/windows/)');
      console.log('2. PostgreSQL service is running (services.msc -> start "postgresql-x64-15")');
      console.log('3. Default credentials: user=postgres, password=postgres');
      process.exit(1);
    }
    
    // Try to create database if it doesn't exist
    console.log('\n2. Creating/Checking database...');
    try {
      await execAsync(`psql -h ${process.env.DB_HOST} -p ${process.env.DB_PORT} -U ${process.env.DB_USER} -c "CREATE DATABASE ${process.env.DB_NAME}"`);
      console.log(`✅ Database "${process.env.DB_NAME}" created`);
    } catch (error) {
      if (error.message.includes('already exists')) {
        console.log(`✅ Database "${process.env.DB_NAME}" already exists`);
      } else {
        throw error;
      }
    }
    
    // Initialize Sequelize models
    console.log('\n3. Initializing Sequelize models...');
    const sequelize = require('./config/database');
    
    try {
      await sequelize.authenticate();
      console.log('✅ Database connection successful');
      
      // Sync all models
      const User = require('./models/User');
      const Task = require('./models/Task');
      
      await sequelize.sync({ force: true });
      console.log('✅ Database tables created');
      
      // Create a test user
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      
      await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword
      });
      
      console.log('✅ Test user created (admin@example.com / admin123)');
      
    } catch (error) {
      console.error('❌ Error syncing database:', error.message);
      throw error;
    }
    
    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nYou can now:');
    console.log('1. Start backend: cd backend && npm run dev');
    console.log('2. Start frontend: cd frontend && npm run dev');
    console.log('3. Login with: admin@example.com / admin123');
    
    process.exit(0);
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.log('\nPossible solutions:');
      console.log('1. Check PostgreSQL password in .env file');
      console.log('2. Reset PostgreSQL password:');
      console.log('   a. Open SQL Shell (psql) as admin');
      console.log('   b. Run: ALTER USER postgres WITH PASSWORD \'postgres\';');
    }
    
    process.exit(1);
  }
}

setupDatabase();