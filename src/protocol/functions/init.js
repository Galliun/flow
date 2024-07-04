// Dependence
import 'dotenv/config';

// Node imports
import fs from 'node:fs';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getClient, getKeypair } from "../../utils/suiUtils.js";
import { getPacakgeId } from "../../utils/waterCooler.js";
import { writeFile, readFile } from "../../utils/fileUtils.js";
import { getObjectIdArrayFromObject } from "../../utils/getObjectIdArray.js";
import { 
  WATER_COOLER_ID,
  WATER_COOLER_ADMIN_ID,
  REGISTRY_ID,
  COLLECTION_ID,
  DIGEST,
  INIT,
  BUY,
  MIZU_NFT,
  MIZU_NFT_IDS
 } from "../../constants.js";

export default async () => {
  console.log("Initiate Water Cooler");

  const buyObject = await readFile(`${config.network}_${BUY}`);
  const keypair = getKeypair();
  const client = getClient();
  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);
  
  tx.moveCall({
    target: `${packageId}::water_cooler::initialize_water_cooler`,
    arguments: [
      tx.object(buyObject[WATER_COOLER_ADMIN_ID]),
      tx.object(buyObject[WATER_COOLER_ID]),
      tx.object(buyObject[REGISTRY_ID]),
      tx.object(buyObject[COLLECTION_ID]),
    ]
  });

  const objectChange = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showObjectChanges: true },
  });

  let initObject = {};

  const mizuNFTIdArray = await getObjectIdArrayFromObject(MIZU_NFT, objectChange);

  initObject[MIZU_NFT_IDS] = mizuNFTIdArray;
  initObject[DIGEST] = objectChange?.digest;

  await writeFile(`${config.network}_${INIT}`, initObject);

  console.log("Your Water Cooler has been initiated.");
}
