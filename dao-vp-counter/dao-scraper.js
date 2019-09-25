const {promisify} = require('util');
const config = require("./config/config");
const {JsonRpc} = require("eosjs");
const fetch = require("node-fetch");
const fs = require("fs");

class DaoScraper {
    constructor() {
        this.rpc = new JsonRpc(config.rpcUrl, {fetch});

        // map of validator points (validator name => number of blocks he created)
        this.vPoints = new Map();

        // array of infos about producers
        this.producersInfo = [];

        this.blockchainInfo = {};

        // contains the last synchronized block. Gotten from config, does not update
        this.nextBlock = config.firstBlock;

        // contains the lib block + 1. Updates with time
        this.lastBlock = 0;

        // the callback when dao-scrapper synchronizes information
        this.onUpdate = undefined;

        // true if the initial synchronization is complete
        this.syncronized = false;

        // true if the warning that user placed lastBlock in the config is bigger then lib block is shown
        this.lastBlockTooBigWarningShown = false;

        setInterval(async () => {
            await this.store();
        }, config.syncStorePeriod);

        setInterval(async () => {
            if (!this.syncronized)
                console.log(`Ready ${this.syncPercent().toFixed(config.syncPercentsDot)}%`);
            else
                console.log(this.toString());
        }, config.syncLogPeriod);

        setInterval(async () => {
            await this.updateInfo();
            if (this.syncronized)
                await this.doSyncWhileNotReady();
            if (this.onUpdate) {
                this.onUpdate();
            }
        }, config.syncInfoPeriod)
    }

    vPointsToArray() {
        return Array.from(this.vPoints.keys()).map(key => {
            return {
                producer: key,
                points: this.vPoints.get(key)
            }
        });
    }

    getData() {
        return {
            validators: this.producersInfo.map(producer => {
                let validatorPoints = this.vPoints.get(producer.owner) | 0;
                return {
                    ...producer,
                    validatorPoints
                }
            }),
            syncPercent: this.syncronized ? 100 : this.syncPercent(),
            blockchainInfo: this.blockchainInfo
        }
    }
    toString() {
        return JSON.stringify(this.getData, null, 2)
    }

    syncPercent() {
        return this.nextBlock / this.lastBlock * 100;
    }

    async store() {
        await promisify(fs.writeFile)(config.dataFile, JSON.stringify({
            validatorPoints: this.vPointsToArray(),
            nextBlock: this.nextBlock
        }));
    }

    async updateInfo() {
        let lib = (await this.rpc.get_info()).last_irreversible_block_num;
        this.producersInfo = (await this.rpc.get_table_rows({
            json: true,
            code: "eosio",
            scope: "eosio",
            table: "producers",
            limit: config.producersLimit
        })).rows;

        let global = (await this.rpc.get_table_rows({
            json: true,
            code: "eosio",
            scope: "eosio",
            table: "global",
            limit: config.producersLimit
        })).rows;

        let stat = (await this.rpc.get_table_rows({
            json: true,
            code: "eosio.token",
            scope: "BET",
            table: "stat",
            limit: config.producersLimit
        })).rows;

        this.blockchainInfo = {
            lib,
            total_activated_stake: global[0].total_activated_stake,
            supply: stat[0].supply
        };

        if (config.lastBlock) {
            if (!this.lastBlockTooBigWarningShown && config.lastBlock + 1 > lib) {
                console.warn("Last block is bigger than blockchain has. Please wait till it reaches desired block");
                this.lastBlockTooBigWarningShown = true;
            }
            this.lastBlock = Math.min(config.lastBlock + 1, lib);
        } else {
            this.lastBlock = lib;
        }
    }

    async restoreFromBackup() {
        if (await promisify(fs.exists)(config.dataFile)) {
            try {
                let stringData = (await promisify(fs.readFile)(config.dataFile)).toString();
                let vPoints = new Map();
                let data = JSON.parse(stringData);
                data.validatorPoints.forEach(vp => {
                    vPoints.set(vp.producer, vp.points)
                });
                if (typeof data.nextBlock !== "number") {
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error("");
                }
                this.nextBlock = data.nextBlock;
                this.vPoints = vPoints;
            } catch (e) {
                console.error("Invalid data file");
                console.error(e);
                process.exit(-1);
            }
        } else
            await this.store();
    }

    async doSyncWhileNotReady() {
        while (this.nextBlock < this.lastBlock) {
            try {
                let block = await this.rpc.get_block(this.nextBlock);
                let oldValue = this.vPoints.get(block.producer);
                if (!oldValue)
                    this.vPoints.set(block.producer, 1);
                else
                    this.vPoints.set(block.producer, oldValue + 1);
                this.nextBlock++;
            } catch (e) {
                // do nothing
                console.error(e)
            }
        }
    }

    async start() {
        console.log("Syncing state...");
        await this.updateInfo();
        await this.restoreFromBackup();
        await this.doSyncWhileNotReady();
        this.syncronized = true;
        await this.store();
        console.log("VP counter synchronized!");
        // noinspection JSUnusedLocalSymbols
        await new Promise(resolve => {
            // don't call resolve
        });
    }
}

module.exports = new DaoScraper();