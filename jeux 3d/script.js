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
            { text: "Oui, désolé j'ai eu quelques problèmes sur la route.", next: 3, score: 5 }
        ]
    },
    // 2
    {
        question: "Asseyez-vous, s'il vous plaît.",
        answers: [{ text: "Merci", next: 4, score: 0 }],
    },
    // 3
    {
        question: "Ce n'est pas grave. Asseyez-vous, s'il vous plaît.",
        answers: [{ text: "Merci", next: 4, score: 0 }]
    },
    // 4
    {
        question: "Alors, dites-moi pourquoi avoir choisi Chao Cinoche ?",
        answers: [
            { text: "Pour être honnête, j'ai besoin d'un travail.", next: 5, score: 5 },
            { text: "J'ai toujours voulu travailler chez vous.", next: 10, score: 10 },
            { text: "Franchement, les cafés gratuits m'attirent.", next: 14, score: 3 }
        ]
    },
    // 5
    {
        question: "C'est sûr que c'est honnête. Le cinéma vous parle ?",
        answers: [
            { text: "Parlez-moi d'une meilleure façon !", next: 6, score: -5 },
            { text: "Je décortique tous les films depuis que je suis petit.", next: 7, score: 0 },
            { text: "Je regarde, mais pas plus.", next: 9, score: 3 }
        ]
    },
    // 6
    {
        question: "Ah, pardon. Alors, vous connaissez bien le cinéma ?",
        answers: [
            { text: "Je décortique tous les films depuis que je suis petit.", next: 8, score: 3 },
            { text: "Je regarde, mais pas plus.", next: 9, score: -2 }
        ]
    },
    // 7
    {
        question: "Ah, c'est génial ! Vraiment une passion chez vous.",
        answers: [
            { text: "On peut dire ça.", next: 17, score: 5 },
            { text: "Non, pas vraiment.", next: 9, score: -5 }
        ]
    },
    // 8
    {
        question: "Génial ! C'est donc une sorte de hobby chez vous.",
        answers: [
            { text: "On peut dire ça.", next: 17, score: 5 },
            { text: "Non, pas vraiment.", next: 9, score: -5 }
        ]
    },
    // 9
    {
        question: "Mais qu'est-ce que vous faites ici alors ?",
        answers: [
            { text: "Oui, c'est vrai, qu'est-ce que je fais là !", next: 21, score: -10 },
            { text: "Vous avez raison, je pense que je me suis trompé.", next: 21, score: -10 }
        ]
    },
    // 10
    {
        question: "Vraiment ? Alors c'est parfait, je suis content de l'entendre.",
        answers: [
            { text: "Vraiment !", next: 12, score: 10 },
            { text: "Je sais que vous dites ça pour me faire plaisir.", next: 11, score: 5 }
        ]
    },
    // 11
    {
        question: "Vous avez raison. Excusez-moi, passons à autre chose.",
        answers: [{ text: "Oui", next: 13, score: 0 }]
    },
    // 12
    {
        question: "Mais évidemment, vous croyez quoi, aller !",
        answers: [{ text: "OK ?", next: 13, score: 0 }]
    },
    // 13
    {
        question: "Très bien, bon, passons à l'essentiel. Êtes-vous vraiment capable de repérer les faux raccords juste en regardant ?",
        answers: [
            { text: "Bien sûr.", next: 16, score: 10 },
            { text: "Évidemment.", next: 16, score: 10 }
        ]
    },
    // 14
    {
        question: "Vraiment ! Je peux vous le dire, vous allez être déçu.",
        answers: [
            { text: "Ha merde alors !", next: 15, score: 0 },
            { text: "Justement, j'aime le café bien corsé.", next: 16, score: 0 }
        ]
    },
    // 15
    {
        question: "Dégueu, j'ai rarement bu un café aussi ignoble ! Bon, dites-moi, vous connaissez le cinéma ?",
        answers: [
            { text: "Je décortique tous les films depuis que je suis petit.", next: 8, score: 7 },
            { text: "Je regarde, mais pas plus.", next: 9, score:-2 }
        ]
    },
    // 16
    {
        question: "OK, mais dites-moi alors, vous connaissez le cinéma ?",
        answers: [
            { text: "Je décortique tous les films depuis que je suis petit.", next: 8, score: 10 },
            { text: "Je regarde, mais pas plus.", next: 9, score: 3 }
        ]
    },
    // 17
    {
        question: "Quel genre de films préférez-vous et pourquoi ?",
        answers: [
            { text: "Les thrillers, car j'aime les histoires captivantes.", next: 18, score: 5 },
            { text: "Les comédies, elles me font toujours rire.", next: 19, score: 5 },
            { text: "Je n'ai pas vraiment de préférence.", next: 20, score: 5 }
        ]
    },
//18
    {
        question: "C'est intéressant, ça montre que vous avez une réelle appréciation pour les détails.",
        answers: [{ text: "Absolument, les détails font toute la différence.", next: 21, score: 0 }]
    },
    //19
    {
        question: "Rire est important, ça détend l'atmosphère, vous ne trouvez pas ?",
        answers: [{ text: "Tout à fait, c'est essentiel pour moi.", next: 21, score: 0 }]
    },
    //20
    {
        question: "Comprendre. Avoir l'esprit ouvert est aussi une qualité.",
        answers: [{ text: "Je suppose que oui, je suis ouvert à tout type de film.", next: 21, score: 0 }]
    },
    //21
    {
    question: "Quels sont vos loisirs en dehors du travail ? Cela nous aide à mieux vous connaître.",
    answers: [
        { text: "Je suis passionné de musique et je joue de la guitare.", next: 25, score: 3 },
        { text: "Je fais beaucoup de randonnée, j'aime être en nature.", next: 26, score: 3 },
        { text: "Je lis beaucoup, surtout de la science-fiction.", next: 27, score: 3 },
        { text: "Quel question ! les film bien sur !", next: 28, score: 15 }
    ]
},
//22
{
    question: "Quel temps fait-il aujourd'hui, n'est-ce pas ? Pensez-vous que cela affecte l'humeur au travail ?",
    answers: [
        { text: "Absolument, le beau temps me rend plus productif.", next: 29, score: 2 },
        { text: "Pas vraiment, je reste concentré quelle que soit la météo.", next: 30, score: 5 }
    ]
},
//23
{
    question: "Avez-vous des attentes particulières concernant vos honoraires ?",
    answers: [
        { text: "J'espère être rémunéré à la hauteur de mes compétences.", next:31, score: 5 },
        { text: "Pour moi, l'important c'est surtout l'environnement de travail.", next: 32, score: 10 }
    ]
},
//24

{
    question: "Comment percevez-vous l'ambiance de notre entreprise, d'après ce que vous avez entendu ?",
    answers: [
        { text: "J'ai entendu dire que l'ambiance était assez décontractée ici, ce qui me plaît.", next: 35, score: -2 },
        { text: "Honnêtement, j'ai entendu quelques critiques, mais je préfère me faire ma propre opinion.", next: 34, score: 5 }
    ]
},
//25
{
    question: "C'est super ! La musique peut être une belle échappatoire. Avez-vous des groupes préférés ?",
    answers: [{ text: "Oui, j'adore Radiohead et les Beatles.", next: 22, score: 5 }]
},
//26
{
    question: "La randonnée, excellent choix. Avez-vous un endroit favori pour marcher ?",
    answers: [{ text: "Oui, je vais souvent dans les Alpes.", next: 22, score: 5 }]
},
//27
{
    question: "La lecture est une fenêtre sur le monde. Quel est votre auteur préféré ?",
    answers: [{ text: "Isaac Asimov est mon préféré, sans hésitation.", next: 22, score: 5 }]
},
//28
{
    question: "C'est ce que je voulais entendre !",
    answers: [{ text: " :)", next: 22, score: 7 }]
},
//29
{
    question: "Je suis d'accord, le soleil a cet effet sur beaucoup de gens. Pensez-vous que cela affecte aussi vos collègues ?",
    answers: [{ text: "Je pense que oui, tout le monde semble plus heureux.", next: 23, score: 2 }]
},
//30
{
    question: "Je ne m'attendais pas à une tel réponse. Pensez-vous que cela affecte aussi vos collègues ?",
    answers: [{ text: "Chacun fait ce qu'il veut !", next: 23, score: 2 }]
},

//31
{
    question: "C'est une attente raisonnable. Quelles sont vos compétences principales qui justifieraient cette rémunération ?",
    answers: [{ text: "Je suis expert en analyse de données et j'ai une grande expérience en gestion de projets.", next: 24, score: 0 }]
},
//32
{
    question: "Cool Cool Cool, je prend note !",
    answers: [{ text: "Ce n'est pas ce que vous attendiez ?", next: 33, score: 0 }]
},
//33
{
    question: "Si si merci",
    answers: [{ text: "ok", next: 24, score: 0}]
},
//34
{
    question: "Que recherchez-vous spécifiquement dans l'ambiance de travail ?",
    answers: [{ text: "Je cherche un environnement où l'innovation et la créativité sont encouragées.", next: 36, score: 2 }]
},
//35
{
    question: "Il ne faut pas croire tout ce que vous entendez !",
    answers: [{ text: "Ha !", next: 36, score: 0 }]
},
//36
{
    question: "En tous cas merci pour toutes ces informations. Je pense que nous avons une bonne idée de qui vous êtes maintenant. Avez-vous des questions pour nous ?",
    answers: [{ text: "Non, je pense que tout est clair pour le moment. Merci.", next: 37, score: 0 }]
},
//37
{
    question: "Parfait alors, je pense que nous avons assez discuté pour aujourd'hui. Comment vous sentez-vous à propos de cet entretien ?",
    answers: [
        { text: "Je suis confiant, j'espère que vous me considérerez pour le poste.", next: 38, score: 10 },
        { text: "Je ne suis pas sûr, j'ai des doutes.", next: 39, score: -5 }
    ]
},

//38

    // Chemin vers la fin
    {
        question: "Vous savez quoi on va faire un test ensemble suivez moi",

    },
    //39

    // Chemin vers la fin
    {
        question: "On vous recontactera par email, au revoir Mr Michel",

    }
];

let currentQuestionIndex = 0;
let playerName = "Michel";
let totalScore = 0; // Initialisation du score total

// Sélection de l'élément pour afficher le score
const scoreElement = document.getElementById('score-value');

// Historique des questions posées
let questionHistory = [];

function askQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    let dialogueText = currentQuestion.question.replace("{nom}", playerName);

    dialogueElement.textContent = dialogueText;
    choicesElement.innerHTML = '';
// Mettez ces lignes dans la fonction askQuestion() juste après la création des boutons pour les réponses

if (currentQuestionIndex === 38) {
    // Si la question est la question 38
    const okButton = document.createElement('button');
    okButton.textContent = "OK";
    okButton.addEventListener('click', () => {
        // Rediriger vers la page LV3.html
        window.location.href = "LV3.html";
    });
    choicesElement.appendChild(okButton);
} else if (currentQuestionIndex === 39) {
    // Si la question est la question 39
    const restartButton = document.createElement('button');
    restartButton.textContent = "Recommencer";
    restartButton.addEventListener('click', () => {
        // Recharger la page actuelle
        window.location.reload();
    });
    choicesElement.appendChild(restartButton);
}

    if (currentQuestion.answers && currentQuestion.answers.length > 0) {
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement('button');
            button.textContent = answer.text;
            button.addEventListener('click', () => selectAnswer(answer.next, answer.score));
            choicesElement.appendChild(button);
        });
    } 
}

function selectAnswer(nextIndex, score) {
    // Stocker l'index de la question actuelle dans l'historique
    questionHistory.push(currentQuestionIndex);

    // Mettre à jour le score total
    totalScore += score;

    // Vérifier si la prochaine question est la question 37 et si la réponse sélectionnée est "Je suis confiant"
    if (currentQuestionIndex === 37 && nextIndex === 38 && totalScore <= 115) {
        // Rediriger vers la question 39 si le score total est inférieur ou égal à 115
        currentQuestionIndex = 39;
    } else {
        // Mettre à jour l'index de la question actuelle
        currentQuestionIndex = nextIndex;
    }

    // Actualiser l'affichage du score
    updateScore();

    // Poser la prochaine question
    askQuestion();
}



// Fonction pour obtenir l'index d'une question dans la liste des questions
function questionIndex(question) {
    return questions.indexOf(question);
}

// Fonction pour mettre à jour l'affichage du score
function updateScore() {
    scoreElement.textContent = totalScore; // Mettre à jour le contenu de l'élément de score
}

// Fonction pour revenir à la question précédente
function goBack() {
    if (questionHistory.length > 0) {
        currentQuestionIndex = questionHistory.pop(); // Retirer la dernière question de l'historique
        askQuestion();
    } else {
        console.log("Vous êtes déjà à la première question.");
    }
}

// Commencer le jeu en posant la première question
askQuestion();