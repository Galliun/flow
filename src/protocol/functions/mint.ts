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


export default async () => {
  console.log("Mint NFT");
}
