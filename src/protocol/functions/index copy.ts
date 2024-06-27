// Dependence
import 'dotenv/config';

// Node packages
import fs from 'node:fs';

// Sui packages
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Other packages
import inquirer from 'inquirer';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getAddress, getClient, getKeypair, mistToSui } from "../../utils/suiUtils.js";
import { getCoolerFactoryId, getPacakgeId, getWaterCoolerDetails, delay } from "../../utils/waterCooler.js";
import { getObjectId } from "../../utils/getObjectId.js";
import { getObjectIdArray } from "../../utils/getObjectIdArray.js";
import { WATER_COOLER, WATER_COOLER_ADMIN, MIZU_NFT, MINT_ADMIN, MINT_WAREHOUSE } from "../../constants.js";

// Display the price of a Water Cooler in $SUI
export const coolerPrice = async () => {
  const price = await getCoolerPrice();
  console.log("Water Cooler price is:", `${mistToSui(price)} $SUI`);
}

// Get the price for buying a Water Cooler from the Water Cooler protocol
// from the Water Cooler Factory
export const getCoolerPrice = async () => {
  return new Promise(async (res, rej) => {
    const client = getClient();
    const coolerFactoryId = getCoolerFactoryId();

    const coolerFactory = await client.getObject({
      id: coolerFactoryId,
      // fetch the object content field
      options: { showContent: true },
    });

    // To Do: fix this any casting
    const response = coolerFactory?.data?.content as any;    

    res(response?.fields?.fee);
  });
}

// Buy a Water Cooler from the Factory in the Water Cooler Protocol
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

  // Execute buy order to protocol
  if(answers.confirm == "y") {
    console.log(`Ordering Water Cooler now.`);

    const CoolerDetails = await getWaterCoolerDetails();

    console.log("Shipping... Your Water Cooler will arrive soon");

    const { name, description, size, treasury, image_url } = CoolerDetails;

    const keypair = getKeypair();
    const client = getClient();
  
    const packageId = getPacakgeId();
    const tx = new TransactionBlock();

    tx.setGasBudget(config.gasBudgetAmount);

    const [coin] = tx.splitCoins(tx.gas, [price]);

    const coolerFactoryId = getCoolerFactoryId();

    tx.moveCall({
      target: `${packageId}::cooler_factory::buy_water_cooler`,
      arguments: [
        tx.object(coolerFactoryId), coin,
        tx.pure.string(name), tx.pure.string(description),
        tx.pure.string(image_url), tx.pure.u16(size),
        tx.pure.address(treasury)
      ]
    });
  
    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: tx,
    });

    // Wait for the transaction to be finalised
    await delay(5000); // Wait 5 seconds

    const objectChange = await client.getTransactionBlock({
      digest: result?.digest,
      // only fetch the effects field
      options: {
        showEffects: false,
        showInput: false,
        showEvents: false,
        showObjectChanges: true,
        showBalanceChanges: false,
      },
    });

    const folderName = '.outputs';

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }
  
    const writeStream = fs.createWriteStream("../../.outputs/water_cooler.json", { flags: 'w' });
      writeStream.write(JSON.stringify(objectChange, null, 4));
      writeStream.end();
  
    console.log("Your Water Cooler has arrived.");

  } else {
    console.log(`Buy order canceled.`);
  }
}

export const init = async () => {
  console.log("Initiate Water Cooler");


  const waterCoolerObjectId = await getObjectId(WATER_COOLER);
  // console.log("objectId", waterCoolerObjectId);
  
  const waterCoolerAdminObjectId = await getObjectId(WATER_COOLER_ADMIN);
  // console.log("waterCoolerAdminObjectId", waterCoolerAdminObjectId);

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new TransactionBlock();

  tx.setGasBudget(config.gasBudgetAmount);

  tx.moveCall({
    target: `${packageId}::water_cooler::admin_initialize_water_cooler`,
    arguments: [
      tx.object(waterCoolerAdminObjectId),
      tx.object(waterCoolerObjectId)
    ]
  });

  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });

  // console.log("result", result);

  // Wait for the transaction to be finalised
  await delay(5000); // Wait 5 seconds

  const objectChange = await client.getTransactionBlock({
    digest: result?.digest,
    // only fetch the effects field
    options: {
      showEffects: false,
      showInput: false,
      showEvents: false,
      showObjectChanges: true,
      showBalanceChanges: false,
    },
  });

  const folderName = '.outputs';

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }

  const writeStream = fs.createWriteStream("./.outputs/initialization.json", { flags: 'w' });
    writeStream.write(JSON.stringify(objectChange, null, 4));
    writeStream.end();

  console.log("Your Water Cooler has been initiated.");
}

export const stock = async () => {
  console.log("Stocking water Cooler with NFTs now");

  // To Do: Fix this "any" casting
  const mizuNFTIdArray = await getObjectIdArray(MIZU_NFT) as any;
  // console.log("mizuNFTIdArray", mizuNFTIdArray);

  const waterCoolerObjectId = await getObjectId(WATER_COOLER);
  // console.log("waterCoolerObjectId", waterCoolerObjectId);
  const mintAdminCapObjectId = await getObjectId(MINT_ADMIN);
  // console.log("mintAdminCapObjectId", mintAdminCapObjectId);
  const warehouseObjectId = await getObjectId(MINT_WAREHOUSE);
  // console.log("warehouseObjectId", warehouseObjectId);

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new TransactionBlock();

  tx.setGasBudget(config.gasBudgetAmount);


  const mizuNFTObjects = mizuNFTIdArray.map(nftId => tx.object(nftId));

  tx.moveCall({
    target: `${packageId}::mint::admin_add_to_mint_warehouse`,
    arguments: [
      tx.object(mintAdminCapObjectId),
      tx.object(waterCoolerObjectId),
      // tx.pure(bcs.vector({ Array: mizuNFTs }).to),
      tx.makeMoveVec({ objects: mizuNFTObjects }),
      // stringList,
      // tx.pure(bcs.ser('vector<MizuNFT>', mizuNFTs).toBytes()),
      // bcs.ser('vector<MizuNFT>', mizuNFTs).toBytes(),
      tx.object(warehouseObjectId),
    ]
  });

  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });

  console.log("result", result);

  const objectChange = await client.getTransactionBlock({
    digest: result?.digest,
    // only fetch the effects field
    options: {
      showEffects: false,
      showInput: false,
      showEvents: false,
      showObjectChanges: true,
      showBalanceChanges: false,
    },
  });

  const folderName = '.outputs';

    try {
      if (!fs.existsSync(folderName)) {
        fs.mkdirSync(folderName);
      }
    } catch (err) {
      console.error(err);
    }

  const writeStream = fs.createWriteStream("../.outputs/warehouse.json", { flags: 'w' });
    writeStream.write(JSON.stringify(objectChange, null, 4));
    writeStream.end();

  console.log("The Water Cooler has been stocked.");

}

export const mint = async () => {
  console.log("Mint NFT");
}

export const settings = async () => {
  console.log("Setting up Water Cooler");
}
