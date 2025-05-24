import { useState } from "react";

interface VaultTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
  type: "deposit" | "withdrawal";
  isSubmitting: boolean;
  vaultCurrency: string;
}

export default function VaultTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  type,
  isSubmitting,
  vaultCurrency,
}: VaultTransactionModalProps) {
  const [formData, setFormData] = useState<any>({
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  });

  const isDeposit = type === "deposit";
  const title = isDeposit ? "Record Deposit" : "Record Withdrawal";
  const buttonColor = isDeposit
    ? "bg-green-600 hover:bg-green-700"
    : "bg-red-600 hover:bg-red-700";
  const buttonText = isSubmitting
    ? "Processing..."
    : isDeposit
      ? "Deposit"
      : "Withdraw";

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    // Reset form data after submission
    setFormData({
      amount: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
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

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="amount"
            >
              Amount ({vaultCurrency})
            </label>
            <input
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              id="amount"
              min="0.000001"
              name="amount"
              step="0.000001"
              type="number"
              value={formData.amount}
              onChange={handleInputChange}
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
              value={formData.date}
              onChange={handleInputChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
              id="description"
              name="description"
              placeholder={
                isDeposit
                  ? "Describe your deposit..."
                  : "Describe your withdrawal..."
              }
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <div className="flex justify-end mt-6">
            <button
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 mr-2"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 ${buttonColor} text-white rounded-md disabled:opacity-50`}
              disabled={isSubmitting}
              type="submit"
            >
              {buttonText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
