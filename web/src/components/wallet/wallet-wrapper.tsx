import { useCurrentAccount } from "@mysten/dapp-kit";
import React from "react";

export default function WalletWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = useCurrentAccount();
  const address = account?.address;

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] w-full">
        <h1 className="text-2xl font-bold">Please connect your wallet</h1>
        <p className="mt-4 text-gray-600">
          You need to connect your wallet to access this page.
        </p>
      </div>
    );
  }

  return children;
}
