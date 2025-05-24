/**
 * Abbreviates an address for display
 * Returns format: 0x1234...5678
 */
export function abbreviateAddress(address: string): string {
  if (!address) return "";

  if (address.length <= 10) return address;

  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

/**
 * Formats a number with thousands separators
 */
export function formatNumber(number: number | string): string {
  const num = typeof number === "string" ? parseFloat(number) : number;

  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2,
  });
}

/**
 * Formats a date for display
 */
export function formatDate(timestamp: number | string): string {
  const date =
    typeof timestamp === "string"
      ? new Date(parseInt(timestamp))
      : new Date(timestamp);

  return date.toLocaleString();
}

import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const explorer = "https://suiscan.xyz/testnet/tx/" as const;

export function urlExplorer({
  address,
  txHash,
  type = "object",
}: {
  address?: string;
  txHash?: string;
  type?: "object" | "tx" | "none";
}) {
  return `${explorer}${type === "object" ? "object/" : type === "none" ? "" : "tx/"}${address || txHash}`;
}
