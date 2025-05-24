import { Route, Routes } from "react-router-dom";
import { useCurrentAccount } from "@mysten/dapp-kit";

import IndexPage from "./pages";
import VaultDashboard from "./components/VaultDashboard";
import VaultDetails from "./components/VaultDetails";
import { VaultProvider } from "./contexts/VaultContext";
import DefaultLayout from "./layouts/default";

// Vault dashboard wrapper with provider
const VaultDashboardPage: React.FC = () => {
  const account = useCurrentAccount();
  const { pathname } = window.location;

  return (
    <DefaultLayout>
      <div className="container mx-auto">
        {account ? (
          <VaultProvider>
            {pathname.startsWith("/vaults/") ? (
              <VaultDetails />
            ) : (
              <VaultDashboard />
            )}
          </VaultProvider>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-4">
              Please connect your wallet using the button in the top-right
              corner to access the vault dashboard.
            </p>
            <div className="animate-pulse flex justify-center">
              <svg
                className="w-12 h-12 text-blue-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
};

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<VaultDashboardPage />} path="/vaults" />
      <Route element={<VaultDashboardPage />} path="/vaults/:id" />
    </Routes>
  );
}

export default App;
