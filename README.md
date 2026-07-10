# Onkyo Control

Contrôle ton ampli **Onkyo** depuis Raycast via le protocole **EISCP** (réseau local, port TCP 60128).

## Configuration

Dans les préférences de l'extension, renseigne l'**adresse IP** de ton ampli (ex. `192.168.1.54`).

## Commandes

| Commande | Description |
|----------|-------------|
| **Onkyo On / Off** | Allume ou éteint l'ampli |
| **Onkyo Volume** | Règle le volume (0–100) |
| **Onkyo Source** | Liste toutes les entrées disponibles (CBL/SAT, GAME, CD, NET…) |
| **Onkyo Volume Mute / Unmute** | Coupe ou réactive le son |
| **Onkyo Remote** | Télécommande complète (power, volume, sources, scènes) |
| **Onkyo Scenes** | Crée et lance des scènes (ex. allumer + SAT + volume 40) |
| **Run Onkyo Scene** | Lance une scène par son nom (alias Raycast, quicklink) |

## Scènes

Une scène enchaîne plusieurs actions en une seule commande :

- Allumer / éteindre
- Choisir une source
- Régler le volume
- Mute / unmute

### Exemple : Mode musique

Scène incluse par défaut au premier lancement :

| Champ | Valeur |
|-------|--------|
| Nom | `Mode musique` |
| Alimentation | Allumer |
| Source | CBL/SAT / VIDEO2 |
| Volume | `40` |

Résultat en un clic : l'ampli s'allume, passe sur la box/TNT, volume à 40.

### Créer une scène custom

1. Ouvre **Onkyo Scenes** dans Raycast
2. Clique **Créer une scène**
3. Remplis le formulaire, par exemple :

| Champ | Valeur |
|-------|--------|
| Nom | `Mode ciné` |
| Alimentation | Allumer |
| Source | BD/DVD |
| Volume | `55` |
| Sourdine | Ne pas changer |

4. Valide avec **Créer**, puis **Activer la scène**

### Lancer une scène via alias Raycast

Crée un alias Raycast pour lancer une scène sans ouvrir la liste :

```
Run Onkyo Scene Mode musique
```

Autres exemples :

```
Run Onkyo Scene Mode ciné
Run Onkyo Scene Mode nuit
```

Le nom doit correspondre exactement à celui enregistré dans **Onkyo Scenes** (insensible à la casse).

## Développement

```bash
yarn install
yarn dev
```

Lint et build :

```bash
yarn lint
yarn build
```
