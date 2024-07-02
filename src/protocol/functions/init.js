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
import writeFile from "../../utils/writeFile.js";
import { updateNestedConfig, getNestedConfig } from "../../utils/configUtils.js";
import { getObjectIdArrayFromObject } from "../../utils/getObjectIdArray.js";
import { 
  WATER_COOLER_ID, WATER_COOLER_ADMIN_ID,
  REGISTRY_ID,
  COLLECTION_ID,
  DIGEST, DIGEST_INIT,
  MIZU_NFT, MIZU_NFT_IDS
 } from "../../constants.js";


export default async () => {
  console.log("Initiate Water Cooler");

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);

  tx.moveCall({
    target: `${packageId}::water_cooler::initialize_water_cooler`,
    arguments: [
      tx.object(getNestedConfig(config.network, WATER_COOLER_ADMIN_ID)),
      tx.object(getNestedConfig(config.network, WATER_COOLER_ID)),
      tx.object(getNestedConfig(config.network, REGISTRY_ID)),
      tx.object(getNestedConfig(config.network, COLLECTION_ID)),
    ]
  });

  const objectChange = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: { showObjectChanges: true },
  });

  await updateNestedConfig(DIGEST, DIGEST_INIT, objectChange?.digest);
  const mizuNFTIdArray = await getObjectIdArrayFromObject(MIZU_NFT, objectChange);
  await updateNestedConfig(config.network, MIZU_NFT_IDS, mizuNFTIdArray);

  await writeFile("initialization", objectChange);

  console.log("Your Water Cooler has been initiated.");
}
