// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  const defaultSeason = document.body.getAttribute("data-default-season");
  loadSeason(defaultSeason);
});

function loadSeason(seasonId) {
  const videoData = document.getElementById("videoData");
  const episodeSelect = document.getElementById("episodeSelect");

  // Clear episode dropdown
  episodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';

  // Get all seasons
  const seasons = videoData.querySelectorAll(".season");
  seasons.forEach(season => {
    season.style.display = "none"; // Hide all seasons
  });

  // Show selected season
  const currentSeason = videoData.querySelector(`.season[data-season="${seasonId}"]`);
  if (!currentSeason) return;

  currentSeason.style.display = "block";

  // Populate episode dropdown
  const episodes = currentSeason.querySelectorAll(".episode");
  episodes.forEach(ep => {
    const episodeName = ep.getAttribute("data-episode");
    const option = document.createElement("option");
    option.value = episodeName;
    option.textContent = episodeName;
    episodeSelect.appendChild(option);
  });

  // Clear part list and video
  document.getElementById("partList").innerHTML = "";
  document.getElementById("videoPlayer").src = "";
}

function loadEpisodeParts() {
  const episodeSelect = document.getElementById("episodeSelect");
  const selectedEpisode = episodeSelect.value;
  const videoData = document.getElementById("videoData");
  const defaultSeason = document.body.getAttribute("data-default-season");
  const currentSeason = videoData.querySelector(`.season[data-season="${defaultSeason}"]`);
  const allSeasons = videoData.querySelectorAll(".season");

  // Determine currently visible season
  let visibleSeason = null;
  allSeasons.forEach(season => {
    if (season.style.display === "block") {
      visibleSeason = season;
    }
  });

  if (!selectedEpisode || !visibleSeason) return;

  const episode = visibleSeason.querySelector(`.episode[data-episode="${selectedEpisode}"]`);
  const partList = document.getElementById("partList");
  partList.innerHTML = ""; // Clear current list

  if (!episode) return;

  const parts = episode.querySelectorAll(".part");

  parts.forEach((part, index) => {
    const videoSrc = part.getAttribute("data-src");
    const imgSrc = part.getAttribute("data-img");
    const altText = part.getAttribute("data-alt") || `Part ${index + 1}`;

    const li = document.createElement("li");

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = altText;
    img.style.cursor = "pointer";
    img.style.maxWidth = "300px";
    img.style.display = "block";

    img.addEventListener("click", () => {
      const videoPlayer = document.getElementById("videoPlayer");
      videoPlayer.src = videoSrc;
      videoPlayer.play();
    });

    const caption = document.createElement("p");
    caption.textContent = altText;

    li.appendChild(img);
    li.appendChild(caption);
    partList.appendChild(li);
  });
}
