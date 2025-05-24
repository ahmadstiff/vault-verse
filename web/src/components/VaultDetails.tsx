import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { useVaultContext } from "../contexts/VaultContext";

import VaultCustomizeModal from "./modals/VaultCustomizeModal";
import VaultTransferModal from "./modals/VaultTransferModal";
import NFTFeatures from "./vault/NFTFeatures";

import { normalize } from "@/lib/bignumber";

export default function VaultDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const {
    selectedVault,
    isSubmitting,
    isLoadingNFTs,
    error,
    recordDeposit,
    recordWithdrawal,
    customizeVault,
    transferVault,
    selectVault,
    // generateVaultFortune,
    getVault,
    refreshVaults,
  } = useVaultContext();

  // State for various modal windows
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);

  const [, setError] = useState<Error | null>(null);

  // State for fortune
  // const [fortune, setFortune] = useState<string | null>(null);
  // const [isLoadingFortune, setIsLoadingFortune] = useState(false);

  // State for transaction forms
  const [transactionData, setTransactionData] = useState({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  // State for transaction validation
  const [transactionError, setTransactionError] = useState("");

  // Effect to fetch vault data when component mounts if needed
  useEffect(() => {
    async function fetchVaultData() {
      if (!id) return;

      // If we already have the selected vault and it matches the ID, no need to fetch
      if (selectedVault && selectedVault.objectId === id) {
        return;
      }

      setIsLoading(true);
      try {
        const vaultData = await getVault(id);

        if (vaultData) {
          // Update the selected vault in the context
          selectVault(vaultData);
        } else {
          // Handle case where vault is not found
          return;
        }
      } catch (err) {
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVaultData();
  }, [id, selectedVault, getVault, selectVault]);

  // Handle navigation back to the dashboard
  const handleBackToDashboard = () => {
    navigate("/vault");
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  // If no vault is selected, show an empty state
  if (!selectedVault) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <svg
          className="h-16 w-16 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
          />
        </svg>
        <h2 className="text-xl font-medium text-gray-600 mb-2">
          Vault Not Found
        </h2>
        <p className="text-gray-500 mb-4">
          The vault you&apos;re looking for could not be found or you may not
          have permission to view it.
        </p>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          onClick={handleBackToDashboard}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Handle transaction submission (unified for both deposit and withdrawal)
  const handleTransaction = async (e: React.FormEvent, isDeposit: boolean) => {
    e.preventDefault();
    if (!selectedVault) return;

    // Clear any previous errors
    setTransactionError("");

    const transactionType = isDeposit ? "deposit" : "withdrawal";

    try {
      // Validate amount
      const amount = parseFloat(transactionData.amount);

      if (isNaN(amount) || amount <= 0) {
        setTransactionError("Please enter a valid positive amount.");

        return;
      }

      // For withdrawals, check if there's enough balance
      if (!isDeposit) {
        const currentBalance = parseFloat(selectedVault.balance);

        if (amount > currentBalance) {
          setTransactionError(
            `Cannot withdraw more than your current balance of ${currentBalance} ${selectedVault.currency}.`,
          );

          return;
        }
      }

      // Convert amount to proper format (u64)
      const amountInMist = Math.floor(amount * 1_000_000); // Convert to MIST (6 decimals)

      const txData = {
        amount: amountInMist,
        note: transactionData.description || "", // Use empty string if no description
      };

      if (isDeposit) {
        await recordDeposit(selectedVault.objectId, txData);
        setIsDepositModalOpen(false);
      } else {
        await recordWithdrawal(selectedVault.objectId, txData);
        setIsWithdrawalModalOpen(false);
      }

      resetTransactionForm();

      // Refresh vault data
      await refreshVaults();
    } catch (error) {
      // Show error to user
      setError(error as Error);
      setTransactionError(
        (error as Error).message || `Failed to record ${transactionType}.`,
      );
    }
  };

  // Handle deposit submission
  const handleDeposit = (e: React.FormEvent) => {
    handleTransaction(e, true);
  };

  // Handle withdrawal submission
  const handleWithdrawal = (e: React.FormEvent) => {
    handleTransaction(e, false);
  };

  // Handle customization submission
  const handleCustomize = async (data: {
    name: string;
    color: string;
    story: string;
  }) => {
    if (!selectedVault) return;
    await customizeVault(
      selectedVault.objectId,
      data.name,
      data.color,
      data.story,
    );
    setIsCustomizeModalOpen(false);
  };

  // Handle transfer submission
  const handleTransfer = async (recipientAddress: string) => {
    if (!selectedVault) return;
    await transferVault(selectedVault.objectId, recipientAddress);
    setIsTransferModalOpen(false);
    selectVault(null); // Return to dashboard after transfer
  };

  // Generate fortune
  // const handleGenerateFortune = async () => {
  //   if (!selectedVault) return;

  //   setIsLoadingFortune(true);
  //   try {
  //     const fortuneText = await generateVaultFortune(selectedVault.objectId);

  //     setFortune(fortuneText);
  //   } catch (err) {
  //     setError(err as Error);
  //   } finally {
  //     setIsLoadingFortune(false);
  //   }
  // };

  // Handle transaction input changes
  const handleTransactionInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setTransactionData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Reset transaction form
  const resetTransactionForm = () => {
    setTransactionData({
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
    setTransactionError("");
  };

  return (
    <div className="container mx-auto p-4">
      {/* Vault Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedVault.name}
          </h1>
          <p className="text-gray-600">
            Balance:{" "}
            <span className="font-semibold">
              {normalize(selectedVault.balance, 6)} {selectedVault.currency}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isSubmitting}
            onClick={() => {
              setTransactionError("");
              setIsDepositModalOpen(true);
            }}
          >
            Record Deposit
          </button>
          <button
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            disabled={isSubmitting}
            onClick={() => {
              setTransactionError("");
              setIsWithdrawalModalOpen(true);
            }}
          >
            Record Withdrawal
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
            onClick={() => setIsCustomizeModalOpen(true)}
          >
            Customize
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={isSubmitting}
            onClick={() => setIsTransferModalOpen(true)}
          >
            Transfer
          </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Left Column - Vault Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Vault Story
          </h2>
          <p className="text-gray-600 mb-6">
            {selectedVault.story ||
              "This vault doesn't have a story yet. Add one by customizing your vault."}
          </p>
        </div>

        {/* Right Column - Memories */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Memories
            </h2>

            {selectedVault.memories.length === 0 ? (
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-500">No memories recorded yet.</p>
                <p className="text-gray-500 mt-2">
                  Record a deposit or withdrawal to create a memory.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {selectedVault.memories.map((memory: any, idx: number) => {
                  return (
                    <div
                      key={idx}
                      className="border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center">
                            <span
                              className={`inline-block w-2 h-2 rounded-full mr-2 ${memory.fields.action_type === 0 ? "bg-green-500" : "bg-red-500"}`}
                            />
                            <span className="font-medium">
                              {memory.fields.action_type === 0
                                ? "Deposit"
                                : "Withdrawal"}
                            </span>
                          </div>
                          <p className="text-gray-500 text-sm mt-1">
                            {/* timestamp like this 1748050600263, convert */}
                            {new Date(
                              Number(memory.fields.timestamp),
                            ).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-bold ${memory.fields.action_type === 0 ? "text-green-600" : "text-red-600"}`}
                          >
                            {memory.fields.action_type === 0 ? "+" : "-"}
                            {normalize(memory.fields.amount, 6)} SUI
                          </p>
                        </div>
                      </div>
                      {memory.fields.description && (
                        <p className="text-gray-600 mt-2">
                          {memory.fields.description}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* NFT Features Section */}
      <div className="bg-gray-50 pt-6 pb-8 px-4 rounded-lg mt-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 container mx-auto">
          NFT Gallery
        </h2>
        <div className="container mx-auto">
          {selectedVault && <NFTFeatures vaultId={selectedVault.objectId} />}
          {isLoadingNFTs && (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600" />
            </div>
          )}
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error.message}</span>
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      {isDepositModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Record Deposit
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsDepositModalOpen(false);
                  setTransactionError("");
                }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleDeposit}>
              {transactionError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {transactionError}
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="amount"
                >
                  Amount
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="amount"
                  min="0.000001"
                  name="amount"
                  step="0.000001"
                  type="number"
                  value={transactionData.amount}
                  onChange={handleTransactionInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="date"
                >
                  Date
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="date"
                  name="date"
                  type="date"
                  value={transactionData.date}
                  onChange={handleTransactionInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="description"
                >
                  Description (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="description"
                  name="description"
                  rows={3}
                  value={transactionData.description}
                  onChange={handleTransactionInputChange}
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 text-gray-700 mr-2 hover:bg-gray-100 rounded-md"
                  type="button"
                  onClick={() => {
                    setIsDepositModalOpen(false);
                    setTransactionError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Recording..." : "Record Deposit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Withdrawal Modal */}
      {isWithdrawalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Record Withdrawal
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => {
                  setIsWithdrawalModalOpen(false);
                  setTransactionError("");
                }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6 18L18 6M6 6l12 12"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleWithdrawal}>
              {transactionError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
                  {transactionError}
                </div>
              )}
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="withdrawal-amount"
                >
                  Amount
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="withdrawal-amount"
                  max={selectedVault.balance}
                  min="0.000001"
                  name="amount"
                  step="0.000001"
                  type="number"
                  value={transactionData.amount}
                  onChange={handleTransactionInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="withdrawal-date"
                >
                  Date
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="withdrawal-date"
                  name="date"
                  type="date"
                  value={transactionData.date}
                  onChange={handleTransactionInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="withdrawal-description"
                >
                  Description (optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="withdrawal-description"
                  name="description"
                  rows={3}
                  value={transactionData.description}
                  onChange={handleTransactionInputChange}
                />
              </div>

              <div className="flex justify-end">
                <button
                  className="px-4 py-2 text-gray-700 mr-2 hover:bg-gray-100 rounded-md"
                  type="button"
                  onClick={() => {
                    setIsWithdrawalModalOpen(false);
                    setTransactionError("");
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Recording..." : "Record Withdrawal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customize Modal */}
      {isCustomizeModalOpen && (
        <VaultCustomizeModal
          initialData={selectedVault}
          isOpen={isCustomizeModalOpen}
          isSubmitting={isSubmitting}
          onClose={() => setIsCustomizeModalOpen(false)}
          onSubmit={handleCustomize}
        />
      )}

      {/* Transfer Modal */}
      {isTransferModalOpen && (
        <VaultTransferModal
          isOpen={isTransferModalOpen}
          isSubmitting={isSubmitting}
          vaultName={selectedVault.name}
          onClose={() => setIsTransferModalOpen(false)}
          onSubmit={handleTransfer}
        />
      )}
    </div>
  );
}
