import { GambaStandardTokens, TokenMeta } from 'gamba-react-ui-v2'
import { PublicKey } from '@solana/web3.js'

// Can be configured in .env
export const RPC_ENDPOINT = import.meta.env.VITE_RPC_ENDPOINT ?? "https://mainnet.helius-rpc.com/?api-key=1b85c20e-a99a-471a-be1b-f288a5666b08"

// Change this value to your Solana address
export const PLATFORM_CREATOR_ADDRESS = new PublicKey('6ZTfLaoqVrWgvHehjPhhhhAvcUCLVDQR5FA3Gt2E9Vxd')

// Appears in ShareModal
export const PLATFORM_SHARABLE_URL = 'mcapysol.xyz'

// List of tokens supported by this platform
export const TOKENS: TokenMeta[] = [
  GambaStandardTokens.sol,
  GambaStandardTokens.usdc,
  {
    mint: new PublicKey("6zz62u9yEoZTe2efnnCyyHx5UUaPiThCngVxdYi8i4ix"),
    symbol: 'CAPY',
    name: 'MarketCapy',
    image: "https://i.postimg.cc/D03fmFZC/FF369273-1799-4-B32-8294-0135-D1-FA25-A8.png",
    decimals: 9,
    baseWager: 1
  }
]
