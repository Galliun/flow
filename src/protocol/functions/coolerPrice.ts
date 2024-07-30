// Dependence
import 'dotenv/config';

// Local imports
import { mistToSui } from "../../utils/suiUtils";
import { getCoolerPrice } from "../helpers/getCoolerPrice";

// Display the price of a Water Cooler in $SUI
export default async () => {
  const price = await getCoolerPrice();
  console.log("Water Cooler price is:", `${mistToSui(price)} $SUI`);
}
