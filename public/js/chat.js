const socket = io();

const $input = document.getElementById('message');
const $messageButton = document.getElementById('sendButton');
const $locationButton = document.getElementById('send-location');
const $messages = document.getElementById('messages');

const messageTemplate = document.getElementById('message-template').innerHTML;
const locationTemplate = document.getElementById('location-template').innerHTML;

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

socket.on('message', message => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    message: message.text,
    createdAt: moment(message.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

socket.on('locationMessage', url => {
  console.log(url);
  const html = Mustache.render(locationTemplate, {
    url: url.url,
    createdAt: moment(url.createdAt).format('h:mm a'),
  });
  $messages.insertAdjacentHTML('beforeend', html);
});

$messageButton.addEventListener('click', e => {
  e.preventDefault();

  $messageButton.setAttribute('disabled', 'disabled');

  const message = $input.value;
  socket.emit('sendMessage', message, error => {
    $messageButton.removeAttribute('disabled');
    $input.value = '';

    console.log(error || 'Message delivered');
  });
});

$locationButton.addEventListener('click', () => {
  if (!navigator.geolocation) {
    return alert('Geolocation is not supported by your broweser');
  }

  $locationButton.setAttribute('disabled', 'disabled');

  navigator.geolocation.getCurrentPosition(position => {
    const {
      coords: { latitude, longitude },
    } = position;
    socket.emit('sendLocation', { latitude, longitude }, () => {
      $locationButton.removeAttribute('disabled');
      console.log('Location Shared!');
    });
  });
});

socket.emit('join', { username, room });
