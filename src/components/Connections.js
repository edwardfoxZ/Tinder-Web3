import React from "react";
import { useWeb3 } from "../context/Web3Context";

export const Connections = () => {
  const { setWeb3Api, web3Api, isLoading } = useWeb3();

  // Connect handler
  const handleConnect = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWeb3Api((prevState) => ({
        ...prevState,
        account: accounts[0],
        isConnect: true,
      }));
    } catch (error) {
      console.error("MetaMask connection failed: ", error);
    }
  };

  // Disconnect handler
  const handleDisconnect = () => {
    setWeb3Api({
      provider: null,
      web3: null,
      contract: null,
      account: null,
      isConnect: false,
    });
  };
  return (
    <div>
      {isLoading ? (
        <p className="Connect-btn">Loading...</p>
      ) : (
        <span>
          {web3Api.isConnect ? (
            <button
              className="Connect-btn cursor-pointer bg-connect-btn-to"
              onClick={handleDisconnect}
            >
              Disconnect
              <span style={{ marginLeft: "10px" }}>
                {web3Api.account?.slice(0, 6) || "Not connected"}
              </span>
            </button>
          ) : (
            <button
              className={`Connect-btn cursor-pointer ${
                web3Api.isConnect ? "bg-connect-btn-to" : "bg-connect-btn"
              }`}
              onClick={handleConnect}
            >
              Connect
            </button>
          )}
        </span>
      )}
    </div>
  );
};
