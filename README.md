# iss-itow
Convert iTow XML to Imperihome ISS API


## Description
Application Node.JS permettant de disposer des informations relevées par iTow (http://itow.fr/site/) dans l'application de contrôle domotique Imperihome (http://www.imperihome.com/).

Interface entre le XML iTow (http://votre.serveur.itow:8166/X) et l'API Imperihome ISS (http://www.imperihome.com/apidoc/systemapi/).

## Configuration
Editer le fichier :
```
./config/default.json
```

* Renseigner le tableau "rooms"
* Renseigner l'ID de room et le nom (optionnel, nom iTow par défaut) de chaque sonde de température ("itowProbes")
* Renseigner l'ID de room et le nom de chaque compteur électrique ("itowMeters")

## Lancement
```
node app.js
```

## Utilisation
Ajouter un nouveau système "ISS" dans les paramètres Imperihome et renseigner l'adresse de base : 
```
http://votre.serveur.iss-itow:8080/
```
