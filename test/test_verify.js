// const { SEED, SEED1, SeedVote1, SeedVote2, SeedVote3 } = require ("./config");
const Constants = require('./config');

describe('some suite', () => {
    let Voties = "3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH,3NC2359r28GxfTsUuRbA4fyPuoWuqqc7EUj,3MtYePm61jmLLdxoNex73HBwxxHBfXfsLHp,3Mq9Z4oXtW6kmEXKL3rYp6YUczRL6cCT2f6"

    const contractAddress = "3MuwmoHDxZZP9bGwExfL3L8JpMU5r95oBr8"
    // before(async() => {
    //     const dataTx = data({
    //         chainId: "T",
    //         data: [{
    //             type: 'string',
    //             key: 'voting_member',
    //             value: Voties,
    //         }],
    //         fee: 1000000,
    //     }, SEED);
    //     await broadcast(dataTx)
    //     await waitForTx(dataTx.id)
    // })
      
    xit('Test func verifyCollection()', async () => {
        const verify = invokeScript({
            fee: 900000, 
            dApp: contractAddress, 
            call:{function:"verifyCollection", 
                args:[
                    {
                    "type": "string", 
                    "value": "nameurl6"
                    },
                    {
                    "type": "string", 
                    "value": "name"
                    },
                    {
                    "type": "string", 
                    "value": "teST tEST teST"
                    },
                    {
                    "type": "string", 
                    "value": "xxxxxxxxxx"
                    }
                ],
                senderPublicKey: publicKey(SEED1)
            }
                
        }, SEED1)
        await broadcast(verify)
        await waitForTx(verify.id)
    })

    it('Test func vote(nameUrl: String)', async () => {
        // const verify1 = invokeScript({
        //     fee: 900000, 
        //     dApp: contractAddress, 
        //     call:{function:"vote", 
        //         args:[
        //             {
        //             "type": "string", 
        //             "value": "nameurl6"
        //             }
        //         ]}
        //     }, SeedVote1)
        // await broadcast(verify1)
        // await waitForTx(verify1.id)
            
        // const verify2 = invokeScript({
        //     fee: 900000, 
        //     dApp: contractAddress, 
        //     call:{function:"vote", 
        //         args:[
        //             {
        //             "type": "string", 
        //             "value": "nameurl6"
        //             }
        //         ]}
        //     }, SeedVote2)
        // await broadcast(verify2)
        // await waitForTx(verify2.id)
        console.log(Constants.SeedVote2)
        const verify3 = invokeScript({
            fee: 900000, 
            dApp: contractAddress, 
            call:{function:"vote", 
                args:[
                    {
                    "type": "string", 
                    "value": "nameurl6"
                    }
                ]
            },
        }, Constants.SeedVote3)
        console.log(verify3)             
        await broadcast(verify3)
        await waitForTx(verify3.id)
    })

    xit('Test func removeVoting(address: String)', async () => {
        const verify1 = invokeScript({
            fee: 900000, 
            dApp: contractAddress, 
            call:{function:"removeVoting", 
                args:[
                    {
                    "type": "string", 
                    "value": "3MutukEa3h9HyFQetfvCwJpaMZyWV1N4nrr"
                    }
                ]}
            }, SEED)

        await broadcast(verify1)
        await waitForTx(verify1.id)
    })

    xit('Test func addVoting(address: String)', async () => {
        const verify1 = invokeScript({
            fee: 900000, 
            dApp: contractAddress, 
            call:{function:"addVoting", 
                args:[
                    {
                    "type": "string", 
                    "value": "3N7yQLHUBnWxogAKAkdYyx11gz8X7PWfAnH"
                    }
                ]}
            }, SEED)

        await broadcast(verify1)
        await waitForTx(verify1.id)
    })
})