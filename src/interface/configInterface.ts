// config.ts
export interface NetworkConfig {
    packageId: string;
    coolerFactoryId: string;
    transferPolicyId?: string; // This is optional since it's not in devnet and mainnet
    factorySettingsId?: string; 
}

export interface ConfigInterface {
    gasBudgetAmount: number;
    network: 'devnet' | 'testnet' | 'mainnet';
    devnet: NetworkConfig;
    testnet: NetworkConfig;
    mainnet: NetworkConfig;
}