const questions = [
    {
      title: "Você prefere algo mais explicito ou mais discreto?",
      subtitle: "Escolha a opção que mais combina com seu estilo.",
      answers: ["Discreto", "explicito"],
    },
    {
      title: "O que mais chama te deixa excitado ?",
      subtitle: "Selecione o ponto que mais desperta seu interesse.",
      answers: ["fotos", "videos", "os dois",]
    },
    {
      title: "Você gosta de descobrir aos poucos ou prefere acesso direto?",
      subtitle: "Sua resposta ajuda a definir a melhor rota de acesso.",
      answers: [
        "Descobrir aos poucos",
        "Quero acesso direto",
      ],
    },
    {
      title: "Qual experiência combina mais com você?",
      subtitle: "Escolha a sensação que mais faz sentido agora.",
      answers: ["Leve e provocante", "Mais envolvente", "VIP completa"],
    },
    {
      title: "Você prefere conhecer antes ou liberar tudo de uma vez?",
      subtitle: "Defina o seu jeito ideal de continuar.",
      answers: [
        "Quero conhecer antes",
        "Quero liberar meu acesso",
        
      ],
    },
    {
      title: "O que mais combina com seu momento?",
      subtitle: "Essa é a última pergunta.",
      answers: [
        "Curiosidade",
        "Quero entrar para o VIP",
      ],
    },
  ];
  
  const state = {
    currentQuestion: 0,
    answers: [],
    userName: "",
    remainingSeconds: 300,
    resultType: "free",
  };
  
  const screens = {
    intro: document.getElementById("screenIntro"),
    quiz: document.getElementById("screenQuiz"),
    loading: document.getElementById("screenLoading"),
    result: document.getElementById("screenResult"),
    free: document.getElementById("screenFree"),
    paid: document.getElementById("screenPaid"),
  };
  
  const userNameInput = document.getElementById("userName");
  const startBtn = document.getElementById("startBtn");
  const backBtn = document.getElementById("backBtn");
  const questionStep = document.getElementById("questionStep");
  const questionTitle = document.getElementById("questionTitle");
  const questionSubtitle = document.getElementById("questionSubtitle");
  const answersContainer = document.getElementById("answersContainer");
  
  const progressFill = document.getElementById("progressFill");
  const progressText = document.getElementById("progressText");
  
  const welcomeName = document.getElementById("welcomeName");
  const freeUserName = document.getElementById("freeUserName");
  const paidUserName = document.getElementById("paidUserName");
  
  const chooseFreeBtn = document.getElementById("chooseFreeBtn");
  const choosePaidBtn = document.getElementById("choosePaidBtn");
  const backToResultFromFree = document.getElementById("backToResultFromFree");
  const backToResultFromPaid = document.getElementById("backToResultFromPaid");
  
  const heroTimer = document.getElementById("heroTimer");
  const resultTimer = document.getElementById("resultTimer");
  
  const freeChoiceCard = document.getElementById("freeChoiceCard");
  const paidChoiceCard = document.getElementById("paidChoiceCard");
  
  const resultTitle = document.getElementById("resultTitle");
  const resultLead = document.getElementById("resultLead");
  
  function showScreen(screenKey) {
    Object.values(screens).forEach((screen) => screen.classList.remove("active"));
    screens[screenKey].classList.add("active");
  }
  
  function sanitizeName(name) {
    return name.trim().replace(/\s+/g, " ").slice(0, 24);
  }
  
  function getDisplayName() {
    return state.userName || "visitante";
  }
  
  function updateUserNames() {
    const displayName = getDisplayName();
    welcomeName.textContent = `Olá, ${displayName}.`;
    freeUserName.textContent = displayName;
    paidUserName.textContent = displayName;
  }
  
  function updateProgress() {
    let percent = 0;
  
    if (screens.intro.classList.contains("active")) {
      percent = 0;
    } else if (screens.quiz.classList.contains("active")) {
      percent = Math.round((state.currentQuestion / questions.length) * 100);
    } else if (screens.loading.classList.contains("active")) {
      percent = 92;
    } else {
      percent = 100;
    }
  
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${percent}%`;
  }
  
  function renderQuestion() {
    const question = questions[state.currentQuestion];
    questionStep.textContent = `Pergunta ${state.currentQuestion + 1} de ${questions.length}`;
    questionTitle.textContent = question.title;
    questionSubtitle.textContent = question.subtitle;
  
    answersContainer.innerHTML = "";
  
    question.answers.forEach((answer) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "answer-btn";
      button.textContent = answer;
      button.addEventListener("click", () => handleAnswer(answer));
      answersContainer.appendChild(button);
    });
  
    updateProgress();
  }
  
  function handleAnswer(answer) {
    state.answers[state.currentQuestion] = answer;
  
    if (state.currentQuestion < questions.length - 1) {
      state.currentQuestion += 1;
      renderQuestion();
      return;
    }
  
    showLoadingThenResult();
  }
  
  function calculateResultType() {
    let vipScore = 0;
    let freeScore = 0;
  
    state.answers.forEach((answer) => {
      if (
        answer === "Intenso" ||
        answer === "Ousadia" ||
        answer === "Quero acesso direto" ||
        answer === "VIP completa" ||
        answer === "Quero liberar meu acesso" ||
        answer === "Quero entrar para o VIP"
      ) {
        vipScore += 2;
      }
  
      if (
        answer === "Equilibrado" ||
        answer === "Exclusividade" ||
        answer === "Mais envolvente" ||
        answer === "Vontade de explorar"
      ) {
        vipScore += 1;
      }
  
      if (
        answer === "Discreto" ||
        answer === "Mistério" ||
        answer === "Descobrir aos poucos" ||
        answer === "Ver uma prévia primeiro" ||
        answer === "Leve e provocante" ||
        answer === "Quero conhecer antes" ||
        answer === "Ainda estou decidindo" ||
        answer === "Curiosidade"
      ) {
        freeScore += 2;
      }
    });
  
    state.resultType = vipScore > freeScore ? "paid" : "free";
  }
  
  function applyResultUI() {
    if (!freeChoiceCard || !paidChoiceCard) return;
  
    if (state.resultType === "paid") {
      freeChoiceCard.style.display = "none";
      paidChoiceCard.style.display = "block";
  
      resultTitle.textContent = "Seu perfil combina com acesso completo";
      resultLead.textContent =
        "Seu resultado indica preferência por uma experiência mais direta e exclusiva.";
    } else {
      paidChoiceCard.style.display = "none";
      freeChoiceCard.style.display = "block";
  
      resultTitle.textContent = "Seu perfil combina com uma entrada por prévias";
      resultLead.textContent =
        "Seu resultado indica que começar pelas prévias faz mais sentido agora.";
    }
  }
  
  function showLoadingThenResult() {
    calculateResultType();
    showScreen("loading");
    updateProgress();
  
    setTimeout(() => {
      updateUserNames();
      applyResultUI();
      showScreen("result");
      updateProgress();
    }, 1800);
  }
  
  function goBackQuestion() {
    if (state.currentQuestion > 0) {
      state.currentQuestion -= 1;
      renderQuestion();
    } else {
      showScreen("intro");
      updateProgress();
    }
  }
  
  function formatTime(totalSeconds) {
    const safeSeconds = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSeconds / 60);
    const seconds = safeSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }
  
  function updateTimers() {
    const formatted = formatTime(state.remainingSeconds);
    heroTimer.textContent = `Oferta expira em ${formatted}`;
    resultTimer.textContent = formatted;
  }
  
  function startCountdown() {
    updateTimers();
  
    setInterval(() => {
      if (state.remainingSeconds > 0) {
        state.remainingSeconds -= 1;
      }
      updateTimers();
    }, 1000);
  }
  
  startBtn.addEventListener("click", () => {
    const typedName = sanitizeName(userNameInput.value);
  
    state.userName = typedName || "visitante";
    state.currentQuestion = 0;
    state.answers = [];
    state.resultType = "free";
  
    renderQuestion();
    showScreen("quiz");
  });
  
  backBtn.addEventListener("click", goBackQuestion);
  
  chooseFreeBtn.addEventListener("click", () => {
    updateUserNames();
    showScreen("free");
    updateProgress();
  });
  
  choosePaidBtn.addEventListener("click", () => {
    updateUserNames();
    showScreen("paid");
    updateProgress();
  });
  
  backToResultFromFree.addEventListener("click", () => {
    showScreen("result");
    updateProgress();
  });
  
  backToResultFromPaid.addEventListener("click", () => {
    showScreen("result");
    updateProgress();
  });
  
  userNameInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      startBtn.click();
    }
  });
  
  showScreen("intro");
  updateProgress();
  startCountdown();