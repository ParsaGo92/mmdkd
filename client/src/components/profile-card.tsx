import { useAgeCounter } from "@/hooks/use-age-counter";
import mintGif from "@/assets/mint.gif";

import IMG_6232 from "@assets/IMG_6232.gif";

export default function ProfileCard() {
  const age = useAgeCounter();

  return (
    <div className="profile-card" data-testid="profile-card">
      <div className="profile-header">
        <h1 data-testid="profile-name">Mania</h1>
        <p className="subtitle" data-testid="profile-subtitle">peace of 🦄</p>
      </div>
      <button type="button" className="avatar-button" data-testid="avatar-button">
        <img 
          alt="mint fox gif" 
          className="avatar" 
          src={IMG_6232}
          data-testid="profile-avatar"
        />
      </button>
      <div className="stats">
        <div className="stat-item">
          <span className="stat-label" data-testid="age-label">AGE</span>
          <span className="stat-value" data-testid="age-value">{age}</span>
        </div>
        
        <div className="retro-stats">
          <div className="visit-counter">
            <h3 className="visit-label" data-testid="birth-year-label">BIRTH YEAR</h3>
            <div className="counter-display" data-testid="birth-year-value">
              2008
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}