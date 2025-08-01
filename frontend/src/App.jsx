import { useState } from 'react';
import { ethers } from 'ethers';
import { NFTStorage, File } from 'nft.storage';
import axios from 'axios'; 
import './App.css';

// --- IMPORTANT ---
// 1. PASTE YOUR DEPLOYED CONTRACT ADDRESS HERE
const contractAddress = '0x6FD786d570BE23Ba4F92C798fF3Ff039dB9eD205';

// 2. PASTE YOUR CONTRACT'S ABI HERE
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "approve",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721IncorrectOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721InsufficientApproval",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "approver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidApprover",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOperator",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "ERC721InvalidOwner",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "receiver",
				"type": "address"
			}
		],
		"name": "ERC721InvalidReceiver",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "sender",
				"type": "address"
			}
		],
		"name": "ERC721InvalidSender",
		"type": "error"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ERC721NonexistentToken",
		"type": "error"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "approved",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Approval",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "ApprovalForAll",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_fromTokenId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_toTokenId",
				"type": "uint256"
			}
		],
		"name": "BatchMetadataUpdate",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "_tokenId",
				"type": "uint256"
			}
		],
		"name": "MetadataUpdate",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "tokenURI",
				"type": "string"
			}
		],
		"name": "mintDream",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			},
			{
				"internalType": "bytes",
				"name": "data",
				"type": "bytes"
			}
		],
		"name": "safeTransferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "approved",
				"type": "bool"
			}
		],
		"name": "setApprovalForAll",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "Transfer",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "to",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "transferFrom",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			}
		],
		"name": "balanceOf",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "getApproved",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "owner",
				"type": "address"
			},
			{
				"internalType": "address",
				"name": "operator",
				"type": "address"
			}
		],
		"name": "isApprovedForAll",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "name",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "ownerOf",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "bytes4",
				"name": "interfaceId",
				"type": "bytes4"
			}
		],
		"name": "supportsInterface",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "symbol",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenId",
				"type": "uint256"
			}
		],
		"name": "tokenURI",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
// Example: const contractABI = [{"inputs": ..., "name": ...}, ...];

function App() {
  const [dream, setDream] = useState('');
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('Connect your wallet to begin.');
  const [isLoading, setIsLoading] = useState(false);

  // New state for displaying dreams
  const [myDreams, setMyDreams] = useState([]);
  const [isFetching, setIsFetching] = useState(false);

  // Helper function to connect wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setMessage('Write your dream and mint it as an NFT!');
      } else {
        setMessage('MetaMask is not installed. Please install it to use this app.');
      }
    } catch (error) {
      console.error('Error connecting to MetaMask', error);
      setMessage('Failed to connect wallet.');
    }
  };

  // Main function to mint the NFT
  const mintDreamNFT = async () => {
    if (!dream) {
      setMessage('Please write your dream first!');
      return;
    }
    if (!account) {
      setMessage('Please connect your wallet first!');
      return;
    }

    setIsLoading(true);
    setMessage('Uploading dream to IPFS via Pinata...');

    try {
      // 1. Upload to IPFS using Pinata
      const jsonData = {
        name: "A Dream",
        description: dream
      };
      const pinataResponse = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        jsonData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_PINATA_JWT}`
          }
        }
      );

      const ipfsHash = pinataResponse.data.IpfsHash;
      const tokenURI = `ipfs://${ipfsHash}`;
      setMessage('Dream uploaded! Now minting NFT...');

      // 2. Mint the NFT on the blockchain
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const dreamChainContract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await dreamChainContract.mintDream(tokenURI);
      await transaction.wait();

      setMessage(`NFT minted successfully! Transaction: ${transaction.hash}`);
      setDream('');
    } catch (error) {
      console.error('Minting failed', error);
      setMessage('Minting failed. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- NEW AND IMPROVED FUNCTION TO FETCH YOUR DREAMS ---
  const fetchMyDreams = async () => {
      if (!account) {
          setMessage("Please connect your wallet to see your dreams.");
          return;
      }
      setIsFetching(true);
      setMyDreams([]); 
      setMessage("Searching your transaction history for dreams...");
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);

          // Create a filter to find all 'Transfer' events where the 'to' address is the current user
          const filter = contract.filters.Transfer(null, account);
          
          // Query the blockchain for these historical events
          const events = await contract.queryFilter(filter, 0, 'latest');

          if (events.length === 0) {
              setMessage("Could not find any dreams minted to this wallet. Mint one first!");
              setIsFetching(false);
              return;
          }

          // Fetch metadata for each owned token in parallel
          const dreamsPromises = events.map(async (event) => {
              const tokenId = event.args.tokenId.toString();
              try {
                  const tokenURI = await contract.tokenURI(tokenId);
                  const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                  const metadataResponse = await axios.get(metadataUrl);
                  if (metadataResponse.data && metadataResponse.data.description) {
                    return {
                        id: tokenId,
                        description: metadataResponse.data.description
                    };
                  }
              } catch (e) {
                  console.error(`Could not fetch metadata for token ${tokenId}`, e);
                  return null; // Return null for failed fetches
              }
          });

          const dreams = (await Promise.all(dreamsPromises)).filter(dream => dream !== null);
          
          setMyDreams(dreams);

          if (dreams.length > 0) {
            setMessage(`Found ${dreams.length} dream(s)!`);
          } else {
            setMessage("Found your mint transactions, but could not load dream data from IPFS. Please try again.");
          }

      } catch (error) {
          console.error("Failed to fetch dreams:", error);
          setMessage("An error occurred while fetching dreams. See console.");
      } finally {
          setIsFetching(false);
      }
  };


  return (
    <div className="container">
      <div className="mint-section">
        <h1>🌙 DreamChain</h1>
        <p>Immortalize your dreams on the blockchain.</p>

        {account ? (
          <p className="wallet-info">Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}</p>
        ) : (
          <button onClick={connectWallet}>Connect Wallet</button>
        )}

        <textarea
          value={dream}
          onChange={(e) => setDream(e.target.value)}
          placeholder="Last night, I dreamt of a flying pizza that delivered tacos..."
          rows="5"
          disabled={!account || isLoading}
        />

        <button onClick={mintDreamNFT} disabled={!account || isLoading}>
          {isLoading ? 'Minting...' : 'Mint as NFT'}
        </button>

        <p className="message">{message}</p>
      </div>

      {/* --- NEW SECTION TO DISPLAY DREAMS --- */}
      <div className="dreams-gallery">
        <h2>My Minted Dreams</h2>
        <button onClick={fetchMyDreams} disabled={isFetching || !account}>
            {isFetching ? 'Fetching...' : 'Fetch My Dreams'}
        </button>
        
        {myDreams.length > 0 ? (
            <ul>
                {myDreams.map(dream => (
                    <li key={dream.id}>"{dream.description}"</li>
                ))}
            </ul>
        ) : (
            <p className="no-dreams-message">
                {isFetching ? 'Searching...' : 'No dreams fetched yet. Click the button above!'}
            </p>
        )}
      </div>
    </div>
  );
}

export default App;