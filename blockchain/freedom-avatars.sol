// SPDX-License-Identifier: GNU AFFERO GENERAL PUBLIC LICENSE Version 3

pragma solidity 0.8.19;
import "https://raw.githubusercontent.com/OpenZeppelin/openzeppelin-contracts/v4.9.4/contracts/token/ERC20/IERC20.sol";
import "https://github.com/monique-baumann/freedom-cash/blob/v1.3.0/blockchain/freedom-cash-interface.sol";

contract FreedomAvatars {

    uint256 public avatarCounter;
    mapping(uint256 => IAvatar) public avatars;
    struct IAvatar {
        address from;
        bytes32 name;
		string description;
        string linkToImage;
        uint256 donationsReceived;
        uint256 donationsClaimed; 
        uint256 timestamp;
    }
    address public freedomCashSmartContract = 0xa1e7bB978a28A30B34995c57d5ba0B778E90033B;
    error ReferenceSeemsUnintended();
    error NothingToClaimATM();
    function create(bytes32 name, string memory description, string memory linkToImage) public {
        avatarCounter++;
        IAvatar memory newAvatar = IAvatar(msg.sender, name, description, linkToImage, 0,0, block.timestamp);
        avatars[avatarCounter] = newAvatar;
    }
    function appreciateAvatar(uint256 avatarID, uint256 donationAmountFC, uint256 fCBuyPrice) public payable {
        if(avatarID > avatarCounter) { revert ReferenceSeemsUnintended(); }        
        IFreedomCash(freedomCashSmartContract).buyFreedomCash{value: msg.value}(donationAmountFC, fCBuyPrice);
		avatars[avatarID].donationsReceived += donationAmountFC;
    }
    function claimDonations() public {
        uint256 sum;
        for (uint256 i = 1; i <= avatarCounter; i++) {
            if (msg.sender == avatars[i].from) { 
                uint256 claimable =  avatars[i].donationsReceived -  avatars[i].donationsClaimed;
                avatars[i].donationsClaimed += claimable;
                sum += claimable;
            }
        }
        if (sum == 0) { revert NothingToClaimATM(); }
        IERC20(freedomCashSmartContract).transfer(msg.sender, sum);
    }
}