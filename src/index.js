const http = require("http");
const fs = require("fs");
const url = require("url");
const parseur = require("querystring");
const wincondition = ["Pierre🪨", "Feuille🍃", "Ciseau✂️"];
let tabSockJoueurs = new Array();
var nbJoueurs = 0;
var reponse1;
var reponse2;
var vreponse1;
var vreponse2;
let victoirej1 = 1;
let victoirej2 = 1;
let id;

let codes = new Array();
/*
I tried to make a system of code and connection via codes to invite friends, but alas I could not make it work, because it works.
friends, but unfortunately I couldn't get it to work, because it works
but after a while it crashes. Also, users who connect
to their urls end up accessing the same page as others.
*/
//
//
//
//
//
// We send client.html to the client
var monServeur = http.createServer(function (req, res) {
  // the additional elements of the request are recovered
  var paramsURL = url.parse(req.url).query;
  console.log("parametres complementaires de l'URL : " + paramsURL);
  //we transform the parameters into an array
  var tabParamsURL = parseur.parse(paramsURL);

  if ("action" in tabParamsURL && tabParamsURL["action"] === "play") {
    /*  Attempted code to filter the different rooms

    //
//
    if ("action" in tabParamsURL && tabParamsURL["action"]) {
     console.log("une action a ete trouvée : " + tabParamsURL["action"]);
    for (let i = 0; i < codes; ) {
*/
    fs.readFile("./src/client.html", "utf-8", function (error, content) {
      console.log("debug" + error);
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(content);
    });
  } else {
    fs.readFile("./src" + url.parse(req.url).href, function (error, content) {
      res.writeHead(200, { "Content-Type": "image/jpeg" });
      res.end(content);
    });
  }
});

/*else {
    fs.readFile("./src/Connexion.html", "utf-8", function (error, content) {
      res.writeHead(201, { "Content-Type": "text/html" });
      res.end(content);
    });
  }*/

var io = require("socket.io")(monServeur);

// We load socket.io and connect it to the current http server

// When a client connects, we create a dedicated socket for it
io.on("connection", function (newSockClient) {
  console.log("U");

  // Disconnection system
  newSockClient.on("disconnect", function () {
    /*
        Allows you to know if a socket is disconnected, if or when it is deleted
        from the socket array. Same for codes that are not used.
    */
    id = newSockClient.id;
    for (i = 0; i < tabSockJoueurs.length; ) {
      //
      if (tabSockJoueurs[i].id === id) {
        codes = codes.slice(i);
        console.log(codes);

        tabSockJoueurs.slice(i);
        tabSockJoueurs.slice(i);
        nbJoueurs--;
        for (i in tabSockJoueurs) {
          tabSockJoueurs[i].emit(
            "update",
            "nombre de joeuurs connectes :" + nbJoueurs
          );
        }
      }
      i++;
    }
  });
  // a console message is displayed
  tabSockJoueurs[nbJoueurs] = newSockClient;
  nbJoueurs++;
  console.log(codes);
  //
  var i;
  /* for (i = 0; i < nbJoueurs; ) {
    tabSockJoueurs[i].on("reponseDuClients", function (message) {
      console.log(message);
      if (codes[i] === undefined) {
        codes[i] = message;
      } else {
        console.log("code déjà dans le tableau");
        console.log(codes);

        
      }
      
    });
    i++;
    
  }
 */
  //
  for (i in tabSockJoueurs) {
    tabSockJoueurs[i].emit(
      "update",
      "nombre de joeuurs connectes :" + nbJoueurs
    );
  }
  tabSockJoueurs[0].emit("update", "joueur1");
  tabSockJoueurs[0].on("reponseDuClient", function (message) {
    reponse1 = message;
    win();
  });
  if (tabSockJoueurs[1] !== undefined) {
    //Le chat//
    //

    tabSockJoueurs[0].on("mp", function (mp) {
      tabSockJoueurs[0].emit(
        "mp",
        "<span style= color:blue>" + mp + "</span><br> "
      );
      tabSockJoueurs[1].emit(
        "mp",
        "<span style= color:blue>" + mp + "</span> <br>"
      );
    });
    tabSockJoueurs[1].on("mp", function (mp) {
      tabSockJoueurs[1].emit(
        "mp",
        "<span style= color:red>" + mp + "</span><br> "
      );
      tabSockJoueurs[0].emit(
        "mp",
        "<span style= color:red>" + mp + "</span><br> "
      );
    });

    tabSockJoueurs[1].emit("update", "joueur2");

    tabSockJoueurs[1].on("reponseDuClient", function (message) {
      reponse2 = message;
      win();
    });

    //
  }
});

//

/*Function that allows you to know to do the verification, display 
results for client sockets
*/
function win() {
  if (
    reponse1 === reponse2 &&
    reponse1 !== undefined &&
    reponse2 !== undefined
  ) {
    vreponse1 = reponse1;
    vreponse2 = reponse2;
    reponse1 = undefined;
    reponse2 = undefined;
    for (let i = 0; i < nbJoueurs; ) {
      tabSockJoueurs[i].emit(
        "texteFinal",
        wincondition[vreponse1] +
          " " +
          wincondition[vreponse2] +
          " " +
          "égalité"
      );
      i++;
    }
  }
  if (reponse1 > reponse2 && reponse1 !== undefined && reponse2 !== undefined) {
    vreponse1 = reponse1;
    vreponse2 = reponse2;
    reponse1 = undefined;
    reponse2 = undefined;
    for (let i = 0; i < nbJoueurs; ) {
      tabSockJoueurs[i].emit(
        "texteFinal",
        wincondition[vreponse1] +
          " " +
          wincondition[vreponse2] +
          " " +
          "Victoire J1"
      );
      tabSockJoueurs[i].emit("scoreJ1", victoirej1);

      i++;
    }
    victoirej1++;
  }
  if (reponse1 < reponse2 && reponse1 !== undefined && reponse2 !== undefined) {
    vreponse1 = reponse1;
    vreponse2 = reponse2;
    reponse1 = undefined;
    reponse2 = undefined;
    for (let i = 0; i < nbJoueurs; ) {
      tabSockJoueurs[i].emit(
        "texteFinal",
        wincondition[vreponse1] +
          " " +
          wincondition[vreponse2] +
          " " +
          "Victoire J2"
      );
      tabSockJoueurs[i].emit("scoreJ2", victoirej2);
      i++;
    }
    victoirej2++;
  }
}

monServeur.listen(8080);
