document.addEventListener("DOMContentLoaded", () => {
  const defaultSeason = document.body.getAttribute("data-default-season");
  loadSeason(defaultSeason);

  // Bind change event to episode dropdown
  document.getElementById("episodeSelect").addEventListener("change", loadEpisodeParts);
});

let currentParts = []; // Track parts for autoplay
let currentIndex = 0;

function loadSeason(seasonId) {
  const videoData = document.getElementById("videoData");
  const episodeSelect = document.getElementById("episodeSelect");

  // Clear episode dropdown
  episodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';

  // Hide all seasons
  videoData.querySelectorAll(".season").forEach(season => {
    season.style.display = "none";
  });

  // Show selected season
  const currentSeason = videoData.querySelector(`.season[data-season="${seasonId}"]`);
  if (!currentSeason) return;

  currentSeason.style.display = "block";

  // Populate episode dropdown
  currentSeason.querySelectorAll(".episode").forEach(ep => {
    const episodeName = ep.getAttribute("data-episode");
    const option = document.createElement("option");
    option.value = episodeName;
    option.textContent = episodeName;
    episodeSelect.appendChild(option);
  });

  // Reset video and parts
  const videoPlayer = document.getElementById("videoPlayer");
  videoPlayer.pause();
  videoPlayer.src = "";
  document.getElementById("partList").innerHTML = "";
}

function loadEpisodeParts() {
  const episodeSelect = document.getElementById("episodeSelect");
  const selectedEpisode = episodeSelect.value;
  const videoData = document.getElementById("videoData");
  const visibleSeason = Array.from(videoData.querySelectorAll(".season")).find(
    season => season.style.display === "block"
  );

  if (!selectedEpisode || !visibleSeason) return;

  const episode = visibleSeason.querySelector(`.episode[data-episode="${selectedEpisode}"]`);
  const partList = document.getElementById("partList");
  partList.innerHTML = "";

  if (!episode) return;

  const parts = Array.from(episode.querySelectorAll(".part"));
  if (parts.length === 0) {
    partList.innerHTML = "<li>No video parts found for this episode.</li>";
    return;
  }

  currentParts = parts; // Store parts for autoplay
  currentIndex = 0;

  parts.forEach((part, index) => {
    const videoSrc = part.getAttribute("data-src");
    const imgSrc = part.getAttribute("data-img");
    const altText = part.getAttribute("data-alt") || `Part ${index + 1}`;

    const li = document.createElement("li");
    li.classList.add("part-thumbnail");

    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = altText;
    img.className = "thumb";

    img.addEventListener("click", () => {
      playPartAt(index);
    });

    const caption = document.createElement("p");
    caption.className = "thumb-caption";
    caption.textContent = altText;

    li.appendChild(img);
    li.appendChild(caption);
    partList.appendChild(li);
  });
}

function playPartAt(index) {
  const part = currentParts[index];
  if (!part) return;

  const videoSrc = part.getAttribute("data-src");
  const videoPlayer = document.getElementById("videoPlayer");

  videoPlayer.pause();
  videoPlayer.src = videoSrc;
  videoPlayer.play();

  currentIndex = index;

  // Highlight active part
  document.querySelectorAll(".part-thumbnail").forEach(thumb => {
    thumb.classList.remove("active");
  });
  const activeThumbnail = document.querySelectorAll(".part-thumbnail")[index];
  if (activeThumbnail) {
    activeThumbnail.classList.add("active");
  }

  // Setup event for auto play next
  videoPlayer.onended = () => {
    if (currentIndex + 1 < currentParts.length) {
      playPartAt(currentIndex + 1);
    }
  };
}
