#!/usr/bin/env -S node --no-warnings=ExperimentalWarning

import packageInfo from '../package.json' assert { type: "json" };
import { Command } from 'commander';

import { getCurrentNetwork, switchNetwork } from './helpers/flowConfig.js';
import { balance, faucet, address } from './helpers/sui.js';
import { 
  coolerPrice,
  buyWaterCooler,
  init,
  settings,
  stock,
  details,
  reveal,
  distribute,
} from './protocol/index.js';

const program = new Command();


program
  .name(packageInfo.name)
  .version(packageInfo.version)

program.command('network')
  .description('Gives information on the sui network')
  .action(getCurrentNetwork);

program.command('switch')
  .description('Switch connected Sui network to dev or main network')
  .argument('<string>', 'the network you want to switch to: devnet or mainnet')
  .action(switchNetwork);

program.command('balance')
  .description('Get connected wallet balance')
  .action(balance);

program.command('faucet')
  .description('Request Sui from network faucet')
  .action(faucet);

  program.command('address')
  .description('View current current address')
  .action(address);

program.command('price')
  .description('Get Water Cooler price from the Cooler factory')
  .action(coolerPrice);

  program.command('buy')
  .description('Buy a Water Cooler from the Cooler factory')
  .action(buyWaterCooler);

program.command('init')
  .description('Initiate Water Cooler for mint')
  .action(init);

  program.command('details')
  .description('Returns the IDs of objects needed to mint NFTs')
  .action(details);

program.command('stock')
  .description('Stock NFTs in Water Cooler warehouse in preperation for mint')
  .action(stock);

  program.command('reveal')
  .description('Reveal the NFT images and attributes')
  .action(reveal);

program.command('set')
  .description('Change setting on your Water Cooler')
  .option('-a, --amount <amount>', 'Change the NFT mint price. Price must be sent in mist: e.g. 10.5 $SUI = 10.5*10^9')
  .option('-p, --phase <phase>', 'Change the current phase of the Water Cooler. e.g. 0: unset, 1: OG, 2: WL, 3: public mint')
  .option('-s, --status <status>', 'Change the status of the mint. e.g. 0: inactive, 1: active')
  .action(settings);

  program.command('dist')
  .description('Distribute OG and WL tickers for your NFT mint')
  .option('-o, --og', 'Distribute OG tickers to address in the assets/og.json')
  .option('-w, --wl', 'Distribute WL tickers to address in the assets/wl.json')
  .action(distribute);
  
program.parse(process.argv);