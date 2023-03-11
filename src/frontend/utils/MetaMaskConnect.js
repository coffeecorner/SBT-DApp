import { ethers } from 'ethers';
import { login, setProvider } from './redux/Action';


// Metamask Login/connect
const web3Handler = async (setAccount, dispatch) => {
    
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

const loadContracts = async (MarketplaceAddress, MarketplaceAbi, signer, NFTAddress, NFTAbi) => {
    //Get deployed copies of contracts
    const marketplace = new ethers.Contract(MarketplaceAddress.address, MarketplaceAbi.abi, signer);
    const nft = new ethers.Contract(NFTAddress.address, NFTAbi.abi, signer);

    return {
        marketPlace: marketplace,
        nft: nft
    }
}

export {web3Handler, loadContracts};