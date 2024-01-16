// Freedom Avatars utilize https://FreedomCash.org to free the world.

import { baseURLScan, communityGate, FC, freedomAvatars, getContract, getLogger, getProvider } from "./constants-types-infrastructure.ts"
import { ethers, Logger } from "./deps.ts"

export class FreedomAvatars {

    private static instance

    public static async getInstance(cGVPLength: number) {
        if (FreedomAvatars.instance === undefined) {
            const logger = await getLogger()
            const provider = getProvider(logger)
            const contract = await getContract(freedomAvatars, provider, './blockchain/freedom-avatars-abi.json')
            const fCcontract = await getContract(FC, provider, './blockchain/freedom-cash-abi.json')
            const cGcontract = await getContract(communityGate, provider, './blockchain/community-gate-abi.json')
            return new FreedomAvatars(logger, contract, fCcontract, cGcontract, provider, cGVPLength)
        }
    }

    protected logger: Logger
    protected provider: any
    protected contract: any
    protected fCcontract: any
    protected cGcontract: any
    protected cGVPLength: number

    protected constructor(logger: Logger, contract: any, fCcontract: any, cGcontract: any, provider: any, cGVPLength: number) {
        this.logger = logger
        this.provider = provider
        this.contract = contract
        this.fCcontract = fCcontract
        this.cGcontract = cGcontract
        this.cGVPLength = cGVPLength
    }

    public async create(name: string, description: string, linkToImage: string): Promise<void> {
        await this.awaitTransaction(await this.contract.create(ethers.encodeBytes32String(name), description, "linkToImage"))
    }
    public async appreciateAvatar(avatarID: number, donationAmountFC: number) {
        const parsedAmount = ethers.parseEther(donationAmountFC.toString())
        const buyPrice = await this.fCcontract.getBuyPrice(BigInt(10 ** 18))
        const cost = buyPrice * BigInt(donationAmountFC)
        this.logger.debug(`appreciate avatar ${avatarID} ${parsedAmount} ${buyPrice} ${cost}`)
        await this.awaitTransaction(await this.contract.appreciateAvatar(avatarID, parsedAmount, buyPrice, { value: cost }))
    }
    public async claimDonations() {
        await this.awaitTransaction(await this.contract.claimDonations())
    }
    public async getAvatarCounter() {
        return this.contract.avatarCounter()
    }
    public async getAvatar(id: number) {
        this.logger.info(`reading avatar ${id}`)
        const raw = await this.contract.avatars(id)

        return {
            from: raw[0],
            name: raw[1],
            description: raw[2],
            linkToImage: raw[3],
            donationsReceived: raw[4],
            donationsClaimed: raw[5],
            timestamp: raw[6]
        }
    }
    public async log() {
        const avatarCounter = await this.getAvatarCounter()
        this.logger.debug(`avatar counter: ${avatarCounter}`)
        let counter = 1
        while (avatarCounter >= counter) {
            const avatar = await this.getAvatar(counter)
            this.logger.debug(`avatar ${counter} ${avatar.from} ${avatar.name} ${avatar.description} ${avatar.linkToImage} ${avatar.donationsReceived} ${avatar.donationsClaimed} ${avatar.timestamp}`)
            counter++
        }
    }
    private async awaitTransaction(tx: any): Promise<void> {
        this.logger.info(`transaction ${baseURLScan}tx/${tx.hash}`)
        await tx.wait()
    }
}