// Fotos e vídeos da marca (assets do Cloud Design). Um único mapa para as telas.
import blueMist from "../../../assets/backgrounds/blue-mist-v2.jpg";
import citySkylineDusk from "../../../assets/photos/city-skyline-dusk.png";
import crew1 from "../../../assets/photos/crew/crew-1.jpg";
import crew2 from "../../../assets/photos/crew/crew-2.jpg";
import crew3 from "../../../assets/photos/crew/crew-3.jpg";
import crew4 from "../../../assets/photos/crew/crew-4.jpg";
import crew5 from "../../../assets/photos/crew/crew-5.jpg";
import crew6 from "../../../assets/photos/crew/crew-6.jpg";
import crew7 from "../../../assets/photos/crew/crew-7.jpg";
import crew8 from "../../../assets/photos/crew/crew-8.jpg";
import feedFalcoes from "../../../assets/photos/feed-falcoes.jpg";
import feedFuria from "../../../assets/photos/feed-furia.jpg";
import feedVelocidade from "../../../assets/photos/feed-velocidade.jpg";
import onbCrewGoggles from "../../../assets/photos/onb-crew-goggles.jpg";
import onbRoute from "../../../assets/photos/onb-route.jpg";
import runnerCitySunset from "../../../assets/photos/runner-city-sunset.png";
import runnerMountain from "../../../assets/photos/runner-mountain.png";
import teamRunningSunset from "../../../assets/photos/team-running-sunset.png";
import teamTrack from "../../../assets/photos/team-track.jpg";

export const PHOTOS = {
	blueMist,
	citySkylineDusk,
	runnerCitySunset,
	runnerMountain,
	teamRunningSunset,
	teamTrack,
	onbCrewGoggles,
	onbRoute,
	feedFalcoes,
	feedFuria,
	feedVelocidade,
};

// Fotos de exemplo da câmera do post (índice guardado em cada post publicado)
export const POST_SAMPLE_PHOTOS = [teamTrack, teamRunningSunset, onbCrewGoggles] as const;

export const CREW = [crew1, crew2, crew3, crew4, crew5, crew6, crew7, crew8];
