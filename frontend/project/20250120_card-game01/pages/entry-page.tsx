import type { Translator } from '../i18n'

type EntryPageProps = {
  t: Translator
  onHumanMatch: () => void
  onBotMatch: () => void
}

export function EntryPage({ t, onHumanMatch, onBotMatch }: EntryPageProps) {
  return (
    <section className="entry entry--home">
      <header className="entry__header">
        <p className="entry__eyebrow">{t('entry.eyebrow')}</p>
        <h1 className="entry__title">{t('entry.title')}</h1>
        <p className="entry__subtitle">{t('entry.subtitle')}</p>
      </header>

      <div className="entry__choices">
        <button className="entry__choice" onClick={onHumanMatch} type="button">
          <span className="entry__choice-tag">{t('entry.choice_human_tag')}</span>
          <h2 className="entry__choice-title">{t('entry.choice_human')}</h2>
          <p className="entry__choice-desc">{t('entry.choice_human_desc')}</p>
          <span className="entry__choice-action">{t('entry.choice_human_action')}</span>
        </button>

        <button className="entry__choice entry__choice--bot" onClick={onBotMatch} type="button">
          <span className="entry__choice-tag">{t('entry.choice_bot_tag')}</span>
          <h2 className="entry__choice-title">{t('entry.choice_bot')}</h2>
          <p className="entry__choice-desc">{t('entry.choice_bot_desc')}</p>
          <span className="entry__choice-action">{t('entry.choice_bot_action')}</span>
        </button>
      </div>
    </section>
  )
}
