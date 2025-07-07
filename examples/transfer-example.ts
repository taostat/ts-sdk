import { config } from 'dotenv';
import { TaoStatsClient } from '../src/client/taostats-client';

// Load environment variables from .env file
config();

async function main() {

  const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY,
    seed: process.env.TAOSTATS_ACCOUNT_SEED
  })

  console.log('TAO Transfer Example');
  console.log('======================');
  console.log('This example demonstrates:');
  
  
  // 1. Transfer TAO(commented out for safety)
  // console.log('- client.transfer.tao() for actual transfers');
  // console.log('\nTransfer Fee Estimation:');
  const transferAmount = '0.01';
  const destinationAddress = '5ELi63FNJFFbQz8a2zWafRLFWxPivNu7gUTMhK4MnrRCxzMr';


  try {
    const result = await client.transfer.tao({
      to: destinationAddress, // Replace with actual destination
      amount: transferAmount, // Amount in TAO
      // from: 'optional-source-address' // Optional: specify source address
    });

    console.log('Transfer completed successfully!');
    console.log(`Transaction hash: ${result.hash}`);
    console.log(`Block number: ${result.blockNumber}`);
    console.log(`Amount transferred: ${result.amount} TAO`);
    console.log(`Actual fee paid: ${result.fee} TAO`);
    console.log(`From: ${result.from}`);
    console.log(`To: ${result.to}`);
  } catch (error) {
    console.error('[ERROR] Transfer failed:', error);
  }

  // 2. Transfer Alpha (commented out for safety)
  // console.log('\nAlpha Transfer Example');
  // console.log('======================');
  // console.log('This example demonstrates:');
  // console.log('- client.transfer.alpha() for actual transfers');

  // const transferAmount = '1'; // 1 Alpha
  // const destinationAddress = '5ELi63FNJFFbQz8a2zWafRLFWxPivNu7gUTMhK4MnrRCxzMr';

  // try {
  //   const result = await client.transfer.alpha({
  //     to_address: destinationAddress,
  //     amount: transferAmount,
  //     from_hotkey: '5G1Qj93Fy22grpiGKq6BEvqqmS2HVRs3jaEdMhq9absQzs6g',
  //     from_subnet: 75,
  //     to_subnet: 75
  //   });

  //   console.log('Transfer completed successfully!');
  //   console.log(`Transaction hash: ${result.hash}`);
  //   console.log(`Block number: ${result.blockNumber}`);
  //   console.log(`Amount transferred: ${result.amount} Alpha`);
  //   console.log(`From: ${result.from}`);
  //   console.log(`To: ${result.to}`);
  // } catch (error) {
  //   console.error('[ERROR] Transfer failed:', error);
  // }
}

main().catch(console.error); 