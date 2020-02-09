class firebase {
    constructor(api_key_file) {
        this.admin = require("firebase-admin");
        this.serviceAccount = require(api_key_file); //le service account key 
        this.admin.initializeApp({
            credential: this.admin.credential.cert(this.serviceAccount),
            databaseURL: "https://lprosio-projet.firebaseio.com"
        });

        this.db = this.admin.firestore();
    }

    creatRoomCode() {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        var charactersLength = characters.length;
    
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    roomCodeExist(arrayCodes, roomCode) {
        for (i = 0; i < arrayCode.lenght; i++) {
            if (roomCode == arrayCode[i]) {
                return true;
            }
        }
        return false; //C
    }

    getRoomCode(roomCode, callback) {
        let arrayCodes = [];
        this.db.collection('Game').get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    console.log('No such document! : partiExist');
                    callback(false);
                } else {
                    snapshot.array.forEach(element => {
                        arrayCodes.push(element.roomCode);
                    });
                    while (roomCodeExist(arrayCodes, roomCode)) {
                        roomCode = createRoomCode();
                    }
                    callback(roomCode);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                callback(false);
            });
    }

    setJoueur(roomCode, nomJoueur, dataPlayer) {
        let roomRef = this.db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueur').doc(nomJoueur);
        playerRef.set(dataPlayer);
    }//To test

    addPoint(roomCode, playerName, newPoints)
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
    }

    playerExist(roomCode, playerName, callback) //ENvoie au client true si exsite
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

    GetPartie(roomCode, callback) {
        this.db.collection('Game').doc(roomCode).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document! : partiExist');
                    callback(false);
                } else {
                    //console.log('Document data:', doc.data());
                    partie_Get = doc.data();
                    callback(roomCode);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                callback(false);
            });
    }

    getCompo(roomCode, playerName, compoType) {
        let roomRef = this.db.collection('Game').doc(roomCode);
        roomRef.collection('Joueurs').doc(playerName).collection(Compositions).where('compoType', '==', compoType).get()
            .then(doc => {
                if (!doc.exists) {
                    console.log('No such document! : getCompo :', compoType);
                    sendToClient(undefined);
                } else {
                    //sendToClient(compo_Get);
                    callback(doc.data());
                }
            })
            .catch(err => {
                console.log('Error getting document', compoType, err);
                sendToClient(undefined);
            });
    }

    getPlayer(roomCode, playerName, callback) //recuperer un objet/variable avec un Id Precis  dans object_Get
    {
        let player_Get;
        console.log('fonction getPlayer...');
        //let query = playerRef.where(selectedVal, '==', wantedVal).get()
        let roomRef = db.collection('Game').doc(roomCode);
        roomRef.collection('Joueurs').doc(playerName).get()
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
                    //sendToClient(player_Get);
                    callback(player_Get);
                }
            })
            .catch(err => {
                console.log('Error getting document', err);
                sendToClient(undefined);
            });

        console.log("Fin fonction getPlayer");
    }

    getAllPlayer(roomCode) //TO FINISH
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
    }

    getPayerByPoint() {
        let playerRef = roomRef.collection('Joueur');
        let query = playerRef.orderBy("points");
    }

    deleteDocument(roomCode, playerName) {
        // [START delete_document]
        let roomRef = db.collection('Game').doc(roomCode);
        let playerRef = roomRef.collection('Joueur').doc(playerName).delete()   // [END delete_document]
    
        return playerRef.then(res => {
            console.log('Delete: ', res);
        });
    }

    uploadImage(roomCode, idImg) {
        //Get elements
    
    
        //Listen for file elements Sub
        subFle_1.addEventListener('click', function (e) { //en cliquant sur "validé"
    
            //Get file
            var file_1 = e.target.file[0]  //ligne incomprise           
    
            //TODO REVOIR POUR ENVOYER LE FICHIER AU SERVER
    
            // Create a root reference
            var storageRef = firebase.storage().ref(roomCode + '/' + idImg);
    
            //upload file
            storageRef.put(file_1);
        })
    }
}

module.exports = firebase;