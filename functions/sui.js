import 'dotenv/config';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

import config from "../config.json" assert { type: "json" };
import { DEVNET } from "../constants.js";
import { getAddress, getClient, getKeypair, mistToSui } from "../utils/suiUtils.js";


export const faucet = async () => {
  if(config.network == DEVNET) {
    console.log("Requesting Sui from faucet.");

    const address = getAddress();

    await requestSuiFromFaucetV0({
      host: getFaucetHost(DEVNET),
      recipient: address
    });
    
    balance();
  } else {
    console.log("Faucet is only available on devnet and testnet.");
  }
}

export const balance = async () => {
  const address = getAddress();
  const client = getClient();

  const coinBalance = await client.getBalance({ owner: address });
  const convertedBalance = mistToSui(coinBalance.totalBalance)

  console.log(`Current balance: ${convertedBalance} $SUI`);
}