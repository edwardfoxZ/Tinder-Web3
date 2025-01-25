// Web3Context.js

import React, { createContext, useContext, useState, useEffect } from "react";
import Web3 from "web3";
import TinderABI from "../contracts/Tinder.json";

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
  const [web3Api, setWeb3Api] = useState({
    provider: null,
    web3: null,
    contract: null,
    account: null,
    isConnect: false,
  });
  const [isLoading, setLoading] = useState(false);

  // Initialize Web3 and handle connection setup
  const initWeb3 = async () => {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = window.ethereum;

      const rpc_ChainId = await window.ethereum.request({
        method: "eth_chainId",
      });
      console.log("RPC Chain ID: ", rpc_ChainId);

      if (!provider) {
        console.error("Please install MetaMask!");
        return;
      }

      const web3 = new Web3(provider);
      const accounts = await web3.eth.getAccounts();
      const netId = await web3.eth.net.getId();
      console.log("Network ID: ", netId);

      const deploymentNet = TinderABI.networks[netId];
      if (!deploymentNet || !deploymentNet.address) {
        console.error(
          "Contract not deployed on this network or invalid address."
        );
        return;
      }

      console.log("Contract address: ", deploymentNet.address);

      const contract = new web3.eth.Contract(
        TinderABI.abi,
        deploymentNet.address
      );

      setWeb3Api({
        provider,
        web3,
        contract,
        account: accounts[0] || null,
        isConnect: !!accounts[0],
      });
    } catch (error) {
      console.error("Failed to initialize Web3: ", error);
    }
  };

  // Use effect to initialize Web3 when the component mounts
  useEffect(() => {
    initWeb3();

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setWeb3Api((prevState) => ({ ...prevState, account: accounts[0] }));
      } else {
        setWeb3Api((prevState) => ({ ...prevState, account: null }));
      }
    };

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, [web3Api.isConnect]);

  return (
    <Web3Context.Provider
      value={{
        setWeb3Api,
        web3Api,
        isLoading,
        setLoading,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Custom hook to use the Web3 context
export const useWeb3 = () => useContext(Web3Context);
