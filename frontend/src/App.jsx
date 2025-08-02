import { useState, useEffect} from 'react';
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
  const [title, setTitle] = useState('');
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('Connect your wallet to begin.');
  const [isLoading, setIsLoading] = useState(false);

  const [myDreams, setMyDreams] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [allDreams, setAllDreams] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  useEffect(() => {
    fetchAllDreams();
  }, []);

  useEffect(() => {
    if (account) {
      fetchMyDreams();
    }
  }, [account]);

  const connectWallet = async () => {
  if (!window.ethereum) {
    setMessage("MetaMask not installed.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0]);

    const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
    if (currentChainId !== "0xaa36a7") {
      try {
        await window.ethereum.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: "0xaa36a7" }],
        });
        setMessage("Switched to Sepolia!");
      } catch (switchError) {
        if (switchError.code === 4902) {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [{
              chainId: "0xaa36a7",
              chainName: "Sepolia Testnet",
              rpcUrls: ["https://rpc.sepolia.org"],
              nativeCurrency: {
                name: "SepoliaETH",
                symbol: "ETH",
                decimals: 18,
              },
              blockExplorerUrls: ["https://sepolia.etherscan.io"],
            }],
          });
        } else {
          console.error("Switch error:", switchError);
          setMessage("Switch failed.");
        }
      }
    } else {
      setMessage("Connected to Sepolia!");
    }
  } catch (err) {
    console.error("MetaMask connect error", err);
    setMessage("Failed to connect wallet.");
  }
};


  const mintDreamNFT = async () => {
    if (!dream || !title) {
      setMessage('Please provide both a title and a description.');
      return;
    }
    if (!account) {
      setMessage('Please connect your wallet first!');
      return;
    }

    setIsLoading(true);
    setMessage('Uploading dream to IPFS...');

    try {
      const jsonData = { name: title, description: dream };
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

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const dreamChainContract = new ethers.Contract(contractAddress, contractABI, signer);

      const transaction = await dreamChainContract.mintDream(tokenURI);
      await transaction.wait();

      setMessage(`NFT minted successfully! Transaction: ${transaction.hash}`);
      setDream('');
      setTitle('');
      fetchAllDreams();
      if (account) {
        fetchMyDreams();
      }
    } catch (error) {
      console.error('Minting failed', error);
      setMessage('Minting failed. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMyDreams = async () => {
    if (!account) {
      setMyDreams([]);
      return;
    }
    setIsFetching(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const filter = contract.filters.Transfer(null, account);
      const events = await contract.queryFilter(filter, 0, 'latest');

      const dreamsPromises = events.map(async (event) => {
        const tokenId = event.args.tokenId.toString();
        try {
          const tokenURI = await contract.tokenURI(tokenId);
          const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          const metadataResponse = await axios.get(metadataUrl);
          return { id: tokenId, name: metadataResponse.data.name, description: metadataResponse.data.description };
        } catch (e) { return null; }
      });

      const dreams = (await Promise.all(dreamsPromises)).filter(d => d !== null);
      setMyDreams(dreams.reverse());
    } catch (error) {
      console.error("Failed to fetch my dreams:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const fetchAllDreams = async () => {
    setIsFetchingAll(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, contractABI, provider);
      const filter = contract.filters.Transfer(ethers.ZeroAddress, null);
      const events = await contract.queryFilter(filter, 0, 'latest');

      const dreamsPromises = events.map(async (event) => {
        const tokenId = event.args.tokenId.toString();
        const owner = event.args.to;
        try {
          const tokenURI = await contract.tokenURI(tokenId);
          const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
          const metadataResponse = await axios.get(metadataUrl);
          return { id: tokenId, name: metadataResponse.data.name, description: metadataResponse.data.description, owner: owner };
        } catch (e) { return null; }
      });
      
      const dreams = (await Promise.all(dreamsPromises)).filter(d => d !== null);
      setAllDreams(dreams.reverse());
    } catch (error) {
      console.error("Failed to fetch all dreams:", error);
    } finally {
      setIsFetchingAll(false);
    }
  };

  const DreamCard = ({ dream, isPublic }) => (
    <div className={`dream-card ${isPublic ? 'public-dream' : 'my-dream'}`}>
      <h3 className="dream-title">{dream.name || 'Untitled Dream'}</h3>
      <p className="dream-description">{dream.description}</p>
      {isPublic && (
        <p className="dream-owner">By: {`${dream.owner.substring(0, 6)}...${dream.owner.substring(dream.owner.length - 4)}`}</p>
      )}
    </div>
  );

  const PublicDreamsTicker = ({ dreams }) => {
    const doubledDreams = dreams.length > 0 ? [...dreams, ...dreams] : [];
    return (
      <div className="ticker-wrap">
        <div className="ticker-move">
          {doubledDreams.map((dream, index) => (
            <div key={`${dream.id}-${index}`} className="ticker-item">
              <h4 className="ticker-title">{dream.name || 'Untitled Dream'}</h4>
              <p className="ticker-description">"{dream.description}"</p>
              <p className="ticker-owner">By: {`${dream.owner.substring(0, 6)}...`}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>🌙 DreamChain</h1>
        {account ? (
          <div className="wallet-info-box">
            Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
          </div>
        ) : (
          <button onClick={connectWallet} className="header-button">
            Connect Wallet
          </button>
        )}
      </header>

      <main className="main-content">
        
        <div className="ticker-section">
            <h2>Recent Public Dreams</h2>
            {isFetchingAll ? <p>Loading recent dreams...</p> : <PublicDreamsTicker dreams={allDreams} />}
        </div>

        {/* --- NEW HORIZONTAL SCROLL FOR MY DREAMS --- */}
        <div className="my-dreams-section">
          <h2>My Minted Dreams</h2>
          <div className="my-dreams-scroll-container">
            {isFetching ? <p className="loading-text">Fetching your dreams...</p> :
             myDreams.length > 0 ? (
                myDreams.map(d => (
                  <div key={d.id} className="my-dream-card">
                    <h3 className="dream-title">{d.name || 'Untitled Dream'}</h3>
                    <p className="dream-description">{d.description}</p>
                  </div>
                ))
             ) : (
              <p className="loading-text">{account ? "You haven't minted any dreams yet." : "Connect wallet to see your dreams."}</p>
             )
            }
          </div>
        </div>

        <div className="minting-section">
          <h2>Immortalize a New Dream</h2>
          <p className="subtitle">Once minted, your dream is permanently stored on the blockchain.</p>
          <div className="input-group">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your dream..."
              disabled={!account || isLoading}
            />
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Describe your dream here..."
              rows="5"
              disabled={!account || isLoading}
            />
          </div>
          <button
            onClick={mintDreamNFT}
            disabled={!account || isLoading}
            className="mint-button"
          >
            {isLoading ? 'Processing...' : 'Mint Dream'}
          </button>
          <p className="message-box">{message}</p>
        </div>

        


        {/* <div className="gallery-section">
          <h2>Public Dream Gallery</h2>
          <div className="dreams-grid">
            {isFetchingAll ? <p className="loading-text">Fetching all dreams...</p> : 
             allDreams.length > 0 ? allDreams.map(d => <DreamCard key={d.id} dream={d} isPublic={true} />) : 
             <p className="loading-text">No public dreams have been minted yet.</p>
            }
          </div>
        </div> */}
      </main>
    </div>
  );
}

export default App;
