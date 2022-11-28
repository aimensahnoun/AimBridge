// React import
import { useEffect, useState, useMemo } from 'react'

// Dependencies import
import { useAtom } from 'jotai'

// Utils import
import { amountAtom, selectedTargetChainAtom, selectedTokenAtom, selectedSourceChainAtom, hasPermitAtom, nonceAtom } from '@/utils/global-state'
import { chainInfo } from "@utils/chain-info"
import { chain, Chain, useAccount, useContract, useProvider, useSigner, useSignTypedData } from 'wagmi'
import { Erc20Token } from '@/utils/types'
import { BigNumber, ethers, providers } from 'ethers'
import { lottieConfig } from '@/utils/lottie-config'
import * as ERC20JSON from "@constants/contract/WrapperToken.json"
import * as BRIDGEJSON from "@constants/contract/Bridge.json"
import { hash } from "@utils/hasing"
import axios from 'axios'

// Lottie import
import Lottie from 'react-lottie'
import contractLottie from "@lotties/contract-lottie.json"
import lockLotietLottie from "@lotties/lock-lottie.json"
import sendLottie from "@lotties/send-lottie.json"
import walletLottie from "@lotties/wallet-lotti.json"
import { Else, If, Then } from 'react-if'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'



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
    const [hasPermit] = useAtom(hasPermitAtom)
    const [nonce] = useAtom(nonceAtom)


    // Wagmi
    const { address } = useAccount()
    const { data: signer } = useSigner()
    const provider = useProvider()
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

    const { signTypedDataAsync } = useSignTypedData({
        domain: {
            name: selectedToken?.name,
            version: "1",
            chainId: selectedSourceChain?.id,
            verifyingContract: selectedToken?.address as any
        } as const,
        types: {
            Permit: [
                {
                    name: "owner",
                    type: "address",
                },
                {
                    name: "spender",
                    type: "address",
                },
                {
                    name: "value",
                    type: "uint256",
                },
                {
                    name: "nonce",
                    type: "uint256",
                },
                {
                    name: "deadline",
                    type: "uint256",
                },
            ],
        } as const
        ,
        value: {
            owner: address as any,
            spender: chainInfo[selectedSourceChain!.id].contract as any,
            value: amount!,
            nonce: nonce,
            deadline: ethers.constants.MaxUint256,
        } as const

    })

    const bridgeToken = async () => {

        if (isLoading) return
        if (!signer) return



        if (!selectedToken || !amount || !selectedTargetChain || !selectedSourceChain) return
        setIsLoading(true)

        try {

            const erc20Name = selectedToken.name
            const erc20Symbol = selectedToken.symbol
            let initiateTx;
            if (!hasPermit) {
                const transferTransaction = await erc20Contract?.approve(
                    chainInfo[selectedSourceChain!.id].contract,
                    amount
                )

                await transferTransaction?.wait()

                console.log("Approved Bridge")

                setStep(1)


                initiateTx = await bridgeContract!.initiateTransfer(
                    address,
                    selectedToken?.address,
                    selectedTargetChain.id,
                    amount,
                );

                await initiateTx.wait();

            } else {
                setStep(1)

                const signedData = await signTypedDataAsync()


                const { v, r, s } = ethers.utils.splitSignature(signedData!)



                initiateTx = await bridgeContract!.initiateTransferWithPermit(
                    address,
                    selectedToken?.address,
                    selectedTargetChain.id,
                    amount,
                    ethers.constants.MaxUint256,
                    v,
                    r,
                    s
                )

                await initiateTx.wait();
            }






            console.log("Initiated transfer")

            setStep(2)

            const timeStamp = Math.floor(Date.now() / 1000);

            const bodyObject = {
                symbol: erc20Symbol,
                tokenName: erc20Name,
                amount: amount,
                to: address,
                tokenAddress: selectedToken.address,
                contractAddress: chainInfo[selectedTargetChain.id].contract,
                selectedChainId: selectedTargetChain.id,
                type: "mint"
            }

            let data = {
                t: timeStamp,
                content: bodyObject,
            };

            const hashedValue = hash(JSON.stringify(data));
            const privateKey = process.env.NEXT_PUBLIC_API_SECRET_KEY

            const result = await axios.post(
                "/api/webhook",
                {
                    t: timeStamp,
                    hash: hashedValue,
                    data: bodyObject,
                    selectedChainId: selectedTargetChain.id,
                    privateKey
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
        console.log(isLoading)
        if (isLoading) return
        (async () => {
            await bridgeToken()
        })()
    }, [signer, selectedToken, amount, selectedTargetChain, selectedSourceChain])

    return <div className="w-screen h-screen fixed inset-0 z-10 bg-black/40 flex items-center justify-center">
        <div className="w-[40rem] p-4 bg-secondaryBg rounded-lg flex flex-col gap-y-4">
            <span className="font-bold text-lg">Bridge doing bridge things</span>
            <ul className="steps self-center">
                {!hasPermit && <li className={`step ${step >= 0 && "step-primary"} ${isComplete && "step-success"} `}>Approve Transfer</li>}
                <li className={`step ${step > 0 && "step-primary"} ${isComplete && "step-success"}`}>Locking Tokens</li>
                <li className={`step ${step > 1 && "step-primary"} ${isComplete && "step-success"}`}>Minting</li>
                <li className={`step ${step > 2 && "step-primary"} ${isComplete && "step-success"}`}>Complete</li>
            </ul>
            {
                transaction === "" ?
                    <>
                        <If condition={
                            step === 0
                        }>
                            <Then>
                                <Lottie
                                    options={lottieConfig(contractLottie)}
                                    height={200}
                                    width={200}
                                />
                            </Then>
                            <Else>
                                <If condition={step === 1}>
                                    <Then>
                                        <Lottie
                                            options={lottieConfig(lockLotietLottie)}
                                            height={200}
                                            width={200}
                                        />
                                    </Then>
                                    <Else>
                                        <If condition={step === 2}>
                                            <Then>
                                                <Lottie
                                                    options={lottieConfig(sendLottie)}
                                                    height={200}
                                                    width={200}
                                                />
                                            </Then>

                                        </If>
                                    </Else>
                                </If>
                            </Else>
                        </If>
                        <p className='self-center font-bold'>DO NOT CLOSE THE PAGE</p>
                    </>
                    :
                    <>
                        <Lottie
                            options={lottieConfig(walletLottie)}
                            height={200}
                            width={200}
                        />

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
