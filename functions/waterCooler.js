// Dependence
import 'dotenv/config';

// Node packages
import fs from 'node:fs';

// Sui packages
import { TransactionBlock } from '@mysten/sui.js/transactions';
import { bcs } from '@mysten/sui.js/bcs';

// Other packages
import inquirer from 'inquirer';

// Local imports
import config from "../config.json" assert { type: "json" };
import { getAddress, getClient, getKeypair, mistToSui } from "../utils/suiUtils.js";
import { getCoolerFactoryId, getPacakgeId, getWaterCoolerDetails } from "../utils/waterCooler.js";
import { getObjectId } from "../utils/getObjectId.js";
import { getObjectIdArray } from "../utils/getObjectIdArray.js";
import { WATER_COOLER, WATER_COOLER_ADMIN, MIZU_NFT, MINT_ADMIN, MINT_WAREHOUSE } from "../constants.js";


const toHEX = (s) => {
  // utf8 to latin1
  var s = unescape(encodeURIComponent(s))
  var h = ''
  for (var i = 0; i < s.length; i++) {
      h += s.charCodeAt(i).toString(16)
  }
  return h
}

const fromHEX = (h) => {
  var s = ''
  for (var i = 0; i < h.length; i+=2) {
      s += String.fromCharCode(parseInt(h.substr(i, 2), 16))
  }
  return decodeURIComponent(escape(s))
}

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

    res(coolerFactory?.data?.content?.fields?.price);
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
  
    const writeStream = fs.createWriteStream("./.outputs/water_cooler.json", { flags: 'w' });
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
  console.log("objectId", waterCoolerObjectId);
  
  const waterCoolerAdminObjectId = await getObjectId(WATER_COOLER_ADMIN);
  console.log("waterCoolerAdminObjectId", waterCoolerAdminObjectId);

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

  const writeStream = fs.createWriteStream("./.outputs/initialization.json", { flags: 'w' });
    writeStream.write(JSON.stringify(objectChange, null, 4));
    writeStream.end();

  console.log("Your Water Cooler has arrived.");
}

export const stock = async () => {
  console.log("Stocking water Cooler with NFTs now");
  const mizuNFTIdArray = await getObjectIdArray(MIZU_NFT);
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

  const mizuNFTs = await client.multiGetObjects({
    ids: mizuNFTIdArray,
    // only fetch the object type
    options: { 
      showType: true,
      showBcs: true,
      showContent: true,
      showDisplay: true,
      showOwner: true,
      showPreviousTransaction: true,
      showStorageRebate: true
    },
  });

  // console.log("mizuNFTs", mizuNFTs);

  mizuNFTs.map(nft => console.log(nft.data?.content?.fields))
  
  const mizuNFT = await client.getObject({
    id: mizuNFTIdArray[0],
    // only fetch the object type
    options: { 
      // showType: true,
      // showBcs: true,
      showContent: true,
      // showDisplay: true,
      // showOwner: true,
      // showPreviousTransaction: true,
      // showStorageRebate: true
    },
  });

  // console.log("mizuNFT", mizuNFT);


  // define UID as a 32-byte array, then add a transform to/from hex strings
  // const UID = bcs.fixedArray(32, bcs.u8()).transform({
  //   input: (id) => fromHEX(id),
  //   output: (id) => toHEX(Uint8Array.from(id)),
  // });

  // const AttributesStruct = bcs.struct("Attributes", {
  //   id: bcs.Address,
  //   number: bcs.u16(),
  //   fields: "AttributesData"
  // })
  
  // const MizuNFTStruct = bcs.struct("MizuNFT", {
  //   id: bcs.Address,
  //   name: bcs.String,
  //   collection_name: bcs.String,
  //   description: bcs.String,
  //   image_url: bcs.String,
  //   number: bcs.u16(),
  //   attributes: bcs.option(AttributesStruct),
  //   image: bcs.option(bcs.String),
  //   minted_by: bcs.option(bcs.Address),
  //   kiosk_id: bcs.Address,
  //   kiosk_owner_cap_id: bcs.Address,
  // })

  // Same for the main object that we intend to read
// const Attributes = bcs.registerStructType("Attributes", {
//   id: bcs.u64(),
//   number: bcs.u16(),
//   fields: "AttributesData"
// });

// Error: Struct MizuNFT requires field name:MizuNFT

// const Attributes = bcs.registerStructType("Attributes", AttributesStruct);

// const MizuNFT = bcs.registerStructType("MizuNFT", {
//     id: bcs.u64,
//     collection_name: bcs.String,
//     description: bcs.String,
//     image_url: bcs.String,
//     number: bcs.u16(),
//     attributes: bcs.option(Attributes),
//     image: bcs.option(bcs.String),
//     minted_by: bcs.option(bcs.Address),
//     kiosk_id: bcs.Address,
//     kiosk_owner_cap_id: bcs.Address,
// });

// const MizuNFT = bcs.registerStructType("MizuNFT", MizuNFTStruct);

    const mizuNFTObjects = mizuNFTIdArray.map(nftId => tx.object(nftId));

    // console.log("mizuNFTObjects", mizuNFTObjects);

    // const mizuNFTObjects = mizuNFTs.map(nft => {
    //   console.log("mizuNFTs", nft.data.content?.fields);
    //   nft.data.content?.fields
    // });

    // console.log("mizuNFTs", mizuNFTs[0].data.content?.fields);

    // console.log("mizuNFTs", mizuNFTObjects[0]);
    // console.log("tx.object(mintAdminCapObjectId),", tx.object(mintAdminCapObjectId),);
  
    // const stringList = bcs.vector(mizuNFTs[0].data.type).serialize(mizuNFTs).toBytes();
    // const stringList = bcs.vector(bcs.string()).serialize(mizuNFTIdArray).toBytes();
    // const stringList = bcs.vector(bcs.string()).serialize(mizuNFTIdArray).toBytes();
    
    // const stringList = bcs.vector(MizuNFTStruct).serialize(mizuNFTObjects).toBytes();

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

  const writeStream = fs.createWriteStream("./.outputs/warehouse.json", { flags: 'w' });
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
