import { useState, useEffect } from "react";

interface VaultCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    color: string;
    story: string;
  }) => Promise<void>;
  initialData: {
    name: string;
    color: string;
    story: string;
  };
  isSubmitting: boolean;
}

export default function VaultCustomizeModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting,
}: VaultCustomizeModalProps) {
  const [formData, setFormData] = useState({
    name: initialData.name,
    color: initialData.color,
    story: initialData.story,
  });

  // Update form data when initialData changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: initialData.name,
        color: initialData.color,
        story: initialData.story,
      });
    }
  }, [isOpen, initialData]);

  // Available color options
  const colorOptions = [
    "#6366F1", // Indigo
    "#EC4899", // Pink
    "#10B981", // Green
    "#F59E0B", // Amber
    "#EF4444", // Red
    "#8B5CF6", // Purple
    "#3B82F6", // Blue
    "#14B8A6", // Teal
  ];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle color selection
  const handleColorChange = (color: string) => {
    setFormData((prev) => ({ ...prev, color }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Customize Vault</h2>
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

          <div className="mb-6">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="vault-color-options"
            >
              Vault Color
            </label>
            <div
              aria-label="Vault Color"
              className="flex flex-wrap gap-2"
              id="vault-color-options"
              role="group"
            >
              {colorOptions.map((color) => (
                <button
                  key={color}
                  aria-label={`Select color ${color}`}
                  className={`w-8 h-8 rounded-full ${formData.color === color ? "ring-2 ring-offset-2 ring-gray-700" : ""}`}
                  style={{ backgroundColor: color }}
                  type="button"
                  onClick={() => handleColorChange(color)}
                />
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="story"
            >
              Vault Story
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
              id="story"
              name="story"
              placeholder="Tell the story behind this vault..."
              value={formData.story}
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
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
