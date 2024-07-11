// Dependence
import 'dotenv/config';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { readFile } from "../../utils/fileUtils.js";
import { 
  WATER_COOLER_ID,
  MINT_WAREHOUSE_ID,
  MINT_SETTING_ID,
  TRANSFER_POLICY_ID,
  BUY
} from "../../constants.js";

export default async () => {
  const buyObject = await readFile(`${config.network}_${BUY}`);
  console.log("Package ID:", config[config.network].packageId);
  console.log("Water Cooler ID:", buyObject[WATER_COOLER_ID]);
  console.log("Transfer policy ID:", config[config.network][TRANSFER_POLICY_ID]);
  console.log("Mint Warehouse ID:", buyObject[MINT_WAREHOUSE_ID]);
  console.log("Mint Setting ID:", buyObject[MINT_SETTING_ID]);
}
