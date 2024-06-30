// Dependence
import 'dotenv/config';

// Node imports
import fs from 'node:fs';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getClient, getKeypair } from "../../utils/suiUtils.js";
import { getPacakgeId, delay } from "../../utils/waterCooler.js";
import { getObjectId } from "../../utils/getObjectId.js";
import { WATER_COOLER, WATER_COOLER_ADMIN } from "../../constants.js";


export default async () => {
  console.log("Initiate Water Cooler");

  const waterCoolerObjectId = await getObjectId(WATER_COOLER);
  console.log("objectId", waterCoolerObjectId);

  const waterCoolerAdminObjectId = await getObjectId(WATER_COOLER_ADMIN);
  console.log("waterCoolerAdminObjectId", waterCoolerAdminObjectId);

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);

  tx.moveCall({
    target: `${packageId}::water_cooler::initialize_water_cooler`,
    arguments: [
      tx.object(waterCoolerAdminObjectId),
      tx.object(waterCoolerObjectId)
    ]
  });

  const result = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
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
