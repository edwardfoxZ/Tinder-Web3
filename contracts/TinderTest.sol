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
    struct SwipeCount {
        uint start;
        uint count;
    }
    enum Gender {
        FEMALE,
        MALE
    }
    enum SwipeStatus {
        UNKNOWN,
        LIKE,
        DISLIKE
    }

    mapping(address => Users) private users;
    mapping(bytes32 => mapping(uint => address[])) private userIdsbyCity;
    mapping(address => mapping(address => SwipeStatus)) private swipes;
    mapping(address => SwipeCount) private swipesCount;

    event Swiped(address indexed from, address indexed to, SwipeStatus status);
    event Matched(address indexed from, address indexed to);
    event sendMessage(address indexed from, address indexed to, string content);

    function register(
        uint _age,
        Gender _gender,
        string calldata _name,
        string calldata _city,
        string calldata _picUrl
    ) external {
        require(users[msg.sender].age == 0, "already exists");
        require(_age > 17, "you must at the age");
        require(notEmptyString(_name), "name is empty");
        require(notEmptyString(_city), "city is empty");
        require(notEmptyString(_picUrl), "city is empty");

        bytes32 _hashCity = keccak256(abi.encodePacked(_city));
        address[] storage cityUsers = userIdsbyCity[_hashCity][uint(_gender)];
        for (uint i = 0; i < cityUsers.length; i++) {
            require(
                cityUsers[i] != msg.sender,
                "User already registered in this city"
            );
        }
        users[msg.sender] = Users(_name, _city, _gender, _age, _picUrl);
        cityUsers.push(msg.sender);
    }

    function getMatchableUsers(
        address _userId,
        uint offset,
        uint limit
    )
        external
        view
        userExists(_userId)
        userExists(msg.sender)
        returns (Users[] memory)
    {
        Users storage user = users[_userId];
        uint oppositeGender = user.gender == Gender.MALE ? 0 : 1;
        bytes32 _hashCity = keccak256(abi.encodePacked(user.city));
        address[] storage userIds = userIdsbyCity[_hashCity][oppositeGender];

        uint matchableUserCount;
        uint startIndex = offset;
        uint endIndex = offset + limit > userIds.length
            ? userIds.length
            : offset + limit;

        Users[] memory _users = new Users[](endIndex - startIndex);

        for (uint i = startIndex; i < endIndex; i++) {
            address userId = userIds[i];
            if (swipes[msg.sender][userId] == SwipeStatus.UNKNOWN) {
                _users[matchableUserCount] = users[userId];
                matchableUserCount++;
            }
        }

        return _users;
    }

    function swipe(
        address _userId,
        SwipeStatus _status
    ) external userExists(_userId) userExists(msg.sender) {
        require(
            swipes[msg.sender][_userId] == SwipeStatus.UNKNOWN,
            "you cannot swipe a person twice"
        );
        swipes[msg.sender][_userId] = _status;

        if (
            _status == SwipeStatus.LIKE &&
            swipes[_userId][msg.sender] == SwipeStatus.LIKE
        ) {
            emit Matched(msg.sender, _userId);
        }
        SwipeCount storage _swipesCount = swipesCount[msg.sender];

        if (block.timestamp > _swipesCount.start + 1 days) {
            _swipesCount.start = block.timestamp;
            _swipesCount.count = 100;
        }
        require(_swipesCount.count > 0, "Daily swipe limits reached");
        _swipesCount.count--;

        emit Swiped(msg.sender, _userId, _status);
    }

    function message(
        address _userId,
        string calldata _content
    ) external userExists(_userId) {
        require(
            swipes[msg.sender][_userId] == SwipeStatus.LIKE &&
                swipes[_userId][msg.sender] == SwipeStatus.LIKE,
            "Messaging allowed only between mutual matches"
        );
        emit sendMessage(msg.sender, _userId, _content);
    }

    function getUser(address _user) external view returns (Users memory) {
        require(users[_user].age > 0, "User does not exist");
        return users[_user];
    }

    function getSwipeStatus(
        address _from,
        address _to
    ) external view returns (SwipeStatus) {
        return swipes[_from][_to];
    }

    function notEmptyString(string memory _str) internal pure returns (bool) {
        bytes memory str = bytes(_str);
        return str.length != 0;
    }

    modifier userExists(address _userId) {
        require(users[_userId].age > 0, "no users exist");
        _;
    }
}
