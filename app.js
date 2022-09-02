import abi from "./abi.js";
import openTab from "./tab.js";
const { ethers: etherjs } = ethers;

const rpcUrl = "https://goerli.infura.io/v3/ba80361523fe423bb149026a490266f0";
const signerProvider = new etherjs.providers.Web3Provider(window.ethereum);

const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);

const signer = signerProvider.getSigner();
const tokenAddress = "0xC770d227Eb937D7D3A327e68180772571C24525F";

const useContract = (address = tokenAddress,contractAbi = abi, isSigner = false) => {
  const providerSigner = new etherjs.providers.Web3Provider(window.ethereum);
  const signer = providerSigner.getSigner();
  const provider = new etherjs.providers.JsonRpcProvider(rpcUrl);
  const newProvider = isSigner ? signer : provider;
  return new etherjs.Contract(address, contractAbi, newProvider);
};

// view functions
// new ethers.Contract(address, abi, provider)

//state  mutating functions
// new ethers.Contract(address, abi, signer)

const connectWallet = async () => {
  await signerProvider.send("eth_requestAccounts");
  await getUserWallet();
};

const getUserWallet = async () => {
  let userAddress = await signer.getAddress();
  //   connectedWallet = userAddress;
  updateUserAddress(userAddress);
  return userAddress;
  //   console.log(connectedWallet, "connected wallet");
};

export default {
  openTab,
};

// elements
// const button = document.getElementById("connectBtn");
// const userAddress = document.getElementById("userAddress");

// Event Listeners
connectBtn.addEventListener("click", connectWallet);

function updateUserAddress(address) {
  userAddress.innerText = address;
}

function tokenTemplateUpdate(name, symbol, totalSupply, balance) {
  return `<div class="flex justify-between items-center">
    <div>
        <div class="flex items-center">
            <div class="p-2 token-thumbnail w-10 h-10"> 
                <img src="https://bafybeiekvvr4iu4bqxm6de5tzxa3yfwqptmsg3ixpjr4edk5rkp3ddadaq.ipfs.dweb.link/" alt="token-img" />  </div>
            <div>
                <p class="font-semibold">${name} - ${symbol} </p>
                <p>Total Supply:${totalSupply}</p>
            </div>
        </div>
    </div>
    <div>${balance}</div>
</div>`;
}

let addresses = [
  '0xE441700EA7C787CE3910D78fB628704B52126a48',
  '0x3385F102B08523E492b933FaA1d3246Afa670C0a',
  '0x4c45AD2879B163DCfF3a76f27EDeBFAf8b6F5413',
  '0xcF7828A211336bD3304097c8C531Fd327898b036',
  '0x0D0AEDB0B20e7851D7A1BEcC0463738eb7c64cE0'
]


// async function getTokenDetails() {
//   loader.innerText = "Loading...";
//   for(var i =0; i <addresses.length; i++){
//     const token = await useContract(addresses[i], abi);
//     try {
//       const [name, symbol, totalSupply, balance] = await Promise.all([
//         token.name(),
//         token.symbol(),
//         token.totalSupply(),
//         token.balanceOf(await getUserWallet())
//       ]);
//       console.log(name, symbol, totalSupply, balance);
//       return { name, symbol, totalSupply: Number(totalSupply), balance };
//     } catch (error) {
//       errored.innerText = "Error Occurred!";
//       console.log("error occurred", error);
//     } finally {
//       loader.innerText = "";
//     }
//   }

// }

async function getTokenDetails(addr, ab) {
  const token = await useContract(addr, ab);
      const [name, symbol, totalSupply, balance] = await Promise.all([
      token.name(),
      token.symbol(),
      token.totalSupply(),
      token.balanceOf(await getUserWallet())
    ]);

    console.log(name, symbol, totalSupply, balance);
    return { name, symbol, totalSupply: Number(totalSupply), balance };
}

for(var i =0; i <addresses.length; i++){
  await getTokenDetails(addresses[i], abi);

}


async function InitData() {
  for(var i =0; i <addresses.length; i++){
  const { name, symbol, totalSupply, balance } = await getTokenDetails(addresses[i], abi);
  const template = tokenTemplateUpdate(name, symbol, totalSupply / 10 ** 18, etherjs.utils.formatUnits(balance));
  token.innerHTML += template;
  }

}

InitData();


/***
 * @amt - Number
 * @receiver - string
 **/
async function sendToken(address, amt) {
  const contract = useContract(addresses[i], abi, true);

  const decimal = await getDecimals();
  const parseUnit = new etherjs.utils.parseUnits(amt, decimal);

  const txn = await contract.transfer(address, parseUnit);

  console.log(txn, "transaction pending....");
  sendTransaction.innerText = "Sending";
  window.alert(`transaction pending....`);
  const confirm = await txn.wait();
  console.log("transaction ends", confirm);
  window.alert(`${amt} CLT sent to ${address}`);
  sendTransaction.innerText = "Send";
}

async function getDecimals() {
  return await useContract().decimals();
}

sendTransaction.addEventListener("click", async () => {
  const amount = amt.value;
  const receiverAddress = receiver.value;
  console.log(amount, receiverAddress);

  await sendToken(receiver.value, amt.value);
});
