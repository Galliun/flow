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
import { readFile, writeFile } from "../../utils/fileUtils.js";
import { 
  WATER_COOLER_ID, MIZU_NFT_IDS,
  MINT_ADMIN_CAP_ID, MINT_WAREHOUSE_ID,
  DIGEST, STOCK, INIT, BUY
} from "../../constants.js";

// This add the NFTs into the NFT mint warehouse for it to be distributed at mint
export default async () => {
  console.log("Stocking Water Cooler...");

  const buyObject = await readFile(`${config.network}_${BUY}`);
  const initObject = await readFile(`${config.network}_${INIT}`);

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);

  tx.moveCall({
    target: `${packageId}::mint::add_to_mint_warehouse`,
    arguments: [
      tx.object(buyObject[MINT_ADMIN_CAP_ID]),
      tx.object(buyObject[WATER_COOLER_ID]),
      tx.makeMoveVec({ elements: initObject[MIZU_NFT_IDS] }),
      tx.object(buyObject[MINT_WAREHOUSE_ID]),
    ]
  });

  const objectChange = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showObjectChanges: true
    }
  });

  let stockObject = {};

  stockObject[DIGEST] = objectChange?.digest;

  await writeFile(`${config.network}_${STOCK}`, stockObject);

  console.log("Water Cooler has been stocked.");
}
