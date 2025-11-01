import type { HardhatUserConfig } from "hardhat/config";

import hardhatToolboxViemPlugin from "@nomicfoundation/hardhat-toolbox-viem";
import { configVariable } from "hardhat/config";

const config: HardhatUserConfig = {
  plugins: [hardhatToolboxViemPlugin],
  solidity: {
    profiles: {
      default: {
        version: "0.8.28",
      },
      production: {
        version: "0.8.28",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    },
  },
  networks: {
    hardhatMainnet: {
      type: "edr-simulated",
      chainType: "l1",
    },
    hardhatOp: {
      type: "edr-simulated",
      chainType: "op",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: configVariable("SEPOLIA_RPC_URL"),
      accounts: [configVariable("SEPOLIA_PRIVATE_KEY")],
    },
    // Celo Networks
    celoSepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.CELO_SEPOLIA_RPC_URL || "https://forno.celo-sepolia.celo-testnet.org",
      accounts: (() => {
        try {
          // Try to use configVariable (for keystore)
          return [configVariable("CELO_PRIVATE_KEY")];
        } catch {
          // Fallback to environment variable
          return process.env.CELO_PRIVATE_KEY ? [process.env.CELO_PRIVATE_KEY] : [];
        }
      })(),
      chainId: 11142220,
    },
    alfajores: {
      type: "http",
      chainType: "l1",
      url: process.env.ALFAJORES_RPC_URL || "https://alfajores-forno.celo-testnet.org",
      accounts: (() => {
        try {
          // Try to use configVariable (for keystore)
          return [configVariable("CELO_PRIVATE_KEY")];
        } catch {
          // Fallback to environment variable
          return process.env.CELO_PRIVATE_KEY ? [process.env.CELO_PRIVATE_KEY] : [];
        }
      })(),
      chainId: 44787,
    },
    celo: {
      type: "http",
      chainType: "l1",
      url: process.env.CELO_RPC_URL || "https://forno.celo.org",
      accounts: (() => {
        try {
          // Try to use configVariable (for keystore)
          return [configVariable("CELO_PRIVATE_KEY")];
        } catch {
          // Fallback to environment variable
          return process.env.CELO_PRIVATE_KEY ? [process.env.CELO_PRIVATE_KEY] : [];
        }
      })(),
      chainId: 42220,
    },
  },
};

export default config;
