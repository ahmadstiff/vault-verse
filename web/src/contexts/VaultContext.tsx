import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
} from "react";
import { SuiTransactionBlockResponse } from "@mysten/sui/client";

import {
  useCreateVault,
  useVaultTransaction,
  useVaultData,
  useVaultNFT,
} from "../hooks/use-vaults";

// Types for the context value
type VaultContextType = {
  // Vault data and state
  ownedVaults: any[];
  ownedNFTs: any[];
  selectedVault: any | null;

  // Loading states
  isLoadingVaults: boolean;
  isLoadingNFTs: boolean;
  isSubmitting: boolean;

  // Error handling
  error: Error | null;
  clearError: () => void;

  // Vault operations
  createVault: (params: any) => Promise<SuiTransactionBlockResponse>;
  recordDeposit: (
    vaultId: string,
    params: any,
  ) => Promise<SuiTransactionBlockResponse>;
  recordWithdrawal: (
    vaultId: string,
    params: any,
  ) => Promise<SuiTransactionBlockResponse>;
  customizeVault: (
    vaultId: string,
    name: string,
    color: string,
    story: string,
  ) => Promise<SuiTransactionBlockResponse>;
  transferVault: (
    vaultId: string,
    newOwner: string,
  ) => Promise<SuiTransactionBlockResponse>;

  // NFT operations
  createVaultArt: (
    vaultId: string,
    name: string,
    description: string,
    url: string,
    rarity: string,
    creator: string,
  ) => Promise<SuiTransactionBlockResponse>;
  createMemoryArt: (
    vaultId: string,
    memoryIndex: number,
    name: string,
    description: string,
    url: string,
    rarity: string,
    creator: string,
  ) => Promise<SuiTransactionBlockResponse>;
  createFortuneArt: (
    vaultId: string,
    name: string,
    url: string,
    rarity: string,
    creator: string,
  ) => Promise<SuiTransactionBlockResponse>;

  // Data operations
  getVault: (vaultId: string) => Promise<any | null>;
  getVaultSummary: (vaultId: string) => Promise<any | null>;
  generateVaultFortune: (vaultId: string) => Promise<string | null>;

  // Refresh operations
  refreshVaults: () => Promise<void>;
  refreshNFTs: () => Promise<void>;

  // Selection
  selectVault: (vault: any | null) => void;
};

// Create the context with a default undefined value
const VaultContext = createContext<VaultContextType | undefined>(undefined);

// Props for the provider component
type VaultProviderProps = {
  children: ReactNode;
};

// Provider component
export function VaultProvider({ children }: VaultProviderProps) {
  const [selectedVault, setSelectedVault] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize hooks
  const { createVault: createVaultHook, error: createError } = useCreateVault();

  const {
    recordDeposit: recordDepositHook,
    recordWithdrawal: recordWithdrawalHook,
    customizeVault: customizeVaultHook,
    transferVault: transferVaultHook,
    error: transactionError,
  } = useVaultTransaction();

  const {
    ownedVaults,
    isLoadingOwned: isLoadingVaults,
    refetchOwned,
    getVault: getVaultHook,
    getVaultSummary: getVaultSummaryHook,
    generateVaultFortune: generateVaultFortuneHook,
  } = useVaultData();

  const {
    ownedVaultNFTs: ownedNFTs,
    isLoadingNFTs,
    refetchNFTs,
    createVaultArt: createVaultArtHook,
    createMemoryArt: createMemoryArtHook,
    createFortuneArt: createFortuneArtHook,
    error: nftError,
  } = useVaultNFT();

  // Wrap refetchOwned and refetchNFTs to match () => Promise<void>
  const refreshVaults = useCallback(async () => {
    await refetchOwned();
  }, [refetchOwned]);

  const refreshNFTs = useCallback(async () => {
    await refetchNFTs();
  }, [refetchNFTs]);

  // Update error state when any of the hook errors change
  useEffect(() => {
    const newError = createError || transactionError || nftError;

    if (newError) {
      setError(newError);
    }
  }, [createError, transactionError, nftError]);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Create a new vault
  const createVault = useCallback(
    async (params: any) => {
      try {
        setIsSubmitting(true);
        const response = await createVaultHook(params);

        await refreshVaults();

        if (!response) {
          throw new Error("Failed to create vault: No response received.");
        }

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [createVaultHook, refreshVaults],
  );

  // Record a deposit
  const recordDeposit = useCallback(
    async (vaultId: string, params: any) => {
      try {
        setIsSubmitting(true);
        const response = await recordDepositHook(vaultId, params);

        await refreshVaults();

        if (!response) {
          throw new Error("Failed to record deposit: No response received.");
        }

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [recordDepositHook, refreshVaults],
  );

  // Record a withdrawal
  const recordWithdrawal = useCallback(
    async (vaultId: string, params: any) => {
      try {
        setIsSubmitting(true);
        const response = await recordWithdrawalHook(vaultId, params);

        await refreshVaults();

        if (!response) {
          throw new Error("Failed to record withdrawal: No response received.");
        }

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [recordWithdrawalHook, refreshVaults],
  );

  // Customize a vault
  const customizeVault = useCallback(
    async (vaultId: string, name: string, color: string, story: string) => {
      try {
        setIsSubmitting(true);
        const response = await customizeVaultHook(vaultId, name, color, story);

        await refreshVaults();

        if (!response) {
          throw new Error("Failed to customize vault: No response received.");
        }

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [customizeVaultHook, refreshVaults],
  );

  // Select a vault
  const selectVault = useCallback((vault: any | null) => {
    setSelectedVault(vault);
  }, []);

  // Transfer a vault
  const transferVault = useCallback(
    async (vaultId: string, newOwner: string) => {
      // Find the vault being transferred for optimistic update
      const vaultToTransfer = ownedVaults.find((v) => v.objectId === vaultId);

      try {
        setIsSubmitting(true);

        // Validate input
        if (!newOwner || !newOwner.trim()) {
          throw new Error(
            "Invalid recipient address. Please provide a valid address.",
          );
        }

        // Optimistic UI update - remove vault from list immediately
        // We'll use this to keep track of the optimistic update state

        if (vaultToTransfer) {
          // If the selected vault is the one being transferred, clear it
          if (selectedVault && selectedVault.objectId === vaultId) {
            selectVault(null);
          }
        }

        const response = await transferVaultHook(vaultId, newOwner);

        // Verify the transaction was successful
        if (!response || response.effects?.status?.status !== "success") {
          throw new Error(
            "Transfer failed: " +
              (response?.effects?.status?.error || "Unknown error"),
          );
        }

        // Poll for state updates with exponential backoff
        let attempts = 0;
        const maxAttempts = 10; // Increase max attempts
        let baseDelay = 1000; // Start with 1 second delay

        while (attempts < maxAttempts) {
          // Calculate delay with exponential backoff (1s, 2s, 4s, 8s, etc.)
          const delay = baseDelay * Math.pow(2, attempts);

          // Wait for calculated delay
          await new Promise((resolve) => setTimeout(resolve, delay));

          // Refresh the vaults list
          await refreshVaults();

          // Check if the vault is no longer in our list
          const vaultStillExists = ownedVaults.some(
            (v) => v.objectId === vaultId,
          );

          if (!vaultStillExists) {
            break; // Vault has been removed from our list, we can stop polling
          }

          attempts++;

          // If we've reached max attempts, log a warning but don't fail the transaction
          if (attempts >= maxAttempts) {
          }
        }

        // Clean up any local state or cache related to this vault
        // This ensures no stale data remains in the application

        // Clear selected vault if it was the transferred one
        if (selectedVault && selectedVault.objectId === vaultId) {
          selectVault(null);
        }

        // Force a final refresh to ensure UI is up to date
        await refreshVaults();
        await refreshNFTs(); // Also refresh NFTs as they may be related to the vault

        return response;
      } catch (err) {
        // If we applied an optimistic update but the transaction failed,
        // we need to refresh to restore the original state
        if (vaultToTransfer) {
          await refreshVaults();
        }

        throw err;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      transferVaultHook,
      refreshVaults,
      refreshNFTs,
      selectVault,
      ownedVaults,
      selectedVault,
    ],
  );

  // Create vault art NFT
  const createVaultArt = useCallback(
    async (
      vaultId: string,
      name: string,
      description: string,
      url: string,
      rarity: string,
      creator: string,
    ) => {
      try {
        setIsSubmitting(true);
        const response = await createVaultArtHook(
          vaultId,
          name,
          description,
          url,
          rarity,
          creator,
        );

        await refreshNFTs();

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [createVaultArtHook, refreshNFTs],
  );

  // Create memory art NFT
  const createMemoryArt = useCallback(
    async (
      vaultId: string,
      memoryIndex: number,
      name: string,
      description: string,
      url: string,
      rarity: string,
      creator: string,
    ) => {
      try {
        setIsSubmitting(true);
        const response = await createMemoryArtHook(
          vaultId,
          memoryIndex,
          name,
          description,
          url,
          rarity,
          creator,
        );

        await refreshNFTs();

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [createMemoryArtHook, refreshNFTs],
  );

  // Create fortune art NFT
  const createFortuneArt = useCallback(
    async (
      vaultId: string,
      name: string,
      url: string,
      rarity: string,
      creator: string,
    ) => {
      try {
        setIsSubmitting(true);
        const response = await createFortuneArtHook(
          vaultId,
          name,
          url,
          rarity,
          creator,
        );

        await refreshNFTs();

        return response;
      } finally {
        setIsSubmitting(false);
      }
    },
    [createFortuneArtHook, refreshNFTs],
  );

  // Get vault details
  const getVault = useCallback(
    async (vaultId: string) => {
      return getVaultHook(vaultId);
    },
    [getVaultHook],
  );

  // Get vault summary
  const getVaultSummary = useCallback(
    async (vaultId: string) => {
      return getVaultSummaryHook(vaultId);
    },
    [getVaultSummaryHook],
  );

  // Generate vault fortune
  const generateVaultFortune = useCallback(
    async (vaultId: string) => {
      return generateVaultFortuneHook(vaultId);
    },
    [generateVaultFortuneHook],
  );

  // Create the context value
  const contextValue: VaultContextType = {
    // Vault data and state
    ownedVaults,
    ownedNFTs,
    selectedVault,

    // Loading states
    isLoadingVaults,
    isLoadingNFTs,
    isSubmitting,

    // Error handling
    error,
    clearError,

    // Vault operations
    createVault,
    recordDeposit,
    recordWithdrawal,
    customizeVault,
    transferVault,

    // NFT operations
    createVaultArt,
    createMemoryArt,
    createFortuneArt,

    // Data operations
    getVault,
    getVaultSummary,
    generateVaultFortune,

    // Refresh operations
    refreshVaults,
    refreshNFTs,

    // Selection
    selectVault,
  };

  return (
    <VaultContext.Provider value={contextValue}>
      {children}
    </VaultContext.Provider>
  );
}

// Custom hook to use the vault context
export function useVaultContext() {
  const context = useContext(VaultContext);

  if (context === undefined) {
    throw new Error("useVaultContext must be used within a VaultProvider");
  }

  return context;
}
