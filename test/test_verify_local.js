const {expect, assert } = require("chai")

/*
Working with a local node is described in the How to Build, Deploy and Test a Waves RIDE dApp (opens new window)article.
*/

const wvs = 10**8
describe('test in testnet: verifycollection.ride', () => {

    //collection`s parameters 
    const nameURL = "nameurl11"
    const name = "name11"
    const description = "Test test test"
    const hashIFPS = "xxxxxxxxxxxxx"
    const contractAddress = "3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8"

    
    before(async() => {
        await setupAccounts({
            Deployer: 10 * wvs,
            Bob: 10 * wvs,
            SeedVote1: 10 * wvs,
            SeedVote2: 10 * wvs,
            SeedVote3: 10 * wvs
        })

        const script = compile(file("verifycollection.ride"))
        const ssTx = setScript({script}, accounts.Deployer)
        await broadcast(ssTx)
        await waitForTx(ssTx.id)
        console.log("Script has been set")
        const Voties = "3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH" + ',' + address(accounts.SeedVote1) + ',' + address(accounts.SeedVote2) + ',' + address(accounts.SeedVote3)

        const dataTx = data({
            chainId: "R",
            data: [{
                type: 'string',
                key: 'voting_member',
                value: Voties,
            }],
            fee: 1000000,
        }, accounts.Deployer);
        console.log("Data has been set")

        await broadcast(dataTx)
        await waitForTx(dataTx.id)
    })
      
    it('Test func verifyCollection(nameUrl: String, name: String, description: String, hash: String)', async () => {
        const verify = invokeScript({
            fee: 900000, 
            dApp: address(accounts.Deployer), 
            call:{function:"verifyCollection", 
                args:[
                    {
                    "type": "string", 
                    "value": nameURL
                    },
                    {
                    "type": "string", 
                    "value": name
                    },
                    {
                    "type": "string", 
                    "value": description
                    },
                    {
                    "type": "string", 
                    "value": hashIFPS
                    }
                ],
            }
                
        }, accounts.Bob)
        await broadcast(verify)
        await waitForTx(verify.id)
    })

    it('Test func vote(nameUrl: String)', async () => {
        const verify1 = invokeScript({
            fee: 900000, 
            dApp: address(accounts.Deployer), 
            call:{function:"vote", 
                args:[
                    {
                    "type": "string", 
                    "value": nameURL
                    }
                ]}
            }, accounts.SeedVote1)
        await broadcast(verify1)
        await waitForTx(verify1.id)
        var data = await accountDataByKey(nameURL + "_status", address(accounts.Deployer))
        expect(data.value).equal("VOTING")   

        const verify2 = invokeScript({
            fee: 900000, 
            dApp: address(accounts.Deployer), 
            call:{function:"vote", 
                args:[
                    {
                    "type": "string", 
                    "value": nameURL
                    }
                ]}
            }, accounts.SeedVote2)
        await broadcast(verify2)
        await waitForTx(verify2.id)
        data = await accountDataByKey(nameURL + "_status", address(accounts.Deployer))
        expect(data.value).equal("VOTING")

        const verify3 = invokeScript({
            fee: 900000, 
            dApp: address(accounts.Deployer), 
            call:{function:"vote", 
                args:[
                    {
                    "type": "string", 
                    "value": nameURL
                    }
                ]
            },
        }, accounts.SeedVote3)
        await broadcast(verify3)
        await waitForTx(verify3.id)
        data = await accountDataByKey(nameURL + "_status", address(accounts.Deployer))
        expect(data.value).equal("VERIFY")   
    })

    it('Test func removeVoting(address: String)', async () => {
        const verify1 = invokeScript({
            fee: 900000, 
            dApp: address(accounts.Deployer), 
            call:{function:"removeVoting", 
                args:[
                    {
                    "type": "string", 
                    "value": "3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH"
                    }
                ]}
            }, accounts.Deployer)
        await broadcast(verify1)
        await waitForTx(verify1.id)
        data = await accountDataByKey("voting_member", address(accounts.Deployer))
        expect(data.value).equal(address(accounts.SeedVote1) + ',' + address(accounts.SeedVote2) + ',' + address(accounts.SeedVote3))   

    })

    it('Test func addVoting(address: String)', async () => {
        const Voties = "3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH" + ',' + address(accounts.SeedVote1) + ',' + address(accounts.SeedVote2) + ',' + address(accounts.SeedVote3)
        const verify1 = invokeScript({
            fee: 900000, 
            dApp: address(accounts.Deployer), 
            call:{function:"addVoting", 
                args:[
                    {
                    "type": "string", 
                    "value": "3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH"
                    }
                ]}
            }, accounts.Deployer)
        await broadcast(verify1)
        await waitForTx(verify1.id)
        data = await accountDataByKey("voting_member", address(accounts.Deployer))
        expect(data.value).equal(Voties)
    })
})