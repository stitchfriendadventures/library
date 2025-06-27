const video = document.getElementById('videoPlayer');
const episodeSelect = document.getElementById('episodeSelect');
const partList = document.getElementById('partList');

const videoData = {
  "Season1": {
    "Episode 1": ["videos/Season1/Ep1-Part1.mp4", "videos/Season1/Ep1-Part2.mp4"],
    "Episode 2": ["videos/Season1/Ep2-Part1.mp4"]
  },
  "Season2": {
    "Episode 1": ["videos/Season2/Ep1-Part1.mp4", "videos/Season2/Ep1-Part2.mp4"]
  }
};

let currentParts = [];
let currentIndex = 0;

function loadSeason(season) {
  episodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';
  const episodes = Object.keys(videoData[season]);
  episodes.forEach(ep => {
    const option = document.createElement('option');
    option.value = ep;
    option.textContent = ep;
    episodeSelect.appendChild(option);
  });

  episodeSelect.setAttribute('data-season', season);
  partList.innerHTML = '';
  video.src = '';
}

function loadEpisodeParts() {
  const season = episodeSelect.getAttribute('data-season');
  const episode = episodeSelect.value;

  if (!season || !episode) return;

  currentParts = videoData[season][episode];
  currentIndex = 0;

  partList.innerHTML = '';
  currentParts.forEach((part, index) => {
    const li = document.createElement('li');
    li.textContent = `Part ${index + 1}`;
    li.dataset.index = index;
    li.addEventListener('click', () => playPart(index));
    partList.appendChild(li);
  });

  playPart(0);
}

function playPart(index) {
  if (index >= 0 && index < currentParts.length) {
    video.src = currentParts[index];
    video.play();
    currentIndex = index;
  }
}

video.addEventListener('ended', () => {
  if (currentIndex + 1 < currentParts.length) {
    playPart(currentIndex + 1);
  }
});
