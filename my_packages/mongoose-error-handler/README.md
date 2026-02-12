# **mongoose-error-handler**

> Un plugin Mongoose simple, propre et réutilisable pour standardiser la gestion des erreurs MongoDB/Mongoose dans une API Node.js.

---

## **Présentation**

`mongoose-error-handler` est un plugin pour **Mongoose** qui intercepte et reformate automatiquement les erreurs courantes liées aux opérations en base de données MongoDB.

Il permet :

* d’éviter les erreurs techniques “brutes” dans les réponses API,
* d’unifier le format des erreurs,
* d’améliorer la lisibilité pour le frontend,
* et de centraliser la logique de gestion des erreurs.

Ce package est particulièrement adapté aux projets **Express + MongoDB + Mongoose**.

---

## **Fonctionnalités principales**

Le plugin gère notamment :

| Type d’erreur                | Description                   | Code HTTP |
| ---------------------------- | ----------------------------- | --------- |
| **Doublon (`unique: true`)** | Ex: email déjà utilisé        | `400`     |
| **Validation Mongoose**      | Champs manquants ou invalides | `400`     |
| **CastError**                | Mauvais ObjectId              | `400`     |
| **DocumentNotFoundError**    | Ressource inexistante         | `404`     |

Il intercepte les erreurs sur les méthodes suivantes :

* `save()`
* `create()`
* `updateOne()`
* `findOneAndUpdate()`
* `deleteOne()`
* `findOneAndDelete()`

---

## **Installation (usage local recommandé)**

### Option 1 — Installation par chemin local (recommandée)

Si votre projet est structuré comme suit :

```
projets/
│
├── backend/
│   └── package.json
│
└── packages/
    └── mongoose-error-handler/
        └── package.json
```

Depuis le dossier **backend/** :

```bash
npm install ../packages/mongoose-error-handler
```

---

### Option 2 — Avec `npm link` (développement actif)

Dans le dossier du package :

```bash
npm link
```

Puis dans votre backend :

```bash
npm link mongoose-error-handler
```

---

## **Utilisation**

Dans votre modèle Mongoose :

```js
const mongoose = require('mongoose');
const mongooseErrorHandler = require('mongoose-error-handler');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "L'email est obligatoire"],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Le mot de passe est obligatoire"],
    minlength: [6, "Le mot de passe doit contenir au moins 6 caractères"]
  },
});

userSchema.plugin(mongooseErrorHandler);

module.exports = mongoose.model('User', userSchema);
```

---

## **Exemple de réponse API**

### Cas : email déjà existant

Requête :

```json
{
  "email": "test@test.com",
  "password": "123456"
}
```

Réponse API :

```json
{
  "message": "Le champ \"email\" existe déjà."
}
```

---

## **Bon pattern Express recommandé**

Dans vos contrôleurs :

```js
.catch(err => {
  res.status(err.status || 500).json({
    message: err.message || "Erreur serveur"
  });
});
```

---

## **Pourquoi utiliser ce plugin ?**

Il permet de :

* séparer la logique métier de la gestion d’erreurs,
* rendre votre API plus professionnelle,
* éviter la duplication de code,
* améliorer l’expérience développeur (DX),
* et préparer votre projet pour une architecture plus robuste.

---

##  **Auteur**

* **Auteur :** Chartrain Donovan
* **Stack :** Node.js • Express • MongoDB • Mongoose
* **Type :** Plugin Mongoose réutilisable

---

## **Licence**

MIT

---

## **Évolutions possibles**

Dans une version future, ce package pourrait inclure :

* messages personnalisables,
* support multilingue (FR/EN),
* logs structurés,
* compatibilité avec `insertMany()` et `bulkWrite()`.

---
