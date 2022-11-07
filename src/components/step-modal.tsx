// React import
import { useEffect, useState } from 'react'

// Dependencies import
import { useAtom } from 'jotai'

// Utils import
import { amountAtom, selectedTargetChainAtom, selectedTokenAtom, selectedSourceChainAtom } from '@/utils/global-state'
import { chainInfo } from "@utils/chain-info"
import { Chain, useAccount, useContract, useSigner } from 'wagmi'
import { Erc20Token } from '@/utils/types'
import { BigNumber } from 'ethers'
import * as ERC20JSON from "@constants/contract/WrapperToken.json"
import * as BRIDGEJSON from "@constants/contract/Bridge.json"
import axios from 'axios'


const StepModal = ({ setIsModalOpen }: {
    setIsModalOpen: (value: boolean) => void
}) => {

    // Local State
    const [step, setStep] = useState(0)
    const [isComplete, setIsComplete] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [transaction, setTransaction] = useState("")

    // Global State
    const [selectedToken, setSelectedToken] = useAtom(selectedTokenAtom)
    const [amount, setAmount] = useAtom(amountAtom)
    const [selectedTargetChain, setSelectedChain] = useAtom(selectedTargetChainAtom)
    const [selectedSourceChain, setSelectedSourceChain] = useAtom(selectedSourceChainAtom)


    // Wagmi
    const { address } = useAccount()
    const { data: signer } = useSigner()

    const erc20Contract = useContract({
        address: selectedToken?.address,
        abi: ERC20JSON.abi,
        signerOrProvider: signer
    })

    const bridgeContract = useContract({
        address: chainInfo[selectedSourceChain!.id].contract,
        abi: BRIDGEJSON.abi,
        signerOrProvider: signer
    })

    const bridgeToken = async () => {
        if (isLoading) return
        if (!signer) return

        if (!selectedToken || !amount || !selectedTargetChain || !selectedSourceChain) return
        setIsLoading(true)

        try {
            const transferTransaction = await erc20Contract?.approve(
                chainInfo[selectedSourceChain!.id].contract,
                amount
            )

            await transferTransaction?.wait()

            console.log("Approved Bridge")

            setStep(1)

            const erc20Name = selectedToken.name
            const erc20Symbol = selectedToken.symbol

            const initiateTx = await bridgeContract!.initiateTransfer(
                address,
                selectedToken?.address,
                selectedTargetChain.id,
                amount,
                erc20Name,
                erc20Symbol
            );

            await initiateTx.wait();

            console.log("Initiated transfer")

            setStep(2)



            const result = await axios.post(
                "/api/webhook",
                {
                    symbol: erc20Symbol,
                    tokenName: erc20Name,
                    amount: amount,
                    to: address,
                    tokenAddress: selectedToken.address,
                    contractAddress: chainInfo[selectedTargetChain.id].contract,
                    selectedChainId: selectedTargetChain.id,
                    type: "mint"
                }
            );

            console.log(result)

            const resultTx = result.data.tx


            console.log(resultTx.tx);
            setStep(3)
            setIsComplete(true)
            setTransaction(resultTx.tx)
            setIsLoading(false)

        } catch (e) {
            console.log(e)
        }


    }


    useEffect(() => {
        if (isLoading) return
        (async () => {
            await bridgeToken()
        })()
    }, [signer, selectedToken, amount, selectedTargetChain, selectedSourceChain])

    return <div className="w-screen h-screen fixed inset-0 z-10 bg-black/40 flex items-center justify-center">
        <div className="w-[40rem] p-4 bg-secondaryBg rounded-lg flex flex-col gap-y-4">
            <span className="font-bold text-lg">Bridge doing bridge things</span>
            <ul className="steps self-center">
                <li className={`step ${step >= 0 && "step-primary"} ${isComplete && "step-success"} `}>Locking Token</li>
                <li className={`step ${step > 0 && "step-primary"} ${isComplete && "step-success"}`}>Initiating Transfer</li>
                <li className={`step ${step > 1 && "step-primary"} ${isComplete && "step-success"}`}>Minting</li>
                <li className={`step ${step > 2 && "step-primary"} ${isComplete && "step-success"}`}>Complete</li>
            </ul>
            {
                transaction === "" ?
                    <p className='self-center font-bold'>DO NOT CLOSE THE PAGE</p>
                    :
                    <>
                        <p className='self-center font-bold'>New token minted succesffuly</p>
                        <a href={chainInfo[selectedTargetChain?.id!]?.explorer + transaction} target="_blank" rel="noreferrer"
                            className="self-center text-primary font-bold">View Transaction</a>
                        <button onClick={() => {
                            setSelectedChain(null)
                            setSelectedToken(null)
                            setAmount(null)
                            setSelectedSourceChain(null)
                            setIsModalOpen(false)
                        }} className='p-2 rounded-lg bg-primaryColor'>
                            Make new transfer
                        </button>
                    </>

            }
        </div>

    </div>
}

export default StepModal
