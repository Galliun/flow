// Dependence
import 'dotenv/config';

// Local imports
import configRaw from "../../../config.json";
import { readFile } from "../../utils/fileUtils";
import { 
  WATER_COOLER_ID,
  MINT_WAREHOUSE_ID,
  MINT_SETTING_ID,
  TRANSFER_POLICY_ID,
  BUY
} from "../../constants";
import { buyObjectInterface } from '../../interface/buyObjectInterface';
import { ConfigInterface } from '../../interface/configInterface';

export default async () => {
  const config = configRaw as ConfigInterface;
  // const buyObject = await readFile(`${config.network}_${BUY}`) as buyObjectInterface;
  const buyObject = await readFile(`${config.network}_${BUY}`) as any;

  console.log("Package ID:", config[config.network].packageId);
  console.log("Water Cooler ID:", buyObject[WATER_COOLER_ID]);
  console.log("Transfer policy ID:", config[config.network]?.transferPolicyId);
  console.log("Mint Warehouse ID:", buyObject[MINT_WAREHOUSE_ID]);
  console.log("Mint Setting ID:", buyObject[MINT_SETTING_ID]);
}
