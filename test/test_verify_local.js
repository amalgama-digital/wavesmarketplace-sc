const { expect } = require('chai');

/*
    Working with a local node is described in the How to Build,
    Deploy and Test a Waves RIDE dApp (opens new window) article.
*/

const wvs = 10 ** 8;

describe('test in testnet: verifycollection.ride', () => {
    // Collection`s parameters
    const nameURL = 'nameurl11';
    const name = 'name11';
    const description = 'Test test test';
    const hashIFPS = 'xxxxxxxxxxxxx';

    before(async () => {
        await setupAccounts({
            Deployer: 10 * wvs,
            Bob: 10 * wvs,
            SeedVote1: 10 * wvs,
            SeedVote2: 10 * wvs,
            SeedVote3: 10 * wvs,
        });

        const script = compile(file('verifycollection.ride'));
        const ssTx = setScript({ script }, accounts.Deployer);

        await broadcast(ssTx);
        await waitForTx(ssTx.id);

        console.log('Script has been set');

        const voties = `3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH,${address(accounts.SeedVote1)},${address(accounts.SeedVote2)},${address(accounts.SeedVote3)}`;

        const dataTx = data({
            chainId: 'R',
            data: [{
                type: 'string',
                key: 'voting_member',
                value: voties,
            }],
            fee: 1000000,
        }, accounts.Deployer);
        console.log('Data has been set');

        await broadcast(dataTx);
        await waitForTx(dataTx.id);
    });

    it('Test func verifyCollection(nameUrl: String, name: String, description: String, hash: String)', async () => {
        const verify = invokeScript({
            fee: 900000,
            dApp: address(accounts.Deployer),
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
        }, accounts.Bob);
        await broadcast(verify);
        await waitForTx(verify.id);
    });

    it('Test func vote(nameUrl: String)', async () => {
        const tx1 = invokeScript({
            fee: 900000,
            dApp: address(accounts.Deployer),
            call: {
                function: 'vote',
                args: [{
                    'type': 'string',
                    'value': nameURL,
                }],
            },
        }, accounts.SeedVote1);

        await broadcast(tx1);
        await waitForTx(tx1.id);

        let data = await accountDataByKey(`${nameURL}_status`, address(accounts.Deployer));
        expect(data.value).equal('VOTING');

        const tx2 = invokeScript({
            fee: 900000,
            dApp: address(accounts.Deployer),
            call: {
                function: 'vote',
                args: [{
                    'type': 'string',
                    'value': nameURL,
                }],
            },
        }, accounts.SeedVote2);

        await broadcast(tx2);
        await waitForTx(tx2.id);

        data = await accountDataByKey(`${nameURL}_status`, address(accounts.Deployer));
        expect(data.value).equal('VOTING');

        const tx3 = invokeScript({
            fee: 900000,
            dApp: address(accounts.Deployer),
            call: {
                function: 'vote',
                args: [{
                    'type': 'string',
                    'value': nameURL,
                }],
            },
        }, accounts.SeedVote3);

        await broadcast(tx3);
        await waitForTx(tx3.id);

        data = await accountDataByKey(`${nameURL}_status`, address(accounts.Deployer));
        expect(data.value).equal('VERIFY');
    });

    it('Test func removeVoting(address: String)', async () => {
        const tx = invokeScript({
            fee: 900000,
            dApp: address(accounts.Deployer),
            call: {
                function: 'removeVoting',
                args: [{
                    'type': 'string',
                    'value': '3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH',
                }],
            },
        }, accounts.Deployer);

        await broadcast(tx);
        await waitForTx(tx.id);

        const data = await accountDataByKey('voting_member', address(accounts.Deployer));

        expect(data.value).equal(`${address(accounts.SeedVote1)},${address(accounts.SeedVote2)},${address(accounts.SeedVote3)}`);
    });

    it('Test func addVoting(address: String)', async () => {
        const voties = `3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH,${address(accounts.SeedVote1)},${address(accounts.SeedVote2)},${address(accounts.SeedVote3)}`;

        const tx = invokeScript({
            fee: 900000,
            dApp: address(accounts.Deployer),
            call: {
                function: 'addVoting',
                args: [{
                    'type': 'string',
                    'value': '3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH',
                }],
            },
        }, accounts.Deployer);

        await broadcast(tx);
        await waitForTx(tx.id);

        data = await accountDataByKey('voting_member', address(accounts.Deployer));

        expect(data.value).equal(voties);
    });
});
