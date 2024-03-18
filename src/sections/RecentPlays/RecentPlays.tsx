import { BPS_PER_WHOLE, GambaTransaction } from 'gamba-core-v2'
import { TokenValue, useTokenMeta } from 'gamba-react-ui-v2'
import React from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { extractMetadata } from '../../utils'
import { Container, Jackpot, Profit, Recent, Skeleton } from './RecentPlays.styles'
import { ShareModal } from './ShareModal'
import { useRecentPlays } from './useRecentPlays'

function TimeDiff({ time, suffix = 'ago' }: {time: number, suffix?: string}) {
  const diff = (Date.now() - time)
  return React.useMemo(() => {
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    if (hours >= 1) {
      return hours + 'h ' + suffix
    }
    if (minutes >= 1) {
      return minutes + 'm ' + suffix
    }
    return 'Just now'
  }, [diff])
}

function RecentPlay({ event }: {event: GambaTransaction<'GameSettled'>}) {
  const data = event.data
  const token = useTokenMeta(data.tokenMint)
  const md = useMediaQuery('md')

  const multiplier = data.bet[data.resultIndex.toNumber()] / BPS_PER_WHOLE
  const wager = data.wager.toNumber()
  const payout = multiplier * wager
  const profit = payout - wager

  const { game } = extractMetadata(event)

  return (
    <>
      <img src={game?.meta.image} style={{ height: '1.5em' }} />
      <div style={{ color: '#a079ff' }}>
        {data.user.toBase58().substring(0, 4)}...
      </div>
      {md && (profit >= 0 ? ' won ' : ' lost ')}
      <Profit $win={profit > 0}>
        <img src={token.image} height="15px" />
        <TokenValue amount={Math.abs(profit)} mint={data.tokenMint} />
      </Profit>
      {md && (
        <>
          {profit > 0 && (
            <div>
              ({multiplier.toFixed(2)}x)
            </div>
          )}
          {data.jackpotPayoutToUser.toNumber() > 0 && (
            <Jackpot>
              +<TokenValue mint={data.tokenMint} amount={data.jackpotPayoutToUser.toNumber()} />
            </Jackpot>
          )}
        </>
      )}
    </>
  )
}

export default function RecentPlays() {
  const events = useRecentPlays()
  const [selectedGame, setSelectedGame] = React.useState<GambaTransaction<'GameSettled'>>()
  const md = useMediaQuery('md')

  return (
    <Container>
      {/* Advertisement iframe */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <iframe data-aa='2311473' src='//ad.a-ads.com/2311473?size=120x60' style={{ width: '120px', height: '60px', border: '0px', padding: '0', overflow: 'hidden', backgroundColor: 'transparent' }}></iframe>
      </div>
      
      {/* Share modal */}
      {selectedGame && (
        <ShareModal event={selectedGame} onClose={() => setSelectedGame(undefined)} />
      )}
      
      {/* Skeleton loading or other loading indicator if there are no events */}
      {!events.length && Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} />
      ))}
      
      {/* Render recent plays */}
      {events.map((tx) => (
        <Recent key={tx.signature} onClick={() => setSelectedGame(tx)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.5em' }}>
            <RecentPlay event={tx} />
          </div>
          <TimeDiff time={tx.time} suffix={md ? 'ago' : ''} />
        </Recent>
      ))}
    </Container>
  )
}
