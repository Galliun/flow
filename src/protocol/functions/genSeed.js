// Dependence
import 'dotenv/config';

// Local imports
import { genSeed } from "../../utils/suiUtils.js";

// Display the price of a Water Cooler in $SUI
export default async () => {
  const mnemonic = await genSeed();
  console.log(`Your new seed phrase: ${mnemonic}`);
}
