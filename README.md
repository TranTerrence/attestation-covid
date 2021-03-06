# Générateur de certificat de déplacement non officiel
Cette version basée sur la version officielle offre un bouton supplémentaire qui permet de générer plusieurs certificats de déplacement pour couvrir une plage horaire plus importante. 
L'instance est disponible à l'adresse suivance: [https://attestation-covid.web.app/](https://attestation-covid.web.app/)

## Développer

### Installer le projet

```console
git clone https://github.com/TranTerrence/attestation-covid.git
cd attestation-covid
npm i
npm start
```

## Générer et tester le code de production

### Tester le code de production en local

#### Générer le code de production pour tester que le build fonctionne en entier

```console
npm run build:dev
```

#### Tester le code de production en local

```console
npx serve dist
```

Et visiter http://localhost:5000

Le code à déployer sera le contenu du dossier `dist`

## Crédits

Ce projet a été réalisé à partir d'un fork du dépôt [attestation-deplacement-derogatoire-q4-2020](https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020.git) lui même issu d'un fork du dépôt [deplacement-covid-19](https://github.com/nesk/deplacement-covid-19) de lui-même réalisé à partir d'un fork du dépôt [covid-19-certificate](https://github.com/nesk/covid-19-certificate) de [Johann Pardanaud](https://github.com/nesk).
Cette version inclut aussi [la pull request](https://github.com/LAB-MI/attestation-deplacement-derogatoire-q4-2020/pull/58) de [tar-gezed](https://github.com/tar-gezed) pour l'enregistrement automatique des données.

Les projets open source suivants ont été utilisés pour le développement de ce
service :

- [PDF-LIB](https://pdf-lib.js.org/)
- [qrcode](https://github.com/soldair/node-qrcode)
- [Bootstrap](https://getbootstrap.com/)
- [Font Awesome](https://fontawesome.com/license)
