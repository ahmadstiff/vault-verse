import { useState, useEffect } from "react";

import { useVaultContext } from "../../contexts/VaultContext";

export default function NFTFeatures({ vaultId }: { vaultId: string }) {
  const {
    selectedVault,
    isSubmitting,
    isLoadingNFTs,
    ownedNFTs,
    createVaultArt,
    createMemoryArt,
    createFortuneArt,
    refreshNFTs,
  } = useVaultContext();

  // State for modals
  const [isGeneralNFTModalOpen, setIsGeneralNFTModalOpen] = useState(false);
  const [isMemoryNFTModalOpen, setIsMemoryNFTModalOpen] = useState(false);
  const [isFortuneNFTModalOpen, setIsFortuneNFTModalOpen] = useState(false);

  const [, setError] = useState<Error | null>(null);

  // State for error handling
  const [nftError, setNftError] = useState<Error | null>(null);

  // State for selected memory (for memory-based NFTs)
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState<number>(0);

  // State for NFT creation form
  const [nftFormData, setNftFormData] = useState({
    name: "",
    description: "",
    url: "https://vault.magic.sui/images/nft-placeholder.png",
    rarity: "common",
    creator: "Vault Verse",
  });

  // Create general vault NFT using context function
  const handleCreateGeneralNFT = async (
    name: string,
    description: string,
    url: string,
    rarity: string,
    creator: string,
  ) => {
    try {
      setNftError(null);
      await createVaultArt(vaultId, name, description, url, rarity, creator);
      await refreshNFTs();
    } catch (err) {
      setError(err as Error);
      setNftError(err as Error);
      throw err;
    }
  };

  // Create memory NFT using context function
  const handleCreateMemoryNFT = async (
    memoryIndex: number,
    name: string,
    description: string,
    url: string,
    rarity: string,
    creator: string,
  ) => {
    try {
      setNftError(null);
      await createMemoryArt(
        vaultId,
        memoryIndex,
        name,
        description,
        url,
        rarity,
        creator,
      );
      await refreshNFTs();
    } catch (err) {
      setError(err as Error);
      setNftError(err as Error);
      throw err;
    }
  };

  // Create fortune NFT using context function
  const handleCreateFortuneNFT = async (
    name: string,
    url: string,
    rarity: string,
    creator: string,
  ) => {
    try {
      setNftError(null);
      await createFortuneArt(vaultId, name, url, rarity, creator);
      await refreshNFTs();
    } catch (err) {
      setError(err as Error);
      setNftError(err as Error);
      throw err;
    }
  };

  // Load NFTs when component mounts
  useEffect(() => {
    if (vaultId) {
      refreshNFTs();
    }
  }, [vaultId, refreshNFTs]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;

    setNftFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle general NFT creation
  const handleGeneralNFTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleCreateGeneralNFT(
        nftFormData.name,
        nftFormData.description,
        nftFormData.url,
        nftFormData.rarity,
        nftFormData.creator,
      );
      setIsGeneralNFTModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err as Error);
    }
  };

  // Handle memory NFT creation
  const handleMemoryNFTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleCreateMemoryNFT(
        selectedMemoryIndex,
        nftFormData.name,
        nftFormData.description,
        nftFormData.url,
        nftFormData.rarity,
        nftFormData.creator,
      );
      setIsMemoryNFTModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err as Error);
    }
  };

  // Handle fortune NFT creation
  const handleFortuneNFTSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleCreateFortuneNFT(
        nftFormData.name,
        nftFormData.url,
        nftFormData.rarity,
        nftFormData.creator,
      );
      setIsFortuneNFTModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err as Error);
    }
  };

  // Reset form
  const resetForm = () => {
    setNftFormData({
      name: "",
      description: "",
      url: "https://vault.magic.sui/images/nft-placeholder.png",
      rarity: "common",
      creator: "Vault Verse",
    });
    setSelectedMemoryIndex(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Vault NFTs</h2>

      {/* NFT Creation Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          disabled={isSubmitting}
          onClick={() => setIsGeneralNFTModalOpen(true)}
        >
          Create Vault NFT
        </button>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
          disabled={isSubmitting || !selectedVault?.memories.length}
          onClick={() => setIsMemoryNFTModalOpen(true)}
        >
          Create Memory NFT
        </button>
        <button
          className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          disabled={isSubmitting}
          onClick={() => setIsFortuneNFTModalOpen(true)}
        >
          Create Fortune NFT
        </button>
      </div>

      {/* NFT Gallery */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-3">
          Your NFT Collection
        </h3>

        {/* Error display */}
        {nftError && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{nftError.message}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setNftError(null)}
            >
              <span className="sr-only">Dismiss</span>
              <svg
                className="h-6 w-6 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 18L18 6M6 6l12 12"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        )}

        {isLoadingNFTs ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-600" />
          </div>
        ) : ownedNFTs.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">No NFTs created yet.</p>
            <p className="text-gray-500 mt-2">
              Create an NFT to start your collection.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ownedNFTs
              .filter((nft) => nft.vault_id === vaultId)
              .map((nft) => (
                <div
                  key={nft.objectId}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="h-40 bg-gray-100 flex items-center justify-center">
                    <img
                      alt={nft.name}
                      className="h-full w-full object-cover"
                      src={nft.url}
                    />
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium">{nft.name}</h4>
                      <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                        {nft.rarity}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                      {nft.description}
                    </p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>By: {nft.creator}</span>
                      <span>
                        {new Date(nft.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* General NFT Modal */}
      {isGeneralNFTModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Vault NFT
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsGeneralNFTModalOpen(false)}
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

            <form onSubmit={handleGeneralNFTSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  NFT Name
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="name"
                  name="name"
                  type="text"
                  value={nftFormData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="description"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  id="description"
                  name="description"
                  value={nftFormData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="url"
                >
                  Image URL
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="url"
                  name="url"
                  type="text"
                  value={nftFormData.url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="rarity"
                >
                  Rarity
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="rarity"
                  name="rarity"
                  value={nftFormData.rarity}
                  onChange={handleInputChange}
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="creator"
                >
                  Creator
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="creator"
                  name="creator"
                  type="text"
                  value={nftFormData.creator}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                  type="button"
                  onClick={() => setIsGeneralNFTModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Creating..." : "Create NFT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Memory NFT Modal */}
      {isMemoryNFTModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Memory NFT
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsMemoryNFTModalOpen(false)}
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

            <form onSubmit={handleMemoryNFTSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="memory-select"
                >
                  Select Memory
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="memory-select"
                  value={selectedMemoryIndex}
                  onChange={(e) =>
                    setSelectedMemoryIndex(parseInt(e.target.value))
                  }
                >
                  {selectedVault?.memories.map((memory: any, index: number) => (
                    <option key={index} value={index}>
                      {memory.type === "deposit" ? "Deposit" : "Withdrawal"} -{" "}
                      {memory.amount} {selectedVault.currency} -{" "}
                      {new Date(memory.date).toLocaleDateString()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="memory-name"
                >
                  NFT Name
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="memory-name"
                  name="name"
                  type="text"
                  value={nftFormData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="memory-description"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  id="memory-description"
                  name="description"
                  value={nftFormData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="memory-url"
                >
                  Image URL
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="memory-url"
                  name="url"
                  type="text"
                  value={nftFormData.url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="memory-rarity"
                >
                  Rarity
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="memory-rarity"
                  name="rarity"
                  value={nftFormData.rarity}
                  onChange={handleInputChange}
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="memory-creator"
                >
                  Creator
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="memory-creator"
                  name="creator"
                  type="text"
                  value={nftFormData.creator}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                  type="button"
                  onClick={() => setIsMemoryNFTModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-purple-400"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Creating..." : "Create Memory NFT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fortune NFT Modal */}
      {isFortuneNFTModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Create Fortune NFT
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsFortuneNFTModalOpen(false)}
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

            <form onSubmit={handleFortuneNFTSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="fortune-name"
                >
                  NFT Name
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="fortune-name"
                  name="name"
                  type="text"
                  value={nftFormData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="fortune-description"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  id="fortune-description"
                  name="description"
                  value={nftFormData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="fortune-url"
                >
                  Image URL
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="fortune-url"
                  name="url"
                  type="text"
                  value={nftFormData.url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="fortune-rarity"
                >
                  Rarity
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="fortune-rarity"
                  name="rarity"
                  value={nftFormData.rarity}
                  onChange={handleInputChange}
                >
                  <option value="common">Common</option>
                  <option value="uncommon">Uncommon</option>
                  <option value="rare">Rare</option>
                  <option value="epic">Epic</option>
                  <option value="legendary">Legendary</option>
                </select>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="fortune-creator"
                >
                  Creator
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="fortune-creator"
                  name="creator"
                  type="text"
                  value={nftFormData.creator}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                  type="button"
                  onClick={() => setIsFortuneNFTModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:bg-teal-400"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Creating..." : "Create Fortune NFT"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
