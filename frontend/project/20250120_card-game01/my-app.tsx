import { useEffect, useMemo, useRef, useState } from 'react'
import './my-app.css'
import { BattlePage } from './pages/battle-page'
import { EntryPage } from './pages/entry-page'
import { LobbyPage } from './pages/lobby-page'
import { MatchPage } from './pages/match-page'
import { ResultPage } from './pages/result-page'
import {
  createTranslator,
  getPreferredLanguage,
  languageStorageKey,
  type Language,
  type MessageKey,
} from './i18n'
import type { GameOver, RoomState, RoomSummary, RoundResult } from './types'

type Theme = 'light' | 'dark'

type Route =
  | { name: 'entry' }
  | { name: 'lobby' }
  | { name: 'match'; roomId: string }
  | { name: 'battle' }
  | { name: 'result' }

const themeStorageKey = 'card_duel_theme'

const getPreferredTheme = (): Theme => {
  if (typeof window === 'undefined') {
    return 'light'
  }

  let stored: string | null = null
  try {
    stored = window.localStorage.getItem(themeStorageKey)
  } catch (error) {
    stored = null
  }

  if (stored === 'light' || stored === 'dark') {
    return stored
  }

  return 'light'
}

function MyApp() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme())
  const [language, setLanguage] = useState<Language>(() => getPreferredLanguage())
  const [route, setRoute] = useState<Route>({ name: 'entry' })
  const [lobbyErrorKey, setLobbyErrorKey] = useState<MessageKey | null>(null)
  const [rooms, setRooms] = useState<RoomSummary[]>([])
  const [roomsErrorKey, setRoomsErrorKey] = useState<MessageKey | null>(null)
  const [roomsLoading, setRoomsLoading] = useState(false)
  const [draftName, setDraftName] = useState('')
  const pendingJoinRef = useRef(false)
  const pendingBotRef = useRef(false)
  const [playerInfo, setPlayerInfo] = useState({
    roomId: '',
    playerName: '',
    playerId: '',
    opponentId: '',
  })
  const [roomState, setRoomState] = useState<RoomState | null>(null)
  const [roundResult, setRoundResult] = useState<RoundResult | null>(null)
  const [gameOver, setGameOver] = useState<GameOver | null>(null)
  const wsRef = useRef<WebSocket | null>(null)
  const pendingMessageRef = useRef<string | null>(null)
  const t = useMemo(() => createTranslator(language), [language])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    try {
      window.localStorage.setItem(themeStorageKey, theme)
    } catch (error) {
      // Ignore write failures (private mode, restricted storage).
    }
  }, [theme])

  useEffect(() => {
    document.documentElement.lang = language
    try {
      window.localStorage.setItem(languageStorageKey, language)
    } catch (error) {
      // Ignore write failures (private mode, restricted storage).
    }
  }, [language])

  useEffect(() => {
    if (route.name === 'match' && route.roomId !== playerInfo.roomId) {
      setPlayerInfo((prev) => ({ ...prev, roomId: route.roomId }))
    }
  }, [route, playerInfo.roomId])

  useEffect(() => {
    if (route.name !== 'battle') {
      return
    }
    if (!playerInfo.playerId || !playerInfo.roomId) {
      navigateToEntry()
    }
  }, [route.name, playerInfo.playerId, playerInfo.roomId])

  useEffect(() => {
    if (route.name !== 'result') {
      return
    }
    if (!gameOver) {
      navigateToEntry()
    }
  }, [route.name, gameOver])

  useEffect(() => {
    if (playerInfo.playerName) {
      document.title = `${playerInfo.playerName} - ${t('app.title')}`
    } else {
      document.title = t('app.title')
    }
  }, [playerInfo.playerName, t])

  useEffect(() => {
    if (route.name !== 'lobby') {
      return
    }

    let active = true
    const fetchRooms = async () => {
      if (!active) {
        return
      }
      setRoomsLoading(true)
      try {
        const response = await fetch('/api/20250120_card-game01/rooms')
        if (!response.ok) {
          throw new Error('Rooms fetch failed')
        }
        const payload = await response.json()
        const list = Array.isArray(payload?.rooms) ? (payload.rooms as RoomSummary[]) : []
        if (active) {
          setRooms(list)
          setRoomsErrorKey(null)
        }
      } catch (error) {
        if (active) {
          setRoomsErrorKey('lobby.error.fetch')
        }
      } finally {
        if (active) {
          setRoomsLoading(false)
        }
      }
    }

    fetchRooms()
    const intervalId = window.setInterval(fetchRooms, 4000)

    return () => {
      active = false
      window.clearInterval(intervalId)
    }
  }, [route.name])

  const resetSession = () => {
    setPlayerInfo({ roomId: '', playerName: '', playerId: '', opponentId: '' })
    setRoomState(null)
    setRoundResult(null)
    setGameOver(null)
    pendingJoinRef.current = false
    pendingBotRef.current = false
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    pendingMessageRef.current = null
  }

  const navigateToEntry = (options?: { preserveLobbyError?: boolean }) => {
    setRoute({ name: 'entry' })
    resetSession()
    if (!options?.preserveLobbyError) {
      setLobbyErrorKey(null)
    }
  }

  const navigateToLobby = (options?: { preserveLobbyError?: boolean }) => {
    setRoute({ name: 'lobby' })
    resetSession()
    if (!options?.preserveLobbyError) {
      setLobbyErrorKey(null)
    }
  }

  const navigateToMatch = (roomId: string) => {
    setRoute({ name: 'match', roomId })
  }

  const navigateToBattle = () => {
    setRoute({ name: 'battle' })
  }

  const navigateToResult = () => {
    setRoute({ name: 'result' })
  }

  const handleSocketMessage = (rawMessage: string) => {
    let message
    try {
      message = JSON.parse(rawMessage)
    } catch (error) {
      return
    }

    if (!message?.type) {
      return
    }

    if (message.type === 'room_created') {
      const roomId = message.payload?.roomId || ''
      const playerId = message.payload?.playerId || ''
      const isBotRoom = pendingBotRef.current
      setPlayerInfo((prev) => ({ ...prev, roomId, playerId }))
      setLobbyErrorKey(null)
      pendingJoinRef.current = false
      pendingBotRef.current = false
      if (roomId) {
        if (isBotRoom) {
          navigateToBattle()
        } else {
          navigateToMatch(roomId)
        }
      }
      return
    }

    if (message.type === 'room_joined') {
      const roomId = message.payload?.roomId || ''
      const playerId = message.payload?.playerId || ''
      setPlayerInfo((prev) => ({ ...prev, roomId, playerId }))
      setLobbyErrorKey(null)
      pendingJoinRef.current = false
      pendingBotRef.current = false
      if (roomId) {
        navigateToMatch(roomId)
      }
      return
    }

    if (message.type === 'error') {
      const errorMessage = message.payload?.message
      const wasPendingJoin = pendingJoinRef.current
      pendingJoinRef.current = false
      pendingBotRef.current = false

      if (wasPendingJoin) {
        let nextErrorKey: MessageKey | null = 'lobby.error.generic'
        if (errorMessage === 'Room not found.') {
          nextErrorKey = 'lobby.error.room_not_found'
        } else if (errorMessage === 'Room is full.') {
          nextErrorKey = 'lobby.error.room_full'
        } else if (errorMessage === 'Room already finished.') {
          nextErrorKey = 'lobby.error.room_finished'
        }
        setLobbyErrorKey(nextErrorKey)
        navigateToLobby({ preserveLobbyError: true })
      }
      return
    }

    if (message.type === 'room_state') {
      const payload = message.payload as RoomState
      if (!payload?.roomId) {
        return
      }
      setRoomState(payload)
      if (payload.status === 'playing' && gameOver) {
        setGameOver(null)
      }
      if (roundResult && payload.round === 1 && roundResult.round > 1) {
        setRoundResult(null)
      }
      setPlayerInfo((prev) => {
        if (!prev.playerId) {
          return prev
        }
        const opponent = payload.players.find((entry) => entry.playerId !== prev.playerId)
        if (!opponent || opponent.playerId === prev.opponentId) {
          return prev
        }
        return { ...prev, opponentId: opponent.playerId }
      })

      if (payload.status === 'playing' && payload.players.length === 2) {
        navigateToBattle()
      }
      if (payload.players.length < 2) {
        setRoundResult(null)
        setGameOver(null)
        navigateToMatch(payload.roomId)
      }
      return
    }

    if (message.type === 'round_result') {
      const payload = message.payload as RoundResult
      if (!payload?.roomId) {
        return
      }
      setRoundResult(payload)
      return
    }

    if (message.type === 'game_over') {
      const payload = message.payload as GameOver
      if (!payload?.roomId) {
        return
      }
      setGameOver(payload)
      navigateToResult()
      return
    }
  }

  const connectSocket = () => {
    const existing = wsRef.current
    if (existing && existing.readyState !== WebSocket.CLOSED) {
      return existing
    }

    const wsProto = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const wsPath = '/api/20250120_card-game01/ws'
    const wsUrl = import.meta.env.DEV
      ? `ws://${window.location.host}${wsPath}`
      : `${wsProto}://${window.location.host}${wsPath}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.addEventListener('open', () => {
      if (pendingMessageRef.current) {
        ws.send(pendingMessageRef.current)
        pendingMessageRef.current = null
      }
    })

    ws.addEventListener('message', (event) => {
      handleSocketMessage(event.data.toString())
    })

    ws.addEventListener('close', () => {
      if (wsRef.current === ws) {
        wsRef.current = null
      }
    })

    return ws
  }

  const sendMessage = (message: object) => {
    const ws = connectSocket()
    const payload = JSON.stringify(message)
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(payload)
      return
    }
    pendingMessageRef.current = payload
  }

  const handlePlayAction = (action: 'attack' | 'defend' | 'rest') => {
    if (!playerInfo.roomId || !playerInfo.playerId || !roomState) {
      return
    }
    if (roomState.status !== 'playing') {
      return
    }

    sendMessage({
      type: 'play_action',
      payload: {
        roomId: playerInfo.roomId,
        round: roomState.round,
        playerId: playerInfo.playerId,
        action,
      },
    })
  }

  const handleRematch = () => {
    if (!playerInfo.roomId || !playerInfo.playerId) {
      return
    }
    setRoundResult(null)
    setGameOver(null)
    sendMessage({
      type: 'rematch',
      payload: {
        roomId: playerInfo.roomId,
        playerId: playerInfo.playerId,
      },
    })
    navigateToMatch(playerInfo.roomId)
  }

  const buildGuestName = () => `${t('player.guest')}${Math.floor(100 + Math.random() * 900)}`

  const handleEntryBotMatch = () => {
    const playerName = buildGuestName()
    setDraftName(playerName)
    setPlayerInfo({
      roomId: '',
      playerName,
      playerId: '',
      opponentId: '',
    })
    pendingBotRef.current = true
    sendMessage({ type: 'create_room_bot', payload: { playerName } })
  }

  const handleLobbyCreate = ({ playerName }: { playerName: string }) => {
    setDraftName(playerName)
    setPlayerInfo({
      roomId: '',
      playerName,
      playerId: '',
      opponentId: '',
    })
    pendingBotRef.current = false
    sendMessage({ type: 'create_room', payload: { playerName } })
  }

  const handleLobbyCreateBot = ({ playerName }: { playerName: string }) => {
    setDraftName(playerName)
    setPlayerInfo({
      roomId: '',
      playerName,
      playerId: '',
      opponentId: '',
    })
    pendingBotRef.current = true
    sendMessage({ type: 'create_room_bot', payload: { playerName } })
  }

  const handleLobbyJoin = ({ roomId, playerName }: { roomId: string; playerName: string }) => {
    setLobbyErrorKey(null)
    pendingJoinRef.current = true
    setDraftName(playerName)
    setPlayerInfo({
      roomId,
      playerName,
      playerId: '',
      opponentId: '',
    })
    sendMessage({ type: 'join_room', payload: { roomId, playerName } })
  }

  const playerIndex = roomState?.players.findIndex((player) => player.playerId === playerInfo.playerId)
  const playerSide = playerIndex === 0 ? 'p1' : playerIndex === 1 ? 'p2' : null

  return (
    <div className="app">
      <div className="app__topbar">
        {route.name === 'battle' ? (
          <button className="app__toggle" type="button" onClick={() => navigateToLobby()}>
            {t('battle.back')}
          </button>
        ) : null}
        <button
          className="app__toggle"
          type="button"
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          aria-pressed={theme === 'dark'}
        >
          {theme === 'light' ? t('toggle.theme.dark') : t('toggle.theme.light')}
        </button>
        <button
          className="app__toggle"
          type="button"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          aria-pressed={language === 'zh'}
        >
          {language === 'zh' ? t('toggle.lang.en') : t('toggle.lang.zh')}
        </button>
      </div>
      {route.name === 'entry' ? (
        <EntryPage t={t} onHumanMatch={() => navigateToLobby()} onBotMatch={handleEntryBotMatch} />
      ) : null}
      {route.name === 'lobby' ? (
        <LobbyPage
          t={t}
          rooms={rooms}
          loading={roomsLoading}
          roomsErrorKey={roomsErrorKey}
          joinErrorKey={lobbyErrorKey}
          onClearJoinError={() => setLobbyErrorKey(null)}
          playerName={draftName}
          onPlayerNameChange={setDraftName}
          onCreateRoom={handleLobbyCreate}
          onCreateBot={handleLobbyCreateBot}
          onJoinRoom={handleLobbyJoin}
          onBack={navigateToEntry}
        />
      ) : null}
      {route.name === 'match' ? (
        <MatchPage
          t={t}
          roomId={route.roomId}
          playerName={playerInfo.playerName}
          playerId={playerInfo.playerId}
          status={roomState?.status}
          playersCount={roomState?.players.length}
          onBack={navigateToLobby}
        />
      ) : null}
      {route.name === 'battle' ? (
        <BattlePage
          t={t}
          playerId={playerInfo.playerId}
          opponentId={playerInfo.opponentId}
          roomState={roomState}
          roundResult={roundResult}
          playerSide={playerSide}
          onPlayAction={handlePlayAction}
        />
      ) : null}
      {route.name === 'result' ? (
        <ResultPage
          t={t}
          playerId={playerInfo.playerId}
          playerSide={playerSide}
          gameOver={gameOver}
          onRematch={handleRematch}
          onBack={navigateToLobby}
        />
      ) : null}
    </div>
  )
}

export default MyApp
