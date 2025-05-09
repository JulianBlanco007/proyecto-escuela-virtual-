function loadVideo(title, url) {
    document.getElementById('class-title').innerText = title;
    document.getElementById('video-frame').src = url;
  }
  
  function fakeLogin() {
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;
  
    if (user && pass) {
      document.getElementById('login-screen').classList.add('hidden');
      document.getElementById('platform-screen').classList.remove('hidden');
    } else {
      alert('Por favor ingresa usuario y contraseña');
    }
  }
  
  