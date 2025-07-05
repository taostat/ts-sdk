import { TaoStatsClient } from '../src/index';

async function main() {
  // Initialize client with RPC URL
  const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY,
    seed: process.env.TAOSTATS_ACCOUNT_SEED
  });

  try {
    console.log('=== Unstake Module Example ===\n');

    // Example hotkey (replace with actual hotkey)
    const hotkey_taostats = '5GKH9FPPnWSUoeeTJp19wVtd84XqFW4pyK2ijV2GsFbhTrP1';

    // 1. Estimate unstake cost for root network (no slippage)
    console.log('1. Estimating unstake cost for root network...');
    const rootUnstakeEstimate = await client.unstake.estimateUnstake(hotkey_taostats, '1.0', 0);
    console.log('Root unstake cost estimate:');
    console.log(`  Total Cost: ${rootUnstakeEstimate.totalCost} TAO`);
    console.log(`  Expected Received: ${rootUnstakeEstimate.expectedReceived} TAO\n`);

    // 2. Estimate unstake cost for subnet (with slippage)
    // console.log('2. Estimating unstake cost for subnet 1...');
    // const subnetUnstakeEstimate = await client.unstake.estimateUnstake(hotkey_taostats, '4.144443', 1);
    // console.log('Subnet unstake cost estimate:');
    // console.log(`  Total Cost: ${subnetUnstakeEstimate.totalCost} Alpha`);
    // console.log(`  Expected Received: ${subnetUnstakeEstimate.expectedReceived} TAO\n`);


    // 3. Example: Unstake from root network (commented out for safety)
    // console.log('3. Unstaking from root network...');
    // const rootUnstakeResult = await client.unstake.fromRoot({
    //   hotkey: hotkey_taostats,
    //   amount: '0.1', // 0.1 TAO
    // });
    // console.log('Root unstake result:', rootUnstakeResult);
    // console.log(`Transaction hash: ${rootUnstakeResult.txHash}\n`);


    // 4. Example: Unstake from subnet (commented out for safety)
    // console.log('4. Unstaking from subnet 1...');
    // const alphaUnstakeResult = await client.unstake.alpha({
    //   hotkey: hotkey_taostats,
    //   subnet: 1,
    //   amount: '4.14444', //in Alpha
    // });
    // console.log('Alpha unstake result:', alphaUnstakeResult);
    // console.log(`Transaction hash: ${alphaUnstakeResult.txHash}\n`);

    console.log('Unstake module example completed successfully!');

  } catch (error) {
    console.error('Error in unstake example:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
    }
  }
}

// Run the example
main().catch(console.error); 