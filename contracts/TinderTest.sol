// SPDX-License-Identifier: MIT
pragma solidity >0.8.0;

// 1. Register the user
// 2. Matching: swipe righ/left
// 3. Messaging: send messages to matches

contract Tinder {
    struct Users {
        string name;
        string city;
        Gender gender;
        uint age;
        string picUrl;
    }
    enum Gender {
        MALE,
        FEMALE
    }

    mapping(address => Users) private users;
    mapping(bytes32 => mapping(uint => address[])) private userIdsbyCity;

    function register(
        uint _age,
        Gender _gender,
        string calldata _name,
        string calldata _city,
        string calldata _picUrl
    ) external {
        require(users[msg.sender].age == 0, "already exists");
        require(_age > 17, "you must at the age");
        require(!notEmptyString(_name), "name is empty");
        require(!notEmptyString(_city), "city is empty");
        require(!notEmptyString(_picUrl), "city is empty");

        users[msg.sender] = Users(_name, _city, _gender, _age, _picUrl);
        userIdsbyCity[keccak256(abi.encodePacked(_city))][uint(_gender)].push(
            msg.sender
        );
    }

    function notEmptyString(string memory _str) internal pure returns (bool) {
        bytes memory str = bytes(_str);
        return str.length == 0;
    }
}
