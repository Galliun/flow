import fs from 'node:fs';
import 'dotenv/config';
import config from "../config.json" assert { type: "json" };
import { DEVNET, MAINNET } from "../constants.js";
import { updateConfig } from '../utils/configUtils.js';

import { getFaucetHost, requestSuiFromFaucetV0 } from '@mysten/sui.js/faucet';

export const getCurrentNetwork = () => {
  console.log("Current network:", config.network);
}

export const switchNetwork = async (network) => {
  if (network == DEVNET || network == MAINNET) {
    await updateConfig("network", network);
    console.log("Network updated to:", network);
  } else {
    console.log(`${network} is not supported`);
  }
}
