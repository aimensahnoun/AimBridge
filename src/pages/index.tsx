// NextJS import
import Head from 'next/head'
import dynamic from 'next/dynamic'


const DynamicBridgeMain = dynamic(() => import('@/components/bridge-page'), {
  ssr: false
})

export default function Home() {



  return (
    <div>
      <Head>
        <title>AimBridge</title>
      </Head>

      <DynamicBridgeMain />
    </div>
  )
}
