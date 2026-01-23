import { useMemo, useState } from 'react'
import type { MessageKey, Translator } from '../i18n'
import type { RoomSummary } from '../types'

type LobbyPageProps = {
  t: Translator
  rooms: RoomSummary[]
  loading: boolean
  roomsErrorKey?: MessageKey | null
  joinErrorKey?: MessageKey | null
  onClearJoinError?: () => void
  playerName: string
  onPlayerNameChange: (value: string) => void
  onCreateRoom: (payload: { playerName: string }) => void
  onCreateBot: (payload: { playerName: string }) => void
  onJoinRoom: (payload: { roomId: string; playerName: string }) => void
  onBack: () => void
}

const statusLabels = {
  waiting: 'lobby.status.waiting',
  playing: 'lobby.status.playing',
  finished: 'lobby.status.finished',
} as const

export function LobbyPage({
  t,
  rooms,
  loading,
  roomsErrorKey,
  joinErrorKey,
  onClearJoinError,
  playerName,
  onPlayerNameChange,
  onCreateRoom,
  onCreateBot,
  onJoinRoom,
  onBack,
}: LobbyPageProps) {
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null)
  const displayErrorKey = errorKey ?? joinErrorKey ?? null

  const sortedRooms = useMemo(() => {
    const order = { waiting: 0, playing: 1, finished: 2 }
    return [...rooms].sort((a, b) => {
      const statusDiff = order[a.status] - order[b.status]
      if (statusDiff !== 0) return statusDiff
      return a.roomId.localeCompare(b.roomId)
    })
  }, [rooms])

  const roomStats = useMemo(() => {
    let waiting = 0
    let playing = 0
    let finished = 0
    rooms.forEach((room) => {
      if (room.status === 'waiting') waiting += 1
      if (room.status === 'playing') playing += 1
      if (room.status === 'finished') finished += 1
    })
    return { waiting, playing, finished, total: rooms.length }
  }, [rooms])

  const handleNameChange = (value: string) => {
    if (displayErrorKey) {
      setErrorKey(null)
      if (joinErrorKey && onClearJoinError) {
        onClearJoinError()
      }
    }
    onPlayerNameChange(value)
  }

  const handleCreate = () => {
    const trimmedName = playerName.trim()
    if (!trimmedName) {
      setErrorKey('lobby.error.name_required')
      return
    }

    setErrorKey(null)
    if (joinErrorKey && onClearJoinError) {
      onClearJoinError()
    }
    onCreateRoom({ playerName: trimmedName })
  }

  const handleCreateBot = () => {
    const trimmedName = playerName.trim()
    if (!trimmedName) {
      setErrorKey('lobby.error.name_required')
      return
    }

    setErrorKey(null)
    if (joinErrorKey && onClearJoinError) {
      onClearJoinError()
    }
    onCreateBot({ playerName: trimmedName })
  }

  const handleJoin = (roomId: string) => {
    const trimmedName = playerName.trim()
    if (!trimmedName) {
      setErrorKey('lobby.error.name_required')
      return
    }

    setErrorKey(null)
    if (joinErrorKey && onClearJoinError) {
      onClearJoinError()
    }
    onJoinRoom({ roomId, playerName: trimmedName })
  }

  return (
    <section className="lobby">
      <header className="lobby__header">
        <p className="lobby__eyebrow">{t('lobby.eyebrow')}</p>
        <h1 className="lobby__title">{t('lobby.title')}</h1>
        <p className="lobby__subtitle">{t('lobby.subtitle')}</p>
      </header>

      <div className="lobby__layout">
        <div className="lobby__controls">
          <div className="lobby__panel">
            <label className="lobby__field">
              <span className="lobby__label">{t('lobby.name_label')}</span>
              <input
                className={`lobby__input ${displayErrorKey ? 'lobby__input--error' : ''}`}
                placeholder={t('lobby.name_placeholder')}
                value={playerName}
                onChange={(event) => handleNameChange(event.target.value)}
              />
            </label>

            {displayErrorKey ? <p className="lobby__error">{t(displayErrorKey)}</p> : null}

            <div className="lobby__actions">
              <button className="lobby__button" onClick={handleCreate}>
                {t('lobby.action.create')}
              </button>
              <button className="lobby__button lobby__button--ghost" onClick={handleCreateBot}>
                {t('lobby.action.bot')}
              </button>
            </div>
          </div>

          <button className="lobby__back" onClick={onBack}>
            {t('lobby.action.back')}
          </button>
        </div>

        <div className="lobby__rooms">
          <div className="lobby__rooms-header">
            <div>
              <h2 className="lobby__rooms-title">{t('lobby.rooms.title')}</h2>
              <p className="lobby__rooms-subtitle">{t('lobby.rooms.subtitle')}</p>
            </div>
            <div className="lobby__rooms-stats">
              <span className="lobby__stat">{t('lobby.rooms.stats_total')}: {roomStats.total}</span>
              <span className="lobby__stat lobby__stat--waiting">{t('lobby.rooms.stats_waiting')}: {roomStats.waiting}</span>
              <span className="lobby__stat lobby__stat--playing">{t('lobby.rooms.stats_playing')}: {roomStats.playing}</span>
            </div>
          </div>

          {roomsErrorKey ? <p className="lobby__rooms-error">{t(roomsErrorKey)}</p> : null}

          {loading ? <p className="lobby__rooms-loading">{t('lobby.loading')}</p> : null}

          {!loading && sortedRooms.length === 0 ? (
            <p className="lobby__rooms-empty">{t('lobby.rooms.empty')}</p>
          ) : null}

          <div className="lobby__rooms-grid">
            {sortedRooms.map((room) => {
              const isFull = room.playersCount >= 2
              const isJoinable = room.status === 'waiting' && !isFull
              const statusLabel = t(statusLabels[room.status])
              const buttonLabel = isJoinable ? t('lobby.room.join') : isFull ? t('lobby.room.full') : statusLabel
              return (
                <article className="lobby__room" key={room.roomId}>
                  <div className="lobby__room-header">
                    <div>
                      <h3 className="lobby__room-title">#{room.roomId}</h3>
                      <p className="lobby__room-meta">
                        {t('lobby.room.players')} {room.playersCount}/2
                      </p>
                    </div>
                    <div className="lobby__room-tags">
                      {room.hasBot ? <span className="lobby__tag">{t('lobby.room.bot')}</span> : null}
                      <span
                        className={`lobby__status lobby__status--${room.status}`}
                        aria-label={statusLabel}
                      >
                        {statusLabel}
                      </span>
                    </div>
                  </div>

                  <div className="lobby__room-players">
                    {room.players.length === 0 ? (
                      <span className="lobby__player">{t('lobby.room.empty_players')}</span>
                    ) : (
                      room.players.map((player, index) => (
                        <span
                          className={`lobby__player ${player.isBot ? 'lobby__player--bot' : ''}`}
                          key={`${room.roomId}-${player.name}-${index}`}
                        >
                          {player.name}
                        </span>
                      ))
                    )}
                  </div>

                  <div className="lobby__room-progress" aria-hidden="true">
                    <span
                      className="lobby__room-progress-fill"
                      style={{ width: `${Math.min(100, (room.playersCount / 2) * 100)}%` }}
                    />
                  </div>

                  <button
                    className="lobby__room-button"
                    disabled={!isJoinable}
                    onClick={() => handleJoin(room.roomId)}
                  >
                    {buttonLabel}
                  </button>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
