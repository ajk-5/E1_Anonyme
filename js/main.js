/*
EXAMPLES FOR JSON
"projects": [
    {
      "id": 1,
      "title": "E-commerce ModaStyle",
      "client": "ModaStyle Fashion",
      "category": "E-commerce",
      "technologies": ["HTML5", "CSS3", "JavaScript", "PHP"],
      "year": 2024,
      "duration": "3 mois",
      "image": "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80",
      "description": "Plateforme e-commerce complète pour une boutique de mode en ligne avec système de paiement intégré et gestion de stock.",
      "features": ["Panier dynamique", "Paiement sécurisé", "Gestion compte client"],
      "url": "https://modastylee-commerce.example.com"
    },


{
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
    },    */
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
    for (const techno of technologies) {
        ajouterTexte(badges, 'span', techno, 'badge text-bg-secondary');
    }
    parent.append(badges);
}

function remplirSelect(id, values) {
    const select = document.getElementById(id);
    for (const value of values) {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.append(option);
    }
}

function ajouterInscription(parent, formation) {
    if (formation.available) {
        const lien = ajouterTexte(parent, 'a', 'S’inscrire', 'btn btn-success');
        lien.href = 'inscription.html?course=' + formation.id;
    } else {
        ajouterTexte(parent, 'button', 'Complet', 'btn btn-secondary').disabled = true;
    }
}

// Bootstrap gère l'ouverture et la fermeture de la fenêtre.
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
        for (const feature of item.features) {
            ajouterTexte(liste, 'li', feature);
        }
        contenu.append(liste);
        const lien = ajouterTexte(contenu, 'a', ' Visiter ');
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
        for (const module of item.modules) {
            ajouterTexte(liste, 'li', module);
        }
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
    const resultats = [];
    for (const projet of projets) {
        const texte = (projet.title + ' ' + projet.client).toLowerCase();
        if (!texte.includes(recherche)) continue;
        if (techno !== '' && !projet.technologies.includes(techno)) continue;
        if (categorie !== '' && projet.category !== categorie) continue;
        resultats.push(projet);
    }

    const liste = document.getElementById('portfolio');
    liste.replaceChildren();
    document.getElementById('total').textContent = resultats.length + ' projet(s) trouvé(s)';
    for (const projet of resultats) {
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
    }
}

function afficherFormations() {
    const recherche = document.getElementById('chercher').value.toLowerCase();
    const categorie = document.getElementById('domaine').value;
    const niveau = document.getElementById('niveau').value;
    const techno = document.getElementById('technologie').value;
    const resultats = [];
    for (const formation of formations) {
        if (!formation.title.toLowerCase().includes(recherche)) continue;
        if (categorie !== '' && formation.category !== categorie) continue;
        if (niveau !== '' && formation.level !== niveau) continue;
        if (techno !== '' && !formation.technologies.includes(techno)) continue;
        resultats.push(formation);
    }

    const liste = document.getElementById('catalogue');
    liste.replaceChildren();
    document.getElementById('nombre').textContent = resultats.length + ' formation(s) trouvée(s)';
    for (const formation of resultats) {
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
    }
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
        for (const filtre of document.querySelectorAll('#projets input, #projets select')) {
            filtre.disabled = false;
        }
    } catch (erreur) {
        document.getElementById('erreur').textContent = 'Impossible de charger les projets. Réessayez en actualisant la page.';
    } finally {
        // Cacher le loader après le chargement, meme en cas d'erreur.
        document.getElementById('chargement').hidden = true;
    }
}

// Charger et afficher les formations.
async function getFormations() {
    try {
        const reponse = await fetch('https://webcraft-api.vercel.app/data/courses.json');

        if (!reponse.ok) {
            throw new Error('API formations inaccessible');
        }

        const donnees = await reponse.json();
        formations = donnees.courses;
        remplirSelect('domaine', donnees.categories);
        remplirSelect('niveau', donnees.levels);
        remplirSelect('technologie', donnees.technologies);
        afficherFormations();
        for (const filtre of document.querySelectorAll('#formations input, #formations select')) {
            filtre.disabled = false;
        }
    } catch (erreur) {
        document.getElementById('probleme').textContent = 'Impossible de charger les formations. Réessayez en actualisant la page.';
    } finally {
        document.getElementById('attente').hidden = true;
    }
}

// Initialiser seulement les elements present sur la page d'accueil.
if (document.getElementById('portfolio')) {
    document.getElementById('recherche').addEventListener('input', afficherProjets);
    document.getElementById('chercher').addEventListener('input', afficherFormations);
    for (const select of document.querySelectorAll('#projets select')) {
        select.addEventListener('change', afficherProjets);
    }
    for (const select of document.querySelectorAll('#formations select')) {
        select.addEventListener('change', afficherFormations);
    }
    getProjets();
    getFormations();
}

// Vérifier les champs du formulaire d'inscription.
function verifierChamp(id) {
    const champ = document.getElementById(id);
    const value = champ.value.trim();
    let message = '';

    if ((id === 'prenom' || id === 'nom') && value.length < 2) {
        message = 'Saisissez au moins 2 caractères.';
    }
    if (id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        message = 'Saisissez un email valide, par exemple nom@mail.fr.';
    }
    if (id === 'telephone' && !/^\+[1-9][0-9]{6,14}$/.test(value.replace(/[\s().-]/g, ''))) {
        message = 'Utilisez le format international, par exemple +33 6 12 34 56 78.';
    }
    if ((id === 'formation' || id === 'niveau') && value === '') {
        message = 'Choisissez une option.';
    }
    if (id === 'motivation' && value.length < 50) {
        message = 'Votre motivation doit contenir au moins 50 caractères.';
    }

    document.getElementById(id + 'erreur').textContent = message;
    if (message === '') {
        champ.classList.remove('is-invalid');
        champ.classList.add('is-valid');
        champ.setAttribute('aria-invalid', 'false');
    } else {
        champ.classList.remove('is-valid');
        champ.classList.add('is-invalid');
        champ.setAttribute('aria-invalid', 'true');
    }
    return message === '';
}

async function chargerChoix() {
    try {
        const reponse = await fetch('https://webcraft-api.vercel.app/data/courses.json');
        if (!reponse.ok) throw new Error('API formations inaccessible');
        const donnees = await reponse.json();
        const select = document.getElementById('formation');
        const choix = new URLSearchParams(window.location.search).get('course');
        for (const formation of donnees.courses) {
            const option = document.createElement('option');
            option.value = formation.id;
            option.textContent = formation.title;
            option.disabled = !formation.available;
            if (!formation.available) option.textContent += ' (Complet)';
            select.append(option);
            if (String(formation.id) === choix && formation.available) {
                select.value = choix;
            }
        }
        select.disabled = false;
        document.getElementById('envoyer').disabled = false;
    } catch (erreur) {
        document.getElementById('probleme').textContent = 'Impossible de charger les formations. Actualisez la page pour réessayer.';
    } finally {
        document.getElementById('attente').hidden = true;
    }
}

// Le meme fichier JS est utilisé sur les deux pages.
if (document.getElementById('inscription')) {
    const formulaire = document.getElementById('inscription');
    const champs = ['prenom', 'nom', 'email', 'telephone', 'formation', 'niveau', 'motivation'];
    for (const id of champs) {
        const champ = document.getElementById(id);
        champ.addEventListener('input', () => verifierChamp(id));
        champ.addEventListener('change', () => verifierChamp(id));
    }
    formulaire.addEventListener('input', () => {
        document.getElementById('succes').textContent = '';
    });
    formulaire.addEventListener('submit', event => {
        event.preventDefault();
        let valide = true;
        let premier = '';
        for (const id of champs) {
            if (!verifierChamp(id)) {
                valide = false;
                if (premier === '') premier = id;
            }
        }
        if (!valide) {
            document.getElementById(premier).focus();
            return;
        }
        document.getElementById('succes').textContent = 'Inscription validée pour la démonstration. Aucune donnée n’a été envoyée.';
        formulaire.reset();
        for (const id of champs) {
            const champ = document.getElementById(id);
            champ.classList.remove('is-valid', 'is-invalid');
            champ.removeAttribute('aria-invalid');
            document.getElementById(id + 'erreur').textContent = '';
        }
    });
    chargerChoix();
}
