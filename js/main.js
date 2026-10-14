// Charger et afficher les projets.
async function getProjets() {
    try {
        const reponse = await fetch('https://webcraft-api.vercel.app/data/projects.json');

        if (!reponse.ok) {
            throw new Error('API projets inaccessible');
        }

        const donnees = await reponse.json();
        const liste = document.getElementById('liste-projets');

        donnees.projects.forEach(projet => {
            const carte = document.createElement('article');
            carte.className = 'border rounded p-3 mb-3';

            const titre = document.createElement('h3');
            titre.textContent = projet.title;

            const description = document.createElement('p');
            description.textContent = projet.description;

            const technologies = document.createElement('p');
            technologies.textContent = 'Technologies : ' + projet.technologies.join(', ');

            carte.append(titre, description, technologies);
            liste.append(carte);
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
