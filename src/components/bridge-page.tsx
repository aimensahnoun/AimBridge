// React import
import { useEffect, useState, useRef } from 'react'

// Dependencies import
import { useAtom } from 'jotai'
import { Chain, useAccount, useBalance, useContractRead, useNetwork, useSigner, useToken } from 'wagmi'
import { ethers, utils } from 'ethers'
import { If, Else, Then } from 'react-if'
import ClipLoader from "react-spinners/ClipLoader";


// Custom component import
import LandingPage from './landing'
import StepModal from './step-modal'


// Utils import
import { navbarHeightAtom, amountAtom, selectedTargetChainAtom, selectedTokenAtom, selectedSourceChainAtom, nativeTokenAddressAtom, hasPermitAtom, nonceAtom } from '@/utils/global-state'
import { getAllErc20Tokens } from '@/utils/alchemy-api'
import { Erc20Token } from '@/utils/types'
import { contractConfig } from '@/constants/contract/config'
import UnWrapModal from './unwrap-modal'
import { useRouter } from 'next/router'
import { hash } from '@/utils/hasing'
import * as ERC20 from '@/constants/contract/WrapperToken.json'
import { chainInfo } from '@/utils/chain-info'

const BridgeMain = () => {

    // Local state
    const [erc20List, setErc20List] = useState<Erc20Token[]>([])
    const [selectedErc20, setSelectedErc20] = useState<Erc20Token | null>(null)
    const [transferAmount, setTransferAmount] = useState<string>("")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isUnwrapModalOpen, setIsUnwrapModalOpen] = useState(false)
    const [ERC20FromWallet, setERC20FromWallet] = useState(true)
    const [ERC20Address, setERC20Address] = useState<string>("")
    const [isCheckingPermit, setIsCheckingPermit] = useState(false)



    // Ref
    const inputRef = useRef<HTMLInputElement>(null)

    // Global state
    const [navHeight] = useAtom(navbarHeightAtom)
    const [_, setSelectedTargetChainGlobal] = useAtom(selectedTargetChainAtom)
    const [_selectedToken, setSelectedToken] = useAtom(selectedTokenAtom)
    const [_amount, setAmount] = useAtom(amountAtom)
    const [_selectedSourceChain, setSelectedSourceChain] = useAtom(selectedSourceChainAtom)
    const [selectedNativeTokenAddress, setNativeTokenAddress] = useAtom(nativeTokenAddressAtom)
    const [hasPermit, setHasPermit] = useAtom(hasPermitAtom)
    const [_nonce, setNonce] = useAtom(nonceAtom)

    // Router
    const router = useRouter()

    // Wagmi state
    const { chain, chains } = useNetwork()
    const { address, isConnected } = useAccount()
    const { data: balanceData } = useBalance({
        addressOrName: address,
        watch: true
    })
    const { data: erc20Balance, isSuccess: didLoadErc20Balance } = useBalance({
        addressOrName: address,
        token: ERC20Address as `0x${string}`,
    })
    const { data: tokenData } = useToken({
        address: ERC20Address as `0x${string}`,
        staleTime: 2000,
    })

    const { data: nativeTokenAddress, isSuccess: gotNativeToken } = useContractRead({
        ...contractConfig(chain?.id!),
        functionName: "wrappedToNative",
        args: [ERC20FromWallet ? selectedErc20?.address : ERC20Address],
        watch: true
    })

    const { data: signer, isError, isLoading } = useSigner()

    const targetChains = chains.filter(currentChain => currentChain.id !== chain?.id)

    const [selectedTargetChain, setSelectedTargetChain] = useState<Chain>(targetChains[0])

    const chainReference = useRef(chain)


    // UseEffects
    useEffect(() => {
        (async () => {
            const tokens = await getAllErc20Tokens(address!, chain?.id!)
            const nonZeroTokens = tokens.filter(token => parseFloat(token.balance) !== 0)
            setErc20List(nonZeroTokens)
            setSelectedErc20(nonZeroTokens[0])
        })()
    }, [chain, address, isModalOpen, isUnwrapModalOpen])

    useEffect(() => {
        if (chainReference.current?.id !== chain?.id && chain !== undefined) {
            chainReference.current = chain
            router.reload()
        }

    }, [chain, router])

    useEffect(() => {
        setTransferAmount("0")
        if (inputRef.current) inputRef.current.value = "0"
    }, [ERC20FromWallet])


    // Methods
    const isButtonDisabled = () => {
        const amount = parseFloat(transferAmount)
        if (ERC20FromWallet) {
            if (selectedErc20) {
                const balance = selectedErc20.balance
                if (transferAmount.length !== 0 && amount > 0 && amount <= balance) return false
            }
        } else {
            if (ERC20Address !== "" && transferAmount.length !== 0 && amount > 0 && amount <= parseFloat(erc20Balance?.formatted!)) return false
        }
        return true
    }

    return <main suppressHydrationWarning className='w-screen flex flex-col items-center justify-center gap-y-4' style={{
        height: `calc(100vh - ${navHeight}px)`
    }}>

        <If condition={isConnected}>
            <Then>
                <span className='font-bold text-2xl'>Welcome to AimBridge</span>
                <div className='flex items-center gap-x-2' >
                    <span className='font-medium text-lg'>Source Network:</span>
                    <span>{chain?.name}</span>
                    <span>{parseFloat(balanceData?.formatted!).toFixed(2)} {balanceData?.symbol}</span>
                </div>

                <div className='p-4 bg-secondaryBg rounded-lg flex flex-col gap-y-2'>

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

                    <div className="divider" />


                    <div className="tabs self-center mb-2 tabs-boxed">
                        <a onClick={() => {
                            setERC20FromWallet(true)
                        }} className={`tab ${ERC20FromWallet ? "tab-active !bg-primaryColor" : ""}`}>Tokens from Wallet</a>
                        <a onClick={() => {
                            setERC20FromWallet(false)
                        }} className={`tab ${!ERC20FromWallet ? "tab-active !bg-primaryColor" : ""}`}>Load Token From Address</a>
                    </div>

                    <If condition={ERC20FromWallet}>
                        <If condition={erc20List.length > 0}>
                            <Then>
                                <div className="divider" />

                                <div className='flex items-center gap-x-2'>
                                    <span className='font-medium text-lg'>Token:</span>
                                    <select onChange={(event) => {
                                        const selectedToken = erc20List.find(token => token.address === event.target.value)
                                        setSelectedErc20(selectedToken!)
                                    }} className='bg-primaryColor outline-none border border-gray-700 rounded-md p-2'>
                                        {erc20List.map(currentToken => <option key={currentToken.address} value={currentToken.address}>{currentToken.symbol} {currentToken.balance}</option>)}
                                    </select>
                                </div>
                            </Then>
                            <Else>
                                <div className='self-center'>

                                    <ClipLoader
                                        color="#fff"
                                        size={20}
                                        aria-label="Loading Spinner"
                                        data-testid="loader"
                                    />
                                </div>

                            </Else>
                        </If>

                        <Else>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">ERC20 Address</span>
                                </label>
                                <label className="input-group">
                                    <span>ERC20</span>
                                    <input onChange={(event) => {
                                        setERC20Address(event.target.value)
                                    }} type="text" placeholder="0x52459834ca561cb55411699e9c2143683bcf865f" className="input input-bordered" />
                                </label>
                            </div>
                            <If condition={didLoadErc20Balance && erc20Balance?.symbol != balanceData?.symbol}>
                                <Then>
                                    <div className='divider' />
                                    <div className='flex items-center gap-x-2'>
                                        <span className='font-medium text-lg'>Token:</span>
                                        <div>
                                            <span>{erc20Balance?.symbol}</span>
                                        </div>
                                    </div>
                                    <div >
                                        <span>Balance:</span>
                                        <span>{parseFloat(erc20Balance?.formatted!).toFixed(2)} {erc20Balance?.symbol}</span>
                                    </div>
                                </Then>
                            </If>

                        </Else>
                    </If>


                    <div className="divider" />

                    <If condition={ERC20FromWallet && (selectedErc20 && selectedTargetChain != null) || !ERC20FromWallet && (selectedTargetChain != null && didLoadErc20Balance && erc20Balance?.symbol != balanceData?.symbol)}>
                        <Then>

                            <div className="form-control mb-6">
                                <label className="label">
                                    <span className="label-text">Enter amount</span>
                                </label>
                                <label className="input-group">
                                    <input ref={inputRef} onChange={(event) => {
                                        const value = event.target.value
                                        if (value.length == 0) return setTransferAmount("0")
                                        const parsedValue = parseFloat(value)
                                        if (isNaN(parsedValue)) return
                                        if (parsedValue < 0) event.target.value = "0"
                                        if (ERC20FromWallet) {
                                            if (parsedValue > selectedErc20!.balance) event.target.value = selectedErc20!.balance.toString()
                                        } else {
                                            if (parsedValue > parseFloat(erc20Balance?.formatted!)) event.target.value = erc20Balance?.formatted!
                                        }
                                        setTransferAmount(event.target.value)
                                    }} type="number" placeholder="0.01" className="input input-bordered" />
                                    <span>{
                                        ERC20FromWallet ? selectedErc20?.symbol : erc20Balance?.symbol
                                    }</span>
                                </label>
                            </div>



                            <div className='flex items-center justify-between'>
                                <button disabled={
                                    isButtonDisabled()
                                } className={`p-2 rounded-lg bg-brandPurple ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
                                    } ${nativeTokenAddress == ethers.constants.AddressZero && gotNativeToken ? "w-full" : "w-[45%]"} `}
                                    onClick={async () => {
                                        setIsCheckingPermit(true)
                                        try {
                                            const erc20 = new ethers.Contract(ERC20FromWallet ? selectedErc20?.address : tokenData?.address as any, ERC20.abi, signer!)


                                            const gas = await (await erc20.estimateGas.nonces(
                                                address!
                                            )).toNumber()

                                            console.log("Gas : ", gas)
                                            const nonce = await erc20.nonces(
                                                address!
                                            )
                                            setNonce(nonce)

                                            setHasPermit(true)


                                        } catch (e) {
                                            setHasPermit(false)
                                            console.log(e)

                                        }


                                        const parseAmount = utils.parseEther(transferAmount)
                                        setSelectedTargetChainGlobal(selectedTargetChain)
                                        setSelectedSourceChain(chain!)
                                        setSelectedToken(ERC20FromWallet ? selectedErc20 : tokenData as any)
                                        setAmount(parseAmount)
                                        setIsModalOpen(true)
                                        setIsCheckingPermit(false)
                                    }}
                                >{isCheckingPermit ? "Loading..." : "Start Transfer"}</button>

                                {
                                    nativeTokenAddress !== ethers.constants.AddressZero && gotNativeToken &&
                                    <button disabled={
                                        isButtonDisabled()
                                    } className={`p-2 rounded-lg w-[45%] bg-primaryColor ${isButtonDisabled() ? "opacity-50 cursor-not-allowed" : ""
                                        }`}
                                        onClick={async () => {
                                            setIsCheckingPermit(true)
                                            try {
                                                const erc20 = new ethers.Contract(ERC20FromWallet ? selectedErc20?.address : tokenData?.address as any, ERC20.abi, signer!)


                                                const gas = await (await erc20.estimateGas.nonces(
                                                    address!
                                                )).toNumber()

                                                console.log("Gas : ", gas)
                                                const nonce = await erc20.nonces(
                                                    address!
                                                )
                                                setNonce(nonce)

                                                setHasPermit(true)


                                            } catch (e) {
                                                setHasPermit(false)
                                                console.log(e)

                                            }
                                            const parseAmount = utils.parseEther(transferAmount)
                                            setSelectedTargetChainGlobal(selectedTargetChain)
                                            setSelectedSourceChain(chain!)
                                            setSelectedToken(ERC20FromWallet ? selectedErc20 : tokenData as any)
                                            setNativeTokenAddress(nativeTokenAddress as string)
                                            setAmount(parseAmount)

                                            setIsUnwrapModalOpen(true)
                                            setIsCheckingPermit(false)
                                        }}
                                    >{isCheckingPermit ? "Loading...": "Release Token"}</button>}
                            </div>
                        </Then>
                    </If>

                </div>
                {isModalOpen &&
                    <StepModal setIsModalOpen={setIsModalOpen} />}

                {isUnwrapModalOpen &&
                    <UnWrapModal setIsModalOpen={setIsUnwrapModalOpen} />}

            </Then>
            <Else>
                <LandingPage />
            </Else>
        </If>


    </main>
}

export default BridgeMain