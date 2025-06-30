let currentLyrics = [];
let lyricsTimer = null;

function selectArtist(artistName) {
  const albumList = document.getElementById("albumList");
  albumList.innerHTML = '<option value="">Select an album</option>';

  const artist = document.querySelector(`.artist[data-artist="${artistName}"]`);
  if (!artist) return;

  const albums = artist.querySelectorAll(".album");
  albums.forEach(album => {
    const albumName = album.dataset.name;
    const option = document.createElement("option");
    option.value = albumName;
    option.textContent = albumName;
    albumList.appendChild(option);
  });

  document.getElementById("trackList").innerHTML = '';
  document.getElementById("audioPlayer").pause();
  document.getElementById("audioPlayer").src = '';
  document.getElementById("lyricsDisplay").innerHTML = '';
  currentLyrics = [];
  clearInterval(lyricsTimer);
}

function selectAlbum(albumName) {
  const album = document.querySelector(`.album[data-name="${albumName}"]`);
  if (!album) return;

  // Show album cover
  const albumImg = album.dataset.img;
  document.getElementById("albumImage").src = albumImg || '';
  document.getElementById("albumImage").style.display = albumImg ? 'block' : 'none';

  const tracks = album.querySelectorAll(".track");
  const trackList = document.getElementById("trackList");
  trackList.innerHTML = '';

  tracks.forEach(track => {
    const li = document.createElement("li");
    li.textContent = track.dataset.title;
    li.onclick = () => playTrack(track.dataset.src, track.dataset.img, track.dataset.video || '');
    trackList.appendChild(li);
  });

  // Reset
  document.getElementById("audioPlayer").pause();
  document.getElementById("audioPlayer").src = '';
  document.getElementById("lyricsDisplay").innerHTML = '';
  document.getElementById("trackImage").src = '';
  currentLyrics = [];
  clearInterval(lyricsTimer);
}


function playTrack(src, trackImg = '', videoSrc = '') {
  const audio = document.getElementById("audioPlayer");
  const video = document.getElementById("videoPlayer");
  const videoSource = document.getElementById("videoSource");
  
  audio.src = src;
  audio.play();

  // Track image
  document.getElementById("trackImage").src = trackImg || '';
  document.getElementById("trackImage").style.display = trackImg ? 'block' : 'none';

    // Video MV
  if (videoSrc) {
    videoSource.src = videoSrc;
    video.load();
    video.style.display = "block";
  } else {
    video.pause();
    video.src = '';
    video.style.display = "none";
  }
  
  loadLyricsForTrack(src);

  if (lyricsTimer) clearInterval(lyricsTimer);
  lyricsTimer = setInterval(() => syncLyrics(audio.currentTime), 300);
}

function loadLyricsForTrack(src) {
  const lyricsDisplay = document.getElementById("lyricsDisplay");
  lyricsDisplay.innerHTML = '';

  const lyricsData = document.querySelector(`.lyrics[data-track="${src}"]`);
  if (!lyricsData) {
    currentLyrics = [];
    return;
  }

  currentLyrics = Array.from(lyricsData.querySelectorAll('p')).map(p => ({
    time: parseFloat(p.dataset.time),
    element: p.cloneNode(true)
  }));

  currentLyrics.forEach(item => lyricsDisplay.appendChild(item.element));
}

function syncLyrics(currentTime) {
  for (let i = 0; i < currentLyrics.length; i++) {
    const current = currentLyrics[i];
    const next = currentLyrics[i + 1];

    if (!next || currentTime < next.time) {
      currentLyrics.forEach(item => item.element.classList.remove('active'));
      current.element.classList.add('active');
      current.element.scrollIntoView({ behavior: "smooth", block: "center" });
      break;
    }
  }
}
