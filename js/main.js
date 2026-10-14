// Les tableaux permettent de filtrer sans recharger les API.
let projets = [];
let formations = [];

// Petites fonctions pour créer des éléments avec du texte.
function ajouterTexte(parent, balise, texte, classe = '') {
    const element = document.createElement(balise);
    element.textContent = texte;
    element.className = classe;
    parent.append(element);
    return element;
}

function ajouterImage(parent, url) {
    const image = document.createElement('img');
    image.src = url;
    image.alt = ''; // Illustration : le titre est affiché juste après.
    image.className = 'image-carte';
    image.loading = 'lazy';
    image.addEventListener('error', () => image.remove());
    parent.append(image);
}

function ajouterBadges(parent, technologies) {
    const badges = document.createElement('div');
    badges.className = 'technologies';
    technologies.forEach(techno => {
        ajouterTexte(badges, 'span', techno, 'badge text-bg-secondary');
    });
    parent.append(badges);
}

function remplirSelect(id, valeurs) {
    const select = document.getElementById(id);
    valeurs.forEach(valeur => {
        const option = document.createElement('option');
        option.value = valeur;
        option.textContent = valeur;
        select.append(option);
    });
}

function ajouterInscription(parent, formation) {
    if (formation.available) {
        const lien = ajouterTexte(parent, 'a', 'S’inscrire', 'btn btn-success');
        lien.href = 'inscription.html?course=' + formation.id;
    } else {
        ajouterTexte(parent, 'button', 'Complet', 'btn btn-secondary').disabled = true;
    }
}

// Bootstrap open fenêtre et handle ses trois façons de fermer.
function voirDetails(item, type) {
    document.getElementById('titre').textContent = item.title;
    const contenu = document.getElementById('contenu');
    contenu.replaceChildren();
    ajouterImage(contenu, item.image);
    ajouterTexte(contenu, 'p', item.description);
    ajouterTexte(contenu, 'p', 'Catégorie : ' + item.category);
    ajouterBadges(contenu, item.technologies);
    ajouterTexte(contenu, 'p', 'Durée : ' + item.duration);

    if (type === 'projet') {
        ajouterTexte(contenu, 'p', 'Client : ' + item.client);
        ajouterTexte(contenu, 'p', 'Année : ' + item.year);
        ajouterTexte(contenu, 'h3', 'Fonctionnalités');
        const liste = document.createElement('ul');
        item.features.forEach(feature => ajouterTexte(liste, 'li', feature));
        contenu.append(liste);
        const lien = ajouterTexte(contenu, 'a', 'Visiter le projet (lien de démonstration)');
        lien.href = item.url;
        lien.target = '_blank';
        lien.rel = 'noopener';
    } else {
        ajouterTexte(contenu, 'p', 'Niveau : ' + item.level);
        ajouterTexte(contenu, 'p', 'Formateur : ' + item.instructor);
        ajouterTexte(contenu, 'p', 'Prix : ' + item.price + ' €');
        ajouterTexte(contenu, 'p', 'Note : ' + item.rating + '/5 · ' + item.students + ' étudiants');
        ajouterTexte(contenu, 'p', item.available ? 'Disponible' : 'Complet');
        ajouterTexte(contenu, 'h3', 'Modules');
        const liste = document.createElement('ul');
        item.modules.forEach(module => ajouterTexte(liste, 'li', module));
        contenu.append(liste);
        ajouterInscription(contenu, item);
        if (item.available) contenu.lastElementChild.textContent = 'S’inscrire maintenant';
    }

    const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('details'));
    modal.show();
}

function afficherProjets() {
    const recherche = document.getElementById('recherche').value.toLowerCase();
    const techno = document.getElementById('techno').value;
    const categorie = document.getElementById('categorie').value;
    const resultats = projets.filter(projet => {
        return (projet.title + ' ' + projet.client).toLowerCase().includes(recherche)
            && (techno === '' || projet.technologies.includes(techno))
            && (categorie === '' || projet.category === categorie);
    });

    const liste = document.getElementById('portfolio');
    liste.replaceChildren();
    document.getElementById('total').textContent = resultats.length + ' projet(s) trouvé(s)';
    resultats.forEach(projet => {
        const carte = document.createElement('article');
        ajouterImage(carte, projet.image);
        ajouterTexte(carte, 'h3', projet.title);
        ajouterTexte(carte, 'p', 'Client : ' + projet.client);
        ajouterTexte(carte, 'p', projet.category);
        ajouterBadges(carte, projet.technologies);
        const boutons = document.createElement('div');
        boutons.className = 'boutons';
        const bouton = ajouterTexte(boutons, 'button', 'Voir détails', 'btn btn-primary');
        bouton.addEventListener('click', () => voirDetails(projet, 'projet'));
        carte.append(boutons);
        liste.append(carte);
    });
}

function afficherFormations() {
    const recherche = document.getElementById('chercher').value.toLowerCase();
    const categorie = document.getElementById('domaine').value;
    const niveau = document.getElementById('niveau').value;
    const techno = document.getElementById('technologie').value;
    const resultats = formations.filter(formation => {
        return formation.title.toLowerCase().includes(recherche)
            && (categorie === '' || formation.category === categorie)
            && (niveau === '' || formation.level === niveau)
            && (techno === '' || formation.technologies.includes(techno));
    });

    const liste = document.getElementById('catalogue');
    liste.replaceChildren();
    document.getElementById('nombre').textContent = resultats.length + ' formation(s) trouvée(s)';
    resultats.forEach(formation => {
        const carte = document.createElement('article');
        ajouterImage(carte, formation.image);
        ajouterTexte(carte, 'h3', formation.title);
        ajouterTexte(carte, 'p', formation.category);
        ajouterTexte(carte, 'p', formation.level, 'badge text-bg-info align-self-start');
        ajouterTexte(carte, 'p', formation.duration + ' · ' + formation.price + ' €');
        ajouterTexte(carte, 'p', '⭐' + formation.rating + '/5 · ' + formation.students + ' étudiants');
        ajouterBadges(carte, formation.technologies);
        ajouterTexte(carte, 'p', formation.available ? 'Disponible' : 'Complet',
            'badge align-self-start ' + (formation.available ? 'text-bg-success' : 'text-bg-secondary'));
        const boutons = document.createElement('div');
        boutons.className = 'boutons';
        const bouton = ajouterTexte(boutons, 'button', 'Voir détails', 'btn btn-primary');
        bouton.addEventListener('click', () => voirDetails(formation, 'formation'));
        ajouterInscription(boutons, formation);
        carte.append(boutons);
        liste.append(carte);
    });
}

async function getProjets() {
    try {
        const reponse = await fetch('https://webcraft-api.vercel.app/data/projects.json');
        if (!reponse.ok) throw new Error('API projets inaccessible');
        const donnees = await reponse.json();
        projets = donnees.projects;
        remplirSelect('techno', donnees.technologies);
        remplirSelect('categorie', donnees.categories);
        afficherProjets();
        document.querySelectorAll('#projets input, #projets select').forEach(filtre => {
            filtre.disabled = false;
        });
    } catch (erreur) {
        document.getElementById('erreur-projets').textContent = 'Impossible de charger les projets. Réessayez en actualisant la page.';
    } finally {
        // Cacher le loader après le chargement, même en cas d'erreur.
        document.getElementById('loader-projets').hidden = true;
    }
}

// Charger et afficher les formations.
async function getFormations() {
    try {
        const reponse = await fetch('https://webcraft-api.vercel.app/data/courses.json');

        if (!reponse.ok) {
            throw new Error('API formations inaccessable');
        }

        const donnees = await reponse.json();
        const liste = document.getElementById('liste-formations');

        donnees.courses.forEach(formation => {
            const carte = document.createElement('article');
            carte.className = 'border rounded p-3 mb-3';

            const titre = document.createElement('h3');
            titre.textContent = formation.title;

            const description = document.createElement('p');
            description.textContent = formation.description;

            const details = document.createElement('p');
            details.textContent = formation.level + ' -> ' + formation.duration + ' -> ' + formation.price + ' €';



            carte.append(titre, description, details);
            liste.append(carte);
        });
    } catch (erreur) {
        document.getElementById('erreur-formations').textContent = 'Impossible de charger les formations. Réessayez en actualisant la page.';
    } finally {
        document.getElementById('loader-formations').hidden = true;
    }
}

getProjets();
getFormations();

/*{
  "courses": [
    {
      "id": 1,
      "title": "Maîtriser React 18",
      "category": "Frontend",
      "level": "Intermédiaire",
      "duration": "24h",
      "technologies": ["React", "JavaScript", "Hooks"],
      "instructor": "Sophie Martin",
      "price": 599,
      "rating": 4.8,
      "students": 342,
      "image": "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
      "description": "Formation complète sur React 18 avec les dernières fonctionnalités : Concurrent Rendering, Suspense, Server Components. Apprenez à créer des applications web modernes et performantes.",
      "modules": ["Composants fonctionnels", "Hooks avancés", "Context API", "Performance", "Server Components"],
      "available": true
    },
    {
      "id": 2,
      "title": "Node.js & Express - Backend Complet",
      "category": "Backend",
      "level": "Intermédiaire",
      "duration": "32h",
      "technologies": ["Node.js", "Express", "MongoDB"],
      "instructor": "Marc Dubois",
      "price": 699,
      "rating": 4.7,
      "students": 289,
      "image": "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80",
      "description": "Développez des APIs REST robustes et scalables avec Node.js et Express. Gestion d'authentification, bases de données, déploiement et bonnes pratiques de sécurité.",
      "modules": ["Installation Node.js", "Routing Express", "MongoDB", "JWT Authentication", "Déploiement"],
      "available": true
    },
    {
      "id": 3,
      "title": "Vue.js 3 - De Zéro à Expert",
      "category": "Frontend",
      "level": "Débutant",
      "duration": "20h",
      "technologies": ["Vue.js", "JavaScript", "Composition API"],
      "instructor": "Julie Rousseau",
      "price": 499,
      "rating": 4.9,
      "students": 456,
      "image": "https://images.unsplash.com/photo-1619410283995-43d9134e7656?w=800&q=80",
      "description": "Débutez avec Vue.js 3 et sa Composition API. Formation pratique avec projets réels : SPA, gestion d'état, routing et communication avec APIs.",
      "modules": ["Bases Vue.js", "Composition API", "Vue Router", "Pinia Store", "Projet fil rouge"],
      "available": true
    },
    {
      "id": 4,
      "title": "DevOps avec Docker & Kubernetes",
      "category": "DevOps",
      "level": "Avancé",
      "duration": "40h",
      "technologies": ["Docker", "Kubernetes", "CI/CD"],
      "instructor": "Thomas Bernard",
      "price": 899,
      "rating": 4.6,
      "students": 178,
      "image": "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&q=80",
      "description": "Maîtrisez les containers Docker et l'orchestration Kubernetes. Déployez des applications scalables avec pipelines CI/CD automatisés sur AWS et Azure.",
      "modules": ["Docker fondamentaux", "Orchestration K8s", "Helm Charts", "CI/CD GitLab", "Production"],
      "available": true
    },
    {
      "id": 5,
      "title": "React Native - Applications Mobiles",
      "category": "Mobile",
      "level": "Intermédiaire",
      "duration": "28h",
      "technologies": ["React Native", "JavaScript", "Expo"],
      "instructor": "Léa Fontaine",
      "price": 649,
      "rating": 4.7,
      "students": 312,
      "image": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80",
      "description": "Créez des applications mobiles iOS et Android avec React Native. Navigation, animations, intégration APIs, notifications push et publication sur les stores.",
      "modules": ["Setup Expo", "Components natifs", "Navigation", "State management", "Publication stores"],
      "available": true
    },
    {
      "id": 6,
      "title": "Python Django - Web Framework",
      "category": "Backend",
      "level": "Débutant",
      "duration": "30h",
      "technologies": ["Python", "Django", "PostgreSQL"],
      "instructor": "Pierre Lefebvre",
      "price": 549,
      "rating": 4.5,
      "students": 267,
      "image": "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
      "description": "Développez des applications web complètes avec Django. ORM, authentification, admin, REST API avec Django REST Framework, tests et déploiement.",
      "modules": ["Intro Django", "Models & ORM", "Views & Templates", "Django REST", "Admin & Auth"],
      "available": false
    },
    {
      "id": 7,
      "title": "Angular 17 - Enterprise Applications",
      "category": "Frontend",
      "level": "Avancé",
      "duration": "36h",
      "technologies": ["Angular", "TypeScript", "RxJS"],
      "instructor": "Alexandre Moreau",
      "price": 799,
      "rating": 4.8,
      "students": 201,
      "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80",
      "description": "Maîtrisez Angular 17 pour des applications d'entreprise robustes. TypeScript avancé, RxJS, architecture modulaire, tests unitaires et e2e avec Cypress.",
      "modules": ["TypeScript avancé", "Components & Directives", "Services & RxJS", "Routing avancé", "Testing"],
      "available": true
    },
    {
      "id": 8,
      "title": "Flutter - Développement Mobile Cross-Platform",
      "category": "Mobile",
      "level": "Débutant",
      "duration": "26h",
      "technologies": ["Flutter", "Dart", "Firebase"],
      "instructor": "Camille Durand",
      "price": 599,
      "rating": 4.9,
      "students": 389,
      "image": "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&q=80",
      "description": "Créez de magnifiques applications mobiles avec Flutter et Dart. Widgets personnalisés, animations, Firebase, state management avec Provider et GetX.",
      "modules": ["Dart basics", "Flutter widgets", "Navigation", "Firebase integration", "State management"],
      "available": true
    },
    {
      "id": 9,
      "title": "AWS Cloud Architect",
      "category": "DevOps",
      "level": "Avancé",
      "duration": "45h",
      "technologies": ["AWS", "Terraform", "CloudFormation"],
      "instructor": "Vincent Lambert",
      "price": 999,
      "rating": 4.7,
      "students": 156,
      "image": "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80",
      "description": "Devenez architecte cloud AWS certifié. EC2, S3, Lambda, RDS, VPC, Infrastructure as Code avec Terraform, sécurité, monitoring et optimisation des coûts.",
      "modules": ["AWS fondamentaux", "Compute & Storage", "Networking", "IaC Terraform", "Sécurité & Coûts"],
      "available": true
    },
    {
      "id": 10,
      "title": "Full Stack JavaScript - MERN Stack",
      "category": "Backend",
      "level": "Intermédiaire",
      "duration": "38h",
      "technologies": ["MongoDB", "Express", "React", "Node.js"],
      "instructor": "Sarah Petit",
      "price": 749,
      "rating": 4.8,
      "students": 423,
      "image": "https://images.unsplash.com/photo-1537432376769-00f5c2f4c8d2?w=800&q=80",
      "description": "Formation complète MERN Stack pour devenir développeur Full Stack JavaScript. Créez une application e-commerce de A à Z avec authentification, paiements et déploiement.",
      "modules": ["MongoDB Atlas", "Express API", "React frontend", "Authentication JWT", "Stripe integration"],
      "available": true
    }
  ],
  "categories": [
    "Frontend",
    "Backend",
    "Mobile",
    "DevOps"
  ],
  "levels": [
    "Débutant",
    "Intermédiaire",
    "Avancé"
  ],
  "technologies": [
    "React",
    "Vue.js",
    "Angular",
    "JavaScript",
    "TypeScript",
    "Node.js",
    "Express",
    "Python",
    "Django",
    "MongoDB",
    "PostgreSQL",
    "Docker",
    "Kubernetes",
    "AWS",
    "React Native",
    "Flutter",
    "Dart",
    "Hooks",
    "RxJS",
    "Firebase",
    "Terraform",
    "CI/CD",
    "Composition API",
    "Expo"
  ]
}*/