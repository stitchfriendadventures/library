const audio = document.getElementById('audioPlayer');
const partList = document.getElementById('partList');
const dataContainer = document.getElementById('audioData');

let currentTracks = [];
let currentIndex = 0;

function loadAlbum(albumName) {
  const album = dataContainer.querySelector(`.album[data-album="${albumName}"]`);
  if (!album) return;

  const tracks = album.querySelectorAll('.track');
  currentTracks = Array.from(tracks).map(track => ({
    src: track.getAttribute('data-src'),
    img: track.getAttribute('data-img'),
    title: track.getAttribute('data-title')
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
    audio.src = currentTracks[index].src;
    audio.play();
    currentIndex = index;

    // Highlight selected
    document.querySelectorAll('#partList li').forEach(li => li.classList.remove('active'));
    const selected = document.querySelector(`#partList li[data-index="${index}"]`);
    if (selected) selected.classList.add('active');
  }
}

if (audio) {
  audio.addEventListener('ended', () => {
    if (currentIndex + 1 < currentTracks.length) {
      playTrack(currentIndex + 1);
    }
  });
}

window.onload = function () {
  const defaultAlbum = document.body.getAttribute('data-default-album');
  if (defaultAlbum) {
    loadAlbum(defaultAlbum);
  }
};
