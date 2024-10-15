document.addEventListener('DOMContentLoaded', function() {
    const titleInit = document.getElementById("titleInit");
    const paragraphInit = document.getElementById("paragraphInit");
    const startButton = document.getElementById('startButton');
    const textContainer = document.getElementById('textContainer');
    const finishButton = document.getElementById('finishButton');
    const questionnaire = document.getElementById('questionnaire');
    const quizForm = document.getElementById('quizForm');
    const results = document.getElementById('results');
    const questionOptions = document.querySelector('.question-options'); // Contenedor de las opciones de pregunta
    const timerValue = document.getElementById('timerValue');
    let time = [];

    let wordCount = 0;
    let startTime, endTime;
    let quizCompleted = false;
    let timerInterval;

    // Texto para las preguntas del cuestionario
    const questions = [
        { 
            question: "¿Cuál es el título de la lectura?", 
            answers: [
                "Los animales de la montaña", 
                "Un león llamado Durdanta", 
                "El león y la liebre", 
                "El rey de la montaña"
            ], 
            correctAnswer: "El león y la liebre" 
        },
        { 
            question: "¿Qué sucedía con el león todos los días?", 
            answers: [
                "Mataba a los animales por capricho", 
                "Cazaba animales para el almuerzo", 
                "Se reunía con el resto de animales para dialogar", 
                "Paseaba solo en la montaña"
            ], 
            correctAnswer: "Mataba a los animales por capricho" 
        },
        { 
            question: "¿Qué decidieron hacer los animales con el león para que no los siguiera matando por capricho?", 
            answers: [
                "Escogerían un animal cada día y se lo enviarían para que lo comiera", 
                "Cazarían animales de otra montaña para entregarlos al león", 
                "Jugarían a las escondidas y el animal que encontrara el león sería su comida", 
                "Le enviarían aves todos los días para que las comiera"
            ], 
            correctAnswer: "Escogerían un animal cada día y se lo enviarían para que lo comiera" 
        },
        { 
            question: "¿Qué pensó la liebre cuando le tocó ir hacía el león para que se la comiera?", 
            answers: [
                "Si iba a morir para que obedecer al león", 
                "Que no era necesario correr y llegar tan rápido", 
                "Se tomaría el tiempo con calma, para contemplar el paisaje", 
                "Todas las respuestas son correctas"
            ], 
            correctAnswer: "Todas las respuestas son correctas" 
        },
        { 
            question: "¿Qué enseñanza deja la lectura?", 
            answers: [
                "La inteligencia es más importante que la fuerza y la fuerza sin inteligencia no sirve", 
                "Con inteligencia se puede lograr lo que se quiere", 
                "La fuerza vale más que cualquier cosa", 
                "Más vale lento que apresurarse cuando no hay nada que hacer"
            ], 
            correctAnswer: "La inteligencia es más importante que la fuerza y la fuerza sin inteligencia no sirve" 
        }
    ];
    
              
    // Función para contar las palabras en el texto
    function countWords(text) {
        return text.split(/\s+/).length;
    }

    // Función para calcular la velocidad de lectura
    function calculateReadingSpeed(startTime, endTime, wordCount) {
        const minutes = (endTime - startTime) / 60000; // Convertir a minutos
        return Math.round(wordCount / minutes);
    }

    // Función para mostrar las preguntas del cuestionario
    function displayQuestions() {
        const questionList = document.getElementById('questionList');
        questionList.innerHTML = '';
        
        questions.forEach((question, index) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <p>${question.question}</p>
                <div class="question-options">
                    ${question.answers.map((answer, i) => `
                        <label>
                            <input type="radio" name="answer${index}" value="${answer}">
                            ${answer}
                        </label>
                    `).join('')}
                </div>
            `;
            questionList.appendChild(listItem);
        });
    }

    // Evento para comenzar el test al hacer clic en "Empezar"
    startButton.addEventListener('click', function() {
        textContainer.classList.remove('hidden');
        paragraphInit.classList.add("hidden");
        startButton.classList.add('hidden');
        startTime = Date.now();
        // Iniciar el contador
        timerInterval = setInterval(updateTimer, 1000);
    });

    // Función para actualizar el contador de tiempo
    function updateTimer() {
        const currentTime = Math.floor((Date.now() - startTime) / 1000); // Tiempo transcurrido en segundos
        timerValue.textContent = currentTime;
        time.push(currentTime);
    }

    // Evento para finalizar el test al hacer clic en "Terminar Test"
    finishButton.addEventListener('click', function() {
        clearInterval(timerInterval); // Detener el contador
        titleInit.classList.add("hidden");
        textContainer.classList.add('hidden');
        finishButton.classList.add('hidden');
        endTime = Date.now();
        wordCount = countWords(document.getElementById('textToRead').textContent);
        const readingSpeed = calculateReadingSpeed(startTime, endTime, wordCount);
        questionnaire.classList.remove('hidden');
        displayQuestions();
    });

    // Evento para enviar el cuestionario
    quizForm.addEventListener('submit', function(event) {
        event.preventDefault();
        if (!quizCompleted) {
            let anyAnswerSelected = true; // Inicialmente, asumimos que al menos una opción está seleccionada

            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (!selectedAnswer) { // Si ninguna opción está seleccionada para alguna pregunta
                    anyAnswerSelected = false;
                    return;
                }
            });

            if (!anyAnswerSelected) {
                alert("Debes seleccionar una opción para cada pregunta antes de terminar.");
                return;
            }

            let correctAnswers = 0;
            let totalQuestions = questions.length;
            
            questions.forEach((question, index) => {
                const selectedAnswer = document.querySelector(`input[name="answer${index}"]:checked`);
                if (selectedAnswer && selectedAnswer.value === question.correctAnswer) {
                    correctAnswers++;
                }
            });
            
            let comprehensionPercentage = (correctAnswers / totalQuestions) * 100;
            let timeResult = time[time.length-1];
            
            quizCompleted = true;
            results.classList.remove('hidden');
            questionnaire.classList.add('hidden');
            document.getElementById('wordCountValue').textContent = wordCount;
            document.getElementById('readingSpeedValue').textContent = `${calculateReadingSpeed(startTime, endTime, wordCount)}`;
            document.getElementById('comprehensionValue').textContent = `${comprehensionPercentage}`;
            document.getElementById('timeResultValue').textContent = `${timeResult}`;
            document.getElementById('results').innerHTML += '<p class="lastParagrah">Toma nota de tu velocidad de lectura para poder realizar ajustes en los próximos ejercicios.</p><p class="finalMessage">Puedes salir y pasar a la siguiente clase.</p>'
            ;

            
            
        }
    });

});
