// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NftMarket is ERC721URIStorage {
    constructor() ERC721("Creatures NFT", "CNFT") {}
}

// Creates NFTs for products
// Stores ownership on blockchain
// Supports NFT resale and verification
