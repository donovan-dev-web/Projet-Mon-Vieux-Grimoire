# 📚 Mon Vieux Grimoire

<p align="center">

![Node](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js\&logoColor=white)
![Express](https://img.shields.io/badge/Express-API-black?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb\&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Containerized-2496ED?logo=docker\&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-blue)
![Security](https://img.shields.io/badge/Security-OWASP%20Inspired-green)
![License](https://img.shields.io/badge/License-Portfolio-lightgrey)

</p>

---

## 📌 Overview

**Mon Vieux Grimoire** est une plateforme de référencement et de notation de livres développée pour une chaîne de librairies indépendante basée à Lille.

Ce repository contient l’architecture complète :

* 🎨 Frontend React
* ⚙️ Backend API REST (Node.js / Express)
* 🗄️ MongoDB
* 🐳 Environnement Dockerisé

---
**Deux branche disponible :**
* Sans Docker (Branch Main) : https://github.com/donovan-dev-web/Projet-Mon-Vieux-Grimoire
* Avec Docker : https://github.com/donovan-dev-web/Projet-Mon-Vieux-Grimoire/tree/Projet-Dockeriser

---

# 📑 Table des matières

* [🏗 Architecture](#-architecture)
* [🎯 Objectifs](#-objectifs)
* [⚙️ Choix Techniques](#️-choix-techniques)
* [🔐 Sécurité](#-sécurité)
* [🖼 Optimisation & Green Code](#-optimisation--green-code)
* [🧰 Stack Technique](#-stack-technique)
* [📖 Documentation API](#-documentation-api)
* [🚀 Installation](#-installation)
* [🔮 Roadmap](#-roadmap)
* [👤 Auteur](#-auteur)

---

# 🏗 Architecture

## 📂 Structure du Repository

```
/Projet-Mon-Vieux-Grimoire
│
├── backend/            → API REST (Node.js / Express)
├── frontend/           → Application React
├── custom_package/     → mongoose-error-handler
│
├── docker-compose.yml
└── README.md
```

---

## 📊 Architecture Applicative

```
        ┌───────────────┐
        │   Frontend    │
        │    (React)    │
        └───────┬───────┘
                │ HTTPS (JWT)
                ▼
        ┌───────────────┐
        │   Backend     │
        │  Express API  │
        └───────┬───────┘
                │ Mongoose
                ▼
        ┌───────────────┐
        │   MongoDB     │
        │  (Dockerized) │
        └───────────────┘
```

---

# 🎯 Objectifs

Dans le cadre de ma formation OpenClassrooms, j’interviens en tant que **développeur back-end freelance**.

Objectifs :

* Concevoir une API REST robuste
* Sécuriser les échanges
* Garantir la persistance des données
* Optimiser les ressources
* Respecter les standards professionnels

---

# ⚙️ Choix Techniques

## 🐳 Dockerisation (Choix volontaire)

<details>
<summary><strong>Pourquoi Docker ?</strong></summary>

Le projet ne l’imposait pas, mais j’ai choisi de :

* Dockeriser l’API
* Dockeriser MongoDB
* Utiliser Docker Compose

### Avantages :

* Reproductibilité environnementale
* Isolation des services
* Déploiement simplifié
* Standard industriel

</details>

---

## 🧩 Remplacement de mongoose-unique-validator

<details>
<summary><strong>Approche critique & maintenabilité</strong></summary>

Le package officiel étant déprécié :

* Non maintenu
* Problèmes connus

J’ai développé un package local :

```
./my_packages/mongoose-error-handler
```

Installation :

```json
"mongoose-error-handler": "file:../my_packages/mongoose-error-handler"
```

Avantages :

* Centralisation des erreurs
* Suppression dépendance obsolète
* Architecture propre et maintenable

</details>

---

# 🧰 Stack Technique

| Technologie | Rôle             |
| ----------- | ---------------- |
| Node.js     | Runtime          |
| Express     | API REST         |
| MongoDB     | Base NoSQL       |
| Mongoose    | ODM              |
| Argon2      | Hash             |
| JWT         | Auth             |
| Multer      | Upload           |
| Sharp       | Optimisation     |
| Docker      | Conteneurisation |

---

# 📖 Documentation API

Documentation générée via **Swagger (OpenAPI)** :

* Documentation interactive
* Test direct des endpoints
* Standardisation

Disponible à : http://localhost:4000/api-docs/

---

# 🚀 Installation

## 💻 Local (Recommandé)

```bash
cp .env.example .env
npm install
npm run dev
```

---

## 🐳 Docker

```bash
docker-compose up --build
```

Api dispoblie sur : http://localhost:4000
Frontend sur : http://localhost:3000

Swagger documentation API sur http://localhost:4000/api-docs





La version sans docker utilise mongoDB Atlas
La version avec Docker utilise MongoDB en local.


# 🔐 Sécurité

Inspirée des recommandations **OWASP**.

---

## 🔑 Gestion des mots de passe

* Hashage **Argon2**
* Paramétrage sécurisé
* Protection brute-force offline
* Aucun stockage en clair

---

## 🔐 Authentification

* JWT
* Middleware d’authentification
* Vérification des permissions
* Séparation rôles

---

## 📂 Sécurité des Uploads

* Validation MIME
* Limitation taille
* Renommage sécurisé
* Optimisation Sharp

---

## ⚠️ Gestion des Erreurs

* Middleware global
* Masquage erreurs internes
* Gestion duplication MongoDB

---

## 🌐 Sécurité Réseau

* MongoDB non exposé publiquement
* Réseau Docker interne
* Isolation des services

---

# 🖼 Optimisation & Green Code

Utilisation de **Sharp (libvips)** :

* Compression efficace
* Conversion WebP
* Réduction significative du poids

Objectif :

* Améliorer les performances
* Réduire l’empreinte carbone numérique
* Respecter les principes Green IT

---


# 👤 Auteur

**Donovan Chartrain**
Développeur Web Full-Stack

🔗 GitHub :
[https://github.com/donovan-dev-web](https://github.com/donovan-dev-web)

---

# 📄 Licence

Projet réalisé dans le cadre de la formation OpenClassrooms.
Usage pédagogique & portfolio.

