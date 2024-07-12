// Dependence
import 'dotenv/config';

// Packages imports
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SUI_DECIMALS } from '@mysten/sui/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import bip39 from 'bip39';

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

//  Get the wallet address from the provided Seed Phrase in the .env
export const genSeed = () => {
  const mnemonic = bip39.generateMnemonic();
  return mnemonic;
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
  const balance = mist / divisor;
  return balance.toFixed(9);
}

// Convert double Sui to int Mist
export const suiToMist = (rawSui) => {

  console.log("rawSui", rawSui);

  const sui = parseFloat(rawSui);

  console.log("sui", sui);
  const multiplier = Math.pow(10, SUI_DECIMALS);
  const balance = sui * multiplier;

  console.log("balance", balance);
  return balance;
}