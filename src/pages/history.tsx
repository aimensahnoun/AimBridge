// NextJS import
import Head from 'next/head'
import dynamic from 'next/dynamic'


const DynamicBridgeMain = dynamic(() => import('@/components/history-page'), {
    ssr: false
})


export default function UserHistory() {


    return <div>
        <DynamicBridgeMain />
    </div>

}
