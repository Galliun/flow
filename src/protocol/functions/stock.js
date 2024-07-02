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
import { updateNestedConfig } from "../../utils/configUtils.js";
import writeFile from "../../utils/writeFile.js";
import { getNestedObjectIdConfig } from "../../utils/getObjectIdConfig.js";
import { 
  WATER_COOLER_ID, MIZU_NFT_IDS,
  MINT_ADMIN_CAP_ID, MINT_WAREHOUSE_ID,
  DIGEST, DIGEST_STOCK
} from "../../constants.js";

// This add the NFTs into the NFT mint warehouse for it to be distributed at mint
export default async () => {
  console.log("Stocking Water Cooler...");

  const mizuNFTIdArray = await getNestedObjectIdConfig(config.network, MIZU_NFT_IDS);
  const waterCoolerObjectId = await getNestedObjectIdConfig(config.network, WATER_COOLER_ID);
  const mintAdminCapObjectId = await getNestedObjectIdConfig(config.network, MINT_ADMIN_CAP_ID);
  const warehouseObjectId = await getNestedObjectIdConfig(config.network, MINT_WAREHOUSE_ID);

  const keypair = getKeypair();
  const client = getClient();

  const packageId = getPacakgeId();
  const tx = new Transaction();

  tx.setGasBudget(config.gasBudgetAmount);

  tx.moveCall({
    target: `${packageId}::mint::add_to_mint_warehouse`,
    arguments: [
      tx.object(mintAdminCapObjectId),
      tx.object(waterCoolerObjectId),
      tx.makeMoveVec({ elements: mizuNFTIdArray }),
      tx.object(warehouseObjectId),
    ]
  });

  const objectChange = await client.signAndExecuteTransaction({
    signer: keypair,
    transaction: tx,
    options: {
      showObjectChanges: true
    }
  });

  await updateNestedConfig(DIGEST, DIGEST_STOCK, objectChange?.digest);

  await writeFile("warehouse", objectChange);

  console.log("Water Cooler has been stocked.");

}
