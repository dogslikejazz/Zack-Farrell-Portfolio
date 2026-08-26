import { games } from '../../content/games'
import SectionShell from './SectionShell'

function GameCard({ game }) {
  const wip = game.status !== 'released'
  // Hand-edited content: only render links that are actual http(s) URLs.
  const links = (Array.isArray(game.links) ? game.links : []).filter(
    (l) => l && typeof l.url === 'string' && /^https?:\/\//.test(l.url) && l.label,
  )

  return (
    <article className={`game-card ${wip ? 'is-wip' : ''}`}>
      <div className="game-frame">
        {game.thumb ? (
          <img src={game.thumb} alt="" loading="lazy" />
        ) : (
          <span className="game-frame-empty" />
        )}
        {game.engine && <span className="engine-badge">{game.engine}</span>}
        {wip && <span className="coming-tag wip-tag">IN DEVELOPMENT</span>}
      </div>
      <div className="game-meta">
        <h2>{game.title}</h2>
        <p className="game-role">
          {game.role} · {game.year}
        </p>
        {game.description && <p className="game-desc">{game.description}</p>}
        {links.length > 0 && (
          <p className="game-links">
            {links.map((l) => (
              <a key={l.label} href={l.url} target="_blank" rel="noreferrer">
                {l.label} ↗
              </a>
            ))}
          </p>
        )}
      </div>
    </article>
  )
}

export default function GameDevSection() {
  return (
    <SectionShell index="04" sub="INTERACTIVE" title="GAME DEVELOPMENT">
      {games.length === 0 ? (
        <p className="empty-note">
          NO PROJECTS YET — add entries in <code>src/content/games.js</code> (see README).
        </p>
      ) : (
        <div className="games-grid">
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </SectionShell>
  )
}
