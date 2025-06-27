const video = document.getElementById('videoPlayer');
const episodeSelect = document.getElementById('episodeSelect');
const partList = document.getElementById('partList');
const dataContainer = document.getElementById('videoData');

let currentParts = [];
let currentIndex = 0;

function loadSeason(seasonName) {
  episodeSelect.innerHTML = '<option value="">-- Select Episode --</option>';
  const season = dataContainer.querySelector(`.season[data-season="${seasonName}"]`);
  if (!season) return;

  const episodes = season.querySelectorAll('.episode');
  episodes.forEach(ep => {
    const epName = ep.getAttribute('data-episode');
    const option = document.createElement('option');
    option.value = epName;
    option.textContent = epName;
    episodeSelect.appendChild(option);
  });

  episodeSelect.setAttribute('data-season', seasonName);
  partList.innerHTML = '';
  video.src = '';
}

function loadEpisodeParts() {
  const seasonName = episodeSelect.getAttribute('data-season');
  const epName = episodeSelect.value;
  if (!seasonName || !epName) return;

  const episode = dataContainer.querySelector(`.season[data-season="${seasonName}"] .episode[data-episode="${epName}"]`);
  if (!episode) return;

  const parts = episode.querySelectorAll('.part');
  currentParts = Array.from(parts).map(part => part.getAttribute('data-src'));
  currentIndex = 0;

  partList.innerHTML = '';

  parts.forEach((part, index) => {
    const src = part.getAttribute('data-src');
    const img = part.getAttribute('data-img') || 'thumbs/default.jpg';

    const li = document.createElement('li');
    li.className = 'part-thumbnail';
    li.setAttribute('data-index', index);

    const image = document.createElement('img');
    image.src = img;
    image.alt = `Part ${index + 1}`;
    image.className = 'thumb';

    const label = document.createElement('span');
    label.textContent = `Part ${index + 1}`;

    li.appendChild(image);
    li.appendChild(label);
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

    // Highlight selected
    document.querySelectorAll('#partList li').forEach(li => li.classList.remove('active'));
    const selected = document.querySelector(`#partList li[data-index="${index}"]`);
    if (selected) selected.classList.add('active');
  }
}

if (video) {
  video.addEventListener('ended', () => {
    if (currentIndex + 1 < currentParts.length) {
      playPart(currentIndex + 1);
    }
  });
}

window.onload = function () {
  const defaultSeason = document.body.getAttribute('data-default-season');
  if (defaultSeason) {
    loadSeason(defaultSeason);
  }
};
