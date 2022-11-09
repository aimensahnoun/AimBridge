// React import
import { useEffect, useRef, useState } from 'react';

// Dependencies import
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useContractRead } from 'wagmi';
import { useAtom } from 'jotai';


// Utils import
import { navbarHeightAtom } from '@/utils/global-state';
import Link from 'next/link';


const Navbar = () => {

    // Global state
    const [_navHeight, setNavHeight] = useAtom(navbarHeightAtom);

    // Wagmi state
    const { isConnected } = useAccount();


    // Ref
    const navRef = useRef<HTMLDivElement>(null);

    // useEffect
    useEffect(() => {
        const height = navRef.current?.clientHeight;
        if (height) setNavHeight(height);
    }, [navRef.current])


    return  <nav ref={navRef} className='flex p-4 items-center justify-between w-full border-b-[1px] border-b-gray-700'>
        <div className='flex gap-x-6 items-center'>

            <Link href='/' className='font-bold text-lg'>
                AimBridge
            </Link>

            {isConnected && <Link href="/history" className='text-gray-400 hover:text-gray-200'>
                User History
            </Link>}
        </div>

        <div className='flex gap-x-2 items-center'>

            <ConnectButton />

        </div>

    </nav>
}

export default Navbar