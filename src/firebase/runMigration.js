import { migrateDataToFirestore } from './migrateData.js';

// Run migration
migrateDataToFirestore()
  .then(() => {
    console.log('Migration completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
