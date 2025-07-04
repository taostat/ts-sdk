import { config } from 'dotenv';
import { TaoStatsClient, TaoStatsError } from '../src';

// Load environment variables from .env file
config();

async function main() {
  // Initialize the client
  const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY || 'your-api-key-here',
  });

  try {
    // Check API health
    console.log('Checking API health...');
    const health = await client.getHealth();
    console.log('API Health:', health.data);

    // Get blocks
    console.log('Getting blocks...');
    const blocks = await client.chain.getExtrinsics(
      {
        limit: 2,

      }
    );
    console.log('Blocks:', blocks.data);
  } catch (error) {
    if (error instanceof TaoStatsError) {
      console.error('TaoStats API Error:', {
        message: error.message,
        statusCode: error.statusCode,
        response: error.response,
      });
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

// Run the example
if (require.main === module) {
  main().catch(console.error);
}

export { main }; 