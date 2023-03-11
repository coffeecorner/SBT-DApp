import logo from './logo.png';
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from 'react';
import { ethers } from "ethers";
import { legacy_createStore as createStore } from 'redux';

import MarketplaceAbi from '../contractsData/Marketplace.json';
import MarketplaceAddress from '../contractsData/Marketplace-address.json';
import NFTAbi from '../contractsData/NFT.json';
import NFTAddress from '../contractsData/NFT-address.json';

import Navigation from './Navbar.js';
import Home from './Home.js';
import Create from './Create.js';
import { Spinner } from 'react-bootstrap';
import SoulsLayout from './layouts/SoulsLayout';
import SBTLayout from './layouts/SBTLayout';
import { connect, Provider, useDispatch } from 'react-redux';
import Reducer from '../utils/redux/Reducer';
import { login, setProvider } from '../utils/redux/Action';
import AccessLayout from './layouts/AccessLayout';
 
function App() {
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);
  const [nft, setNFT] = useState();
  const [marketplace, setMarketplace] = useState({});
  const store = createStore(Reducer);
  const dispatch = useDispatch();
  
  // Metamask Login/connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method : 'eth_requestAccounts' });
    const networkId = await window.ethereum.request({ method: 'net_version' });
    setAccount(accounts[0]);
    dispatch(login(accounts[0], networkId));
    //Get provider from Metamask
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //Set signer
    const signer = provider.getSigner();

    dispatch(setProvider(provider));
    dispatch(setProvider(signer));

    loadContracts(signer);
  }

  const loadContracts = async (signer) => {
    //Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
    setMarketplace(marketplace);

    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);
    setNFT(nft);
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
              <Home marketplace={marketplace} nft={nft}/>
            } />
            <Route path="/create" element={
              <Create marketplace={marketplace} nft={nft} />
            }/>
            <Route path="/my-souls" element={
              <SoulsLayout web3Handler={web3Handler} />
            } />
            <Route path="/:soul/sbt" element={
              <SBTLayout web3Handler={web3Handler} account={account} />
            } />
            <Route path="/accesses" element={
              <AccessLayout web3Handler={web3Handler} />
            } />
            <Route path="/my-purchases"/>
          </Routes>
          )}
        </div>
      </BrowserRouter>
    </>
  );
}

const mapStateToProps = (state) => ({
  loggedIn: state.loggedIn,
  account: state.account,
  networkId: state.networkId,
});

export default connect(mapStateToProps)(App);