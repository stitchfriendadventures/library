const audio = document.getElementById('audioPlayer');
const partList = document.getElementById('partList');
const dataContainer = document.getElementById('audioData');
const lyricsData = document.getElementById('lyricsData');
const lyricsBox = document.getElementById('lyricsDisplay');

let currentTracks = [];
let currentIndex = 0;
let currentLyrics = [];

function loadAlbum(albumName) {
  const album = dataContainer.querySelector(`.album[data-album="${albumName}"]`);
  if (!album) return;

  const tracks = album.querySelectorAll('.track');
  currentTracks = Array.from(tracks).map(track => ({
    src: track.getAttribute('data-src'),
    img: track.getAttribute('data-img'),
    title: track.getAttribute('data-title'),
    album: albumName
  }));

  currentIndex = 0;
  partList.innerHTML = '';

  currentTracks.forEach((track, index) => {
    const li = document.createElement('li');
    li.className = 'part-thumbnail';
    li.setAttribute('data-index', index);

    const image = document.createElement('img');
    image.src = track.img || 'covers/default.jpg';
    image.alt = track.title || `Track ${index + 1}`;
    image.className = 'thumb';

    const label = document.createElement('span');
    label.textContent = track.title || `Track ${index + 1}`;

    li.appendChild(image);
    li.appendChild(label);
    li.addEventListener('click', () => playTrack(index));
    partList.appendChild(li);
  });

  playTrack(0);
}

function playTrack(index) {
  if (index >= 0 && index < currentTracks.length) {
    const track = currentTracks[index];
    audio.src = track.src;
    audio.play();
    currentIndex = index;

    document.querySelectorAll('#partList li').forEach(li => li.classList.remove('active'));
    const selected = document.querySelector(`#partList li[data-index="${index}"]`);
    if (selected) selected.classList.add('active');

    loadLyrics(track);
  }
}

function loadLyrics(track) {
  const key = `${track.album}-${track.title}`;
  const lyricsDiv = lyricsData.querySelector(`.lyrics[data-track="${key}"]`);
  lyricsBox.innerHTML = '';
  currentLyrics = [];

  if (lyricsDiv) {
    const lines = lyricsDiv.querySelectorAll('p');
    lines.forEach(line => {
      const time = parseFloat(line.getAttribute('data-time'));
      const p = document.createElement('p');
      p.textContent = line.textContent;
      lyricsBox.appendChild(p);
      currentLyrics.push({ time, element: p });
    });
  }
}

audio.addEventListener('ended', () => {
  if (currentIndex + 1 < currentTracks.length) {
    playTrack(currentIndex + 1);
  }
});

audio.addEventListener('timeupdate', () => {
  const currentTime = audio.currentTime;
  let activeIndex = -1;

  for (let i = 0; i < currentLyrics.length; i++) {
    if (currentTime >= currentLyrics[i].time) {
      activeIndex = i;
    } else {
      break;
    }
  }

  currentLyrics.forEach((line, idx) => {
    line.element.classList.toggle('active', idx === activeIndex);
  });
});

window.onload = function () {
  const defaultAlbum = document.body.getAttribute('data-default-album');
  if (defaultAlbum) {
    loadAlbum(defaultAlbum);
  }
};
