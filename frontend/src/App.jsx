import { useState } from 'react';
import { ethers } from 'ethers';
import { NFTStorage, File } from 'nft.storage';
import axios from 'axios'; 

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
  const [title, setTitle] = useState(''); // Add state for title
  const [account, setAccount] = useState('');
  const [message, setMessage] = useState('Connect your wallet to begin.');
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('others'); // 'others' or 'my'

  // State for displaying dreams
  const [myDreams, setMyDreams] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [allDreams, setAllDreams] = useState([]);
  const [isFetchingAll, setIsFetchingAll] = useState(false);

  // Helper function to connect wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setMessage('Write your dream and mint it as an NFT!');
        fetchMyDreams(accounts[0]);
        fetchAllDreams();
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
    if (!dream || !title) {
      setMessage('Please write your dream title and description first!');
      return;
    }
    if (!account) {
      setMessage('Please connect your wallet first!');
      return;
    }

    setIsLoading(true);
    setMessage('Uploading dream to IPFS via Pinata...');

    try {
      // 1. Upload metadata to IPFS using Pinata
      const jsonData = {
        name: title, // Use the title state
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
      setTitle('');
      fetchMyDreams(account);
      fetchAllDreams();
    } catch (error) {
      console.error('Minting failed', error);
      setMessage('Minting failed. Check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- FUNCTION TO FETCH YOUR DREAMS (PRIVATE) ---
  const fetchMyDreams = async (userAccount = account) => {
      if (!userAccount) return;
      setIsFetching(true);
      setMyDreams([]); 
      setMessage("Searching your transaction history for dreams...");
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);
          const filter = contract.filters.Transfer(null, userAccount);
          const events = await contract.queryFilter(filter, 0, 'latest');

          if (events.length === 0) {
              setMessage("Could not find any dreams minted to this wallet.");
              setIsFetching(false);
              return;
          }

          const dreamsPromises = events.map(async (event) => {
              const tokenId = event.args.tokenId.toString();
              try {
                  const tokenURI = await contract.tokenURI(tokenId);
                  const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                  const metadataResponse = await axios.get(metadataUrl);
                  if (metadataResponse.data && metadataResponse.data.description) {
                    return { id: tokenId, name: metadataResponse.data.name, description: metadataResponse.data.description };
                  }
              } catch (e) { return null; }
          });

          const dreams = (await Promise.all(dreamsPromises)).filter(d => d !== null);
          setMyDreams(dreams);
          setMessage(dreams.length > 0 ? `Found ${dreams.length} dream(s)!` : "Could not load dream data.");
      } catch (error) {
          console.error("Failed to fetch dreams:", error);
          setMessage("An error occurred while fetching dreams.");
      } finally {
          setIsFetching(false);
      }
  };

  // --- FUNCTION TO FETCH ALL DREAMS (PUBLIC) ---
  const fetchAllDreams = async () => {
      setIsFetchingAll(true);
      setAllDreams([]);
      setMessage("Searching the blockchain for all dreams...");
      try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const contract = new ethers.Contract(contractAddress, contractABI, provider);
          
          const filter = contract.filters.Transfer(ethers.ZeroAddress, null);
          const events = await contract.queryFilter(filter, 0, 'latest');

          if (events.length === 0) {
              setMessage("No dreams have been minted on this contract yet.");
              setIsFetchingAll(false);
              return;
          }

          const dreamsPromises = events.map(async (event) => {
              const tokenId = event.args.tokenId.toString();
              const owner = event.args.to;
              try {
                  const tokenURI = await contract.tokenURI(tokenId);
                  const metadataUrl = tokenURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
                  const metadataResponse = await axios.get(metadataUrl);
                  if (metadataResponse.data && metadataResponse.data.description) {
                    return { id: tokenId, name: metadataResponse.data.name, description: metadataResponse.data.description, owner: owner };
                  }
              } catch (e) { return null; }
          });

          const dreams = (await Promise.all(dreamsPromises)).filter(d => d !== null);
          setAllDreams(dreams);
          setMessage(dreams.length > 0 ? `Found ${dreams.length} total dream(s)!` : "Could not load any dream data.");

      } catch (error) {
          console.error("Failed to fetch all dreams:", error);
          setMessage("An error occurred while fetching all dreams.");
      } finally {
          setIsFetchingAll(false);
      }
  };

return (
	<div className="min-h-screen bg-[#13110C] text-white">
		{/* Header */}
		<header className="bg-[#FFC700] py-4 px-8 flex justify-between items-center shadow-md">
			<h1 className="text-3xl font-bold text-black tracking-tight">Dream Chain</h1>
			{account ? (
				<div className="text-sm font-semibold text-black bg-[#FFF7D3] px-4 py-2 rounded-md shadow">
					Connected: {`${account.substring(0, 6)}...${account.substring(account.length - 4)}`}
				</div>
			) : (
				<button
					onClick={connectWallet}
					className="font-semibold py-2 px-6 rounded-md transition-all duration-200 text-[#242428] bg-gradient-to-r from-[#FFF7D3] to-[#C8C3AE] hover:from-[#C8C3AE] hover:to-[#FFF7D3] shadow"
				>
					Connect
				</button>
			)}
		</header>

		<div className="p-8">
			{/* Tabs for My Dreams / Others' Dreams */}
			<div className="flex space-x-4 mb-8">
				<button
					onClick={() => {
						setView('my');
						fetchMyDreams();
					}}
					className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 border-2 ${
						view === 'my'
							? 'bg-transparent border-[#00bfff] text-[#00bfff]'
							: 'bg-[#242428] border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
					}`}
				>
					My Dreams
				</button>
				<button
					onClick={() => {
						setView('others');
						fetchAllDreams();
					}}
					className={`flex-1 py-3 px-6 rounded-md font-semibold transition-all duration-200 border-2 ${
						view === 'others'
							? 'bg-transparent border-[#e94560] text-[#e94560]'
							: 'bg-[#242428] border-transparent text-gray-400 hover:text-white hover:bg-gray-700'
					}`}
				>
					Others' Dreams
				</button>
			</div>

			{/* Display Dreams based on view state */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
				{view === 'my' ? (
					myDreams.length > 0 ? (
						myDreams.map((dream) => (
							<div key={dream.id} className="bg-[#242428] rounded-md p-6 border-l-4 border-[#00bfff]">
								<h3 className="text-xl font-bold text-white mb-2">{dream.name}</h3>
								<p className="text-gray-400">{dream.description}</p>
							</div>
						))
					) : (
						<p className="text-gray-400 col-span-full text-center">
							{isFetching ? 'Fetching your dreams...' : account ? 'You have not minted any dreams yet.' : 'Please connect your wallet to see your dreams.'}
						</p>
					)
				) : (
					allDreams.length > 0 ? (
						allDreams.map((dream) => (
							<div key={dream.id} className="bg-[#242428] rounded-md p-6 border-l-4 border-[#e94560]">
								<h3 className="text-xl font-bold text-white mb-2">{dream.name}</h3>
								<p className="text-gray-400">{dream.description}</p>
								<p className="text-sm text-gray-500 mt-2">By: {`${dream.owner.substring(0, 6)}...${dream.owner.substring(dream.owner.length - 4)}`}</p>
							</div>
						))
					) : (
						<p className="text-gray-400 col-span-full text-center">
							{isFetchingAll ? 'Fetching all dreams...' : 'No public dreams found yet.'}
						</p>
					)
				)}
			</div>

			{/* Minting Section */}
			<div className="bg-[#242428] p-8 rounded-lg">
				<h2 className="text-3xl font-semibold mb-2">What's your Dream Today?</h2>
				<p className="text-gray-400 mb-6">Immortalize your dreams on Dream Chain</p>

				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Title"
					className="w-full p-3 bg-black border border-gray-600 rounded-md mb-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#FFC700]"
					disabled={!account || isLoading}
				/>
				<textarea
					value={dream}
					onChange={(e) => setDream(e.target.value)}
					placeholder="Description"
					rows="5"
					className="w-full p-3 bg-black border border-gray-600 rounded-md mb-6 text-white placeholder-gray-500 resize-y focus:outline-none focus:border-[#FFC700]"
					disabled={!account || isLoading}
				/>

				<button
					onClick={mintDreamNFT}
					disabled={!account || isLoading}
					className="w-full font-bold py-3 rounded-md text-lg transition-transform duration-200 hover:scale-105 disabled:bg-gray-500 disabled:cursor-not-allowed bg-gradient-to-r from-[#FFD000] to-[#FF8800] hover:from-[#FF8800] hover:to-[#FFD000]"
				>
					{isLoading ? 'Processing...' : 'Go'}
				</button>

				<p className="mt-4 text-sm text-gray-400 min-h-[20px] text-center">{message}</p>
			</div>
		</div>
	</div>
);
}

export default App;