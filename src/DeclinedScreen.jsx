import { content } from "./content.js";

export default function DeclinedScreen({ onRetry }) {
  return (
    <section className="screen screen--center">
      <div className="stagger">
        <div className="declined-mark" aria-hidden="true">❀</div>
        <h1 className="title title--lg">{content.declinedTitle}</h1>
        <p className="subtitle">{content.declinedText}</p>
        <button className="btn btn--ghost" onClick={onRetry}>
          {content.declinedButton}
        </button>
      </div>
    </section>
  );
}
