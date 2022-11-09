// NextJS import
import Head from 'next/head'
import { useRouter } from 'next/router'

// React import
import { useEffect, useRef, useState } from 'react'

// Dependencies import
import { useAtom } from 'jotai'
import { useQuery } from '@apollo/client'
import { useAccount, useNetwork } from 'wagmi'
import ClipLoader from "react-spinners/ClipLoader";


// Utils import
import { navbarHeightAtom } from '@/utils/global-state'
import { GET_USER_HISTORY } from '@/utils/graph-queries'
import InitTransferTable from '@/components/init-transfer-table'
import TransferCompletedTable from '@/components/completed-transfer-table'
import UnwrappedTokensTable from '@/components/unwraped-tokens-table'
import BurnedTokensTable from '@/components/burned-tokens-table'


export default function HistoryPage() {

    // Local State
    const [selectedTab, setSelectedTab] = useState(0)
    const [isSSR, setIsSSR] = useState(true);

    // Wagmi state
    const { address, isConnected } = useAccount()
    const { chain } = useNetwork()

    // Global state
    const [navHeight, setNavHeight] = useAtom(navbarHeightAtom);

    // Graphql query
    const { loading, error, data: userHistory } = useQuery(
        GET_USER_HISTORY,
        {
            context: { chain: chain?.id },
            variables: { user: address?.toString() },
            pollInterval: 500

        },

    )

    const router = useRouter()

    const tabs = [
        {
            name: "Initiated Transfers",
            index: 0,
        },
        {
            name: "Completed Transfers",
            index: 1,
        },
        {
            name: "Un-Wrapped Tokens",
            index: 2,
        },
        {
            name: "Burned Tokens",
            index: 3,
        },
    ]

    const renderTable = () => {
        switch (selectedTab) {
            case 0:
                return <InitTransferTable data={userHistory} />
            case 1:
                return <TransferCompletedTable data={userHistory} />
            case 2:
                return <UnwrappedTokensTable data={userHistory} />
            case 3:
                return <BurnedTokensTable data={userHistory} />
            default:
                return <InitTransferTable data={userHistory} />
        }
    }


    useEffect(() => {
        if (!isConnected) router.replace("/")
    }, [isConnected])



    return (
        <div suppressHydrationWarning>
            <Head>
                <title>AimBridge | User History</title>
            </Head>

            <main suppressHydrationWarning className='w-screen flex flex-col items-center justify-center gap-y-4' style={{
                height: `calc(100vh - ${navHeight}px)`
            }}>
                {
                    loading ? <ClipLoader color='#fff' />  :
                    <>
                        <div className="tabs">
                            {
                                tabs.map((tab, index) => {
                                    return <a key={index} onClick={() => setSelectedTab(index)} className={`tab tab-bordered ${selectedTab === index ? 'tab-active' : ''}`}
                                    >{tab.name}</a>

                                })
                            }
                        </div>



                        {renderTable()}
                    </>
                }
            </main>

        </div>
    )
}

