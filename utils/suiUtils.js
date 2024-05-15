import 'dotenv/config';

import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { SUI_DECIMALS } from '@mysten/sui.js/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

import config from "../config.json" assert { type: "json" };

export const getKeypair = () => {
  const keypair = Ed25519Keypair.deriveKeypair(process.env.SEED_PHRASE);
  return keypair;
}

export const getAddress = () => {
  const keypair = getKeypair();
  const publicKey = keypair.getPublicKey();
  return publicKey.toSuiAddress();
}

export const getClient = () => {
  return new SuiClient({
    url: getFullnodeUrl(config.network),
  });
}

export const mistToSui = (rawMist) => {
  const mist = parseInt(rawMist);
  const divisor = Math.pow(10, SUI_DECIMALS);
  const balance = parseFloat(mist).toFixed(9) / (divisor).toFixed(9);
  return balance.toFixed(9);
}