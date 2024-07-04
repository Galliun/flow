// Dependence
import 'dotenv/config';

// Local imports
import config from "../../../config.json" assert { type: "json" };
import { readFile } from "../../utils/fileUtils.js";
import { WATER_COOLER_ID, BUY } from "../../constants.js";

export default async () => {
  const buyObject = await readFile(`${config.network}_${BUY}`);
  console.log("Your Water Cooler ID is:", buyObject[WATER_COOLER_ID]);
}
