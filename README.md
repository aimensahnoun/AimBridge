
# AimBridge

AimBridge is a proof of concept for a EVM token-bridge developed that uses OpenZeppelin Defender in order to manage the transactions between two networks.



## Features

- Transfer tokens from source network to target network, by generating a new Wrapper Token in the target network.
- Reverse the wrapping process, by burning the warpped token in the source network and releasing locked tokens in the target network.
- Display history of user's transactions using *The Graph* .
- Streamline the `minting/releasing` process by implementing `OpenZeppelin Defender`, to provide a smoother and easier UX. (This is highly experimental and not suggested in production).


## How it works
The bridge is has three important components:

- the [`UI`](https://www.aimbridge.xyz) that manages all of the user's interactions and provides an easy and smooth UX.
- The [`Smart contracts`](https://github.com/aimensahnoun/EVM-Bridge-hh) which are the backbone of all transactions.
- [`OpenZeppelin Defender`](https://www.openzeppelin.com/defender) which are a very important component in this project, and what makes the UX much better.

### Architecture 
![AimBridge Architecture](https://user-images.githubusercontent.com/62159014/201778084-b7bd232b-9522-4dd5-b138-8cde02baca6c.png)

This is a simplified version of how the whole system works.

The application detects all of the `ERC20` tokens a users has, and allows them to select any of them to bridge to the target network.

After the users select their token, the amount is then transfered from the user's address into the bridge's address and locked there.

Once this process is complete, a `webhook` using `OpenZeppelin AutoTask` is called with the needed data in order to start the `minting`in the target network.

This is done in order to ensure the transaction on target network is executed automatically, without the user needing to switch networks or claim later on.

Here's is a flowchart that explains the same details:
![FlowChart](https://user-images.githubusercontent.com/62159014/201779496-f57e9d34-62f9-4fb3-89c1-b90e8dffa71c.png)

## Security

While `OpenZeppelin AutoTask` and `OpenZeppelin Relayer` help streamline the process, there are many security issues that arise.

- Can anyone call the `miniting` and `releasing` methods ?
- How to avoid showing the `webhook` url to users ?
- How to secure a successful transaction against `replay attacks` ?

### Roles
In order to solve the first issue, `Roles` were implemented into the bridge smart contracts, which makes `OpenZeppelin Relayer`s perfect for this.

By giving the `Relayer` account a role that allows them and only them to call the methods, we prevent regular users from causing issues.
And since the relayes `keys`are injected automatically into the `OpenZeppelin AutoTask` this makes it easier.

### NextJS API Route
In order to avoid the `WebHook` from being overwhelmed or attacked, it the `POST` request is abstracted by a `NextJS` api route.
The route is the only way to communicate with the `WebHook`.

And the route is also secure with a secret key, any request to that route would fail unless the key is provided.

### Replay attacks
Replay attacks are the biggest threat to this architecture, a `Replay Attack` is when an attacker intercepts a communication, in our case the `webhook` call and delays it or repeat the successful transaction again.

It is apparent that if an attacker can repeat a successful transaction again, one could `mine` unlimited amount of the same token over and over again, or `release` the total balance of the bridge contract.

In order to avoid that a security mesure has been put in place.

`timestamp + hash`:

Any transaction sent to the webhook would consist of three things,

- `Timestamp` : a `UNIX` timestamp of when the transaction has been started by the front-end
- `Data` : the data needed to be sent to the `webhook` in order for it to carry out the command properly.
- `Hash` : this is a hash generated using a private key, its a combination of the previously mentioned `timestamp` and `data` ( `h(timestamp+data)` ).

Once the `POST` request is sent to the `webhook`, if first checks the time passed from the `timestamp` it received and the current `timestamp`. If the difference between the two is bigger than a certain interval the request is automatically rejected.

ex: `timestamp-webhook - timestamp-front-end > 5 minutes { reject }`

This is just an example and not how the actual thing is coded.

Next, the webhook generates a `hash` using the same private key as the front-end, if the newly generated `hash` is the same with the one sent by the front-end it means the data has not been tampered with.

ex : `5a6b9c05466f6826530c379c2d1ad87b === 5a6b9c05466f6826530c379c2d1ad87b` Passes
`5a6b9c05466f6826530c379c2d1ad87b === 5a667adbd4dfcaae3c8f86a835b8b54f` REJECTED

a change in the original `timestamp` or the `data` would also cause the hash to change, which leads to the request being rejected.






## Important Note

Even though there are security measures implemented , this is just a proof of concept and is not advised to be deployed to production.

Please make sure that your system is well secured before deploying as it can cause major loses for both the service and users.