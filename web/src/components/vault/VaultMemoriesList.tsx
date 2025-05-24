import { useState } from "react";

interface VaultMemoriesListProps {
  memories: any[];
  currency: string;
}

type FilterType = "all" | "deposits" | "withdrawals";
type SortType = "newest" | "oldest" | "highest" | "lowest";

export default function VaultMemoriesList({
  memories,
  currency,
}: VaultMemoriesListProps) {
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [sortType, setSortType] = useState<SortType>("newest");

  // Filter memories based on selected filter
  const filteredMemories = memories.filter((memory) => {
    if (filterType === "all") return true;
    if (filterType === "deposits") return memory.type === "deposit";
    if (filterType === "withdrawals") return memory.type === "withdrawal";

    return true;
  });

  // Sort memories based on selected sort
  const sortedMemories = [...filteredMemories].sort((a, b) => {
    if (sortType === "newest")
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (sortType === "oldest")
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (sortType === "highest")
      return parseFloat(b.amount) - parseFloat(a.amount);
    if (sortType === "lowest")
      return parseFloat(a.amount) - parseFloat(b.amount);

    return 0;
  });

  // Format date as a readable string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Memories</h2>

        <div className="flex space-x-2">
          {/* Filter Dropdown */}
          <select
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
          >
            <option value="all">All Transactions</option>
            <option value="deposits">Deposits Only</option>
            <option value="withdrawals">Withdrawals Only</option>
          </select>

          {/* Sort Dropdown */}
          <select
            className="px-3 py-1.5 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={sortType}
            onChange={(e) => setSortType(e.target.value as SortType)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highest">Highest Amount</option>
            <option value="lowest">Lowest Amount</option>
          </select>
        </div>
      </div>

      {sortedMemories.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">
            No memories found with the current filter.
          </p>
          {filterType !== "all" && (
            <button
              className="text-blue-600 hover:text-blue-800 mt-2 underline"
              onClick={() => setFilterType("all")}
            >
              Show all memories
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedMemories.map((memory) => (
            <div
              key={memory.objectId}
              className="border border-gray-200 rounded-lg p-4 transition-shadow hover:shadow-md"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <span
                      className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        memory.type === "deposit"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">
                      {memory.type === "deposit" ? "Deposit" : "Withdrawal"}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">
                    {formatDate(memory.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p
                    className={`font-bold ${
                      memory.type === "deposit"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {memory.type === "deposit" ? "+" : "-"}
                    {memory.amount} {currency}
                  </p>
                </div>
              </div>
              {memory.description && (
                <p className="text-gray-600 mt-2">{memory.description}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary Stats */}
      {memories.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Total Memories</p>
              <p className="font-bold text-lg">{memories.length}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Deposits</p>
              <p className="font-bold text-lg text-green-600">
                {memories.filter((m) => m.type === "deposit").length}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Withdrawals</p>
              <p className="font-bold text-lg text-red-600">
                {memories.filter((m) => m.type === "withdrawal").length}
              </p>
            </div>

            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-500">Last Activity</p>
              <p className="font-medium">
                {memories.length > 0
                  ? formatDate(
                      [...memories].sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime(),
                      )[0].date,
                    )
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
