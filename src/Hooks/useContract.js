import React, { useEffect, useState } from "react";
import Web3 from "web3";
import Tinder from "../contracts/Tinder.json";

export const useContract = () => {
  const [contract, setContract] = useState(null);

  useEffect(() => {
    const initContract = async () => {
      try {
        const web3 = new Web3(window.ethereum);

        const CONTRACT_ABI = Tinder.abi;
        const NET_ID = await web3.eth.net.getId();
        const DEPLOYMENT_NET = Tinder.networks[NET_ID];

        if (!DEPLOYMENT_NET || !DEPLOYMENT_NET.address) {
          console.error("Contract not deployed on this network.");
          return;
        }

        const contractInstance = new web3.eth.Contract(
          CONTRACT_ABI,
          DEPLOYMENT_NET.address
        );

        setContract(contractInstance);
      } catch (error) {
        console.error("Contract initializing failed: ", error);
      }
    };

    initContract();
  }, []);

  return { contract };
};
