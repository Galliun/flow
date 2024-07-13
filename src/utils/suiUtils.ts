// Dependence
import 'dotenv/config';


// Packages imports
import { Ed25519Keypair } from '@mysten/sui/keypairs/ed25519';
import { SUI_DECIMALS } from '@mysten/sui/utils';
import { getFullnodeUrl, SuiClient } from '@mysten/sui/client';
import { generateMnemonic as bip39GenerateMnemonic } from '@scure/bip39';
import { wordlist } from '@scure/bip39/wordlists/english';
import chalk from 'chalk';
import boxen from 'boxen';

import config from "../../config.json";

//  Get the Key pair from the provided Seed Phrase in the .env
export const getKeypair = () => {
  try{
    const keypair = Ed25519Keypair.deriveKeypair(process.env.SEED_PHRASE!);
    return keypair;
  } catch (e: unknown) {
    // we need to use unknown because error can be anything(null, number, {}, undefined)
    if (e instanceof Error) {
      if (e.message === "Invalid mnemonic type: undefined") {
        console.error(`${chalk.red.bold("[Error]")} Please set up the mnemonic in the .env file to start working with Flow or use the command ${chalk.green.bold("flow create-address")} to create a new wallet.`);
      } else {
        console.log(e.message)
      }
    }
    process.exit(1) // to stop code
  }
}

// https://github.com/MystenLabs/sui/blob/02599ed5c4e03845ca3ea06bc0a9ded10fc1aa52/apps/wallet/src/shared/utils/bip39.ts#L13
export function generateMnemonic() {
  return bip39GenerateMnemonic(wordlist);
}

export const createMnemonic = () => {
  const mnemonic = generateMnemonic(); // if we want to show mnemonic we need to use bip39
  // Get the secret key
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const address = keypair.getPublicKey().toSuiAddress()

  const warningMessage = "Don't forget to save the mnemonic in the .env file to start working with FLOW!"
  const titleMessage = "Wallet Created!"
  const output = boxen(
      `${chalk.bold('Address:')} ${chalk.blue(address)}\n\n${chalk.bold('Recovery Phrase:')}\n${chalk.green(mnemonic)}\n\n${chalk.bold.red(warningMessage)}`,
      { title: titleMessage, padding: 1, margin: 1, borderStyle: 'double' }
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

//  Get the wallet address from the provided Seed Phrase in the .env
export const genSeed = () => {
  const mnemonic = bip39GenerateMnemonic(wordlist);
  return mnemonic;
}

//  Get Sui client using the current network
export const getClient = () => {
  return new SuiClient({
    url: getFullnodeUrl(config.network as any),
  });
}

// Convert int Mist to double Sui
export const mistToSui = (rawMist: string, defaultDecimals = 9) => {
  const mist = parseInt(rawMist);
  const divisor = Math.pow(10, SUI_DECIMALS);
  const balance = mist / divisor;
  return balance.toFixed(defaultDecimals);
}

// Convert double Sui to int Mist
export const suiToMist = (rawSui: string) => {
  console.log("rawSui", rawSui);
  const sui = parseFloat(rawSui);

  console.log("sui", sui);
  
  const multiplier = Math.pow(10, SUI_DECIMALS);
  const balance = sui * multiplier;
  
  console.log("balance", balance);
  return balance;
}