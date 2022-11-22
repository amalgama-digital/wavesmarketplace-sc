// const { SEED, SEED1, SeedVote1, SeedVote2, SeedVote3 } = require ('./config');
const Constants = require('./config');
const { expect } = require('chai');
/*
struct config:
const Constants = {
    SEED: '',
    SEED1: '',
    SeedVote1: '',
    SeedVote2: '',
    SeedVote3: ''
  }
module.exports = Constants
*/

describe('test in testnet: verifycollection.ride', () => {
    // Voties include address with seed phrase: SeedVotes1, SeedVotes2, SeedVotes3
    const voties = '3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH,3NC2359r28GxfTsUuRbA4fyPuoWuqqc7EUj,3MtYePm61jmLLdxoNex73HBwxxHBfXfsLHp,3Mq9Z4oXtW6kmEXKL3rYp6YUczRL6cCT2f6';

    // Collection`s parameters
    const nameURL = 'nameurl11';
    const name = 'name11';
    const description = 'Test test test';
    const hashIFPS = 'xxxxxxxxxxxxx';
    const contractAddress = '3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8';

    before(async () => {
        const dataTx = data({
            chainId: 'T',
            data: [{
                type: 'string',
                key: 'voting_member',
                value: voties,
            }],
            fee: 1000000,
        });

        await broadcast(dataTx);
        await waitForTx(dataTx.id);
    });

    it('Test func verifyCollection(nameUrl: String, name: String, description: String, hash: String)', async () => {
        const tx = invokeScript({
            fee: 900000,
            dApp: contractAddress,
            call: {
                function: 'verifyCollection',
                args: [
                    {
                        'type': 'string',
                        'value': nameURL,
                    },
                    {
                        'type': 'string',
                        'value': name,
                    },
                    {
                        'type': 'string',
                        'value': description,
                    },
                    {
                        'type': 'string',
                        'value': hashIFPS,
                    },
                ],
            },
        }, Constants.SEED1);

        await broadcast(tx);
        await waitForTx(tx.id);
    });

    it('Test func vote(nameUrl: String)', async () => {
        const tx = invokeScript({
            fee: 900000,
            dApp: contractAddress,
            call: {
                function: 'vote',
                args: [{
                    'type': 'string',
                    'value': nameURL,
                }],
            },
        }, Constants.SeedVote1);

        await broadcast(tx);
        await waitForTx(tx.id);

        let data = await accountDataByKey(`${nameURL}_status`, '3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8');
        expect(data.value).equal('VOTING');

        const tx2 = invokeScript({
            fee: 900000,
            dApp: contractAddress,
            call: {
                function: 'vote',
                args: [{
                    'type': 'string',
                    'value': nameURL,
                }],
            },
        }, Constants.SeedVote2);

        await broadcast(tx2);
        await waitForTx(tx2.id);

        data = await accountDataByKey(`${nameURL}_status`, '3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8');
        expect(data.value).equal('VOTING');

        const tx3 = invokeScript({
            fee: 900000,
            dApp: contractAddress,
            call: {
                function: 'vote',
                args: [{
                    'type': 'string',
                    'value': nameURL,
                }],
            },
        }, Constants.SeedVote3);

        await broadcast(tx3);
        await waitForTx(tx3.id);

        data = await accountDataByKey(`${nameURL}_status`, '3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8');
        expect(data.value).equal('VERIFY');
    });

    it('Test func removeVoting(address: String)', async () => {
        const tx = invokeScript({
            fee: 900000,
            dApp: contractAddress,
            call: {
                function: 'removeVoting',
                args: [{
                    'type': 'string',
                    'value': '3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH',
                }],
            },
        });

        await broadcast(tx);
        await waitForTx(tx.id);

        const data = await accountDataByKey('voting_member', '3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8');
        expect(data.value).equal('3NC2359r28GxfTsUuRbA4fyPuoWuqqc7EUj,3MtYePm61jmLLdxoNex73HBwxxHBfXfsLHp,3Mq9Z4oXtW6kmEXKL3rYp6YUczRL6cCT2f6');
    });

    it('Test func addVoting(address: String)', async () => {
        const tx = invokeScript({
            fee: 900000,
            dApp: contractAddress,
            call: {
                function: 'addVoting',
                args: [{
                    'type': 'string',
                    'value': '3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH',
                }],
            },
        });

        await broadcast(tx);
        await waitForTx(tx.id);

        const data = await accountDataByKey('voting_member', '3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8');
        expect(data.value).equal(voties);
    });
});
