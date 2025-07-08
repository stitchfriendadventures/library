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
  const select = document.getElementById('episodeSelect');
  const selectedEpisode = select.value;
  const seasonName = document.body.getAttribute('data-default-season');
  const videoData = document.getElementById('videoData');
  const partList = document.getElementById('partList');
  partList.innerHTML = '';

  const season = videoData.querySelector(`.season[data-season="${seasonName}"]`);
  if (!season) return;

  const episode = season.querySelector(`.episode[data-episode="${selectedEpisode}"]`);
  if (!episode) return;

  const parts = episode.querySelectorAll('.part');

  parts.forEach(part => {
    const src = part.getAttribute('data-src');
    const imgSrc = part.getAttribute('data-img');
    const altText = part.getAttribute('data-alt') || 'Video preview';

    const li = document.createElement('div');
    li.className = 'part-thumbnail';
    li.tabIndex = 0;

    li.onclick = () => {
      const video = document.getElementById('videoPlayer');
      video.src = src;
      video.load();
      video.play();

      // Remove active state from other thumbnails
      document.querySelectorAll('.part-thumbnail').forEach(p => p.classList.remove('active'));
      li.classList.add('active');
    };

    // Conditional rendering
    if (imgSrc && imgSrc.trim() !== '') {
      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = altText;
      img.className = 'thumb';
      li.appendChild(img);
    }

    const caption = document.createElement('div');
    caption.className = 'thumb-caption';
    caption.textContent = altText;
    li.appendChild(caption);

    partList.appendChild(li);
  });
}

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
