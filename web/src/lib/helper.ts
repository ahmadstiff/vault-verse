import { normalize } from "./bignumber";

export const normalizeAPY = (apy: number) => {
  return apy / 100;
};

export const normalizeTVL = (tvl: number, decimals: number) => {
  return formatCurrency(normalize(tvl, decimals));
};

export const formatDateToDMY = (date: string): string => {
  const pad = (n: number) => String(n).padStart(2, "0");

  const parsedDate = new Date(date);
  const day = pad(parsedDate.getDate());
  const month = pad(parsedDate.getMonth() + 1);
  const year = parsedDate.getFullYear();

  return `${day}/${month}/${year}`;
};

export const formatCurrency = (
  value: string,
  currencyPrefix?: string,
): string => {
  const values = parseFloat(value);

  if (isNaN(values)) {
    return `${currencyPrefix}0.00`;
  }

  const absValue = Math.abs(values);
  let formattedValue: string;
  let suffix: string = "";

  if (absValue >= 1_000_000_000) {
    formattedValue = (values / 1_000_000_000).toFixed(2);
    suffix = "B";
  } else if (absValue >= 1_000_000) {
    formattedValue = (values / 1_000_000).toFixed(2);
    suffix = "M";
  } else if (absValue >= 1_000) {
    formattedValue = (values / 1_000).toFixed(2);
    suffix = "K";
  } else {
    formattedValue = values.toFixed(2);
  }

  return `${currencyPrefix ?? ""}${formattedValue}${suffix}`;
};

export const truncateAddress = (
  address: string,
  startLength = 6,
  endLength = 4,
) => {
  if (!address) return "Not Found";
  const regex = new RegExp(
    `^(0x[a-zA-Z0-9]{${startLength}})[a-zA-Z0-9]+([a-zA-Z0-9]{${endLength}})$`,
  );
  const match = address.match(regex);

  if (!match) return address;

  return `${match[1]}…${match[2]}`;
};

export const toHex = (num: number) => {
  const val = Number(num);

  return "0x" + val.toString(16);
};

export const formatPercent = (value: number) => `${value.toFixed(2)}%`;

export const formatUSD = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
