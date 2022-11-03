// React import
import { useEffect, useRef, useState } from 'react';

// Dependencies import
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from 'wagmi';
import { useAtom } from 'jotai';


// Utils import
import { navbarHeightAtom } from '@/utils/global-state';


const Navbar = () => {

    // Global state
    const [_navHeight, setNavHeight] = useAtom(navbarHeightAtom);

    // Local state
    const [isModalOpen, setIsModalOpen] = useState(false);

    // // Wagmi state
    // const { address } = useAccount();
    // const { data: ownerAddress } = useContractRead({
    //     ...contractConfig,
    //     functionName: "owner"
    // })

    // Ref
    const navRef = useRef<HTMLDivElement>(null);

    // useEffect
    useEffect(() => {
        const height = navRef.current?.clientHeight;
        if (height) setNavHeight(height);
    }, [navRef.current])


    return <nav ref={navRef} className='flex p-4 items-center justify-between w-full border-b-[1px] border-b-gray-700'>
        <span className='font-bold text-lg'>AimBridge</span>

        <div className='flex gap-x-2 items-center'>

            <ConnectButton />

        </div>

    </nav>
}

export default Navbar