// Dependence
import 'dotenv/config';

// Local imports
import buy from "./buyWaterCooler.js";
import init from "./init.js";
import stock from "./stock.js";

export default async () => {
  await buy();
  await init();
  await stock();
}