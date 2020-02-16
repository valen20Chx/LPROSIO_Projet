const fs = require('fs'); //creer lire efface fichier/dossier
class firebase {
    constructor(api_key_file) {
        //this.Jimp = require('jimp'); //Pour la convertion au format jpg
        this.admin = require("firebase-admin");
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
        console.log('fonction createRoomCode');
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
        let i = 0;
        for (i = 0; i < 4; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
        console.log('FIN fonction roomCodeExist');
    }

    roomCodeExist(arrayCodes, roomCode) //Test OK
    {
        console.log('fonction roomCodeExist');
        let i = 0;
        for (i = 0; i < arrayCodes.length; i++) {
            if (roomCode == arrayCodes[i]) {
                console.log('ArrayCode-',i,' ', arrayCodes[i]);
                return true;
            }
        }
        console.log('FIN fonction roomCodeExist');
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
                    console.log('Recupere tout les roomCode...');
                    snapshot.forEach(element => {
                        console.log(element.data());
                        arrayCodes.push(element.roomCode);
                    });
                    while (this.roomCodeExist(arrayCodes, newRoomCode)) {
                        roomCode = this.creatRoomCode();
                    }
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

    setJoueur(roomCode, nomJoueur, dataPlayer) //Test OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueur').doc(nomJoueur);
        playerRef.set(dataPlayer);
    }

    
    addPoint(roomCode, playerName, newPoints)//Test OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
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
        });
    }

    set_CompoRecieve(roomCode, idPlayer, arrImgToSet)//TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        this.getPlayerById('CODE', 1, player =>{
            let playerName =  player[0].nom;
            console.log("Nom Recu : " + playerName);
            let playerRef = roomRef.collection('Joueurs').doc(playerName);
            let compoRef = playerRef.collection('Compositions').doc('Get');
            compoRef.set(arrImgToSet);
        })
               
    }

    set_CompoSet(roomCode, playerName, arrImgToSet)//TO TEST
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueurs').doc(playerName);
        let compoRef = playerRef.collection('Compositions').doc('SET');
        compoRef.set(arrImgToSet);
    }

    set_CompoChosen(roomCode, playerName, arrImgToSet)//TO TEST
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueurs').doc(playerName);
        let compoRef = playerRef.collection('Compositions').doc('CHOSEN');
        compoRef.set(arrImgToSet);
    }

    set_Titre(roomCode, playerName, titre) //TEST OK
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueurs').doc(playerName);
        let compoRef = playerRef.collection('Compositions').doc('CHOSENNN');
        compoRef.set(titre);
    }
///////////////////////////
    //GET FROM FIRESTORE//


    //Envoie au client true si exsite
    playerExist(roomCode, playerName, callback)  //Test OK
    {
        console.log('fonction playerExist...');
        //let query = playerRef.where(selectedVal, '==', wantedVal).get()
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueur').doc(playerName).get()
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

    getPartie(roomCode, callback) //To 
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
        roomRef.collection('Joueurs').doc(playerName).collection('Compositions').doc(compoType).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document! : getCompo :', compoType);
                    callback(undefined);
                } else {
                    //sendToClient(compo_Get);
                    callback(doc.data());
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
        roomRef.collection('Joueurs').doc(playerName).get()
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
        let query = this.db.collection('Game').doc(roomCode).collection('Joueurs').get()
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
        let playerRef = roomRef.collection('Joueurs');
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
        let playerRef = roomRef.collection('Joueurs').where('id','==', idPlayer).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return 0;
            }
            var tabPlayer = [];
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                tabPlayer.push(doc.data()); //Normalement 1 seul
            });
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
        let playerRef = roomRef.collection('Joueur').doc(playerName).delete()   // [END delete_document]
    
        return playerRef.then(res => {
            console.log('Delete: ', res);
        });
    }

    deleteParti(roomCode) //To test
    {
        // [START delete_document]
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.delete();   // [END delete_document]
    
       /* return roomRef.then(res => {
            console.log('Delete: ', res);
        });*/
    }

    deleteCompo(roomCode, compoType)
    {
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.collection('Joueurs').doc(playerName).collection(Compositions).doc(compoType).delete
    }

    


////////////////////////
    //IMAGES//



    attribueIdImages(nbImgPlayer, nbPlayer)
    {
        let ArrImg = [];
        for(let p = 0; p < nbImgPlayer*nbPlayer; p++){
            ArrImg.push(0);
        } //init
        let idImg;
        console.log(ArrImg.length);

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
        console.log("FIN ATTRIBUE img");
        return ArrImg;
    }

    distribueIdImage(roomCode, arrImg, nbPlayer)
    {
        for(let i = 1; i<nbPlayer; i++)
        {
            let arrImg_toSet = [];
            for(let j = 0; j<arrImg.length; j++)
            {
                if(arrImg[j] == i)
                {
                    //appelle la fonction pour mettre dans fireStore
                    set_CompoGet(roomCode, i, arrImg_toSet);
                }
            }
        }
    }

   
    //recupere le nombre d'image et l'augmente de 1 
    get_incrementeNbImg(roomCode, callback) //TO TEST
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

  /*  getExtention(nameFile)
    {
    let extention;
    let chaineSepare = nameFile.split('.')
    extention = chaineSepare[chaineSepare.length - 1];
    return '.' + extention;
    }



    //Charge les images dans les dossié
    uploadImage(req, roomCode) //TO TEST
    {
        
        console.log("Image Recuperée" + req.files);
	if(req.files.upfile){
	  var file = req.files.upfile,
		name = file.name, 
        type = file.mimetype;

        get_incrementeNbImg(roomCode, nbImages =>{ 

            let idImage = nbImages.nbImages;
            //var uploadpath = __dirname + '/Game/' + name;
            ext = getExtention(name);
            let uploadpath = __dirname + '/Game/' + roomCode + '/'
            var uploadpathImg = uploadpath + idImage + ext; //TODO afficher l'id
    
            console.log("uploadpath : " + uploadpath);
    
            file.mv(uploadpathImg,function(err){
              if(err){
                console.log("File Upload Failed",name, err);
                res.send("Error Occured !")
              }
              else {
                console.log("File Uploaded",name);
                res.send('Done! Uploading files')
    
                //CONVERTION EN jpg
                if(ext.localeCompare('.jpg') != 0 ) //Si pas egale
                {
                this.Jimp.read(uploadpathImg, (err, img) => {
                  if (err) throw err;
                  img
                    .resize(256, 256) // resize
                    .quality(60) // set JPEG quality
                    .write(uploadpath + idImage + '.jpg'); // save
                });
                //SUPPRESSION image != jpg
                fs.unlinkSync(uploadpathImg);
               }
              }
            });

        })
		
	}
	else {
	  res.send("No File selected !");
	  res.end();
    } 
}*/
}
module.exports = firebase;