const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
//var firebase = require('firebase');

// const hostname = '127.0.0.1';
const port = 3000;

app.use(express.static(__dirname + '/public'));

http.listen(port, () => {
    console.log(`listening on *:${3000}`);
});

// app.get('/', (req, res) => {
//     res.setHeader('Content-Type', 'text/html');
//     res.statusCode = 200;
//     res.sendFile(__dirname + '/public' + '/index.html');
// });




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////
//    Socket.io
//////////////////////

io.on('connection', (socket) => { // Pour le client
  console.log('New connection: ' + socket.id);
  socket.on('disconnect', () => {
      console.log('New disconnection: ') + socket.id;
  });
});




//////////////////////
//    Firebase
//////////////////////

var admin = require("firebase-admin");

var serviceAccount = require("./lprosio-projet-firebase-adminsdk-fk5af-4e315c4f6e.json"); //le service account key 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://lprosio-projet.firebaseio.com"
});

/*
admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
*/
const db = admin.firestore();

//Tuto test
var docRef = db.collection('collecTest').doc('docTest');
var setData = docRef.set({
    name : 'leNom',
    prenom : 'lePrenom',
    age : 42
});

////
/*
  // Set the configuration for your app
  // TODO: Replace with your app's config object
  var firebaseConfig = {
    apiKey: 'AIzaSyDynJXJrx-4loDRF3z3yx_g9_Ku0xI0AZc',
    authDomain: '<your-auth-domain>',
    databaseURL: 'https://lprosio-projet.firebaseio.com',
    projectId: 'lprosio-projet',
    storageBucket: '<your-storage-bucket>',
    messagingSenderId: '<your-sender-id>'
};
  firebase.initializeApp(firebaseConfig);

  // Get a reference to the storage service, which is used to create references in your storage bucket
  var storage = firebase.storage();
*/


////////////////////
//SET to FireStore//

function playerExist(roomCode, playerName) //ENvoie au client true si exsite
{
  console.log('fonction playerExist...');
      //let query = playerRef.where(selectedVal, '==', wantedVal).get()
    let roomRef = db.collection('Game').doc(roomCode);
    let playerRef = roomRef.collection('Joueur').doc(playerName).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document! : getPlayer');
        sendToClient(false);
      } else {
        //console.log('Document data:', doc.data());
        sendToClient(true);
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
      sendToClient(false);
    });

    console.log("Fin fonction getPlayer");
    return "Fin Fonction getPlayer";
}
  //Test Arrive a la fin avant d'avoir recupere dans la base de donnée et donc return rien.
//console.log(playerExist("XXXX", "John Test"));


function setJoueur(roomCode, nomJoueur, dataPlayer)
{
    let roomRef = db.collection('Game').doc(roomCode);
    let playerRef = roomRef.collection('Joueur').doc(nomJoueur);
    let setPlayer = playerRef.set(dataPlayer);
}//To test
var dataP = {
  points : 5,
  idDoc : [1, 2, 9, 15, 5]
} 
//setJoueur("XXXX", "Bobo", dataP);
//RESULT TEST  OK

function addPoint(roomCode, playerName, newPoints)
{
  let roomRef = db.collection('Game').doc(roomCode);
  let playerRef = roomRef.collection('Joueur').doc(playerName);
  playerRef.get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document! : addPoint');
    } else {
      //console.log('Document data:', doc.data());
      let playerData =  doc.data();
      console.log("Mon Player_Get POINTS before update", playerData.points);
      console.log("Mon Player_Get Points after update", playerData.points);
      playerRef.update({points: playerData.points += newPoints});
    }      
  })
  .catch(err => {
    console.log('Error getting document', err);
  });//TEST OK
}addPoint2("XXXX", "John Test", 7);



///////////////////////////
//////Get from FireStore//

function sendToClient(object) //Envoie au client des données
{
  //Function to send Object
}


function partiExist(roomCode)
{
  let roomRef = db.collection('Game').doc(roomCode).get()
  .then(doc => {
    if (!doc.exists) {
      console.log('No such document! : partiExist');
      sendToClient(false);
    } else {
      //console.log('Document data:', doc.data());
      sendToClient(true);
    }      
  })
  .catch(err => {
    console.log('Error getting document', err);
    sendToClient(false);
  });
}

function affichPlayer(player)
{
  console.log("fonction affiche ",player);
}


function  getPlayer(roomCode, playerName) //recuperer un objet/variable avec un Id Precis  dans object_Get
{
  let player_Get;
  console.log('fonction getPlayer...');
      //let query = playerRef.where(selectedVal, '==', wantedVal).get()
    let roomRef = db.collection('Game').doc(roomCode);
    let playerRef = roomRef.collection('Joueur').doc(playerName).get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document! : getPlayer');
        sendToClient(undefined);
      } else {
        //console.log('Document data:', doc.data());
        player_Get = doc.data();
        toGet = doc.data();
        console.log("Mon Player_Get POINTS", player_Get.points);
        console.log("Mon Player_Get idDoc", player_Get.idDoc);
        affichPlayer(toGet);
        sendToClient(player_Get);
      }
    })
    .catch(err => {
      console.log('Error getting document', err);
      sendToClient(undefined);
    });

    console.log("Fin fonction getPlayer");
    return "Fin Fonction getPlayer";
}// test OK MAIS arrive pas attribuer dans un objet externe
 //getPlayer("XXXX", "John Test"); //Même si appeler apres  n'apas le temps de recuperer





function getAllPlayer(roomCode) //TO FINISH
{
  let query = db.collection('Game').doc(roomCode).collection('Joueur').get()
  .then(snapshot => {
    if (snapshot.empty) {
      console.log('No matching documents.');
      return 0;
    }  
    var tabPlayer = tab[10];
    let id = 0;
    snapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      tabPlayer[id] = doc.data();
      id++;
    });
    sendToClient(tabPlayer);
  })
  .catch(err => {
    console.log('Error getting documents', err);
  });
}//To TEst


function getPayerByPoint()
{
  let playerRef = roomRef.collection('Joueur');
  let query = playerRef.orderBy("points");
}//TO FINISH


function deleteDocument(roomCode, playerName) 
{
    // [START delete_document]
    let roomRef = db.collection('Game').doc(roomCode);
    let playerRef = roomRef.collection('Joueur').doc(playerName).delete()   // [END delete_document]
  
    return playerRef.then(res => {
      console.log('Delete: ', res);
    });
  }
//Test OK
//deleteDocument("XXXX", "Bobo");

//Pour les LISTE IMAGE il suffira de recuperer avec un Where "typeListe" (le champ) = "set" ou "recieve" ou "chosen" dans la collection "collection" du joueur



//Set to Storage (images) //TODO

function uploadImage(roomCode, idImg)
{
    //Get elements
   

    //Listen for file elements Sub
    subFle_1.addEventListener('click', function(e){ //en cliquant sur "validé"
    
    //Get file
    var file_1 = e.target.file[0]  //ligne incomprise           

//TODO REVOIR POUR ENVOYER LE FICHIER AU SERVER

    // Create a root reference
    var storageRef = firebase.storage().ref( roomCode  + '/' + idImg)

    //upload file
    storageRef.put(file_1);
    })    
}
/*subFle_1.addEventListener('click', function(e){ //en cliquant sur "validé"
    
    //Get file
    var file_1 = e.target.file[0]  //ligne incomprise           

//TODO REVOIR POUR ENVOYER LE FICHIER AU SERVER

    // Create a root reference
    var storageRef = firebase.storage().ref( "XXXX"  + '/' + "1")

    //upload file
    storageRef.put(file_1);
    })*/

//subFle_1.onclick(uploadImage(XXXX, 1));


//Get from Storage (images) //





/*Fontion qui creer une ref de partie (code en param)
pouvoir recuperer un objet partie en fonction du room code (comme une requete)*/