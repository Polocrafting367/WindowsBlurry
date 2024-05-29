const dialogueElement = document.getElementById('dialogue');
const choicesElement = document.getElementById('choices');

let questions = [
    // 0
    { 
        question: "Bonjour, Mr {nom}. Êtes-vous à l’heure ?",
        answers: [
            { text: "Oui, j'ai fait de mon mieux.", next: 2, score: 10 }
        ]
    },
    // 1
    { 
        question: "Bonjour, Mr {nom}. Êtes-vous en retard ?",
        answers: [
            { text: "Oui, désolé j'ai eu quelques problèmes sur la route.", next: 3 , score: 5}
        ]
    },
    // 2
    { 
        question: "Asseyez-vous, s'il vous plaît.",
        answers: [{ text: "Merci", next: 4 , score: 0}],
    }, 
    // 3
    { 
        question: "Ce n'est pas grave. Asseyez-vous, s'il vous plaît.",
        answers: [{ text: "Merci", next: 4 , score: 0}]
    },
    // 4
    { 
        question: "Alors, dites-moi pourquoi avoir choisi Chao Cinoche ?",
        answers: [
            { text: "Pour être honnête, j'ai besoin d'un travail.", next: 5 , score: 5},
            { text: "J'ai toujours voulu travailler chez vous.", next: 10 , score: 5},
            { text: "Franchement, les cafés gratuits m'attirent.", next: 14 , score: 5}
        ]
    },
    // 5
    { 
        question: "C'est sûr que c'est honnête. Le cinéma vous parle ?",
        answers: [
            { text: "Parlez-moi d'une meilleure façon !", next: 6 },
            { text: "Je décortique tous les films depuis que je suis petit.", next: 7 },
            { text: "Je regarde, mais pas plus.", next: 9 }
        ]
    },
    // 6
    { 
        question: "Ah, pardon. Alors, vous connaissez bien le cinéma ?",
        answers: [
            { text: "Je décortique tous les films depuis que je suis petit.", next: 8 },
            { text: "Je regarde, mais pas plus.", next: 10 }
        ]
    },
    // 7
    { 
        question: "Ah, c'est génial ! Vraiment une passion chez vous.",
        answers: [
            { text: "On peut dire ça.", next: 11 },
            { text: "Non, pas vraiment.", next: 9 }
        ]
    },
    // 8
    { 
        question: "Génial ! C'est donc une sorte de hobby chez vous.",
        answers: [
            { text: "On peut dire ça.", next: 11 },
            { text: "Non, pas vraiment.", next: 9 }
        ]
    },
    // 9
    { 
        question: "Mais qu'est-ce que vous faites ici alors ?",
        answers: [
            { text: "Oui, c'est vrai, qu'est-ce que je fais là !", next: 99 },
            { text: "Vous avez raison, je pense que je me suis trompé.", next: 99 }
        ]
    },
    // 10
    { 
        question: "Vraiment ? Alors c'est parfait, je suis content de l'entendre.",
        answers: [
            { text: "Vraiment !", next: 12 },
            { text: "Je sais que vous dites ça pour me faire plaisir.", next: 11 }
        ]
    },
    // 11
    { 
        question: "Vous avez raison. Excusez-moi, passons à autre chose.",
        answers: [
            { text: "Oui", next: 13 }
        ]
    },
    // 12
    { 
        question: "Mais évidemment, vous croyez quoi, aller !",
        answers: [
            { text: "OK ?", next: 13 }
        ]
    },
    // 13
    { 
        question: "Très bien, bon, passons à l'essentiel. Êtes-vous vraiment capable de repérer les faux raccords juste en regardant ?",
        answers: [
            { text: "Bien sûr.", next: 99 },
            { text: "Évidemment.", next: 99 }
        ]
    },
    // 14
    { 
        question: "Vraiment ! Je peux vous le dire, vous allez être déçu.",
        answers: [
            { text: "Ha merde alors !", next: 15 },
            { text: "Justement, j'aime le café bien corsé.", next: 16 }
        ]
    },
    // 15
    { 
        question: "Dégueu, j'ai rarement bu un café aussi ignoble ! Bon, dites-moi, vous connaissez le cinéma ?",
        answers: [
            { text: "Je décortique tous les films depuis que je suis petit.", next: 8 },
            { text: "Je regarde, mais pas plus.", next: 10 }
        ]
    },
    // 16
    { 
        question: "OK, mais dites-moi alors, vous connaissez le cinéma ?",
        answers: [
            { text: "Je décortique tous les films depuis que je suis petit.", next: 8 },
            { text: "Je regarde, mais pas plus.", next: 10 }
        ]
    },
    // Chemin vers la fin
    { 
        question: "Je pense que nous avons assez appris pour le moment. Merci, nous vous contacterons bientôt.",
        answers: []
    }
];
let currentQuestionIndex = 0;
let playerName = "Michel";
let totalScore = 0; // Initialisation du score total

// Sélection de l'élément pour afficher le score
const scoreElement = document.getElementById('score-value');

function askQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    let dialogueText = currentQuestion.question.replace("{nom}", playerName);

    dialogueElement.textContent = dialogueText;
    choicesElement.innerHTML = '';

    if (currentQuestion.answers && currentQuestion.answers.length > 0) {
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.addEventListener('click', () => selectAnswer(answer.next, answer.score));
            choicesElement.appendChild(button);
        });
    } else {
        const nextButton = document.createElement('button');
        nextButton.textContent = "Suivant";
        nextButton.addEventListener('click', () => selectAnswer(currentQuestionIndex + 1, 0));
        choicesElement.appendChild(nextButton);
    }
}

function selectAnswer(nextIndex, score) {
    currentQuestionIndex = nextIndex;
    totalScore += score; // Mettre à jour le score total en fonction de la réponse choisie

    // Actualiser l'affichage du score
    updateScore();

    // Déterminer si nous devons afficher une question finale en fonction du score total
    if (currentQuestionIndex === 99 || totalScore >= 50) {
        currentQuestionIndex = questions.length - 1; // Index de la question finale
    }

    askQuestion();
}

// Fonction pour mettre à jour l'affichage du score
function updateScore() {
    scoreElement.textContent = totalScore; // Mettre à jour le contenu de l'élément de score
}

// Commencer le jeu en posant la première question
askQuestion();

