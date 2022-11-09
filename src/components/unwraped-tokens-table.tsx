import { chainInfo } from "@/utils/chain-info"
import { ethers } from "ethers"
import { useToken } from "wagmi"

const UnwrappedTokensTable = ({ data }: { data: any }) => {

    const { uwrappedTokens} = data

    if (uwrappedTokens.length === 0) return <div>No transfers completed</div>

    return <div className="overflow-x-auto">
        <table className="table table-compact w-full">
            <thead>
                <tr>
                    <th></th>
                    <th>Token Name</th>
                    <th>Token Symbol</th>
                    <th>Network</th>
                    <th>Amount</th>

                </tr>
            </thead>
            <tbody>

                {uwrappedTokens.map((history: any) => <UnwrapedTokenHistory key={history.id} history={history} />)}

            </tbody>

        </table>
    </div>
}


const UnwrapedTokenHistory = ({ history }: { history: any }) => {
    const { data: tokenData } = useToken({
        address: history.nativeTokenAddress as `0x${string}`,
    })



    return <tr>
        <th></th>
        <th>{tokenData?.name}</th>
        <th>{tokenData?.symbol}</th>
        <th>{chainInfo[history.chainId]?.name}</th>
        <th>{ethers.utils.formatEther(history.amount).toString()} {tokenData?.symbol}</th>

    </tr>
}

export default UnwrappedTokensTable