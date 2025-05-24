/* eslint-disable no-console */
import { useMemo, useState } from "react";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import {
  SuiObjectResponse,
  SuiTransactionBlockResponse,
} from "@mysten/sui/client";

import { chainIdentifier, publishedPackageId } from "../lib/constants";

/**
 * Hook for creating a new vault
 * @returns Function to create a vault and loading state
 */
export function useCreateVault() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [data, setData] = useState<SuiTransactionBlockResponse | null>(null);

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createVault = async (params: any) => {
    if (!account) throw new Error("No connected wallet");

    if (!params.name?.trim()) throw new Error("Vault name is required");
    if (!params.color?.trim()) throw new Error("Vault color is required");
    if (!params.story?.trim()) throw new Error("Vault story is required");

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Gunakan object clock global
      const clockObjectId = "0x6"; // default clock ID
      const clock = tx.object(clockObjectId);

      // Serialize strings using bcs.string().serialize
      const nameBytes = bcs.string().serialize(params.name.trim());
      const colorBytes = bcs.string().serialize(params.color.trim());
      const storyBytes = bcs.string().serialize(params.story.trim());

      tx.moveCall({
        target: `${publishedPackageId}::vault::create_vault`,
        arguments: [
          tx.pure(nameBytes),
          tx.pure(colorBytes),
          tx.pure(storyBytes),
          clock,
        ],
      });

      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setData(response);
            window.location.reload();
          },
          onError: (error) => {
            setError(error);
          },
        },
      );

      setIsLoading(false);

      return data;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : typeof err === "object" && err !== null && "message" in err
            ? String((err as any).message)
            : String(err);

      const formattedError = new Error(
        `Failed to create vault: ${errorMessage}`,
      );

      setError(formattedError);
      setIsLoading(false);
      throw formattedError;
    }
  };

  return { createVault, isLoading, error };
}

/**
 * Hook for vault transactions (deposits and withdrawals)
 * @returns Functions for deposit and withdrawal transactions
 */
export function useVaultTransaction() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const [dataDeposit, setDataDeposit] =
    useState<SuiTransactionBlockResponse | null>(null);
  const [dataWithdraw, setDataWithdraw] =
    useState<SuiTransactionBlockResponse | null>(null);
  const [dataCustomizeVault, setDataCustomizeVault] =
    useState<SuiTransactionBlockResponse | null>(null);
  const [dataTransferVault, setDataTransferVault] =
    useState<SuiTransactionBlockResponse | null>(null);

  const { mutateAsync: signAndExecuteTransactionDeposit } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const { mutateAsync: signAndExecuteTransactionWithdraw } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const { mutateAsync: signAndExecuteTransactionCustomizeVault } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const { mutateAsync: signAndExecuteTransactionTransferVault } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const recordDeposit = async (vaultId: string, params: any) => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Get the system clock object
      const clockObjectId = "0x6"; // default clock ID
      const clock = tx.object(clockObjectId);

      // Serialize strings using bcs.string().serialize
      const noteBytes = bcs.string().serialize(params.note.trim());

      // Call the record_deposit function
      tx.moveCall({
        target: `${publishedPackageId}::vault::record_deposit`,
        arguments: [
          tx.object(vaultId),
          tx.pure.u64(params.amount),
          tx.pure(noteBytes),
          params.multiplier
            ? tx.pure.option("u64", BigInt(params.multiplier))
            : tx.pure.option("u64", null),
          clock,
        ],
      });

      await signAndExecuteTransactionDeposit(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataDeposit(response);
            window.location.reload();
          },
        },
      );

      setIsLoading(false);

      return dataDeposit;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  const recordWithdrawal = async (vaultId: string, params: any) => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Get the system clock object
      const clockObjectId = "0x6"; // default clock ID
      const clock = tx.object(clockObjectId);

      // Serialize strings using bcs.string().serialize
      const noteBytes = bcs.string().serialize(params.note.trim());

      // Call the record_withdrawal function
      tx.moveCall({
        target: `${publishedPackageId}::vault::record_withdrawal`,
        arguments: [
          tx.object(vaultId),
          tx.pure.u64(params.amount),
          tx.pure(noteBytes),
          params.multiplier
            ? tx.pure.option("u64", BigInt(params.multiplier))
            : tx.pure.option("u64", null),
          clock,
        ],
      });

      await signAndExecuteTransactionWithdraw(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataWithdraw(response);
            window.location.reload();
          },
        },
      );

      setIsLoading(false);

      return dataWithdraw;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  const customizeVault = async (
    vaultId: string,
    name: string,
    color: string,
    story: string,
  ) => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Call the customize_vault function
      tx.moveCall({
        target: `${publishedPackageId}::vault::customize_vault`,
        arguments: [
          tx.object(vaultId),
          tx.pure(bcs.string().serialize(name)),
          tx.pure(bcs.string().serialize(color)),
          tx.pure(bcs.string().serialize(story)),
        ],
      });

      await signAndExecuteTransactionCustomizeVault(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataCustomizeVault(response);
            window.location.reload();
          },
        },
      );

      setIsLoading(false);

      return dataCustomizeVault;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  const transferVault = async (vaultId: string, newOwner: string) => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();

      // Call the transfer_vault function
      tx.moveCall({
        target: `${publishedPackageId}::vault::transfer_vault`,
        arguments: [tx.object(vaultId), tx.pure.address(newOwner)],
      });

      console.log("Transfer vault transaction:", {
        target: `${publishedPackageId}::vault::transfer_vault`,
        arguments: [vaultId, newOwner],
      });

      // Execute the transaction and wait for confirmation
      await signAndExecuteTransactionTransferVault(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataTransferVault(response);
            window.location.reload();
          },
        },
      );

      // Verify the transaction status
      if (
        !dataTransferVault ||
        dataTransferVault.effects?.status?.status !== "success"
      ) {
        throw new Error(
          "Transfer failed: " +
            (dataTransferVault?.effects?.status?.error || "Unknown error"),
        );
      }

      // Wait for blockchain to sync
      console.log("Transfer successful, waiting for blockchain sync...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      setIsLoading(false);

      return dataTransferVault;
    } catch (err) {
      console.error("Transfer error:", err);
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  return {
    recordDeposit,
    recordWithdrawal,
    customizeVault,
    transferVault,
    isLoading,
    error,
  };
}

// Define TypeScript interfaces for vault data
export interface VaultMemory {
  amount: string;
  note: string;
  timestamp: string;
  is_deposit: boolean;
  multiplier?: string;
}

export interface VaultData {
  objectId: string;
  version: string;
  digest: string;
  name: string;
  color: string;
  story: string;
  owner: HexAddress;
  memories: VaultMemory[];
  total_deposits: string;
  total_withdrawals: string;
  created_at: string;
}

export interface OwnershipError extends Error {
  code: "NOT_OWNER" | "VAULT_NOT_FOUND" | "WALLET_NOT_CONNECTED";
}

/**
 * Hook for fetching and querying vault data
 * @returns Functions and data for interacting with vaults
 */
export function useVaultData() {
  const client = useSuiClient();
  const account = useCurrentAccount();

  // Query for all owned vaults
  const {
    data: ownedObjects,
    isLoading: isLoadingOwned,
    refetch: refetchOwned,
  } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showContent: true,
        showType: true,
      },
      filter: {
        StructType: `${publishedPackageId}::vault::VaultNFT`,
      },
    },
    {
      enabled: !!account?.address,
      refetchInterval: 5000, // Refetch every 5 seconds
      staleTime: 0, // Always consider data stale
      refetchOnWindowFocus: true, // Refetch when window regains focus
    },
  );

  // Parse vault objects
  const ownedVaults = useMemo(() => {
    if (!ownedObjects?.data) return [];

    return ownedObjects.data
      .map(parseVaultObject)
      .filter(Boolean) as VaultData[];
  }, [ownedObjects]);

  /**
   * Checks if the current wallet is the owner of a specific vault
   * @param vault The vault object or vault ID to check
   * @returns true if the current wallet is the owner, false otherwise
   */
  const isVaultOwner = (vault: VaultData | string): boolean => {
    if (!account?.address) return false;

    if (typeof vault === "string") {
      // If vault is an ID, find it in owned vaults
      const foundVault = ownedVaults.find((v) => v.objectId === vault);

      return !!foundVault;
    }

    // If vault is an object, compare the owner with current account
    return vault.owner === account.address;
  };

  /**
   * Gets a vault by ID that is owned by the current wallet
   * @param vaultId The ID of the vault to retrieve
   * @returns The vault if owned by current wallet, otherwise throws an error
   */
  const getOwnedVaultById = async (vaultId: string): Promise<VaultData> => {
    if (!account?.address) {
      const error = new Error("Wallet not connected") as OwnershipError;

      error.code = "WALLET_NOT_CONNECTED";
      throw error;
    }

    // First check if we already have it in the ownedVaults array
    const existingVault = ownedVaults.find((v) => v.objectId === vaultId);

    if (existingVault) {
      return existingVault;
    }

    // If not found in owned vaults, fetch it and verify ownership
    const vault = await getVault(vaultId);

    if (!vault) {
      const error = new Error(
        `Vault with ID ${vaultId} not found`,
      ) as OwnershipError;

      error.code = "VAULT_NOT_FOUND";
      throw error;
    }

    if (vault.owner !== account.address) {
      const error = new Error(
        `Vault with ID ${vaultId} is not owned by the connected wallet`,
      ) as OwnershipError;

      error.code = "NOT_OWNER";
      throw error;
    }

    return vault;
  };

  // Function to get a specific vault by ID
  const getVault = async (vaultId: string): Promise<VaultData | null> => {
    try {
      const result = await client.getObject({
        id: vaultId,
        options: {
          showContent: true,
          showType: true,
        },
      });

      if (result) {
        return parseVaultObject(result) as VaultData;
      }

      return null;
    } catch (error) {
      console.error("Error fetching vault:", error);

      return null;
    }
  };

  // Function to get vault summary
  const getVaultSummary = async (vaultId: string): Promise<any | null> => {
    try {
      const tx = new Transaction();

      const [vaultObject] = tx.moveCall({
        target: `${publishedPackageId}::vault::get_vault_summary`,
        arguments: [tx.object(vaultId)],
      });

      tx.moveCall({
        target: "0x1::debug::print",
        arguments: [vaultObject],
      });

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: account?.address || "",
      });

      if (result.effects?.status.status === "success" && result.results?.[0]) {
        // Parse the returned data to extract VaultSummary
        // This is a simplified approach and may need adjustment based on actual return format
        const summaryData = result.results?.[0]?.returnValues?.[0]?.[0];

        if (summaryData === undefined) {
          return null;
        }

        return summaryData as unknown as any;
      }

      return null;
    } catch (error) {
      console.error("Error fetching vault summary:", error);

      return null;
    }
  };

  // Function to generate vault fortune
  const generateVaultFortune = async (
    vaultId: string,
  ): Promise<string | null> => {
    try {
      const tx = new Transaction();

      const [fortune] = tx.moveCall({
        target: `${publishedPackageId}::vault::generate_vault_fortune`,
        arguments: [tx.object(vaultId)],
      });

      tx.moveCall({
        target: "0x1::debug::print",
        arguments: [fortune],
      });

      const result = await client.devInspectTransactionBlock({
        transactionBlock: tx,
        sender: account?.address || "",
      });

      if (result.effects?.status.status === "success" && result.results?.[0]) {
        // Parse the returned data to extract the fortune string
        const fortuneData = result.results?.[0]?.returnValues?.[0]?.[0];

        return fortuneData as unknown as string;
      }

      return null;
    } catch (error) {
      console.error("Error generating vault fortune:", error);

      return null;
    }
  };

  return {
    ownedVaults,
    isLoadingOwned,
    refetchOwned,
    getVault,
    getVaultSummary,
    generateVaultFortune,
    isVaultOwner,
    getOwnedVaultById,
  };
}

/**
 * Hook for NFT operations related to vaults
 * @returns Functions for creating and managing NFTs
 */
export function useVaultNFT() {
  const client = useSuiClient();
  const account = useCurrentAccount();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [dataValueArt, setDataValueArt] = useState<any>();
  const [dataMemoryArt, setDataMemoryArt] = useState<any>();
  const [dataFortuneArt, setDataFortuneArt] = useState<any>();

  const { mutateAsync: signAndExecuteTransaction } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const { mutateAsync: signAndExecuteTransactionCreateMemoryArt } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  const { mutateAsync: signAndExecuteTransactionCreateFortuneArt } =
    useSignAndExecuteTransaction({
      execute: async ({ bytes, signature }) =>
        await client.executeTransactionBlock({
          transactionBlock: bytes,
          signature,
          options: {
            showRawEffects: true,
            showObjectChanges: true,
          },
        }),
    });

  // Query for owned NFTs
  const {
    data: ownedNFTs,
    isLoading: isLoadingNFTs,
    refetch: refetchNFTs,
  } = useSuiClientQuery(
    "getOwnedObjects",
    {
      owner: account?.address || "",
      options: {
        showContent: true,
        showType: true,
      },
      filter: {
        StructType: `${publishedPackageId}::nft_object::VaultArtNFT`,
      },
    },
    {
      enabled: !!account?.address,
    },
  );

  // Parse NFT objects
  const ownedVaultNFTs = useMemo(() => {
    if (!ownedNFTs?.data) return [];

    return ownedNFTs.data.map(parseNFTObject);
  }, [ownedNFTs]);

  // Create a vault art NFT
  const createVaultArt = async (
    vaultId: string,
    name: string,
    description: string,
    url: string,
    rarity: string,
    creator: string,
  ): Promise<SuiTransactionBlockResponse> => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      const timestamp = Math.floor(Date.now());

      // Call the create_vault_art function
      tx.moveCall({
        target: `${publishedPackageId}::nft_object::create_vault_art`,
        arguments: [
          tx.object(vaultId),
          tx.pure(bcs.string().serialize(name)),
          tx.pure(bcs.string().serialize(description)),
          tx.pure(bcs.string().serialize(url)),
          tx.pure(bcs.string().serialize(rarity)),
          tx.pure(bcs.string().serialize(creator)),
          tx.pure(bcs.u64().serialize(timestamp)),
        ],
      });

      await signAndExecuteTransaction(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataValueArt(response);
            window.location.reload();
          },
        },
      );

      setIsLoading(false);

      return dataValueArt;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  // Create a memory-based NFT
  const createMemoryArt = async (
    vaultId: string,
    memoryIndex: number,
    name: string,
    description: string,
    url: string,
    rarity: string,
    creator: string,
  ): Promise<SuiTransactionBlockResponse> => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      const timestamp = Math.floor(Date.now());

      // Call the create_memory_art function
      tx.moveCall({
        target: `${publishedPackageId}::nft_object::create_memory_art`,
        arguments: [
          tx.object(vaultId),
          tx.pure(bcs.u64().serialize(memoryIndex)), // Memory index to use
          tx.pure(bcs.string().serialize(name)),
          tx.pure(bcs.string().serialize(description)),
          tx.pure(bcs.string().serialize(url)),
          tx.pure(bcs.string().serialize(rarity)),
          tx.pure(bcs.string().serialize(creator)),
          tx.pure(bcs.u64().serialize(timestamp)),
        ],
      });

      await signAndExecuteTransactionCreateMemoryArt(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataMemoryArt(response);
            window.location.reload();
          },
        },
      );

      setIsLoading(false);

      return dataMemoryArt;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  // Create a fortune-based NFT
  const createFortuneArt = async (
    vaultId: string,
    name: string,
    url: string,
    rarity: string,
    creator: string,
  ): Promise<SuiTransactionBlockResponse> => {
    if (!account) {
      throw new Error("No connected wallet");
    }

    setIsLoading(true);
    setError(null);

    try {
      const tx = new Transaction();
      const timestamp = Math.floor(Date.now());

      // Call the create_fortune_art function
      tx.moveCall({
        target: `${publishedPackageId}::nft_object::create_fortune_art`,
        arguments: [
          tx.object(vaultId),
          tx.pure(bcs.string().serialize(name)),
          tx.pure(bcs.string().serialize(url)),
          tx.pure(bcs.string().serialize(rarity)),
          tx.pure(bcs.string().serialize(creator)),
          tx.pure(bcs.u64().serialize(timestamp)),
        ],
      });

      await signAndExecuteTransactionCreateFortuneArt(
        {
          transaction: tx,
          chain: chainIdentifier,
        },
        {
          onSuccess: (response) => {
            setDataFortuneArt(response);
            window.location.reload();
          },
        },
      );

      setIsLoading(false);

      return dataFortuneArt;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setIsLoading(false);
      throw err;
    }
  };

  return {
    ownedVaultNFTs,
    isLoadingNFTs,
    refetchNFTs,
    createVaultArt,
    createMemoryArt,
    createFortuneArt,
    isLoading,
    error,
  };
}

// Helper function to parse Vault object from SuiObjectResponse
function parseVaultObject(response: SuiObjectResponse): VaultData | null {
  try {
    if (!response.data || !response.data.content) {
      return null;
    }

    const { fields } = response.data.content as { fields: any };
    const objectId = response.data.objectId;
    const version = response.data.version || "0";
    const digest = response.data.digest || "";

    // Extract the fields from the response
    const vaultNFT: VaultData = {
      objectId,
      version,
      digest,
      name: fields.name,
      color: fields.color,
      story: fields.story,
      owner: fields.owner,
      memories: fields.memories || [],
      total_deposits: fields.total_deposits,
      total_withdrawals: fields.total_withdrawals,
      created_at: fields.created_at,
    };

    return vaultNFT;
  } catch (error) {
    console.error("Error parsing vault object:", error);

    return null;
  }
}

// Define TypeScript interface for NFT data
export interface VaultNFTData {
  objectId: string;
  version: string;
  digest: string;
  name: string;
  description: string;
  url: string;
  vault_id: string;
  creator: string;
  rarity: string;
  created_at: string;
}

// Helper function to parse NFT object from SuiObjectResponse
function parseNFTObject(response: SuiObjectResponse): VaultNFTData | null {
  try {
    if (!response.data || !response.data.content) {
      return null;
    }

    const { fields } = response.data.content as { fields: any };
    const objectId = response.data.objectId;
    const version = response.data.version || "0";
    const digest = response.data.digest || "";

    // Extract the fields from the response
    const vaultArtNFT: VaultNFTData = {
      objectId,
      version,
      digest,
      name: fields.name,
      description: fields.description,
      url: fields.url,
      vault_id: fields.vault_id,
      creator: fields.creator,
      rarity: fields.rarity,
      created_at: fields.created_at,
    };

    return vaultArtNFT;
  } catch (error) {
    console.error("Error parsing NFT object:", error);

    return null;
  }
}
