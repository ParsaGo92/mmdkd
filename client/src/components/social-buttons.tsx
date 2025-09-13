import { useState } from 'react';

// Import social platform icons
import DiscordIcon from "@/assets/Discord.j_ZV8_P8.png";
import InstagramIcon from "@/assets/Instagram.D27R3SYi.png";
import TwitterIcon from "@/assets/Twitter.D6cvzweC.png";
import YoutubeIcon from "@/assets/Youtube.Cx3HgCZh.png";
import SteamIcon from "@/assets/Steam.A8yoDAcN.png";
import SpotifyIcon from "@/assets/Spotify.C-DErQdT.png";
import SoundcloudIcon from "@/assets/Soundcloud.CCP7vrGE.png";
import LastfmIcon from "@/assets/Lastfm.Cp8nHnGs.png";
import TelegramIcon from "@/assets/Telegram.DJ5mBl0Y.png";
import VrchatIcon from "@/assets/VRChat.rkfyIuay.png";

interface SocialButton {
  name: string;
  url: string;
  icon: string;
  alt: string;
}

const socialButtons: { [key: string]: SocialButton[] } = {
  socials: [
    {
      name: "Instagram", 
      url: "https://instagram.com/ygmania",
      icon: InstagramIcon,
      alt: "Instagram"
    }
  ],
  contacts: [
    {
      name: "Telegram",
      url: "https://t.me/ygmania",
      icon: TelegramIcon,
      alt: "Telegram"
    }
  ],
  music: [
    {
      name: "Spotify",
      url: "https://open.spotify.com",
      icon: SpotifyIcon,
      alt: "Spotify"
    },
    {
      name: "SoundCloud",
      url: "https://soundcloud.com",
      icon: SoundcloudIcon,
      alt: "SoundCloud"
    }
  ]
};

export default function SocialButtons() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<string>('socials');

  const handleImageLoad = (name: string) => {
    setLoadedImages(prev => new Set(prev).add(name));
  };

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <section className="links" data-testid="social-buttons">
      <h2>links</h2>
      <div className="selector">
        <a 
          className={activeTab === 'socials' ? 'active' : ''} 
          role="button" 
          tabIndex={0}
          onClick={() => handleTabClick('socials')}
        >
          socials
        </a>
        <span>─</span>
        <a 
          role="button" 
          tabIndex={0}
          className={activeTab === 'contacts' ? 'active' : ''}
          onClick={() => handleTabClick('contacts')}
        >
          contacts
        </a>
        <span>─</span>
        <a 
          role="button" 
          tabIndex={0}
          className={activeTab === 'music' ? 'active' : ''}
          onClick={() => handleTabClick('music')}
        >
          my music
        </a>
      </div>
      <div className="embla">
        <div className="embla__viewport">
          <div className="embla__container">
            <div className="embla__slide buttons">
              {socialButtons[activeTab]?.map((button) => (
                <a
                  key={button.name}
                  href={button.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card card-centered card-clickable card-hoverable"
                  data-testid={`social-link-${button.name.toLowerCase()}`}
                  title={button.name}
                >
                  <div className="link">
                    <img
                      src={button.icon}
                      alt={`${button.alt} icon`}
                      width="56"
                      height="56"
                      className={`social-link-icon ${loadedImages.has(button.name) ? 'loaded' : ''}`}
                      onLoad={() => handleImageLoad(button.name)}
                      data-testid={`social-icon-${button.name.toLowerCase()}`}
                    />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}