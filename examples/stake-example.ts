import { TaoStatsClient } from '../src/index';

async function main() {
  // Initialize client with RPC URL
  const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY,
    seed: process.env.TAOSTATS_ACCOUNT_SEED
  });

  try {
    console.log('=== Stake Module Example ===\n');

    // Example hotkey (replace with actual hotkey)
    const hotkey_taostats = '5GKH9FPPnWSUoeeTJp19wVtd84XqFW4pyK2ijV2GsFbhTrP1';

    // 1. Estimate stake cost for root network (no slippage)
    console.log('1. Estimating stake cost for root network...');
    const rootCostEstimate = await client.stake.estimateStake(hotkey_taostats, '1.0', 0);
    console.log('Root staking cost estimate:');
    console.log(`  Total Cost: ${rootCostEstimate.totalCost} TAO`);
    console.log(`  Expected Received: ${rootCostEstimate.expectedReceived} TAO\n`);

    // // 2. Estimate stake cost for subnet (with slippage)
    // console.log('2. Estimating stake cost for subnet 64...');
    // const subnetCostEstimate = await client.stake.estimateStake(hotkey_taostats, '1.0', 64);
    // console.log('Subnet staking cost estimate:');
    // console.log(`  Total Cost: ${subnetCostEstimate.totalCost} TAO`);
    // console.log(`  Expected Received: ${subnetCostEstimate.expectedReceived} Alpha\n`);


    // // 3. Example: Stake to root network (commented out for safety)
    // console.log('3. Staking to root network...');
    // const rootStakeResult = await client.stake.toRoot({
    //   hotkey: hotkey_taostats,
    //   amount: '0.1', // 0.1 TAO
    // });
    // console.log('Root stake result:', rootStakeResult);
    // console.log(`Transaction hash: ${rootStakeResult.txHash}\n`);


    // 4. Example: Stake to subnet (commented out for safety)
    // console.log('4. Staking to subnet 1...');
    // const alphaStakeResult = await client.stake.alpha({
    //   hotkey: hotkey_taostats,
    //   subnet: 1,
    //   amount: '10', //in TAO
    // });
    // console.log('Alpha stake result:', alphaStakeResult);
    // console.log(`Transaction hash: ${alphaStakeResult.txHash}\n`);


    console.log('✅ Stake module example completed successfully!');

  } catch (error) {
    console.error('❌ Error in stake example:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error name:', error.name);
    }
  }
}

// Run the example
main().catch(console.error); 