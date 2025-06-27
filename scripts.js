const video = document.getElementById('videoPlayer');
const playlist = document.getElementById('videoPlaylist');
const items = playlist.getElementsByTagName('li');

let currentIndex = 0;

function playVideo(index) {
  const src = items[index].getAttribute('data-src');
  video.src = src;
  video.play();
  currentIndex = index;
}

for (let i = 0; i < items.length; i++) {
  items[i].addEventListener('click', () => {
    playVideo(i);
  });
}

video.addEventListener('ended', () => {
  currentIndex++;
  if (currentIndex < items.length) {
    playVideo(currentIndex);
  }
});
