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

// Bootstrap ouvre la fenêtre et gère ses trois façons de fermer.
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
        ajouterTexte(carte, 'p', '★ ' + formation.rating + '/5 · ' + formation.students + ' étudiants');
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
        document.getElementById('portfolio').replaceChildren();
        document.getElementById('erreur').textContent = 'Impossible de charger les projets. Actualisez la page pour réessayer.';
    } finally {
        document.getElementById('chargement').hidden = true;
    }
}

async function getFormations() {
    try {
        const reponse = await fetch('https://webcraft-api.vercel.app/data/courses.json');
        if (!reponse.ok) throw new Error('API formations inaccessible');
        const donnees = await reponse.json();
        formations = donnees.courses;
        remplirSelect('domaine', donnees.categories);
        remplirSelect('niveau', donnees.levels);
        remplirSelect('technologie', donnees.technologies);
        afficherFormations();
        document.querySelectorAll('#formations input, #formations select').forEach(filtre => {
            filtre.disabled = false;
        });
    } catch (erreur) {
        document.getElementById('catalogue').replaceChildren();
        document.getElementById('probleme').textContent = 'Impossible de charger les formations. Actualisez la page pour réessayer.';
    } finally {
        document.getElementById('attente').hidden = true;
    }
}

// La recherche réagit à la saisie, les menus au changement de valeur.
document.getElementById('recherche').addEventListener('input', afficherProjets);
document.getElementById('chercher').addEventListener('input', afficherFormations);
document.querySelectorAll('#projets select').forEach(select => select.addEventListener('change', afficherProjets));
document.querySelectorAll('#formations select').forEach(select => select.addEventListener('change', afficherFormations));

getProjets();
getFormations();
