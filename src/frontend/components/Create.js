import { useState } from 'react';
import { ethers } from 'ethers';
import { Row, Form, Button } from 'react-bootstrap'
import axios from 'axios';
import FormData from 'form-data';

const key = "e2267be43329d3b6ab87";
const secret = "a2ac0749184057d7dd6b7a9ef73b9c123385617b93250a16787ad8bfbb7bc553";

const Create = ({ marketplace, nft, soulHub, soul, sbt }) => {
    const [fileURL, setFileURL] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [soulName, setSoulName] = useState('');
    const [option, setOption] = useState();
    const [objType, setObjType] = useState('');

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
                    soul: soulName
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
    
    const createSBT = async () => {
        if (!fileURL || !soulName || !name || !description) return;
        
        const sbtJSON = {
            name, description, soulName, file: fileURL
        }

        const url =  `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
        
        return axios
            .post(url, sbtJSON, {
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

        //mint sbt
        await (await sbt.mint(uri)).wait();

        //get tokenId of new sbt
        const id = await sbt.tokenCount()

        //approve soulHub to spend sbt
        await (await sbt.setApprovalForAll(soulHub.address, true)).wait()

        //add sbt to soulHub
        const result = await (await soulHub.createSBTItem(sbt.address, id, id)).wait();
        console.log("listed");
        return result;
    }

    const loadSouls = async () => {
        const soulCount = await soul.getSoulCount();
        let items = [];

        for(let i=1; i<=soulCount; i++){
            
        }
        
    }

    const createSoul = async () => {
        var data = JSON.stringify({
            "pinataOptions": {
              "cidVersion": 1
            },
            "pinataMetadata": {
              "name": name,
              "keyvalues": {
                "type": "Soul"
              }
            },
            "pinataContent": {
                "id": 1,                //hardcoded
                "name": name,
                "description": description
              }
          });

          var config = {
            method: 'post',
            url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
            headers: { 
              'Content-Type': 'application/json', 
              pinata_api_key: key,
              pinata_secret_api_key: secret,
            },
            data : data
          };
          
          const res = await axios(config);
          
          console.log(res.data);

    }

    return (
        <div className='container-fluid mt-5'>
            <div className='row'>
                <main role="main" className="col-lg-12 mx-auto" style={{maxWidth: '1000px'}}>
                    <div className='content mx-auto'>
                        <Row className='g-4'>
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
                            as="select"
                            onChange={e => {
                                console.log("e.target.value", e.target.value);
                                setOption(e.target.value);
                            }}
                            >
                                <option>Soul</option>
                                <option>SBT</option>
                            </Form.Control>

                            {option === 'SBT' && <Form.Control
                            as="select"
                            onChange={e => {
                                setSoulName(e.target.value);
                            }}
                            >
                                <option>Official</option>
                                <option>Education</option>
                                <option>Achievements</option>
                                <option>Tech Achievements</option>
                            </Form.Control>}

                            {option === 'SBT' && <Form.Control 
                                type="file" 
                                name="file" 
                                onChange={uploadToIPFS}
                            />}

                            <div className='d-grid px-0'>
                                <Button onClick={option === 'SBT' ? createSBT : createSoul} variant="primary" size="lg">
                                    Add {option && option}
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