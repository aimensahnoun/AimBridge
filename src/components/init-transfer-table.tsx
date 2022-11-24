import { chainInfo } from "@/utils/chain-info"
import { parseDate } from "@/utils/graph-queries"
import { ethers } from "ethers"
import { useToken } from "wagmi"

const InitTransferTable = ({ data }: { data: any }) => {

    const { transferInitiateds } = data





    if ((transferInitiateds).length === 0) return <div>No transfers found</div>


    return <div className="overflow-x-auto">
        <table className="table table-compact w-full">
            <thead>
                <tr>
                    <th></th>
                    <th>Token Name</th>
                    <th>Token Symbol</th>
                    <th>Source Network</th>
                    <th>Target Network</th>
                    <th>Amount</th>
                    <th>Date</th>

                </tr>
            </thead>
            <tbody>

                {[...transferInitiateds].sort((b, a) => {
                    return a.timestamp - b.timestamp
                }).map((history: any) => <InitTransferHistory key={history.id} history={history} />)}

            </tbody>

        </table>
    </div>
}


const InitTransferHistory = ({ history }: { history: any }) => {
    const { data: tokenData } = useToken({
        address: history.tokenAddress as `0x${string}`,
    })


    return <tr>
        <th></th>
        <th>{tokenData?.name}</th>
        <th>{tokenData?.symbol}</th>
        <th>{chainInfo[history.sourceChainId]?.name}</th>
        <th>{chainInfo[history.targetChainId]?.name}</th>
        <th>{ethers.utils.formatEther(history.amount).toString()} {tokenData?.symbol}</th>
        <th>{parseDate(history.timestamp)}</th>

    </tr>
}

export default InitTransferTable