import { ethers, Logger } from "./deps.ts"

export const freedomAvatars = "0xCF39209D2506aE91f2492Fc082EaEdACeC69B538"
export const communityGate = "0x9fdf4aEd365c7EAE74e23b00544D22d3e64c3C8b"
export const FC = "0xa1e7bB978a28A30B34995c57d5ba0B778E90033B"
export const baseURLScan = "https://zkevm.polygonscan.com/"


export function getProvider(logger: Logger) {
    // const configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
    // const wallet = new ethers.Wallet(configuration.pkTestWallet, provider)
    // const signer = await wallet.connect(provider)

    return new ethers.JsonRpcProvider(getProviderURL(logger))
}
export function getABI(url: string) {
    return JSON.parse(Deno.readTextFileSync(url))
}
export async function getContract(asset: string, provider: any, url: string): Promise<any> {
    const configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
    const wallet = new ethers.Wallet(configuration.pkTestWallet, provider)
    const signer = await wallet.connect(provider)    
    return new ethers.Contract(asset, getABI(url), signer)
    // return new ethers.Contract(asset, getABI(url), await provider.getSigner())
}
export function getProviderURL(logger: Logger): string {
    let configuration: any = {}
    if (Deno.args[0] !== undefined) { // supplying your provider URL via parameter
        return Deno.args[0]
    } else { // ... or via .env.json
        try {
            configuration = JSON.parse(Deno.readTextFileSync('./.env.json'))
            return configuration.providerURL
        } catch (error) {
            logger.error(error.message)
            logger.error("without a providerURL I cannot connect to the blockchain")
        }
    }
    throw new Error("could not get a providerURL")
}
let loggerInstance
export async function getLogger() {
    if (loggerInstance === undefined) {
        const minLevelForConsole = 'DEBUG'
        const minLevelForFile = 'WARNING'
        const fileName = "./warnings-errors.txt"
        const pureInfo = true // leaving out e.g. the time info
        loggerInstance = await Logger.getInstance(minLevelForConsole, minLevelForFile, fileName, pureInfo)
    }
    return loggerInstance
}

