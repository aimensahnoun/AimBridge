// React import
import { useEffect, useState } from 'react'

// Dependencies import
import { useAtom } from 'jotai'
import { useAccount, useBalance, useNetwork } from 'wagmi'


// Utils import
import { navbarHeightAtom } from '@/utils/global-state'
import { chainInfo } from "@utils/chain-info"
import { getAllErc20Tokens } from '@/utils/alchemy-api'
import { Erc20Token } from '@/utils/types'

const BridgeMain = () => {

    // Local state
    const [erc20List, setErc20List] = useState<Erc20Token[]>([])

    // Global state
    const [navHeight] = useAtom(navbarHeightAtom)

    // Wagmi state
    const { chain, chains } = useNetwork()
    const { address } = useAccount()
    const { data: balanceData } = useBalance({
        addressOrName: address,
        watch: true
    })



    const targetChains = chains.filter(currentChain => currentChain.id !== chain?.id)

    useEffect(() => {
        (async () => {
            const tokens = await getAllErc20Tokens(address!, chain?.id!)
            setErc20List(tokens)
        })()
    }, [chain, address])




    return <main suppressHydrationWarning className='w-screen flex flex-col items-center justify-center gap-y-4' style={{
        height: `calc(100vh - ${navHeight}px)`
    }}>
        <span className='font-bold text-2xl'>Welcome to AimBridge</span>
        <div className='flex items-center gap-x-2' >
            <span className='font-medium text-lg'>Source Network:</span>
            <span>{chain?.name}</span>
            <span>{parseFloat(balanceData?.formatted!).toFixed(2)} {balanceData?.symbol}</span>
        </div>

        <div className='flex items-center gap-x-2'>
            <span className='font-medium text-lg'>Target Network:</span>
            <select className='bg-primaryColor outline-none border border-gray-700 rounded-md p-2'>
                {targetChains.map(currentChain => <option key={currentChain.id} value={currentChain.id}>{currentChain.name}</option>)}
            </select>
        </div>

        <div className='flex items-center gap-x-2'>
            <span className='font-medium text-lg'>Token:</span>
            <select className='bg-primaryColor outline-none border border-gray-700 rounded-md p-2'>
                {erc20List.map(currentToken => <option key={currentToken.address} value={currentToken.address}>{currentToken.name}</option>)}
            </select>
        </div>

    </main>
}

export default BridgeMain