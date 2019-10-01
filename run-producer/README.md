# Run producer node

Steps to run own validator node
- Run dao-wallet and dao-node, for that you can just run command: ```./run-node.sh```. It will automatically configure and start wallet and node in fullnode mode as docker container.
- Create wallet: ```./dao-cli.sh wallet create --to-console```. 

**IMPORTANT: you have to save wallet password created by this command.**

- Import your private key into wallet: 
```./dao-cli.sh wallet import --private-key <YOUR_PRIVATE_KEY> ```.
- Configure node to become validator: 
  - add `producer-name = <YOUR_VALIDATOR_NAME>` 
and `signature-provider = <YOUR_PUBLIC_KEY>=KEY:<YOUR_PRIVATE_KEY>` 
lines into config.ini file. 
  - The config.ini is located in `<node_data_path>/config/config.ini`.

**NOTE: `<node_data_path>` by default is `./dao-node`**
- Restart node: ```docker restart dao-node```. 
After restart your node will work in validator mode.
- Register your account as a validator: ```./dao-cli.sh system regproducer <YOUR_VALIDATOR_NAME> <YOUR_PUBLIC_KEY>```
- Stake tokens for voting:```./dao-cli.sh system delegatebw "<CPU_STAKE_AMOUNT> BET" "<NET_STAKE_AMOUNT> BET" "<VOTE_STAKE_AMOUNT> BET"```. 

**For Game of Stakes we recommend set maximum VOTE amount and minimal CPU and NET amount.**

**To become a validator `<CPU_STAKE_AMOUNT>` + `<NET_STAKE_AMOUNT>` + `<VOTE_STAKE_AMOUNT>` should be more than 0.1% of BET tokens.**

- Vote for own validator: ```./dao-cli.sh system voteproducer prods <YOUR_VALIDATOR_NAME> <YOUR_VALIDATOR_NAME>```


# Update node

Update node with state wiping:
- run script: `./run-node.sh`
- pass '**y**' when script asks:
  - "Config file already exists, do you want rewrite it? (y/n)" (NOTE: this step is optional, pass 'y' if you want to rewrite config.ini)
  - "Blockchain state already exists, do you want delete it? (y/n)"
  - "Dao node docker contrainer already exists, do you want delete it? (y/n)"
  - "Dao wallet docker contrainer already exists, do you want delete it? (y/n)" (optionally, if you want update wallet daemon)
