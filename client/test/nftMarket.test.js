const NftMarket = artifacts.require("NftMarket");
const { ethers } = require("ethers");

contract("NftMarket", accounts => {
    let _contract = null;
    let _nftPrice = ethers.parseEther("0.3").toString();
    let _listingPrice = ethers.parseEther("0.025").toString();
    
    before(async () => {
        _contract = await NftMarket.deployed();
    });

    describe("Mint token", () => {
        const tokenURI = "https://example.com/token/1";
        
        before(async () => {
            await _contract.mintToken(tokenURI, _nftPrice, {
                from: accounts[0],
                value: _listingPrice,
            });
        });

        it("owner of first token should be the address [0]", async () => {
            const owner = await _contract.ownerOf(1);
            assert.equal(owner, accounts[0], "Owner of token is not matching address [0]");
        });

        it("first token should point to the correct tokenURI", async () => {
            const actualTokenURI = await _contract.tokenURI(1);
            assert.equal(actualTokenURI, tokenURI, "Token URI is not matching the correct URI");
        });

        it("should not be possible to create a NFT with used tokenURI", async () => {
            try {
                await _contract.mintToken(tokenURI, _nftPrice, {
                    from: accounts[0],
                    value: _listingPrice,
                });
                assert.fail("NFT was minted with previously used tokenURI");
            } catch (error) {
                assert(error.message.includes("Token URI already exists"), "Error message should contain 'Token URI already exists'");
            }
        });

        it("should have one listed item", async () => {
            const listedItemCount = await _contract.listedItemsCount();
            assert.equal(listedItemCount.toNumber(), 1, "Listed item count is not 1");
        });

        it("should have create NFT item", async () => {
            const nftItem = await _contract.getNftItem(1);

            assert.equal(nftItem.tokenId, 1, "Token id is not 1");
            assert.equal(nftItem.price, _nftPrice, "Price is not 0.3");
            assert.equal(nftItem.creator, accounts[0], "Creator is not the address [0]");
            assert.equal(nftItem.isListed, true, "Is listed is not true");
        });

        // NESTED: Buy NFT tests run AFTER mint tests
        describe("Buy NFT", () => {
            before(async () => {
                await _contract.buyNft(1, {
                    from: accounts[1],
                    value: _nftPrice,
                });
            });

            it("should unlist the item", async () => {
                const listedItem = await _contract.getNftItem(1);
                assert.equal(listedItem.isListed, false, "NFT is still listed");
            });

            it("should decrease the listed item count", async () => {
                const listedItemCount = await _contract.listedItemsCount();
                assert.equal(listedItemCount.toNumber(), 0, "Listed has not been decreased");
            });

            it("should transfer ownership to buyer", async () => {
                const owner = await _contract.ownerOf(1);
                assert.equal(owner, accounts[1], "Owner should be accounts[1]");
            });

            });

            describe("Mint Token", () => {
                const tokenURI2 = "https://example.com/token/2";
                before(async () => {
                    await _contract.mintToken(tokenURI2, _nftPrice, {
                        from: accounts[0],
                        value: _listingPrice,
                    });
                })

                it("should have two NFTs created", async () => {
                    const totalSupply = await _contract.totalSupply();
                    assert.equal(totalSupply.toNumber(), 2, "Total supply of token is not correct");
                });

                it("should be able to retrieve the token by index", async () => {
                    const nftId1 = await _contract.tokenByIndex(0);
                    const nftId2 = await _contract.tokenByIndex(1);

                    assert.equal(nftId1.toNumber(), 1, "Token id is not correct");
                    assert.equal(nftId2.toNumber(), 2, "Token id is not correct");
                });

                it("should have one listed NFT", async () => {
                    const allNfts = await _contract.getAllNftsOnSale();
                    assert.equal(allNfts[0].tokenId, 2, "NFT should be listed");
                });

                it("account[1] should have one owned NFT", async () => {
                    const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
                    assert.equal(ownedNfts[0].tokenId, 1, "NFT has a wrong id");
                });

                it("account[0] should have one owned NFT", async () => {
                    const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
                    assert.equal(ownedNfts[0].tokenId, 2, "NFT has a wrong id");
                });
                
        });
    });

    describe("Token transfer to new owner", () => {
        before(async () => {
            await _contract.transferFrom(
                accounts[0], 
                accounts[1], 
                2
            );
        });

        it("accounts[0] should have own 0 tokens", async () => {
            const ownedNfts = await _contract.getOwnedNfts({from: accounts[0]});
            assert.equal(ownedNfts.length, 0, "Invalid length of tokens");
        });
        it("accounts[1] should have own 2 tokens", async () => {
            const ownedNfts = await _contract.getOwnedNfts({from: accounts[1]});
            assert.equal(ownedNfts.length, 2, "Invalid length of tokens");
        });
    });

    describe("List an Nft", () => {
        before(async () => {
            await _contract.placeNftOnSale(
                1,
                _nftPrice,
                {
                    from: accounts[1],
                    value: _listingPrice,
                }
            );
        });

        it("should have two listed Items", async () => {
            const listedNfts = await _contract.getAllNftsOnSale();
            
            assert.equal(listedNfts.length, 2, "Invalid length of Nfts");
        });

        it("should set new listing price", async () => {
            await _contract
            .setListingPrice(_listingPrice, {from: accounts[0]});
            const listingPrice = await _contract.listingPrice();
            assert.equal(listingPrice.toString(), _listingPrice, "Listing price");
        });
        
    });

   
});