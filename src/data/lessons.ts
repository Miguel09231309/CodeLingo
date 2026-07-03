import { Lesson, Achievement } from '../types';

export const LESSONS: Lesson[] = [
  // --- HTML CURRICULUM ---
  {
    id: 'html-1',
    subject: 'html',
    title: {
      pt: 'Introdução ao HTML',
      en: 'Introduction to HTML'
    },
    levelRequired: 1,
    xpReward: 15,
    exercises: [
      {
        id: 'html-1-1',
        type: 'multiple-choice',
        question: {
          pt: 'O que significa a sigla HTML?',
          en: 'What does HTML stand for?'
        },
        options: [
          'Hyper Text Markup Language',
          'High Text Machine Language',
          'Hyper Transfer Modular Language',
          'Home Tool Markup Language'
        ],
        correctAnswer: 'Hyper Text Markup Language',
        hint: {
          pt: 'É uma linguagem de marcação hipertexto.',
          en: 'It is a Hyper Text Markup Language.'
        }
      },
      {
        id: 'html-1-2',
        type: 'fill-blank',
        question: {
          pt: 'Complete a tag para criar o maior título de cabeçalho possível:',
          en: 'Complete the tag to create the largest heading element possible:'
        },
        codeSnippet: '<___1>Olá, Mundo!</___1>',
        options: ['h1', 'head', 'header', 'p'],
        correctAnswer: 'h1',
        hint: {
          pt: 'Usamos h1 até h6. Qual é o maior?',
          en: 'We use h1 through h6. Which is the largest?'
        }
      },
      {
        id: 'html-1-3',
        type: 'order-code',
        question: {
          pt: 'Ordene as tags para criar uma estrutura HTML básica válida:',
          en: 'Order the tags to create a basic valid HTML structure:'
        },
        options: [
          '<!DOCTYPE html>',
          '<html>',
          '  <body>Olá</body>',
          '</html>'
        ],
        correctAnswer: '<!DOCTYPE html>|<html>|  <body>Olá</body>|</html>',
        hint: {
          pt: 'O DOCTYPE sempre vem primeiro, seguido de html e seu conteúdo.',
          en: 'DOCTYPE always comes first, followed by html and its content.'
        }
      }
    ]
  },
  {
    id: 'html-2',
    subject: 'html',
    title: {
      pt: 'Atributos e Links',
      en: 'Attributes and Links'
    },
    levelRequired: 2,
    xpReward: 20,
    exercises: [
      {
        id: 'html-2-1',
        type: 'multiple-choice',
        question: {
          pt: 'Qual atributo é usado para definir o destino de um link em uma tag <a>?',
          en: 'Which attribute is used to define the destination link in an <a> tag?'
        },
        options: [
          'href',
          'src',
          'link',
          'target'
        ],
        correctAnswer: 'href',
        hint: {
          pt: 'Abreviação de "hypertext reference".',
          en: 'Short for "hypertext reference".'
        }
      },
      {
        id: 'html-2-2',
        type: 'fill-blank',
        question: {
          pt: 'Preencha o atributo que fornece texto alternativo para uma imagem se ela não carregar:',
          en: 'Fill in the attribute that provides alternative text for an image if it fails to load:'
        },
        codeSnippet: '<img src="logo.png" ___1="Logotipo da Empresa">',
        options: ['alt', 'title', 'desc', 'name'],
        correctAnswer: 'alt',
        hint: {
          pt: 'Abreviação de "alternative".',
          en: 'Short for "alternative".'
        }
      }
    ]
  },

  // --- PYTHON CURRICULUM ---
  {
    id: 'python-1',
    subject: 'python',
    title: {
      pt: 'Variáveis e Saída',
      en: 'Variables and Output'
    },
    levelRequired: 1,
    xpReward: 15,
    exercises: [
      {
        id: 'py-1-1',
        type: 'multiple-choice',
        question: {
          pt: 'Como você imprime "Olá" no console em Python?',
          en: 'How do you print "Hello" to the console in Python?'
        },
        options: [
          'print("Olá")',
          'echo("Olá")',
          'console.log("Olá")',
          'System.out.println("Olá")'
        ],
        correctAnswer: 'print("Olá")',
        hint: {
          pt: 'Python usa a função print().',
          en: 'Python uses the simple print() function.'
        }
      },
      {
        id: 'py-1-2',
        type: 'fill-blank',
        question: {
          pt: 'Complete o código para verificar se uma variável x é maior que 10:',
          en: 'Complete the code to check if variable x is greater than 10:'
        },
        codeSnippet: 'x = 15\n___1 x > 10:\n    print("Maior")',
        options: ['if', 'while', 'for', 'def'],
        correctAnswer: 'if',
        hint: {
          pt: 'Palavra-chave de controle condicional.',
          en: 'Conditional control keyword.'
        }
      },
      {
        id: 'py-1-3',
        type: 'order-code',
        question: {
          pt: 'Ordene o código para declarar uma variável, somar 5 e imprimir o resultado:',
          en: 'Order the code to declare a variable, add 5, and print the result:'
        },
        options: [
          'numero = 10',
          'numero = numero + 5',
          'print(numero)'
        ],
        correctAnswer: 'numero = 10|numero = numero + 5|print(numero)',
        hint: {
          pt: 'Declare primeiro, altere o valor, depois imprima.',
          en: 'Declare first, update the value, then print.'
        }
      }
    ]
  },
  {
    id: 'python-2',
    subject: 'python',
    title: {
      pt: 'Listas e Loops',
      en: 'Lists and Loops'
    },
    levelRequired: 2,
    xpReward: 25,
    exercises: [
      {
        id: 'py-2-1',
        type: 'multiple-choice',
        question: {
          pt: 'Como você adiciona um elemento ao final de uma lista em Python?',
          en: 'How do you append an element to the end of a list in Python?'
        },
        options: [
          'lista.append(item)',
          'lista.add(item)',
          'lista.push(item)',
          'lista.insert(item)'
        ],
        correctAnswer: 'lista.append(item)',
        hint: {
          pt: 'O termo correto em Python é "anexar".',
          en: 'The correct term in Python is to append.'
        }
      },
      {
        id: 'py-2-2',
        type: 'fill-blank',
        question: {
          pt: 'Preencha a palavra-chave para repetir o bloco 5 vezes usando range():',
          en: 'Fill in the keyword to repeat the block 5 times using range():'
        },
        codeSnippet: '___1 i in range(5):\n    print(i)',
        options: ['for', 'while', 'each', 'loop'],
        correctAnswer: 'for',
        hint: {
          pt: 'Usado para iterações contadas/definidas.',
          en: 'Used for counted or bounded iterations.'
        }
      }
    ]
  },

  // --- JAVASCRIPT CURRICULUM ---
  {
    id: 'js-1',
    subject: 'javascript',
    title: {
      pt: 'Fundamentos de JS',
      en: 'JS Fundamentals'
    },
    levelRequired: 1,
    xpReward: 15,
    exercises: [
      {
        id: 'js-1-1',
        type: 'multiple-choice',
        question: {
          pt: 'Qual palavra-chave é usada para declarar uma constante que não pode ser reatribuída?',
          en: 'Which keyword is used to declare a constant that cannot be reassigned?'
        },
        options: [
          'const',
          'let',
          'var',
          'constant'
        ],
        correctAnswer: 'const',
        hint: {
          pt: 'Vem de "constant".',
          en: 'Short for "constant".'
        }
      },
      {
        id: 'js-1-2',
        type: 'fill-blank',
        question: {
          pt: 'Complete o código para registrar uma mensagem no console:',
          en: 'Complete the code to log a message to the console:'
        },
        codeSnippet: 'console.___1("Olá JS!");',
        options: ['log', 'print', 'write', 'alert'],
        correctAnswer: 'log',
        hint: {
          pt: 'O método mais usado do objeto console.',
          en: 'The most common method on the console object.'
        }
      },
      {
        id: 'js-1-3',
        type: 'order-code',
        question: {
          pt: 'Ordene os termos para criar uma arrow function que retorna o dobro de um número:',
          en: 'Order the terms to create an arrow function that returns double a number:'
        },
        options: [
          'const dobro = (x) => {',
          '  return x * 2;',
          '};'
        ],
        correctAnswer: 'const dobro = (x) => {|  return x * 2;|};',
        hint: {
          pt: 'Defina a arrow function, adicione o escopo/corpo e feche a chave.',
          en: 'Define the arrow function, add the body, and close the bracket.'
        }
      }
    ]
  },
  {
    id: 'js-2',
    subject: 'javascript',
    title: {
      pt: 'Manipulação de DOM',
      en: 'DOM Manipulation'
    },
    levelRequired: 2,
    xpReward: 25,
    exercises: [
      {
        id: 'js-2-1',
        type: 'multiple-choice',
        question: {
          pt: 'Como você seleciona um elemento HTML pelo seu ID em JavaScript?',
          en: 'How do you select an HTML element by its ID in JavaScript?'
        },
        options: [
          'document.getElementById("id")',
          'document.selectId("id")',
          'document.queryID("id")',
          'document.getElementByTagName("id")'
        ],
        correctAnswer: 'document.getElementById("id")',
        hint: {
          pt: 'É um método direto no objeto "document".',
          en: 'It is a direct method on the "document" object.'
        }
      },
      {
        id: 'js-2-2',
        type: 'fill-blank',
        question: {
          pt: 'Preencha o método usado para escutar um evento de clique em um botão:',
          en: 'Fill in the method used to listen for a click event on a button:'
        },
        codeSnippet: 'botao.___1("click", () => {\n  alert("Clicado!");\n});',
        options: ['addEventListener', 'on', 'listen', 'attachEvent'],
        correctAnswer: 'addEventListener',
        hint: {
          pt: 'Adiciona um ouvinte para o evento especificado.',
          en: 'Adds a listener for the specified event.'
        }
      }
    ]
  }
];

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ach-1',
    title: {
      pt: 'Primeiro Passo',
      en: 'First Step'
    },
    desc: {
      pt: 'Complete sua primeira lição no CodeLingo',
      en: 'Complete your first lesson on CodeLingo'
    },
    icon: 'Compass',
    xpBonus: 50,
    conditionType: 'lesson',
    targetValue: 1
  },
  {
    id: 'ach-2',
    title: {
      pt: 'Focado e Determinado',
      en: 'Focused & Committed'
    },
    desc: {
      pt: 'Mantenha uma ofensiva (streak) de 3 dias',
      en: 'Keep a 3-day learning streak'
    },
    icon: 'Flame',
    xpBonus: 100,
    conditionType: 'streak',
    targetValue: 3
  },
  {
    id: 'ach-3',
    title: {
      pt: 'Mestre Acumulador',
      en: 'XP Accumulator'
    },
    desc: {
      pt: 'Alcance um total de 200 XP',
      en: 'Reach a total of 200 XP'
    },
    icon: 'Award',
    xpBonus: 150,
    conditionType: 'xp',
    targetValue: 200
  },
  {
    id: 'ach-4',
    title: {
      pt: 'Dev Conectado',
      en: 'Connected Dev'
    },
    desc: {
      pt: 'Sincronize sua conta com o GitHub',
      en: 'Synchronize your account with GitHub'
    },
    icon: 'Github',
    xpBonus: 120,
    conditionType: 'github',
    targetValue: 1
  },
  {
    id: 'ach-5',
    title: {
      pt: 'Campeão de Duelos',
      en: 'Duel Champion'
    },
    desc: {
      pt: 'Vença um Desafio Rápido de Amigos',
      en: 'Win a Quick Friend Challenge'
    },
    icon: 'Zap',
    xpBonus: 100,
    conditionType: 'challenge',
    targetValue: 1
  }
];
