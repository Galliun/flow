// Dependence
import 'dotenv/config';

// Node imports
import fs from 'node:fs';

// Packages imports
import { Transaction } from '@mysten/sui/transactions';

// Local imports
import config from "../../../config.json";
import { getClient, getKeypair } from "../../utils/suiUtils";
import { getPacakgeId } from "../../utils/waterCooler";
import { readFile, writeFile } from "../../utils/fileUtils";
import { 
  WATER_COOLER_ID, CAPSULE_IDS,
  MINT_ADMIN_CAP_ID, MINT_WAREHOUSE_ID,
  DIGEST, STOCK, INIT, BUY
} from "../../constants";
import { buyObjectInterface } from '../../interface/buyObjectInterface';
import {InitObjectInterface} from "../../interface/initObjectInterface";

// This add the NFTs into the NFT mint warehouse for it to be distributed at mint
export default async () => {
  console.log("Stocking Water Cooler...");


  const buyObject = await readFile(`${config.network}_${BUY}`) as buyObjectInterface;
  const initObject = await readFile(`${config.network}_${INIT}`) as InitObjectInterface;

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);
  tx.moveCall({
    target: `${packageId}::orchestrator::stock_warehouse`,
    arguments: [
      tx.object(buyObject[MINT_ADMIN_CAP_ID]),
      tx.object(buyObject[WATER_COOLER_ID]),
      tx.makeMoveVec({ elements: initObject[CAPSULE_IDS] }),
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

  let stockObject: {digest: any} = {digest: ""};

  stockObject[DIGEST] = objectChange?.digest;

  await writeFile(`${config.network}_${STOCK}`, stockObject);

  console.log("Water Cooler has been stocked.");
}
