// ==== Networks ====
export const DEVNET: string = "devnet";
export const MAINNET: string = "mainnet";
export const TESTNET: string = "testnet";

export type NETWORK = 'devnet' | "mainnet" | "testnet";

// ==== Digest ====
export const DIGEST = "digest";
export const BUY = "buy";
export const INIT = "init";
export const INIT_OBJECTS = "init_objects";
export const STOCK = "stock";
export const DISTRUBUTE = "distribute";
export const REVEAL = "reveal";

// ==== Sui object types ====
export const WATER_COOLER = "::water_cooler::WaterCooler";
export const WATER_COOLER_ADMIN = "::water_cooler::WaterCoolerAdminCap";
export const MINT_SETTINGS = "::orchestrator::Settings";
export const MINT_WAREHOUSE = "::orchestrator::Warehouse";
export const MINT_ADMIN = "::orchestrator::OrchAdminCap";
export const REGISTRY = "::registry::Registry";
export const REGISTRY_ADMIN = "::registry::RegistryAdminCap";
export const COLLECTION = "::collection::Collection";
export const CAPSULE = "::capsule::Capsule";

// ==== Config objects ====
// This is preset
export const PACKAGE_ID = "packageId";
export const COOLER_FACTOR_ID = "coolerFactoryId";
export const TRANSFER_POLICY_ID = "transferPolicyId";
export const FACTORY_SETTINGS_ID = "factorySettingsId";
// This is extracted from commands
export const WATER_COOLER_ID = "waterCoolerId";
export const WATER_COOLER_ADMIN_ID = "waterCoolerAdminCapId";
export const COLLECTION_ID = "collectionId";
export const MINT_SETTING_ID = "settingsId";
export const MINT_WAREHOUSE_ID = "warehouseId";
export const MINT_ADMIN_CAP_ID = "mintAdminCapId";
export const REGISTRY_ID = "registryId";
export const REGISTRY_ADMIN_CAP_ID = "registryAdminCapId";
export const CAPSULE_IDS = "CapsuleIDs";
