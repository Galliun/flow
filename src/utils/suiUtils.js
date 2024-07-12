// Dependence
import 'dotenv/config';


// Packages imports
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SUI_DECIMALS } from '@mysten/sui/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import * as bip39 from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import chalk from 'chalk';
import boxen from 'boxen';

import config from "../../config.json" assert { type: "json" };

//  Get the Key pair from the provided Seed Phrase in the .env
export const getKeypair = () => {
  const keypair = Ed25519Keypair.deriveKeypair(process.env.SEED_PHRASE);
  return keypair;
}

// https://github.com/MystenLabs/sui/blob/02599ed5c4e03845ca3ea06bc0a9ded10fc1aa52/apps/wallet/src/shared/utils/bip39.ts#L13
export function generateMnemonic() {
  return bip39.generateMnemonic(wordlist);
}

export const createMnemonic = () => {
  const mnemonic = generateMnemonic(); // if we want to show mnemonic we need to use bip39
  // Get the secret key
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const address = keypair.getPublicKey().toSuiAddress()

  const output = boxen(
      `${chalk.bold('Address:')} ${chalk.blue(address)}\n\n${chalk.bold('Recovery Phrase:')}\n${mnemonic}`,
      { padding: 1, margin: 1, borderStyle: 'double' }
  );
  console.log(output)
}

//  Get the wallet address from the provided Seed Phrase in the .env
export const getAddress = () => {
  const keypair = getKeypair();
  if(!keypair){
    throw new Error("Cannot find mnemonic in the .env file")
  }
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
export const mistToSui = (rawMist, defaultDecimals = 9) => {
  const mist = parseInt(rawMist);
  const divisor = Math.pow(10, SUI_DECIMALS);
  const balance = mist / divisor;
  return balance.toFixed(defaultDecimals);
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