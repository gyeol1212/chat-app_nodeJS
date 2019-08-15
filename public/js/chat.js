const socket = io();

socket.on('message', message => {
  console.log(message);
});

document.getElementById('sendButton').addEventListener('click', () => {
  const message = document.getElementById('message').value;
  socket.emit('sendMessage', message);
});

document.getElementById('send-location').addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your broweser');
  }

  navigator.geolocation.getCurrentPosition(position => {
    const {
      coords: { latitude, longitude },
    } = position;
    socket.emit('sendLocation', { latitude, longitude });
  });
});
