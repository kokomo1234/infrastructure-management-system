const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Empty password - adjust if needed
  multipleStatements: true
});

async function setupDatabase() {
  try {
    console.log('Connecting to MySQL...');
    
    // Create database if it doesn't exist
    await connection.promise().execute('CREATE DATABASE IF NOT EXISTS infrastructure_db');
    console.log('Database "infrastructure_db" created or already exists');
    
    // Use the database
    await connection.promise().execute('USE infrastructure_db');
    console.log('Using database "infrastructure_db"');
    
    // Read and execute the SQL schema file
    const sqlFile = path.join(__dirname, 'drawSQL-mysql-export-2025-07-16.sql');
    const sqlContent = fs.readFileSync(sqlFile, 'utf8');
    
    console.log('Executing SQL schema...');
    await connection.promise().execute(sqlContent);
    console.log('Database schema imported successfully!');
    
    // Test the connection by listing tables
    const [tables] = await connection.promise().execute('SHOW TABLES');
    console.log('\nTables created:');
    tables.forEach(table => {
      console.log(`- ${Object.values(table)[0]}`);
    });
    
    console.log('\n✅ Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Try updating the password in backend/.env file');
      console.log('   Common passwords: "root", "password", or leave empty');
    }
  } finally {
    connection.end();
  }
}

setupDatabase();
