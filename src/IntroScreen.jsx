import { content } from "./content.js";
import { PulsingHeart } from "./CuteAnimation.jsx";

export default function IntroScreen({ onNext }) {
  return (
    <section className="screen screen--center">
      <div className="stagger">
        <div className="intro-heart">
          <PulsingHeart size={48} />
        </div>
        <p className="eyebrow">{content.introEyebrow}</p>
        <h1 className="title title--xl">{content.introTitle}</h1>
        <button className="btn btn--primary btn--large" onClick={onNext}>
          {content.introButton}
        </button>
      </div>
    </section>
  );
}
