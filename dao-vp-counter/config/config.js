const config = {
    rpcUrl: "api.daovalidator.com",
    // rpcUrl: "http://127.0.0.1:8888",
    dataFile: "vp-counter-data.json",
    syncPercentsDot: 4, // used for nice output during synchronization with node
    syncStorePeriod: 1000, // period of saving backup information
    syncLogPeriod: 1000, // period of logging synchronization status (only during synchronization)
    syncInfoPeriod: 500, // period of syncing info like last block (only when synchronization is complete)

    producersLimit: 500, // limit the producers amount in the output

    firstBlock: 1, // the first block used for sync
    lastBlock: undefined // the last block used for sync
};

module.exports = config;