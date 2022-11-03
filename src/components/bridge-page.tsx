// React import
import { useEffect, useState } from 'react'

// Dependencies import
import { useAtom } from 'jotai'
import { Chain, useAccount, useBalance, useNetwork } from 'wagmi'
import { utils } from 'ethers'


// Utils import
import { navbarHeightAtom, amountAtom, selectedTargetChainAtom, selectedTokenAtom  , selectedSourceChainAtom} from '@/utils/global-state'
import { chainInfo } from "@utils/chain-info"
import { getAllErc20Tokens } from '@/utils/alchemy-api'
import { Erc20Token } from '@/utils/types'
import StepModal from './step-modal'

const BridgeMain = () => {

    // Local state
    const [erc20List, setErc20List] = useState<Erc20Token[]>([])
    const [selectedErc20, setSelectedErc20] = useState<Erc20Token | null>(null)
    const [transferAmount, setTransferAmount] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Global state
    const [navHeight] = useAtom(navbarHeightAtom)
    const [_, setSelectedTargetChainGlobal] = useAtom(selectedTargetChainAtom)
    const [_selectedToken, setSelectedToken] = useAtom(selectedTokenAtom)
    const [_amount, setAmount] = useAtom(amountAtom)
    const [_selectedSourceChain, setSelectedSourceChain] = useAtom(selectedSourceChainAtom)


    // Wagmi state
    const { chain, chains } = useNetwork()
    const { address } = useAccount()
    const { data: balanceData } = useBalance({
        addressOrName: address,
        watch: true
    })


    const targetChains = chains.filter(currentChain => currentChain.id !== chain?.id)

    const [selectedTargetChain, setSelectedTargetChain] = useState<Chain>(targetChains[0])





    useEffect(() => {
        (async () => {
            const tokens = await getAllErc20Tokens(address!, chain?.id!)
            setErc20List(tokens)
            setSelectedErc20(tokens[0])
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

        {
            targetChains.length > 0 &&
            <div className='flex items-center gap-x-2'>
                <span className='font-medium text-lg'>Target Network:</span>
                <select onChange={(event) => {
                    const selectedChain = targetChains.find(chain => chain.id === parseInt((event.target as HTMLSelectElement).value))
                    setSelectedTargetChain(selectedChain!)
                }} className='bg-primaryColor outline-none border border-gray-700 rounded-md p-2'>
                    {targetChains.map(currentChain => <option key={currentChain.id} value={currentChain.name}>{currentChain.name}</option>)}
                </select>
            </div>
        }



        {
            erc20List.length > 0 &&
            <div className='flex items-center gap-x-2'>
                <span className='font-medium text-lg'>Token:</span>
                <select onChange={(event) => {
                    const selectedToken = erc20List.find(token => token.address === event.target.value)
                    setSelectedErc20(selectedToken!)
                }} className='bg-primaryColor outline-none border border-gray-700 rounded-md p-2'>
                    {erc20List.map(currentToken => <option key={currentToken.address} value={currentToken.address}>{currentToken.symbol} {currentToken.balance}</option>)}
                </select>
            </div>
        }

        {
            selectedErc20 && selectedTargetChain &&

            <>
                <input className='p-2 rounded-lg bg-secondaryBg w-[20rem] outline-none' placeholder='Token value to transfer'

                    onChange={(event) => {
                        const value = event.target.value
                        if (!value) return
                        const parsedValue = parseFloat(value)
                        if (isNaN(parsedValue)) return
                        if (parsedValue < 0) event.target.value = "0"
                        if (parsedValue > selectedErc20.balance) event.target.value = selectedErc20.balance.toString()

                        setTransferAmount(event.target.value)
                    }}

                    type="number"
                />

                <button disabled={
                    transferAmount === "" || parseFloat(transferAmount) === 0 || parseFloat(transferAmount) > selectedErc20.balance
                } className={`p-2 rounded-lg bg-brandPurple ${transferAmount === "" || parseFloat(transferAmount) === 0 || parseFloat(transferAmount) > selectedErc20.balance ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {

                        const parseAmount = utils.parseEther(transferAmount)
                        setSelectedTargetChainGlobal(selectedTargetChain)
                        setSelectedSourceChain(chain!)
                        setSelectedToken(selectedErc20)
                        setAmount(parseAmount)
                        setIsModalOpen(true)
                    }}
                >Start Transfer</button>
            </>

        }


        {isModalOpen &&
            <StepModal />}
    </main>
}

export default BridgeMain