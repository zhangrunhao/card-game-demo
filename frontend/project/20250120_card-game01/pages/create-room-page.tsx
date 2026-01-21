import { useState } from 'react'
import type { MessageKey, Translator } from '../i18n'

type CreateRoomPageProps = {
  t: Translator
  onCreate: (payload: { playerName: string }) => void
  onCreateBot: (payload: { playerName: string }) => void
  onBack: () => void
}

export function CreateRoomPage({ t, onCreate, onCreateBot, onBack }: CreateRoomPageProps) {
  const [playerName, setPlayerName] = useState('')
  const [errorKey, setErrorKey] = useState<MessageKey | null>(null)

  const handleCreate = () => {
    const trimmedName = playerName.trim()
    if (!trimmedName) {
      setErrorKey('create.error.name_required')
      return
    }

    setErrorKey(null)
    onCreate({ playerName: trimmedName })
  }

  const handleBotChallenge = () => {
    const trimmedName = playerName.trim()
    if (!trimmedName) {
      setErrorKey('create.error.name_required')
      return
    }

    setErrorKey(null)
    onCreateBot({ playerName: trimmedName })
  }

  return (
    <section className="entry">
      <header className="entry__header">
        <p className="entry__eyebrow">{t('create.eyebrow')}</p>
        <h1 className="entry__title">{t('create.title')}</h1>
        <p className="entry__subtitle">{t('create.subtitle')}</p>
      </header>

      <div className="entry__form">
        <label className="entry__field">
          <span className="entry__label">{t('create.player_name')}</span>
          <input
            className={`entry__input ${errorKey ? 'entry__input--error' : ''}`}
            placeholder={t('create.player_placeholder')}
            value={playerName}
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </label>

        {errorKey ? <p className="entry__error">{t(errorKey)}</p> : null}

        <div className="entry__actions">
          <button className="entry__button entry__button--ghost" onClick={onBack}>
            {t('create.back')}
          </button>
          <button className="entry__button" onClick={handleCreate}>
            {t('create.confirm')}
          </button>
          <button className="entry__button" onClick={handleBotChallenge}>
            {t('create.bot')}
          </button>
        </div>
      </div>
    </section>
  )
}
