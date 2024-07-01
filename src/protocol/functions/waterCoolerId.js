// Dependence
import 'dotenv/config';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { getNestedObjectIdConfig } from "../../utils/getObjectIdConfig.js";
import { WATER_COOLER_ID } from "../../constants.js";


export default async () => {
  const waterCoolerId = getNestedObjectIdConfig(config.network, WATER_COOLER_ID);
  console.log("Your Water Cooler ID is:", waterCoolerId);
}
