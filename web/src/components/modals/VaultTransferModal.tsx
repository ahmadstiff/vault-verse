import { useState } from "react";

interface VaultTransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (recipientAddress: string) => Promise<void>;
  vaultName: string;
  isSubmitting: boolean;
}

export default function VaultTransferModal({
  isOpen,
  onClose,
  onSubmit,
  vaultName,
  isSubmitting,
}: VaultTransferModalProps) {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [addressError, setAddressError] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);

  const [, setError] = useState<Error | null>(null);

  // Basic Sui address validation
  const validateAddress = (address: string): boolean => {
    // Basic validation - Sui addresses start with "0x" and are 42 characters long (including 0x)
    const isValidFormat = /^0x[a-fA-F0-9]{64}$/.test(address);

    if (!isValidFormat) {
      setAddressError(
        "Please enter a valid Sui address (0x followed by 40 hex characters)",
      );

      return false;
    }

    setAddressError("");

    return true;
  };

  // Handle input change
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const address = e.target.value;

    setRecipientAddress(address);

    // Clear error when user starts typing again
    if (addressError) {
      setAddressError("");
    }
  };

  // Handle initial form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate address before proceeding to confirmation
    if (validateAddress(recipientAddress)) {
      setIsConfirming(true);
    }
  };

  // Handle transfer confirmation
  const handleConfirmTransfer = async () => {
    try {
      await onSubmit(recipientAddress);
      resetForm();
      onClose();
    } catch (error) {
      setError(error as Error);
      // If there's an error, go back to the address entry step
      setIsConfirming(false);
    }
  };

  // Reset form state
  const resetForm = () => {
    setRecipientAddress("");
    setAddressError("");
    setIsConfirming(false);
  };

  // Handle cancel and close
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            {isConfirming ? "Confirm Transfer" : "Transfer Vault"}
          </h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={handleCancel}
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

        {!isConfirming ? (
          // Address Entry Form
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                You are about to transfer ownership of{" "}
                <span className="font-semibold">{vaultName}</span> to another
                address. This action cannot be undone. The new owner will have
                complete control over this vault.
              </p>

              <label
                className="block text-gray-700 font-medium mb-2"
                htmlFor="recipientAddress"
              >
                Recipient Address
              </label>
              <input
                required
                className={`w-full px-3 py-2 border ${addressError ? "border-red-500" : "border-gray-300"} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                id="recipientAddress"
                placeholder="0x..."
                type="text"
                value={recipientAddress}
                onChange={handleAddressChange}
              />
              {addressError && (
                <p className="mt-1 text-sm text-red-600">{addressError}</p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                type="button"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                type="submit"
              >
                Continue
              </button>
            </div>
          </form>
        ) : (
          // Confirmation View
          <div>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      clipRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      fillRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Warning:</strong> This action cannot be undone. Once
                    transferred, you will no longer have access to this vault.
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-2">
                Please confirm the transfer details:
              </h3>

              <div className="bg-gray-50 rounded-md p-3 mb-4">
                <p className="text-sm text-gray-500">Vault</p>
                <p className="font-medium">{vaultName}</p>
              </div>

              <div className="bg-gray-50 rounded-md p-3">
                <p className="text-sm text-gray-500">Recipient Address</p>
                <p className="font-medium break-all">{recipientAddress}</p>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
                type="button"
                onClick={() => setIsConfirming(false)}
              >
                Back
              </button>
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md disabled:opacity-50"
                disabled={isSubmitting}
                type="button"
                onClick={handleConfirmTransfer}
              >
                {isSubmitting ? "Transferring..." : "Confirm Transfer"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
