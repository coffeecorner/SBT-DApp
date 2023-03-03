/* eslint-disable no-unused-vars */
import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios';
import FormData from 'form-data';

const key = "e2267be43329d3b6ab87";
const secret = "a2ac0749184057d7dd6b7a9ef73b9c123385617b93250a16787ad8bfbb7bc553";

const Create = ({ marketplace, nft }) => {
    const [fileURL, setFileURL] = useState('');
    const [price, setPrice] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    const uploadToIPFS = async (event) => {
        const url =  `https://api.pinata.cloud/pinning/pinFileToIPFS`;

        let data = new FormData();
        
        const file = event.target.files[0];

        if(typeof file != 'undefined'){
            data.append('file', file);

            const metadata = JSON.stringify({
                name : name,
                keyvalues: {
                    description : description,
                    price: 2
                }
            })
            data.append('pinataMetadata', metadata);

            const pinataOptions = JSON.stringify({
                cidVersion : 1,
                wrapWithDirectory: false
            })

            return axios.post(url, data, {
                    maxBodyLength: 'Infinity',
                    headers: {
                        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
                        pinata_api_key: key,
                        pinata_secret_api_key: secret,
                    }
                })
                .then(function (response) {
                    console.log("file uploaded", response.data.IpfsHash);
                    setFileURL("https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash);
                    return {
                       success: true,
                       pinataURL: fileURL
                   };
                })
                .catch(function (error) {
                    console.log(error);
                    return {
                        success: false,
                        message: error.message,
                    }
        
                });
        }
        
    }
    
    const createNFT = async () => {
        if (!fileURL || !price || !name || !description) return;
        
        const nftJSON = {
            name, description, price, file: fileURL
        }

        const url =  `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        
        return axios
            .post(url, nftJSON, {
                headers: {
                    pinata_api_key: key,
                    pinata_secret_api_key: secret
                }
            })
            .then(async function (response){
                const mint = await mintThenList(response);
                console.log("successfully listed");
                return {
                    success: true,
                    pinataURL: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
                }
            })
            .catch(function (error){
                console.log(error);
                return{
                    success: false,
                    message: error.message
                }
            });
    }

    const mintThenList = async (response) => {
        const uri = "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash;

        //mint nft
        await (await nft.mint(uri)).wait();

        //get tokenId of new nft
        const id = await nft.tokenCount()

        //approve marketplace to spend nft
        await (await nft.setApprovalForAll(marketplace.address, true)).wait()

        //add nft to marketplace
        const listingPrice = ethers.utils.parseEther(price.toString());
        const result = await (await marketplace.makeItem(nft.address, id, listingPrice)).wait();
        console.log("listed");
        return result;
    }

    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: '1000px'}}>
                    <div className='content mx-auto'>
                        <Row className='g-4'>
                            <Form.Control 
                                type="file" 
                                name="file" 
                                onChange={uploadToIPFS}
                            />
                            <Form.Control 
                                onChange={(e) => setName(e.target.value)}
                                size="lg"
                                type="text"
                                placeholder="Name"
                            />
                            <Form.Control 
                                onChange={(e) => setDescription(e.target.value)}
                                size="lg"
                                as="textarea"
                                placeholder="Description"
                            />
                            <Form.Control 
                                onChange={(e) => setPrice(e.target.value)}
                                size="lg"
                                type="number"
                                placeholder="Price in ETH"
                            />
                            <div className='d-grid px-0'>
                                <Button onClick={createNFT} variant="primary" size="lg">
                                    Create & List NFT
                                </Button>
                            </div>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Create;