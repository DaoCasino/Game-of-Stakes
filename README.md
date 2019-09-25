# Game of Stakes

Welcome to the Game of Stakes from DAObet! 

In this document you will find the necessary instructions and useful advise for participating in the game.

## Producers.json

To participate in the Game of Stakes you have to add information about yourself in `producers.json`.
Fill in the information via **pull request** or just send it to [us](https://t.me/daobet_validators)

```json
{
    "name": "example",
    "account_name": "examplenamee",
    "publickey": "EOS6fzMVJsxXyXvuTcoRpkkFo2FtNT8jrAfmU3vxMsb8eWYG8Uz5S",
    "url": "daobet.org",
    "public_ip": "127.0.0.1"
}
```
### name (optional)

Your account name or company name

### account_name (required)

The name for your account in DAObet game of stakes network. The name should be created according to the following rules:

- Can only contain the characters:.abcdefghijklmnopqrstuvwxyz12345. a-z (lowercase), 1-5 and . (period)
- Must start with a letter
- Must be 12 characters long
- Must not end with a dot

example:

valid:
- validator111
- validator222
- validatorbet

invalid:
- validator    // shorter that 12 characters
- validator069 // contains numbers 0,6 and 9
- val.idator   // contains a dot
- 111validator // starts with a numeral

### publickey (required)

public key (in EOS format) of which you have a private key.

For generating the keypair (public key and private key) you can use [daobet-cli](https://docs.daobet.org/get-started/daobet-cli):

```bash
// output to console
daobet-cli create key --to-console

// output to file
daobet-cli create key -f keys.txt
```

Be sure to save the private key!

### url (optional)

your website url

### public_ip (optional)

specify your ip so that other validators can connect to you.
In this file you will find the ip of other validators and you can add them to your configuration.
this will allow the network to be more stable and decentralized.

To add a peer address add each of them to `config.ini`: 

example:
```ini
p2p-peer-address = example.сom:9999
p2p-peer-address = 127.0.0.1:7777
```

**Warning**!

**When publishing an ip you must evaluate the risks and possible attacks! Please make sure that you provide sufficient protection.**

##

### run-producer

Scripts and instructions for launching the node for participating in the Game of Stakes

### dao-vp-counter

Service for counting of the `Validators Points` and for receiving the information about the network status.
