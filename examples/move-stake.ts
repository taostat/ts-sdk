import { TaoStatsClient } from '../src/index';

async function main() {
  // Initialize client with RPC URL
  const client = new TaoStatsClient({
    apiKey: process.env.TAOSTATS_API_KEY,
    seed: process.env.TAOSTATS_ACCOUNT_SEED
  });

  try {
    console.log('=== Move Module Example ===\n');

    // Example hotkeys (replace with actual hotkeys)
    const originHotkey = '5GKH9FPPnWSUoeeTJp19wVtd84XqFW4pyK2ijV2GsFbhTrP1';
    const destinationHotkey = '5G3wMP3g3d775hauwmAZioYFVZYnvw6eY46wkFy8hEWD5KP3';

    // 1. Same subnet move
    // console.log('1. Same subnet move example...');
    // console.log('Moving 0.1 tao within subnet 0');

    // // Uncomment to execute:
    // const sameSubnetResult = await client.move.stake({
    //   originHotkey,
    //   destinationHotkey,
    //   originNetuid: 0,
    //   destinationNetuid: 0,
    //   amount: '0.05', // 0.05 TAO
    // });

    // if (sameSubnetResult.success) {
    //   console.log(`Transaction hash: ${sameSubnetResult.txHash}`);
    // } else {
    //   console.log('Same subnet move failed:', sameSubnetResult.error);
    // }

    // 2. Cross subnet move
    // console.log('2. Cross subnet move example...');
    // console.log('Moving 1.9 Alpha from subnet 1 to subnet 75');

    // // Uncomment to execute:
    // const crossSubnetResult = await client.move.stake({
    //   originHotkey: '5GeR3cDuuFKJ7p66wKGjY65MWjWnYqffq571ZMV4gKMnJqK5',
    //   destinationHotkey: '5G1Qj93Fy22grpiGKq6BEvqqmS2HVRs3jaEdMhq9absQzs6g',
    //   originNetuid: 1,
    //   destinationNetuid: 75,
    //   amount: '1.9', //in Alpha
    // });

    // if (crossSubnetResult.success) {
    //   console.log('Cross subnet move successful!');
    //   console.log(`Transaction hash: ${crossSubnetResult.txHash}`);
    // } else {
    //   console.log('Cross subnet move failed:', crossSubnetResult.error);
    // }

    // console.log('Move module example completed successfully!');


  } catch (error) {
    console.error('Move example failed:', error);

    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

main().catch(console.error); 