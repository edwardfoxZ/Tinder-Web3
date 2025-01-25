import React, { useEffect, useState } from "react";
import { useWeb3 } from "../context/Web3Context";

export const useAccount = () => {
  const [account, setAccount] = useState(null);
  const { web3Api } = useWeb3();

  useEffect(() => {
    if (web3Api.account) {
      setAccount(web3Api.account);
    }
  }, [web3Api.account]);

  return { account };
};
