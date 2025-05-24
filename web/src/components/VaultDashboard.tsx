import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useVaultContext } from "../contexts/VaultContext";

import { normalize } from "@/lib/bignumber";

export default function VaultDashboard() {
  const navigate = useNavigate();
  const {
    ownedVaults,
    isLoadingVaults,
    isSubmitting,
    error,
    clearError,
    createVault,
    refreshVaults,
    selectVault,
  } = useVaultContext();

  const [, setError] = useState<Error | null>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    initialValue: "0",
    currency: "SUI",
    color: "#6366F1", // Default Indigo color
    story: "",
  });

  useEffect(() => {
    // Fetch vaults on component mount
    refreshVaults();
  }, [refreshVaults]);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle color selection
  const handleColorChange = (color: string) => {
    setFormData((prev: any) => ({ ...prev, color }));
  };

  // Handle vault creation
  const handleCreateVault = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createVault(formData);
      setIsCreateModalOpen(false);
      // Reset form
      setFormData({
        name: "",
        initialValue: "0",
        currency: "SUI",
        color: "#6366F1",
        story: "",
      });
    } catch (err) {
      setError(err as Error);
    }
  };

  const handleViewVault = (vault: any) => {
    // Ensure the vault object matches the VaultNFT type expected by selectVault
    selectVault({
      ...vault,
      objectId: vault.objectId,
      version: vault.version,
      digest: vault.digest,
      story: vault.story || "",
      owner: vault.owner || "",
      total_deposits: vault.total_deposits || "0",
      total_withdrawals: vault.total_withdrawals || "0",
      created_at: vault.created_at || "",
    });
    // Navigate to vault detail page
    navigate(`/vaults/${vault.objectId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={clearError}
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

      {/* Dashboard Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Vaults</h1>
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create New Vault
        </button>
      </div>

      {/* Vaults Grid */}
      {isLoadingVaults ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
        </div>
      ) : ownedVaults.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-medium text-gray-600 mb-2">
            No Vaults Found
          </h3>
          <p className="text-gray-500 mb-4">
            Create your first vault to get started.
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            onClick={() => setIsCreateModalOpen(true)}
          >
            Create Vault
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ownedVaults.map((vault) => {
            // Map VaultNFT to any
            const vaultForView: any = {
              id: vault.objectId ?? "",
              name: vault.name,
              balance:
                Number(vault.total_deposits ?? 0) -
                Number(vault.total_withdrawals ?? 0),
              currency: vault.currency ?? "SUI",
              color: vault.color ?? "#6366F1",
              memories: vault.memories ?? [],
              objectId: vault.objectId,
              version: vault.version,
              digest: vault.digest,
              story: vault.story,
              owner: vault.owner,
              total_deposits: vault.total_deposits,
              total_withdrawals: vault.total_withdrawals,
              created_at: vault.created_at,
            };

            return (
              <div
                key={vault.objectId}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div
                  className="h-3"
                  style={{ backgroundColor: vault.color || "#6366F1" }}
                />
                <div className="p-5">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {vault.name}
                  </h3>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">Balance</span>
                    <span className="font-medium">
                      {normalize(vault.total_deposits, 6) || "0"}{" "}
                      {vault.currency}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-500">Memories</span>
                    <span className="font-medium">{vault.memories.length}</span>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      className="text-blue-600 hover:text-blue-800 px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                      onClick={() => handleViewVault(vaultForView)}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Vault Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Create New Vault
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setIsCreateModalOpen(false)}
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

            <form onSubmit={handleCreateVault}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="name"
                >
                  Vault Name
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="initialValue"
                >
                  Initial Balance
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="initialValue"
                  min="0"
                  name="initialValue"
                  step="0.000001"
                  type="number"
                  value={formData.initialValue}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="currency"
                >
                  Currency
                </label>
                <input
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  id="currency"
                  name="currency"
                  type="text"
                  value={formData.currency}
                  onChange={handleInputChange}
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="vault-color-group"
                >
                  Vault Color
                </label>
                <div
                  aria-label="Vault Color"
                  className="flex space-x-2"
                  id="vault-color-group"
                  role="group"
                >
                  {["#6366F1", "#EC4899", "#10B981", "#F59E0B", "#EF4444"].map(
                    (color) => (
                      <button
                        key={color}
                        aria-label={`Select color ${color}`}
                        className={`w-8 h-8 rounded-full border-2 ${formData.color === color ? "border-gray-800" : "border-transparent"}`}
                        style={{ backgroundColor: color }}
                        type="button"
                        onClick={() => handleColorChange(color)}
                      />
                    ),
                  )}
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 font-medium mb-2"
                  htmlFor="story"
                >
                  Story (Optional)
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                  id="story"
                  name="story"
                  value={formData.story}
                  onChange={handleInputChange}
                />
              </div>

              <div className="flex justify-end mt-6">
                <button
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Creating..." : "Create Vault"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
