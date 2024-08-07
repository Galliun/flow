import 'dotenv/config';
import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui/faucet';

import configRaw from "../../config.json";
import { DEVNET, TESTNET, NETWORK } from "../constants";
import { ConfigInterface } from "../interface/configInterface";
import { createMnemonic, getAddress, getClient, getKeypair, mistToSui } from "../utils/suiUtils";


export const faucet = async () => {
  const config = configRaw as ConfigInterface
  if(config.network === DEVNET || config.network === TESTNET) {
    console.log("Requesting Sui from faucet.");
    const address = getAddress();

    const response = await requestSuiFromFaucetV0({
      // host: getFaucetHost(config.network as "testnet" | "devnet"),
      host: getFaucetHost(config.network as any),
      recipient: address,

    });
    if(response.error === null) {
      const topupMistAmount = response.transferredGasObjects[0].amount
      console.log(`Successfully topped up ${mistToSui(topupMistAmount.toString(), 1)} $SUI`)
    } else {
      console.log("Error topping up", response.error)
    }
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

export const address = async () => {
  const address = getAddress();
  console.log(`Your address is: ${address}`);
}

export const createAddress = () => {
  createMnemonic()
}
