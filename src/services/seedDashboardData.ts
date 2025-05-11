
import { seedHistoricalData } from './supabaseService';

// Auto-run the seeding process when this file is imported
export const seedDashboardData = () => {
  // Seed dashboard data on startup
  // This will add health check-ins and plan recommendations if needed
  seedHistoricalData().catch(error => {
    console.error('Failed to seed dashboard data:', error);
  });
};

// Call the function to ensure it runs
seedDashboardData();
