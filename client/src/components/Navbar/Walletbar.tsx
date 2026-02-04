/* eslint-disable @next/next/no-img-element */

"use client";

import React, { useState, useEffect } from "react";
import { Menu } from "@headlessui/react";
import Link from "next/link";
import { FunctionComponent } from "react";
import { useWeb3 } from "../providers/web3";

type WalletbarProps = {
  isLoading: boolean;
  isInstalled: boolean;
  account: string | undefined;
  connect: () => Promise<void>;
  wasDisconnected?: boolean;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const NETWORK_NAMES: Record<string, string> = {
  "1": "Ethereum Mainnet",
  "3": "Ropsten",
  "4": "Rinkeby",
  "5": "Goerli",
  "11155111": "Sepolia",
  "5777": "Ganache Local",
  "1337": "Localhost",
};

const Walletbar: FunctionComponent<WalletbarProps> = ({
  isInstalled,
  isLoading,
  connect,
  account,
  wasDisconnected = false,
}) => {
  const { provider, contract } = useWeb3();
  const [balance, setBalance] = useState<string | null>(null);
  const [networkInfo, setNetworkInfo] = useState<{ name: string; chainId: string } | null>(null);
  const [contractAddress, setContractAddress] = useState<string | null>(null);

  useEffect(() => {
    if (!account || !provider) {
      setBalance(null);
      setNetworkInfo(null);
      return;
    }
    (async () => {
      try {
        const bal = await provider.getBalance(account);
        setBalance((Number(bal) / 1e18).toFixed(4));
      } catch {
        setBalance(null);
      }
    })();
  }, [account, provider]);

  useEffect(() => {
    if (!provider) {
      setNetworkInfo(null);
      return;
    }
    provider.getNetwork().then((net) => {
      const chainId = net.chainId.toString();
      setNetworkInfo({
        name: NETWORK_NAMES[chainId] || `Network ${chainId}`,
        chainId,
      });
    }).catch(() => setNetworkInfo(null));
  }, [provider]);

  useEffect(() => {
    if (!contract) {
      setContractAddress(null);
      return;
    }
    (contract as any).getAddress?.().then(setContractAddress).catch(() => setContractAddress(null));
  }, [contract]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div>
        <button
          onClick={() => {}}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Loading ...
        </button>
      </div>
    );
  }

  if (account) {
    return (
      <Menu as="div" className="ml-3 relative">
        <div>
          <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
            <span className="sr-only">Open user menu</span>
            <div className="h-8 w-8 rounded-full bg-primarybrown flex items-center justify-center text-white text-xs font-medium">
              {account ? `${account[2]}${account[3]}`.toUpperCase() : "U"}
            </div>
          </Menu.Button>
        </div>

        <Menu.Items className="z-50 origin-top-right absolute right-0 mt-2 w-80 rounded-xl shadow-xl bg-white ring-1 ring-black/10 focus:outline-none overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Wallet</p>
            <div className="space-y-2 text-sm">
              {balance != null && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Balance</span>
                  <span className="font-semibold text-gray-900">{balance} ETH</span>
                </div>
              )}
              {networkInfo && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Network</span>
                    <span className="font-medium text-gray-900">{networkInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Chain ID</span>
                    <span className="font-mono text-gray-700">{networkInfo.chainId}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className="font-medium text-emerald-600">Connected</span>
              </div>
              {isInstalled && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Wallet</span>
                  <span className="font-medium text-gray-900">MetaMask</span>
                </div>
              )}
            </div>
          </div>
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Account address</p>
            <div className="flex items-center gap-2">
              <code className="text-xs text-gray-800 font-mono break-all flex-1">{account}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(account)}
                className="shrink-0 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-gray-400 font-mono mt-1">{`${account.slice(0, 6)}...${account.slice(-4)}`}</p>
          </div>
          {contractAddress && (
            <div className="p-4 border-b border-gray-100">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Contract</p>
              <div className="flex items-center gap-2">
                <code className="text-xs text-gray-800 font-mono break-all flex-1">{contractAddress}</code>
                <button
                  type="button"
                  onClick={() => copyToClipboard(contractAddress)}
                  className="shrink-0 px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium hover:bg-gray-200"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
          <Menu.Item>
            {({ active }) => (
              <Link
                href="/profile"
                className={classNames(active ? "bg-gray-50" : "", "block px-4 py-3 text-sm font-medium text-gray-700 text-center border-t border-gray-100")}
              >
                View full profile
              </Link>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
    );
  }

  if (isInstalled) {
    return (
      <div>
        <button
          onClick={() => {
            connect()
          }}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {wasDisconnected ? "Reconnect Wallet" : "Connect Wallet"}
        </button>
      </div>
    )
  } else {
    return (
      <div>
        <button
          onClick={() => {
            window.open('https://metamask.io', '_blank');
          }}
          type="button"
          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          No Wallet
        </button>
      </div>
    )
  }
}

export default Walletbar;