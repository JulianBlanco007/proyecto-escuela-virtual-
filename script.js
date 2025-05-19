// Lista de preguntas para el cuestionario
const questions = [
  "¿Qué le llamó la atención?",
  "¿Les surgió alguna duda o pregunta?",
  "¿A qué les retó el tema y cómo asumirás el reto?"
];

let currentQuestionIndex = 0;
let answers = [];
let player; // YouTube player

// Elementos del DOM
const questionnaire = document.getElementById("questionnaire");
const questionTitle = document.getElementById("question-title");
const answerInput = document.getElementById("answer");
const video = document.getElementById("video-frame");

// Función para cargar un video
function loadVideo(title, url) {
  document.getElementById('class-title').innerText = title;

  if (player && player.loadVideoByUrl) {
    // Cambia el video si el reproductor ya fue inicializado
    player.loadVideoByUrl(url.replace("embed/", "watch?v="));
  } else {
    // Primera carga del iframe (para iframe sin API todavía activa)
    video.src = url + "?enablejsapi=1";
  }

  currentQuestionIndex = 0;
  answers = [];
  questionnaire.classList.add("hidden");
  answerInput.value = "";

  // Marcar como activa
  const listItems = document.querySelectorAll("#class-list li");
  listItems.forEach(item => item.classList.remove("active"));
  event.target.classList.add("active");
}

// Mostrar el cuestionario al terminar el video
function onVideoEnded() {
  questionnaire.classList.remove("hidden");
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
    questionnaire.classList.add("hidden");
    goToNextClass();
  }
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
    window.location.href = "index.html"; // o la página de bienvenida
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
};

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
