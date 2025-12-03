#!/usr/bin/env node

import { setupDatabase } from '../lib/database/schema';

console.log('🚀 Initializing database...\n');

try {
  setupDatabase();
  console.log('\n✅ Database initialized successfully!');
  console.log('\n📝 Default credentials:');
  console.log('   Username: admin');
  console.log('   Password: James1234');
  process.exit(0);
} catch (error) {
  console.error('\n❌ Error initializing database:', error);
  process.exit(1);
}
