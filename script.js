// Lista de preguntas para el cuestionario
const questions = [
  '¿Qué le llamó la atención?',
  '¿Les surgió alguna duda o pregunta?',
  '¿A qué les retó el tema y cómo asumirás el reto?',
];

let currentQuestionIndex = 0;
let answers = [];
let player; // YouTube player

// Elementos del DOM
const questionnaire = document.getElementById('questionnaire');
const questionTitle = document.getElementById('question-title');
const answerInput = document.getElementById('answer');
const video = document.getElementById('video-frame');

// ====== CARRUSEL DE IMÁGENES ======
// Referencia al carrusel
const carousel = document.getElementById('carousel');
let scrollPosition = 0;

window.scrollCarousel = function(direction) {
  if (!carousel) return;

  // Obtener ancho de una imagen incluyendo margin/gap
  const firstImage = carousel.querySelector('img');
  if (!firstImage) return;
  const imageStyle = getComputedStyle(firstImage);
  const imageWidth = firstImage.offsetWidth + 
    parseInt(imageStyle.marginRight) + parseInt(imageStyle.marginLeft);

  // Mover 3 imágenes por vez (puedes cambiar 3 a otro número si quieres)
  const scrollAmount = imageWidth * 3;

  // Nuevo scroll esperado
  let newScrollPos = scrollPosition + direction * scrollAmount;

  // Limitar scroll para no pasar extremos
  const maxScrollLeft = carousel.scrollWidth - carousel.clientWidth;
  if (newScrollPos < 0) newScrollPos = 0;
  if (newScrollPos > maxScrollLeft) newScrollPos = maxScrollLeft;

  scrollPosition = newScrollPos;

  carousel.scrollTo({
    left: scrollPosition,
    behavior: 'smooth'
  });
}
// ==================================

// Función para cargar un video
function loadVideo(title, url) {
  document.getElementById('class-title').innerText = title;

  if (player && player.loadVideoByUrl) {
    player.loadVideoByUrl(url.replace("embed/", "watch?v="));
  } else {
    video.src = url + "?enablejsapi=1";
  }

  currentQuestionIndex = 0;
  answers = [];
  questionnaire.classList.add("hidden");
  answerInput.value = "";

  const listItems = document.querySelectorAll("#class-list li");
  listItems.forEach(item => item.classList.remove("active"));
  event.target.classList.add("active");
}

// Mostrar el cuestionario al terminar el video
function onVideoEnded() {
  questionnaire.classList.remove('hidden');
  showQuestion();
}

// Mostrar la siguiente pregunta
function showQuestion() {
  questionTitle.textContent = questions[currentQuestionIndex];
  answerInput.value = "";
}

// Enviar respuesta
function submitAnswer() {
  const answer = answerInput.value.trim();
  if (!answer) {
    alert("Por favor escribe tu respuesta.");
    return;
  }

  answers.push({
    pregunta: questions[currentQuestionIndex],
    respuesta: answer,
  });

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    saveAnswers();
    marcarClaseComoVista(document.getElementById('class-title').innerText);
    questionnaire.classList.add("hidden");
    goToNextClass();
  }
}

// Guardar respuestas en localStorage
function saveAnswers() {
  const classTitle = document.getElementById('class-title').innerText || 'Clase';
  localStorage.setItem(`respuestas_${classTitle}`, JSON.stringify(answers));
}

// Marcar la clase actual como completada
function marcarClaseComoVista(title) {
  let completadas = JSON.parse(localStorage.getItem("clases_completadas") || "[]");
  if (!completadas.includes(title)) {
    completadas.push(title);
    localStorage.setItem("clases_completadas", JSON.stringify(completadas));
  }
  updateProgress();
}

// Pasar a la siguiente clase
function goToNextClass() {
  const listItems = document.querySelectorAll("#class-list li");
  let currentIndex = -1;

  listItems.forEach((item, index) => {
    if (item.classList.contains("active")) {
      currentIndex = index;
      item.classList.remove("active");
    }
  });

  if (currentIndex + 1 < listItems.length) {
    const nextItem = listItems[currentIndex + 1];
    nextItem.classList.add("active");
    nextItem.click();
  } else {
    alert("¡Has completado todas las clases!");
  }
}

// Login falso
function fakeLogin() {
  const user = document.getElementById('user')?.value;
  const pass = document.getElementById('pass')?.value;

  if (user && pass) {
    localStorage.setItem("user", user);
    window.location.href = "index.html";
  } else {
    alert('Por favor ingresa usuario y contraseña');
  }
}

// Logout
function logout() {
  localStorage.clear();
  window.location.href = "login.html";
}

// Cargar usuario al iniciar
window.onload = () => {
  const name = localStorage.getItem("user");
  const usernameElement = document.getElementById("username");
  if (usernameElement && name) {
    usernameElement.textContent = "Hola, " + name;
  }

  updateProgress();
  document.querySelector('#class-list li.active')?.click();
}

// Inicializar API de YouTube
function onYouTubeIframeAPIReady() {
  player = new YT.Player('video-frame', {
    events: {
      'onStateChange': function (event) {
        if (event.data === YT.PlayerState.ENDED) {
          onVideoEnded();
        }
      },
    },
  });
}

// Mostrar/ocultar menú del perfil
function toggleDropdown() {
  const menu = document.getElementById("dropdown-menu");
  menu.classList.toggle("hidden");
}

// Cerrar el menú al hacer clic fuera
window.addEventListener('click', function (e) {
  const dropdown = document.querySelector('.dropdown');
  if (!dropdown.contains(e.target)) {
    document.getElementById('dropdown-menu')?.classList.add('hidden');
  }
});

// Actualizar barra de progreso
function updateProgress() {
  const totalClases = document.querySelectorAll("#class-list li").length;
  const completadas = JSON.parse(localStorage.getItem("clases_completadas") || "[]");
  const progreso = Math.floor((completadas.length / totalClases) * 100);

  const progressBar = document.querySelector('.progress progress');
  const progressLabel = document.querySelector('.progress label');

  if (progressBar && progressLabel) {
    progressBar.value = progreso;
    progressLabel.textContent = `Progreso: ${progreso}%`;
  }
}
