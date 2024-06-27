import 'dotenv/config';

import { Ed25519Keypair } from '@mysten/sui.js/keypairs/ed25519';
import { SUI_DECIMALS } from '@mysten/sui.js/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

import config from "../../config.json" assert { type: "json" };

//  Get the Key pair from the provided Seed Phrase in the .env
export const getKeypair = () => {
  const keypair = Ed25519Keypair.deriveKeypair(process.env.SEED_PHRASE);
  return keypair;
}

//  Get the wallet address from the provided Seed Phrase in the .env
export const getAddress = () => {
  const keypair = getKeypair();
  const publicKey = keypair.getPublicKey();
  return publicKey.toSuiAddress();
}

//  Get Sui client using the current network
export const getClient = () => {
  return new SuiClient({
    url: getFullnodeUrl(config.network),
  });
}

// Convert int Mist to double Sui
export const mistToSui = (rawMist) => {
  const mist = parseInt(rawMist);
  const divisor = Math.pow(10, SUI_DECIMALS);
  const balance = parseFloat(mist).toFixed(9) / (divisor).toFixed(9);
  return balance.toFixed(9);
}