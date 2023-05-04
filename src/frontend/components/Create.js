import { useEffect, useState } from 'react';
import { Row, Form, Button, ButtonGroup, ToggleButton } from 'react-bootstrap'
import axios from 'axios';
import FormData from 'form-data';

import styles from "./styles.module.scss";

const key = "e2267be43329d3b6ab87";
const secret = "a2ac0749184057d7dd6b7a9ef73b9c123385617b93250a16787ad8bfbb7bc553";

const Create = ({ marketplace, nft, soulHub, soul, sbt, account }) => {
    const [fileURL, setFileURL] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [option, setOption] = useState('Soul');
    const [soulsArray, setSoulsArray] = useState();
    const [soulName, setSoulName] = useState('');
    const [soulId, setSoulId] = useState()
    const [checked, setChecked] = useState(false);
    const [ownerAddress, setOwnerAddress] = useState();

    useEffect(() => {
        loadSouls();
    });

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

            /* const pinataOptions = JSON.stringify({
                cidVersion : 1,
                wrapWithDirectory: false
            }) */

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
        console.log(fileURL, " ", soulName, " ", name, " ", description)
        if (!fileURL || !soulName || !name || !description) return alert('Missing data');

        console.log(soulId, soulName);

        debugger;
        
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
                await mintThenList(response);
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
        console.log(id);

        //approve soulHub to spend sbt
        await (await sbt.setApprovalForAll(soulHub.address, true)).wait()

        //add sbt to soulHub
        const result = await (await soulHub.createSBTItem(sbt.address, id, soulId)).wait();
        console.log(result);
        console.log("listed ", soulId, " ", soulName);
        return result;
    }

    const loadSouls = async () => {
        const soulCount = await soul.getSoulCount();
        let souls = []

        for(let i=1; i<=soulCount; i++){
            const soulOwner = await soul.getOwner(i);
            if (soulOwner.toLowerCase() === account) {
                const soulname = await soul.getSoulName(i);
                souls.push({id: i, soulName: soulname});
            }
        }

        setSoulsArray(souls);
    }

    const createSoul = async () => {
        if (!name /* || !description */) return alert('Missing data');

        const id = await soul.getSoulCount();
        /* console.log(id.toNumber());
        debugger; */

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
                "id": (id.toNumber() + 1),
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
          mintSoul(res);
          
          console.log(res?.data);

    }

    const mintSoul = async (response) => {
        /* const uri = "https://gateway.pinata.cloud/ipfs/" + response?.data?.IpfsHash; */

        await (await soul?.createSoul(name)).wait();

        const id = await soul?.getSoulCount();

        const result = await (await soulHub.createSoulItem(soul?.address, id));
        console.log("Soul listed");
        return result;
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
                                placeholder="Name*"
                            />

                            <Form.Control 
                                onChange={(e) => setDescription(e.target.value)}
                                size="lg"
                                as="textarea"
                                placeholder="Description*"
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

                            {option === 'SBT' && <ButtonGroup className={styles.btn}>
                                <ToggleButton
                                id="toggle-check"
                                type="checkbox"
                                variant="outline-primary"
                                checked={checked}
                                value="1"
                                onChange={(e) => setChecked(e.currentTarget.checked)}
                                >
                                Not for me
                                </ToggleButton>
                            </ButtonGroup>}

                            {option === 'SBT' && !checked && <Form.Select
                            as="select"
                            onChange={(e) => {
                                if (e.target.value) {
                                    const selectedOption = soulsArray.find((element) => element.soulName === e.target.value);
                                    console.log(e.target.value)
                                    setSoulName(e.target.value);
                                    setSoulId(selectedOption?.id);
                                    console.log(e.target.value, " ", soulName);
                                }
                            }}
                            value={soulName}
                            >
                                {soulsArray?.map((element) => {
                                    return (
                                        <option>{element?.soulName}</option>
                                    )
                                })}
                            </Form.Select>}

                            {checked && option === 'SBT' && 
                            <Form.Control
                                onChange={(e) => setOwnerAddress(e.target.value)}
                                size="lg"
                                type="text"
                                placeholder="Owner Address*"
                            />}

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

                            <Button onClick={(e) => loadSouls()}>Button</Button>
                        </Row>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Create;