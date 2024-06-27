// Dependence
import 'dotenv/config';

// Node packages
import fs from 'node:fs';

// Sui packages
import { TransactionBlock } from '@mysten/sui.js/transactions';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getClient, getKeypair } from "../../utils/suiUtils.js";
import { getPacakgeId } from "../../utils/waterCooler.js";
import { getObjectId } from "../../utils/getObjectId.js";
import { getObjectIdArray } from "../../utils/getObjectIdArray.js";
import { WATER_COOLER, MIZU_NFT, MINT_ADMIN, MINT_WAREHOUSE } from "../../constants.js";

// This add the NFTs into the NFT mint warehouse for it to be distributed at mint
export default async () => {
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
