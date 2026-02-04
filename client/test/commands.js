

const instance = await NftMarket.deployed();

instance.mintToken("https://azure-absolute-snake-340.mypinata.cloud/ipfs/bafkreigpqfmp5j74wayt462cnzx6bykpwjj46coiy5kbpiq7nsg6yihevm","500000000000000000", {value: "25000000000000000",from: accounts[0]})

instance.mintToken("https://azure-absolute-snake-340.mypinata.cloud/ipfs/bafkreie6cnd5g26xnddd77cciqc6cpb5wx45jiad76ysy3p6jjjtbsuiz4","300000000000000000", {value: "25000000000000000",from: accounts[0]});