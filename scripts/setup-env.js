import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envExamplePath = path.join(__dirname, '..', 'env.example');
const envPath = path.join(__dirname, '..', '.env');

// Check if .env already exists
if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
  process.exit(0);
}

// Read example file
if (!fs.existsSync(envExamplePath)) {
  console.error('❌ env.example file not found');
  process.exit(1);
}

// Copy example to .env
fs.copyFileSync(envExamplePath, envPath);

// Generate a random JWT secret
const randomSecret = crypto.randomBytes(32).toString('hex');

// Update JWT_SECRET in .env
let envContent = fs.readFileSync(envPath, 'utf8');
envContent = envContent.replace(
  'JWT_SECRET=your-secret-key-here-change-this-in-production-please-use-a-random-string',
  `JWT_SECRET=${randomSecret}`
);

fs.writeFileSync(envPath, envContent);

console.log('✅ .env file created successfully!');
console.log('✅ Random JWT_SECRET generated');
console.log('\n⚠️  Please update the following in .env:');
console.log('   - MONGODB_URI (your MongoDB connection string)');
console.log('   - ODDS_API_KEY (optional, for sports tools)');
console.log('   - STRIPE_SECRET_KEY (optional, for payments)');

