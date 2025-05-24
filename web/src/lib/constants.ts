export const publishedPackageId =
  "0x7f3a4b917bca190846b811870f94a0836a4b3612f20a22d302fd699518061f22" as HexAddress;

const network = import.meta.env.SUI_NETWORK || "testnet";

export const DECIMALS_MOCK_TOKEN = 6;

export const chainIdentifier: `${string}:${string}` = `sui:${network}`;
