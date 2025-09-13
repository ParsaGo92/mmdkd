import buttonGif from "@assets/images/button.gif";
import chillPillGif from "@assets/images/chill_pill.gif";
import firefoxgetGif from "@assets/images/firefoxget.gif";
import halfLifeGif from "@assets/images/half-life.gif";
import macosGif from "@assets/images/macos.gif";
import poweredByDebianGif from "@assets/images/powered-by-debian.gif";
import saynotoweb3Gif from "@assets/images/saynotoweb3.gif";
import sucksGif from "@assets/images/sucks.gif";
import telegramGif from "@assets/images/telegram.gif";
import vscGif from "@assets/images/vsc.gif";

export default function WebringBanners() {
  const banners = [
    { 
      id: '1', 
      image: buttonGif,
      alt: "button gif",
      url: "#"
    },
    { 
      id: '2', 
      image: chillPillGif,
      alt: "chill pill", 
      url: "#"
    },
    { 
      id: '3', 
      image: firefoxgetGif,
      alt: "get firefox",
      url: "https://www.mozilla.org/firefox/"
    },
    { 
      id: '4', 
      image: halfLifeGif,
      alt: "half life",
      url: "#"
    },
    { 
      id: '5', 
      image: macosGif,
      alt: "macos",
      url: "#"
    },
    { 
      id: '6', 
      image: poweredByDebianGif,
      alt: "powered by debian",
      url: "https://www.debian.org/"
    },
    { 
      id: '7', 
      image: saynotoweb3Gif,
      alt: "say no to web3",
      url: "#"
    },
    { 
      id: '8', 
      image: sucksGif,
      alt: "sucks",
      url: "#"
    },
    { 
      id: '9', 
      image: telegramGif,
      alt: "telegram",
      url: "https://telegram.org/"
    },
    { 
      id: '10', 
      image: vscGif,
      alt: "visual studio code",
      url: "https://code.visualstudio.com/"
    }
  ];

  return (
    <div className="banners-container">
      <div className="copyright-text">
        copyright 2025
      </div>
    </div>
  );
}