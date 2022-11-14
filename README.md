# AimBridge

AimBridge is a proof of concept for a EVM token-bridge developed that uses OpenZeppelin Defender in order to manage the transactions between two networks.



## Features

- Transfer tokens from source network to target network, by generating a new Wrapper Token in the target network.
- Reverse the wrapping process, by burning the warpped token in the source network and releasing locked tokens in the target network.
- Display history of user's transactions using *The Graph* .
- Streamline the `minting/releasing` process by implementing `OpenZeppelin Defender`, to provide a smoother and easier UX. (This is highly experimental and not suggested in production).


## How it works
The bridge is has three important components:

- the `UI` that manages all of the user's interactions and provides an easy and smooth UX.
- The `Smart contracts` which are the backbone of all transactions.
- `OpenZeppelin Defender` which are a very important component in this project, and what makes the UX much better.