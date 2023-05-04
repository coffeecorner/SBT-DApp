import logo from './logo.png';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { ethers } from "ethers";

import SBTAbi from '../contractsData/SBT.json';
import SBTAddress from '../contractsData/SBT-address.json';
import SoulAbi from '../contractsData/Soul.json';
import SoulAddress from '../contractsData/Soul-address.json';
import SoulHubAbi from '../contractsData/SoulHub.json';
import SoulHubAddress from '../contractsData/SoulHub-address.json';

import Navigation from './Navbar.js';
import Home from './Home.js';
import Create from './Create.js';
import { Spinner } from 'react-bootstrap';
import SoulsLayout from './layouts/SoulsLayout';
import SBTLayout from './layouts/SBTLayout';
import AccessLayout from './layouts/AccessLayout';
import GrantAccessLayout from './layouts/GrantAccessLayout';
import PendingSBTsLayout from './layouts/PendingSBTsLayout';
 
function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  const [sbt, setSBT] = useState();
  const [soul, setSoul] = useState();
  const [soulHub, setSoulHub] = useState();

  // Metamask Login/connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method : 'eth_requestAccounts' });
    setAccount(accounts[0]);
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //Set signer
    const signer = provider.getSigner();

    loadContracts(signer);
  }

  const loadContracts = async (signer) => {
    //Get deployed copies of contracts
    const SBT = new ethers.Contract(SBTAddress.address, SBTAbi.abi, signer);
    setSBT(SBT);

    const Soul = new ethers.Contract(SoulAddress.address, SoulAbi.abi, signer);
    setSoul(Soul);

    const SoulHub = new ethers.Contract(SoulHubAddress.address, SoulHubAbi.abi, signer);
    setSoulHub(SoulHub);

    setLoading(false);
    localStorage.setItem("isConnectionEstablished", true);
  }

  return (
    <>
      <BrowserRouter>
        <div className='App'>
          <Navigation web3Handler={web3Handler} account={account} />
          {loading ? (
            <div style={{ display:'flex', justifyContent: 'center', alignItems:'center', minHeight:'80vh' }}>
              <Spinner animation="border" style={{display:'flex'}} />
              <p className='mx-3 my-0'>Awaiting Metamask Connection...</p>
            </div>
          ):(
          <Routes>
            <Route path="/" element = {
              <Home web3Handler={web3Handler} />
            } />
            <Route path="/create" element={
              <Create web3Handler={web3Handler} soulHub={soulHub} soul={soul} sbt={sbt} account={account}/>
            }/>
            <Route path="/my-souls" element={
              <SoulsLayout web3Handler={web3Handler} soulHub={soulHub} soul={soul} sbt={sbt} account={account}/>
            } />
            <Route path="/:soul" element={
              <SBTLayout web3Handler={web3Handler} account={account} soulHub={soulHub} soul={soul} sbt={sbt} />
            } />
            <Route path="/:sbtId/grant-access" element={
              <GrantAccessLayout web3Handler={web3Handler} soulHub={soulHub} soul={soul} sbt={sbt} account={account} />
            } />
            <Route path="/accesses" element={
              <AccessLayout web3Handler={web3Handler} />
            } />
            <Route path="/new-sbts" element={
              <PendingSBTsLayout web3Handler={web3Handler} account={account} sbt={sbt} soulHub={soulHub} soul={soul} />
            } />
            <Route path="/my-purchases"/>
          </Routes>
          )}
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
