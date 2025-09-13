import FontSwitcher from "@/components/font-switcher";
import ProfileCard from "@/components/profile-card";
import AboutSection from "@/components/about-section";
import SocialButtons from "@/components/social-buttons";
import RecentTracks from "@/components/recent-tracks";
import WebringBanners from "@/components/webring-banners";

export default function Home() {
  return (
    <div className="layout">
      <div className="layout-header">
        <FontSwitcher />
      </div>
      
      <main>
        <div className="container">
          <header>
            <div className="hero">
              <div className="hero__sidebar">
                <ProfileCard />
              </div>
              
              <div className="hero__main">
                <AboutSection />
              </div>
            </div>
          </header>
          
          <main>
            <section className="music-carousel-section">
              <RecentTracks />
            </section>
            <SocialButtons />
            <WebringBanners />
          </main>
        </div>
      </main>
    </div>
  );
}