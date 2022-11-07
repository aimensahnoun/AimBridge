// NextJS import
import Image from "next/image"

// Dependencies import
import {useConnectModal} from "@rainbow-me/rainbowkit"

// Assets import
import Exchange from "../../public/global.svg"
import Eth from "../../public/ETH.svg"
import MATIC from "../../public/MATIC.svg"



const LandingPage = () => {

    const { openConnectModal } = useConnectModal();


    const supportedChains = [
        {
            name: "Polygon",
            logo: MATIC,
        },
        {
            name: "Goerli",
            logo: Eth,
        }
    ]

    return <div className="flex items-center h-full w-[90%] justify-between">
        <div className="flex flex-col gap-y-2 items-center justify-center h-full">
            <span className="font-bold text-[5rem] magic " >Aim Bridge</span>
            <span className="font-semibold text-lg">A way to move your tokens between EVM networks.</span>
            <div className="flex gap-x-4 mt-4">
                {
                    supportedChains.map((chain, index) => <div key={index} className="flex flex-col items-center gap-y-2">
                        <Image src={chain.logo} width={50} height={50} alt={chain.name} />
                        <span className="font-semibold text-sm">{chain.name}</span>
                    </div>)
                }
            </div>


            <button onClick={openConnectModal} className="p-2 rounded-lg bg-primaryColor font-bold mt-4">Get Started</button>

        </div>


        <Image src={Exchange} width={700} height={700} alt="Intranetwork transactions" />
    </div>
}

export default LandingPage