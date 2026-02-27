// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NftMarket is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

        struct NftItem {
        uint tokenId;
        uint price;
        address creator;
        bool isListed;
    }

uint public listingPrice = 0.025 ether;

    
    Counters.Counter private _listedItems;
    Counters.Counter private _tokenIds;

    
    
    mapping(string => bool) private _useTokenURIs;
    mapping(uint => NftItem) private _idToNftItem;

    mapping(address => mapping(uint => uint)) private _ownedTokens;
    mapping(uint => uint) private _idToOwnIndex;

    uint256[] private _allNfts;
    mapping (uint => uint) private _idToNfIndex;

    


   event NftItemCreated (
        uint tokenId,
        uint price,
        address creator,
        bool isListed
   );

    constructor() ERC721("Creatures NFT", "CNFT") {}

    function setListingPrice(uint newPrice) external onlyOwner {
        require(newPrice > 0, "Price must be at least 0.001 ether");
        listingPrice = newPrice;
    }

    function getNftItem(uint tokenId) public view returns (NftItem memory) {
    return _idToNftItem[tokenId];
}

function listedItemsCount() public view returns (uint) {
    return _listedItems.current();
}

function tokenURIExists(string memory tokenURI) public view returns (bool) {
    return _useTokenURIs[tokenURI] == true;    // Check if the token URI has been used
}

function totalSupply() public view returns (uint) {
    return _allNfts.length;
}

function tokenByIndex(uint index) public view returns (uint) {
    require(index < totalSupply(), "Index out of bounds");
    return _allNfts[index];
}

function tokenofOwnerByIndex( address owner, uint index) public view returns (uint) {
    require(index < ERC721.balanceOf(owner), "Index out of bounds");
    return _ownedTokens[owner][index];
}

function getAllNftsOnSale() public view returns (NftItem[] memory) {
    uint allItemCount = totalSupply();
    uint currentIndex = 0;
    NftItem[] memory items = new NftItem[](_listedItems.current());

    for (uint i = 0; i < allItemCount; i++) {
        uint tokenId = tokenByIndex(i);
        NftItem storage item = _idToNftItem[tokenId];

        if (item.isListed) {
            items[currentIndex] = item;
            currentIndex += 1;
        }
    }
    return items;
}


function getOwnedNfts() public view returns (NftItem[] memory) {
    uint ownedItemsCount = ERC721.balanceOf(msg.sender);
    NftItem[] memory items = new NftItem[](ownedItemsCount);

    for (uint i = 0; i < ownedItemsCount; i++) {
        uint tokenId = tokenofOwnerByIndex(msg.sender, i);
        NftItem storage item = _idToNftItem[tokenId];
        items[i] = item;
    }
    return items;
}


function mintToken(string memory tokenURI, uint price) public payable returns (uint) {
    require(!tokenURIExists(tokenURI), "Token URI already exists");
    require(msg.value == listingPrice, "Price must be equal to listing price");

        _tokenIds.increment();
        _listedItems.increment();


        uint newTokenId = _tokenIds.current();

        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        _createNftItem(newTokenId, price);
        _useTokenURIs[tokenURI] = true;

        return newTokenId;
}
function buyNft(
    uint tokenId
) public payable {
    uint price = _idToNftItem[tokenId].price;
    address owner = ERC721.ownerOf(tokenId);

    require(msg.sender != owner , "You are the owner of the NFT");
    require(msg.value == price, "Please submit the asking price");

    _idToNftItem[tokenId].isListed = false;
    _listedItems.decrement();
    
    _transfer(owner, msg.sender, tokenId);
    payable(owner).transfer(msg.value);
}

function placeNftOnSale(uint tokenId, uint newPrice) public payable {
    require(ERC721.ownerOf(tokenId) == msg.sender, "You are not the owner of the NFT");
    require(_idToNftItem[tokenId].isListed == false, "NFT is already on sale");
    require(msg.value == listingPrice, "Price must be equal to listing price");

    _idToNftItem[tokenId].isListed = true;
    _idToNftItem[tokenId].price = newPrice;
    _listedItems.increment();
}

function updateNftPrice(uint tokenId, uint newPrice) public {
    require(ERC721.ownerOf(tokenId) == msg.sender, "You are not the owner of the NFT");
    require(_idToNftItem[tokenId].isListed == true, "NFT is not listed");
    require(newPrice > 0, "Price must be greater than 0");
    _idToNftItem[tokenId].price = newPrice;
}

function _createNftItem(
    uint tokenId,
    uint price
) private {
    require(price > 0, "Price must be greater than 0");

    _idToNftItem[tokenId] = NftItem(
        tokenId, 
        price, 
        msg.sender, 
        true
        );

    emit NftItemCreated(tokenId, price, msg.sender, true);
}

function _beforeTokenTransfer(
    address from, 
    address to, 
    uint256 firstTokenId,
    uint256 batchSize
    ) internal virtual override {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

    // minting token
    if (from == address(0)) {
        _addTokenToAllTokensEnumeration(firstTokenId);
    }
    else if (from != to) {
        _removeTokenFromOwnerEnumeration(from, firstTokenId);
    }
    if (to == address(0)) {
        _removeTokenFromAllTokensEnumeration(firstTokenId);
    }
    else if (to != from) {
        _addTokenToOwnerEnumeration(to, firstTokenId);
    }
}

function _addTokenToAllTokensEnumeration(uint tokenId) private {
    _idToNfIndex[tokenId] = _allNfts.length;
    _allNfts.push(tokenId);
}

function _addTokenToOwnerEnumeration(address to, uint tokenId) private {
    uint length = ERC721.balanceOf(to);
    _ownedTokens[to][length] = tokenId;
    _idToOwnIndex[tokenId] = length;
}

function _removeTokenFromOwnerEnumeration(address from, uint tokenId) private {
    uint lastTokenIndex = ERC721.balanceOf(from) - 1;
    uint tokenIndex = _idToOwnIndex[tokenId];

    if (tokenIndex != lastTokenIndex) {
        uint lastTokenId = _ownedTokens[from][lastTokenIndex];
        _ownedTokens[from][tokenIndex] = lastTokenId;
        _idToOwnIndex[lastTokenId] = tokenIndex;
    }
    delete _idToOwnIndex[tokenId];
    delete _ownedTokens[from][lastTokenIndex];
}

function _removeTokenFromAllTokensEnumeration(uint tokenId) private {
    uint lastTokenIndex = _allNfts.length - 1;
    uint tokenIndex = _idToNfIndex[tokenId];
    uint lastTokenId = _allNfts[lastTokenIndex];

    _allNfts[tokenIndex] = lastTokenId;
    _idToNfIndex[lastTokenId] = tokenIndex;
    
    delete _idToNfIndex[tokenId];
    _allNfts.pop();
}

}
