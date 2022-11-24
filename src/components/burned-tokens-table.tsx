import { chainInfo } from "@/utils/chain-info"
import { parseDate } from "@/utils/parse-date"
import { ethers } from "ethers"
import { useToken } from "wagmi"

const BurnedTokensTable = ({ data }: { data: any }) => {

    const { burnedTokens } = data

    if (burnedTokens.length === 0) return <div>No transfers completed</div>

    return <div className="overflow-x-auto">
        <table className="table table-compact w-full">
            <thead>
                <tr>
                    <th></th>
                    <th>Token Name</th>
                    <th>Token Symbol</th>
                    <th>Network</th>
                    <th>Amount</th>
                    <th>Date</th>

                </tr>
            </thead>
            <tbody>

                {[...burnedTokens].sort((b, a) => {
                    return a.timestamp - b.timestamp
                }).map((history: any) => <BurnedTokensHistory key={history.id} history={history} />)}

            </tbody>

        </table>
    </div>
}


const BurnedTokensHistory = ({ history }: { history: any }) => {
    const { data: tokenData } = useToken({
        address: history.tokenAddress as `0x${string}`,
    })



    return <tr>
        <th></th>
        <th>{tokenData?.name}</th>
        <th>{tokenData?.symbol}</th>
        <th>{chainInfo[history.chainId]?.name}</th>
        <th>{ethers.utils.formatEther(history.amount).toString()} {tokenData?.symbol}</th>
        <th>{parseDate(history.timestamp)}</th>

    </tr>
}

export default BurnedTokensTable