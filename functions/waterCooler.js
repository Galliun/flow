// Dependence
import 'dotenv/config';

// Node packages
import fs from 'node:fs';

// Sui packages
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Other packages
import inquirer from 'inquirer';

// Local imports
import config from "../config.json" assert { type: "json" };
import { DEVNET, MAINNET } from "../constants.js";
import { updateConfig } from '../utils/configUtils.js';
import { getAddress, getClient, getKeypair, mistToSui } from "../utils/suiUtils.js";


export const coolerPrice = async () => {
  const price = await getCoolerPrice();
  console.log("Water Cooler price is:", `${mistToSui(price)} $SUI`);
}

export const getCoolerPrice = async () => {
  return new Promise(async (res, rej) => {
    const client = getClient();

    const cooler_factory = await client.getObject({
      id: config.cooler_factory,
      // fetch the object content field
      options: { showContent: true },
    });

    res(cooler_factory?.data?.content?.fields?.price);
  });
}


export const buyWaterCooler = async () => {
  const price = await getCoolerPrice();

  const prompt = inquirer.createPromptModule();
  const answers = await prompt([
    {
      type: "input",
      name: "confirm",
      message: `You are about to buy a Water Cooler for ${mistToSui(price)} $SUI. To confirm type y or n to cancel:`
    }
  ]);

  // Execute buy order from smart contract
  if(answers.confirm == "y") {
    console.log(`Buy Water Cooler now.`);

    const keypair = getKeypair();
    const client = getClient();
  
    const packageId = config.water_cool_package_id;
    const tx = new TransactionBlock();

    const name = "My First Cooler";
    const description = "Launching the best NFT collection ever.";
    const image_url = "https://i.pinimg.com/564x/69/4d/e7/694de75fb07176e33e435e9938da1f60.jpg";
    const size = 10;
    const treasury = getAddress();


    const [coin] = tx.splitCoins(tx.gas, [price]);

    tx.setGasBudget(config.gasBudgetAmount);

    console.log("coin", coin);

    const res = tx.moveCall({
      target: `${packageId}::cooler_factory::buy_water_cooler`,
      arguments: [
        tx.object(config.cooler_factory), coin,
        tx.pure.string(name), tx.pure.string(description),
        tx.pure.string(image_url), tx.pure.u16(size),
        tx.pure.address(treasury)
      ]
    });

    console.log("res", res);
  
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,

    });

    console.log("result:", { result });
  
    const writeStream = fs.createWriteStream("./water_cooler.json", { flags: 'w' });
      writeStream.write(JSON.stringify(result, null, 4));
      writeStream.end();
  
    console.log("write done");


  } else {
    console.log(`Buy order canceled.`);
  }
}

export const mint = async () => {
  console.log("Mint NFT");
}

export const init = async () => {
  console.log("Initiate Water Cooler");
}

export const settings = async () => {
  console.log("Setting up Water Cooler");
}
