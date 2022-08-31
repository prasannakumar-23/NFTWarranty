// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;




import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IRetailer.sol";


contract Warranty is ERC721Enumerable,Ownable{

    string _baseTokenURI;
    address Owner;
    bool public _paused;
    IRetailer retailer;
    mapping(uint256=>address) isRetailer;
    mapping(address=>bool) isRepairer;
    event _aproove(address indexed _repairer,address indexed _user,uint256 indexed tokenId,string  req);
    event _req(address indexed _user,address indexed _repairer,uint256 indexed tokenId,string  req);

    modifier onlyWhenNotPaused{
        require(!_paused,"Contract currently paused");
        _;
    }
    
    constructor(string memory baseURI,address retailerContract)ERC721("warrantyCards","WC"){
        _baseTokenURI = baseURI;
         retailer = IRetailer(retailerContract);
         Owner=msg.sender;
    }
    
    function _baseURI() internal view override returns (string memory) {
        
        return _baseTokenURI;
    }

  

    function baseTokenURI() public view returns (string memory) {
     return _baseTokenURI;
    }

    

    function setPaused(bool val) public onlyOwner{
        _paused=val;
    }
   
    function setRepairer(address _repairer) public{
        require(retailer.whitelistedAddresses(msg.sender),"You have no right to assign authority");
        isRepairer[_repairer]=true;
    }


    function mint(uint256 tokenIds) public payable onlyWhenNotPaused{
        require(retailer.whitelistedAddresses(msg.sender), "You are not retailer or owner");
        _safeMint(msg.sender, tokenIds);
        isRetailer[tokenIds]=msg.sender;
        isRepairer[msg.sender]=true;
    }

    function transfer(address from,address to,uint256 tokenId) public{
        safeTransferFrom(from, to, tokenId);
    }

     function burn(uint256 tokenId,address from) public{
        require(((from==Owner)||isRetailer[tokenId]==from), "You have no right to burn the nft");
        _burn(tokenId);
    }

     function aproove(address  _user,address from,uint256 tokenId,string memory _request) public{
        require(isRepairer[from], "You have no right to Approve");
         emit _aproove(msg.sender,_user,tokenId,_request);
     }

      function request(address _repairer,uint256 tokenId,string memory  _request) public {
         require(ownerOf(tokenId)==msg.sender,"You cant send a request");
         require(isRepairer[_repairer],"You can't send a request to this address");
         emit _req(msg.sender,_repairer,tokenId,_request);
      }


    receive() external payable{}

    fallback() external payable{}

    

}