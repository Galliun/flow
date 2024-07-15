import 'dotenv/config';
import config from "../../config.json";
import { DEVNET, MAINNET, TESTNET, NETWORK } from "../constants";
import { updateConfig } from '../utils/configUtils';

export const getCurrentNetwork = () => {
  console.log("Current network:", config.network);
}

export const switchNetwork = async (network: NETWORK) => {
  if (network === DEVNET || network == MAINNET || network == TESTNET) {
    await updateConfig("network", network);
    console.log("Network updated to:", network);
  } else {
    console.log(`${network} is not supported`);
  }
}
