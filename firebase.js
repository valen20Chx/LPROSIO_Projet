const fs = require('fs'); //creer lire efface fichier/dossier

class firebase {
    constructor(api_key_file) {
        this.admin = require("firebase-admin");
        this.rimraf = require("rimraf");
        this.serviceAccount = require(api_key_file); //le service account key 
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.serviceAccount),
            databaseURL: "https://lprosio-projet.firebaseio.com"
        });
        this.db = this.admin.firestore();
    }
/////////////////     
    //ROOM CODE//
    creatRoomCode() //TEST OK
    {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        let i = 0;
        for (i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    roomCodeExist(arrayCodes, roomCode) //Test OK
    {
        let i = 0;
        for (i = 0; i < arrayCodes.length; i++) {
            if (roomCode == arrayCodes[i]) {
                console.log('ArrayCode-',i,' ', arrayCodes[i]);
                return true;
            }
        }
        return false; //C
    }

    getNewRoomCode(callback) //Test OK
    {
        console.log("function get getRoomCode..");
        let arrayCodes = [];
        let newRoomCode = this.creatRoomCode();
        let gameRef =  this.db.collection('Game');
        let allPartie = gameRef.get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No such document! : getRoomCode');
                    callback(false);
                } else {
                    //console.log('Recupere tout les roomCode...');
                    snapshot.forEach(element => {
                        //console.log(element.data());
                        arrayCodes.push(element.roomCode);
                    });
                    while (this.roomCodeExist(arrayCodes, newRoomCode)) {
                        newRoomCode = this.creatRoomCode();
                    }
                    this.db.collection('Game').doc(newRoomCode).set({roomCode : newRoomCode, nbImages : 0});
                    callback(newRoomCode);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                callback(false);
            });
    }
  

////////////////////////
    //SET TO FIRESTORE//

    setJoueur(roomCode, PlayerName, dataPlayer) //Test OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').doc(PlayerName);
        playerRef.set(dataPlayer);
    }


    setHasPres(roomCode, playerName, value)//Test OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);

        let playerRef = roomRef.collection('Players').doc(playerName);
        playerRef.get()
        .then(doc => {
            if (!doc.exists) {
            console.log('No such document! : addPoint');
            } else {
            playerRef.update({hasPres: value});
            }      
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    }

    
    addPoint(roomCode, playerName, newPoints)//Test OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);

        let playerRef = roomRef.collection('Players').doc(playerName);
        playerRef.get()
        .then(doc => {
            if (!doc.exists) {
            console.log('No such document! : addPoint');
            } else {
            //console.log('Document data:', doc.data());
            let playerData =  doc.data();
            playerRef.update({points: playerData.points += newPoints});
            }      
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    }

    set_CompoRecieve(roomCode, idPlayer, arrImgToSet)//TEST OK
    {
        console.log('set_CompoRecieve: roomcode: ' + roomCode + ' player : ' + idPlayer);
        let roomRef = this.db.collection('Game').doc(roomCode);
        this.getPlayerById(roomCode, idPlayer, player =>{
            let playerName =  player[0].nom;
            console.log("Nom Recu : " + playerName);
            let playerRef = roomRef.collection('Players').doc(playerName);
            let compoRef = playerRef.collection('Compositions').doc('Get');
            compoRef.set(arrImgToSet);
            console.log("FIN GetPlayerById");
        });
       console.log('FIN FONCTION COMPORECIEVE');        
    }

    set_CompoSet(roomCode, playerName, arrImgToSet)//TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').doc(playerName);
        let compoRef = playerRef.collection('Compositions').doc('Set');
        compoRef.set(arrImgToSet);
    }

    set_CompoChosen(roomCode, playerName, arrImgToSet)//TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').doc(playerName);
        let compoRef = playerRef.collection('Compositions').doc('Chosen');
        compoRef.set({idImg : arrImgToSet});
    }

    set_Titre(roomCode, playerName, titre) //TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').doc(playerName);
        let compoRef = playerRef.collection('Compositions').doc('CHOSENNN');
        compoRef.set({titre : titre});
    }
///////////////////////////
    //GET FROM FIRESTORE//


    //Envoie au client true si exsite
    playerExist(roomCode, playerName, callback)  //Test OK
    {
        console.log('fonction playerExist...');
        //let query = playerRef.where(selectedVal, '==', wantedVal).get()
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').doc(playerName).get()
        .then(doc => {
        if (!doc.exists) {
            console.log('No such document! : getPlayer');
            callback(false);
        } else {
            //console.log('Document data:', doc.data());
            callback(true);
        }
        })
        .catch(err => {
        console.log('Error getting document', err);
        callback(false);
        });
    }




    partieExist(roomCode, callback) //TEST OK
    {
        this.db.collection('Game').doc(roomCode).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document! : ' + roomCode);
                    callback(false);
                } else {
                    //console.log('Document data:', doc.data());
                    callback(true);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                callback(false);
            });
    }
              
    getPartie(roomCode, callback) //TEST OK
    {
        this.db.collection('Game').doc(roomCode).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document! : partiExist');
                    callback(undefined);
                } else {
                    //console.log('Document data:', doc.data());
                    partie_Get = doc.data();
                    callback(partie_Get);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                callback(undefined);
            });
    }

    getCompo(roomCode, playerName, compoType, callback) //TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.collection('Players').doc(playerName).collection('Compositions').doc(compoType).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('roomCode : ' + roomCode);
                    console.log('playerName : ' + playerName);
                    console.log('No such document! : getCompo :', compoType);
                    callback(undefined);
                } else {
                    let tabImg = doc.data().Idimg;
                    callback(tabImg);
                }
            })
            .catch(err => {
                console.log('Error getting document', compoType, err);
                callback(undefined);
            });
    }

     //recuperer un objet/variable avec un Id Precis  dans object_Get
    getPlayer(roomCode, playerName, callback)//Test OK
    {
        let player_Get;
        console.log('fonction getPlayer...');
        //let query = playerRef.where(selectedVal, '==', wantedVal).get()
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.collection('Players').doc(playerName).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document! : getPlayer');
                    callback(undefined);
                } else {
                    //console.log('Document data:', doc.data());
                    player_Get = doc.data();
                    console.log("Mon Player_Get POINTS", player_Get.points);
                    //sendToClient(player_Get);
                    callback(player_Get);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                callback(undefined);
            });

        console.log("Fin fonction getPlayer");
    }

    //Retourne un tableau de tout les joueurs
    getAllPlayer(roomCode, callback) //TEST OK
    {
        let query = this.db.collection('Game').doc(roomCode).collection('Players').get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching documents.');
                    return 0;
                }
                var tabPlayer = [];
                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    tabPlayer.push(doc.data());
                });
                callback(tabPlayer);
            })
            .catch(err => {
                console.log('Error getting documents', err);
            });
    }

    getPlayerByPoint(roomCode, callback) //TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players');
        let query = playerRef.orderBy("points").get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return 0;
            }
            var tabPlayer = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                tabPlayer.push(doc.data());
            });
            callback(tabPlayer);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
    }
    
    getPlayerById(roomCode, idPlayer, callback)//TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').where('id','==', idPlayer).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return 0;
            }
            var tabPlayer = [];
            snapshot.forEach(doc => { 
                tabPlayer.push(doc.data()); //Normalement 1 seul
            });
            //console.log(tabPlayer);
            callback(tabPlayer);
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
        
    }

    //////////////
    //SUPPRESSION

    deletePlayer(roomCode, playerName) //TEST OK
    {
        // [START delete_document]
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Players').doc(playerName).delete()   // [END delete_document]
    
        return playerRef.then(res => {
            console.log('Delete: ', res);
        });
    }

    deleteParti(roomCode) //TEST OK
    {
        // [START delete_document]
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.delete();   // [END delete_document]
    }

    deleteCompo(roomCode, compoType)
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.collection('Players').doc(playerName).collection(Compositions).doc(compoType).delete
    }

    


////////////////////////
    //IMAGES//



    attribueIdImages(nbPlayer, nbImgPlayer)//TEST OK
    {
        let ArrImg = [];
        for(let p = 0; p < nbImgPlayer*nbPlayer; p++){
            ArrImg.push(0);
        } //init
        let idImg;
        //console.log(ArrImg.length);

        for(let i = 1; i < nbPlayer + 1; i++)
        {
            for(let j = 0; j<nbImgPlayer; j++)
            {
                idImg = Math.floor((Math.random() * ArrImg.length) + 0);
                while(ArrImg[idImg] != 0 )
                {
                   idImg = Math.floor((Math.random() * ArrImg.length) + 0);
                }
                ArrImg[idImg] = i; //attribue le joueur
            }
        }
        console.log(ArrImg + " FIN fonction ATTRIBUE img");
        return ArrImg;
    }

    distribueIdImage(roomCode, arrImg, nbPlayer, callback) //TEST OK
    {
        for(let i = 1; i<nbPlayer + 1; i++)
        {
            let arrImg_toDo = [];
            for(let j = 0; j<arrImg.length; j++)
            {
                if(arrImg[j] == i)
                {
                    arrImg_toDo.push(j);
                    //appelle la fonction pour mettre dans fireStore
                }
            } 
            let arrImg_toSet = {
                idImg : arrImg_toDo
            }
            this.set_CompoRecieve(roomCode, i, arrImg_toSet);
        } //////////////////////  BUG ICI ///////////////////////////////
        console.log("CallBAck distribueImg");
        setTimeout(() => {callback()}, 5000);
    }

   
    //recupere le nombre d'image et l'augmente de 1 
    get_incrementeNbImg(roomCode, callback) //TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
       roomRef.get()
        .then(doc => {
            if (!doc.exists) {
            console.log('No such document! : addPoint');
            } else {
            //console.log('Document data:', doc.data());
            let gameData =  doc.data();
            callback(gameData.nbImages + 1 );
            console.log("getIncremente Image : " + (gameData.nbImages + 1));
            roomRef.update({nbImages: gameData.nbImages += 1});
            }      
        })
        .catch(err => {
            console.log('Error getting document', err);
        });
    }

/////////////////
//FICHIER IMAGE//

    createDIR(roomCode)//TEST OK
    {
        console.log("Fonction createDir");
        let pathDir = __dirname + '/ressources/images/' + roomCode;
        try{
            fs.mkdirSync(pathDir) //creer le fichier du nom du roomCode
            console.log("Dossier creer : " + pathDir);
            }catch(err){
            if(err.code == 'EEXIST')
            {
              console.log("Le fichier Game existe deja !");
            }
            else console.log(err);
          }
    }


    
    creatFileImg(roomCode, contenuImg)//TEST OK
    {
        this.get_incrementeNbImg(roomCode, nbImages =>{ 

            let idImage = nbImages;
            console.log("recupId Image : " + idImage);
            let pathImg = __dirname + '/ressources/images/' + roomCode + "/" + idImage;
            fs.stat(pathImg, function(err, stat) {
                if(err == null) {
                    console.log('File already exists');
                } else if(err.code === 'ENOENT') {
                    //creer le Fichier
                    fs.writeFileSync(pathImg, contenuImg);
                } else {
                    console.log('Some other error: ', err.code);
                }
            });
        });
    }

    deleteFileImg(roomCode, idImage) //TEST OK
    {
        //fs.access(nomImage, err => err ? 'does not exist' : 'exists')//Test
        let pathImg = __dirname + '/ressources/images/' + roomCode + "/" + idImage;

        fs.stat(pathImg, function(err, stat) {
            if(err == null) {
                console.log('File exists');
                fs.unlinkSync(pathImg);
            } else if(err.code === 'ENOENT') {
                console.log("le Fichier n'existe pas")
            } else {
                console.log('Some other error: ', err.code);
            }
        });   
    }

    deleteDir(roomCode)
    {
        this.rimraf(__dirname + '/ressources/images/' + roomCode, function () { console.log(roomCode + " effacé"); });
    }

    readFileImg(roomCode, idImage, callback) //TEST OK
    {
        let pathImg = __dirname + '/ressources/images/' + roomCode + "/" + idImage;
        fs.stat(pathImg, function(err, stat) {
            if(err == null) {
                console.log('File exists');
               fs.readFile(pathImg, (err, contenuImg) =>{
                   console.log("CONTENUE DE LIMAGE : " + contenuImg);
                   callback("" + contenuImg);
               });
            } else if(err.code === 'ENOENT') {
                console.log("le Fichier n'existe pas")
                return false;
            } else {
                console.log('Some other error: ', err.code);
                return false;
            }
        });   
    }

  
}
module.exports = firebase;
