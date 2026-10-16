// =========================================================
//  Données du voyage — c'est le seul fichier à modifier.
//  Le dépôt est PUBLIC. Ne mettez jamais ici : numéro ou code de
//  réservation, numéro de billet, téléphone, adresse e-mail.
//  billet : "attendu" (Selma doit l'envoyer) ou "pris" (on l'a).
//  fichiers : les billets eux-mêmes, {src, nom}. Un .enc est chiffré avec le
//  mot de passe du groupe (voir outils/chiffrer-billets.mjs) : l'app le
//  demande une fois par téléphone.
// =========================================================

// --- ÉTAPES -------------------------------------------------
// trajet : comment on rejoint cette étape depuis la précédente.
//   mode / duree / prix, depart et arrivee (pour le lien Maps),
//   details : une ligne par correspondance.
const ETAPES = [
  { lieu: "Tokyo", du: "2026-10-14", au: "2026-10-18", nuits: 4,
    note: "Arrivée le 14 depuis Paris · Airbnb Toyama Century, Shinjuku 7-chome" },

  { lieu: "Kawaguchiko", du: "2026-10-18", au: "2026-10-20", nuits: 2,
    note: "Au pied du Fuji · le lac est à 830 m, les nuits sont fraîches",
    trajet: { mode: "Train Fuji Excursion", duree: "2 h", prix: "~24 €",
              depart: "Shinjuku Station, Tokyo", arrivee: "Kawaguchiko Station",
              details: ["Fuji Excursion 15, départ 10h30, arrivée 12h30. Voiture 3, places 2A, 2B, 6C, 6D et 7D. Billets pris.",
                        "Les billets papier se retirent avant le départ à une borne JR East de Shinjuku, avec le QR de retrait (onglet Billets). Impossible de les retirer à Kawaguchiko.",
                        "Puis taxi devant la gare, 10-15 min (1 500-3 000 ¥)."] } },

  { lieu: "Kyoto", du: "2026-10-20", au: "2026-10-25", nuits: 5,
    note: "278 km depuis Kawaguchiko",
    trajet: { mode: "Bus + Shinkansen", duree: "~4 h", prix: "~80 €",
              depart: "Kawaguchiko Station", arrivee: "Kyoto Station",
              details: ["Bus express Fujikyu n° 0108 Kawaguchiko → Mishima, sortie Nord : 10h20 → 11h50. Voiture 1, places 02A, 02B, 03A, 03B, 04A. Billets pris.",
                        "Shinkansen Hikari 713 Mishima → Kyoto : 13h46 → 15h37, voiture 6, places 8-A à 8-E. Billets pris."] } },

  { lieu: "Nara", du: "2026-10-25", au: "2026-10-27", nuits: 2,
    note: "36 km depuis Kyoto",
    trajet: { mode: "Train Kintetsu", duree: "30-50 min",
              depart: "Kintetsu Kyoto Station", arrivee: "Kintetsu Nara Station",
              details: ["Puis 10-15 min à pied jusqu'au logement, ou Uber en 3-5 min (700-1 200 ¥)."] } },

  { lieu: "Osaka", du: "2026-10-27", au: "2026-10-30", nuits: 3,
    note: "28 km depuis Nara",
    trajet: { mode: "Train Kintetsu", duree: "~40 min",
              depart: "Kintetsu Nara Station", arrivee: "Osaka Namba Station",
              details: ["Puis Uber jusqu'au logement, à Shinsekai."] } },

  { lieu: "Tokyo", du: "2026-10-30", au: "2026-11-03", nuits: 4,
    note: "392 km depuis Osaka · vol retour le 3 novembre",
    trajet: { mode: "Shinkansen Nozomi 90", duree: "2 h 19", prix: "80-90 €",
              depart: "Shin-Osaka Station", arrivee: "Shinagawa Station",
              details: ["Avant : à pied jusqu'à Ebisucho ou Shin-Imamiya, puis 20-30 min de métro + JR jusqu'à Shin-Osaka.",
                        "Nozomi 90 : 11h30 → 13h49, voiture 5, places 1-B à 1-D. Trois billets pris ; le retour de Nidia reste à vérifier.",
                        "Après, depuis Shinagawa : JR Yamanote jusqu'à Shinjuku (~20 min) puis 15-20 min à pied, ou Uber (15-20 €)."] } }
];

// --- APPLICATIONS -------------------------------------------
// role    : l'action en deux mots, c'est ce qu'on lit en premier
// id      : identifiant App Store (apps.apple.com/fr/app/idXXXX)
// schema  : ouvre l'app directement si elle est installée. N'en mettre
//           qu'un qui a été vérifié (page tester-apps.html sur l'iPhone).
//           Sans schéma, l'appui ouvre la fiche App Store, dont le
//           bouton « Ouvrir » lance l'app si elle est installée.
const APPS = [
  { nom: "Japan Travel", role: "Trouver son train", id: 686373726,
    desc: "Itinéraires, horaires et correspondances dans tout le Japon, avec les guides de quartier. L'app de référence sur place." },

  { nom: "Suica", role: "Payer le métro", id: 1156875272,
    desc: "La carte de transport rechargeable, dans Apple Pay. On pose le téléphone sur le portique, et ça sert aussi au konbini." },

  { nom: "GO", role: "Prendre un taxi", id: 1254341709,
    desc: "L'app de taxi la plus répandue au Japon. On commande, on suit la voiture sur la carte et on paie dedans." },

  { nom: "Google Traduction", role: "Traduire un truc", id: 414706506,
    schema: "googletranslate://",
    desc: "Gratuite, sans limite. L'appareil photo traduit menus et panneaux. Télécharger le japonais avant de partir : elle marche alors hors ligne." },

  { nom: "Google Maps", role: "Trouver un lieu", id: 585027354,
    schema: "comgooglemaps://",
    desc: "Marche, bus et restaurants avec leurs avis. Complète Japan Travel pour les trains. Télécharger la zone de Tokyo hors ligne." },

  { nom: "Safety tips", role: "Être alerté", id: 858357174,
    desc: "L'app officielle de l'Agence du tourisme japonaise : alertes séisme, tsunami, typhon et chaleur, en français. Gratuite." },

  { nom: "Universal Studios Japan", role: "Le parc du 28", id: 532097000,
    desc: "L'app officielle, gratuite : temps d'attente, plan, et entrées à horaire pour Super Nintendo World." },

  { nom: "Tabelog", role: "Choisir un resto", id: 6752922875,
    desc: "La référence japonaise des restaurants, en version voyageurs avec menus traduits et réservation. Gratuite ; une option premium existe, inutile ici." },

  { nom: "Japan Wi-Fi auto-connect", role: "Se connecter au wifi", id: 1461015351,
    desc: "Connexion automatique aux wifi gratuits : aéroports, gares, trains, konbini, cafés. À installer avant de partir." },

  { nom: "Ubigi", role: "Avoir du réseau", id: 1375857674,
    desc: "L'eSIM : un forfait data activé avant le départ, sans toucher à la carte SIM française." },

  { nom: "Travel Japan Phrase", role: "Dire une phrase", id: 6739940739,
    desc: "230 phrases toutes prêtes, rangées par situation : resto, train, taxi, hôtel, pharmacie." },

  { nom: "Vietnam Airlines", role: "Le vol retour", id: 1472323081,
    desc: "Enregistrement, carte d'embarquement et suivi des vols du 3 novembre." }
];

// --- ALBUM PARTAGÉ ------------------------------------------
// Album iCloud partagé. Apple interdit de l'afficher dans la page
// (X-Frame-Options), donc l'app l'ouvre : sur iPhone ça bascule
// directement dans Photos.
// ⚠ Ce lien suffit à voir l'album et à y déposer des photos.
//   Dans un dépôt public, il est lisible par qui trouve le dépôt.
const ALBUM = {
  titre: "japon \u201826 \ud83c\uddef\ud83c\uddf5\ud83c\udf38",
  lien: "https://photos.icloud.com/shared/album/0423DXn1RkV7ltl42N67FMwPA"
};

// --- ACTIVITÉS ----------------------------------------------
// Une ligne par activité, dans l'ordre de la journée.
// heure, duree (en minutes) et note sont facultatives.
// Le lien Google Maps se fabrique tout seul depuis l'adresse.
const ACTIVITES = [
  { date: "2026-10-13", heure: "09:40", duree: 795, titre: "Vol AF186 · Paris → Tokyo", adresse: "Aéroport Paris-Charles de Gaulle Terminal 2E", tz: "Europe/Paris", vol: "AFR186", note: "Cartes d'embarquement ci-dessous, une par place : 26C, 26D, 26E et 26H, rang 26, zone 4. Arrivée conseillée 7h10 au terminal 2E. Dépose bagages jusqu'à 8h40, zone E10. Embarquement 8h45, porte fermée à 9h20. Passage PARAFE possible. Bagages : 1 petit sac + 1 bagage cabine, 12 kg en tout, et 2 valises en soute de 23 kg. Arrivée à Haneda terminal 3 le 14 à 5h55.", marche: 0, billet: "pris",
    fichiers: [{src: "billets/2026-10-13-af186-26C.jpg.enc", nom: "Place 26C"}, {src: "billets/2026-10-13-af186-26D.jpg.enc", nom: "Place 26D"}, {src: "billets/2026-10-13-af186-26E.jpg.enc", nom: "Place 26E"}, {src: "billets/2026-10-13-af186-26H.jpg.enc", nom: "Place 26H"}] },
  { date: "2026-10-14", heure: "05:55", duree: 60, titre: "Arrivée à Tokyo Haneda", adresse: "Haneda Airport Terminal 3, Ota-ku, Tokyo", vol: "AFR186", note: "Vol AF186 depuis Paris, terminal 3.", marche: 0 },
  { date: "2026-10-14", titre: "Rejoindre Shinjuku", adresse: "Wakamatsu-Kawada Station, Shinjuku, Tokyo", note: "~1 h : Tokyo Monorail jusqu'à Hamamatsucho (15 min), à pied jusqu'à Daimon, puis Toei Oedo Line direction Hikarigaoka. Ou Uber, 50-100 €.", marche: 1 },
  { date: "2026-10-14", titre: "Check-in Airbnb Toyama Century", adresse: "Toyama Century, 7-3-36 Shinjuku, Shinjuku-ku, Tokyo", note: "Logement du 14 au 18. La clé est dans une boîte à code près de la porte ; le code, le numéro de l'appartement et le wifi sont dans les photos protégées ci-dessous (mot de passe du groupe). C'est bien le « 26 » du carnet.", marche: 0, billet: "pris",
    fichiers: [{src: "billets/2026-10-14-tokyo-acces.jpg.enc", nom: "Accès"}, {src: "billets/2026-10-14-tokyo-immeuble.jpg.enc", nom: "Immeuble"}, {src: "billets/2026-10-14-tokyo-porte.jpg.enc", nom: "Porte"}, {src: "billets/2026-10-14-tokyo-boite-a-cle.jpg.enc", nom: "Clé"}] },
  { date: "2026-10-14", titre: "Soirée à Shinjuku", adresse: "Shinjuku, Tokyo", marche: 2 },
  { date: "2026-10-15", titre: "Temple Senso-ji", adresse: "Senso-ji, 2-3-1 Asakusa, Taito-ku, Tokyo", note: "Le matin, avant la foule.", marche: 2 },
  { date: "2026-10-15", titre: "Rue marchande Nakamise-dori", adresse: "Nakamise-dori, Asakusa, Taito-ku, Tokyo", marche: 1 },
  { date: "2026-10-15", titre: "Parc Ueno et quartier d'Ueno", adresse: "Ueno Park, Taito-ku, Tokyo", note: "Resto dans le quartier.", marche: 3 },
  { date: "2026-10-16", titre: "Shinjuku", adresse: "Shinjuku, Tokyo", note: "Journée échangée avec le 17, confirmé.", marche: 2 },
  { date: "2026-10-16", titre: "Shibuya", adresse: "Shibuya Crossing, Shibuya, Tokyo", marche: 2 },
  { date: "2026-10-16", titre: "Balade à Roppongi", adresse: "Roppongi, Minato-ku, Tokyo", marche: 2 },
  { date: "2026-10-16", heure: "19:30", titre: "Arrivée de maman · Nidia", note: "Elle arrive vers 19h30, le 16 et non le 15 comme prévu au départ. Lieu et vol d'arrivée à confirmer.", marche: 0 },
  { date: "2026-10-17", titre: "Palais impérial", adresse: "Imperial Palace East Gardens, Chiyoda, Tokyo", note: "Les jardins sont fermés le lundi et le vendredi : d'où l'échange avec le 16, qui tombe un vendredi.", marche: 3 },
  { date: "2026-10-17", titre: "Quartier Minato", adresse: "Minato, Tokyo", marche: 2 },
  { date: "2026-10-17", titre: "Temple Zojo-ji et parc Shiba", adresse: "Zojo-ji, 4-7-35 Shibakoen, Minato-ku, Tokyo", note: "Vue sur la Tokyo Tower depuis le parvis.", marche: 2 },
  { date: "2026-10-18", heure: "10:30", duree: 120, titre: "Fuji Excursion · Shinjuku → Kawaguchiko", adresse: "Shinjuku Station, Tokyo", note: "Fuji Excursion 15, arrivée 12h30. Voiture 3, places 2A, 2B, 6C, 6D, 7D. ⚠ Avant de partir, retirer les billets papier à une borne JR East de Shinjuku (borne à QR, « Read QR code ») avec le QR de retrait ci-dessous : on ne peut pas le faire à Kawaguchiko. Puis taxi, 10-15 min.", marche: 0, billet: "pris",
    fichiers: [{src: "billets/2026-10-18-fuji-excursion-retrait.jpg.enc", nom: "QR de retrait"}] },
  { date: "2026-10-18", heure: "16:00", titre: "Check-in Fujisan Kingyo", adresse: "Fujisan Kingyo, Katsuyama, Fujikawaguchiko, Yamanashi", note: "Check-out à 10h, parking gratuit. Maison entière : 4 chambres, 10 lits, 1 seule salle de bain. Rien n'est payé d'avance. Les deux nuits (18 et 19) sont réservées, confirmé par Selma.", marche: 0 },
  { date: "2026-10-18", titre: "Balade en ville et repas", adresse: "Kawaguchiko, Fujikawaguchiko, Yamanashi", marche: 2 },
  { date: "2026-10-18", titre: "Vélo autour du lac Kawaguchiko", adresse: "Lake Kawaguchi, Fujikawaguchiko, Yamanashi", marche: 1 },
  { date: "2026-10-19", heure: "06:00", titre: "Lever tôt pour voir le Fuji", note: "Le sommet se dégage surtout au lever du jour.", marche: 0 },
  { date: "2026-10-19", titre: "Chureito Pagoda", adresse: "Chureito Pagoda, Arakurayama Sengen Park, Fujiyoshida, Yamanashi", note: "Environ 400 marches.", marche: 3 },
  { date: "2026-10-19", titre: "Oishi Park", adresse: "Oishi Park, Fujikawaguchiko, Yamanashi", marche: 2 },
  { date: "2026-10-19", titre: "Fuji-Q Highland", adresse: "Fuji-Q Highland, 5-6-1 Shinnishihara, Fujiyoshida, Yamanashi", note: "Le parc d'attractions au pied du Fuji, c'est le « Naruto Park » du carnet (il a une zone Naruto). Billets à prendre en ligne : la file à l'entrée est longue.", marche: 2 },
  { date: "2026-10-19", titre: "Téléphérique du Mt Fuji", adresse: "Mt. Fuji Panoramic Ropeway, Fujikawaguchiko, Yamanashi", note: "S'il n'y a pas trop de monde.", marche: 1 },
  { date: "2026-10-20", heure: "10:00", titre: "Check-out Fujisan Kingyo", adresse: "Fujisan Kingyo, Katsuyama, Fujikawaguchiko, Yamanashi", marche: 0 },
  { date: "2026-10-20", heure: "10:20", duree: 100, titre: "Bus express · Kawaguchiko → Mishima", adresse: "Kawaguchiko Station, Fujikawaguchiko, Yamanashi", note: "Bus Fujikyu n° 0108, arrivée 11h50 à Mishima, sortie Nord. Voiture 1, places 02A, 02B, 03A, 03B, 04A. Montrer le QR au chauffeur. ⚠ Le billet précise « captures d'écran refusées » : garder aussi le billet original ouvert sur le téléphone de Selma.", marche: 0, billet: "pris",
    fichiers: [{src: "billets/2026-10-20-bus-mishima.jpg.enc", nom: "QR du bus"}] },
  { date: "2026-10-20", heure: "13:46", duree: 115, titre: "Shinkansen · Mishima → Kyoto", adresse: "Mishima Station, Shizuoka", note: "Hikari 713, arrivée 15h37. Voiture 6, places 8-A à 8-E, les cinq ensemble. Les cinq QR sont ci-dessous, un par place : au portique, ouvre le tien et monte la luminosité. Dans smartEX, « Designate IC Card » lie une place à ta Suica : on passe alors en posant le téléphone.", marche: 0, billet: "pris",
    fichiers: [{src: "billets/2026-10-20-shinkansen-8A.jpg.enc", nom: "Place 8-A"}, {src: "billets/2026-10-20-shinkansen-8B.jpg.enc", nom: "Place 8-B"}, {src: "billets/2026-10-20-shinkansen-8C.jpg.enc", nom: "Place 8-C"}, {src: "billets/2026-10-20-shinkansen-8D.jpg.enc", nom: "Place 8-D"}, {src: "billets/2026-10-20-shinkansen-8E.jpg.enc", nom: "Place 8-E"}] },
  { date: "2026-10-20", titre: "Check-in Rokuhara Inn", adresse: "Rokuhara Inn, Higashiyama-ku, Kyoto", note: "C'est bien le Rokuhara Inn, pas le Daiya Ryokan (confirmé par Selma). Le numéro de réservation et le code ne sont pas dans l'app — garde-les dans Booking.", marche: 0 },
  { date: "2026-10-20", titre: "Gion et la rue Hanamikoji", adresse: "Hanamikoji Dori, Gion, Higashiyama-ku, Kyoto", marche: 2 },
  { date: "2026-10-20", titre: "Yasaka Shrine", adresse: "Yasaka Shrine, 625 Gionmachi Kitagawa, Higashiyama-ku, Kyoto", marche: 1 },
  { date: "2026-10-21", titre: "Kiyomizu-dera", adresse: "Kiyomizu-dera, 1-294 Kiyomizu, Higashiyama-ku, Kyoto", note: "Le matin.", marche: 3 },
  { date: "2026-10-21", titre: "Sannenzaka et Ninenzaka", adresse: "Sannenzaka, Higashiyama-ku, Kyoto", note: "Les deux ruelles pavées en descendant du temple.", marche: 2 },
  { date: "2026-10-21", titre: "Après-midi libre", marche: 0 },
  { date: "2026-10-22", titre: "Fushimi Inari Taisha", adresse: "Fushimi Inari Taisha, 68 Fukakusa Yabunouchicho, Fushimi-ku, Kyoto", note: "Y aller très tôt, c'est ouvert jour et nuit.", marche: 3 },
  { date: "2026-10-22", titre: "Nishiki Market", adresse: "Nishiki Market, Nakagyo-ku, Kyoto", marche: 1 },
  { date: "2026-10-22", titre: "Festival Jidai Matsuri", adresse: "Kyoto Imperial Palace, Kamigyo-ku, Kyoto", note: "Grande parade en costumes, samouraïs et geishas. ⚠ Selma dit que ça ne part pas du Palais impérial vers midi, alors que le programme habituel annonce 12h au Palais, arrivée au Heian-jingu vers 14h30. À recouper avec elle avant le 22.", marche: 2 },
  { date: "2026-10-22", titre: "Balade à Gion", adresse: "Gion, Higashiyama-ku, Kyoto", marche: 2 },
  { date: "2026-10-23", titre: "Forêt de bambous d'Arashiyama", adresse: "Arashiyama Bamboo Grove, Ukyo-ku, Kyoto", note: "Tôt, c'est le seul moment où elle est calme.", marche: 2 },
  { date: "2026-10-23", titre: "Tenryu-ji", adresse: "Tenryu-ji, 68 Sagatenryuji Susukinobabacho, Ukyo-ku, Kyoto", note: "Le temple au lac.", marche: 2 },
  { date: "2026-10-23", titre: "Otagi Nenbutsu-ji", adresse: "Otagi Nenbutsu-ji, 2-5 Sagatoriimoto Fukatanicho, Ukyo-ku, Kyoto", note: "Les 1 200 statues de pierre, en haut du quartier.", marche: 3 },
  { date: "2026-10-23", titre: "Iwatayama Monkey Park", adresse: "Iwatayama Monkey Park, Arashiyama, Nishikyo-ku, Kyoto", note: "20-30 min de montée.", marche: 3 },
  { date: "2026-10-24", titre: "Kinkaku-ji", adresse: "Kinkaku-ji, 1 Kinkakujicho, Kita-ku, Kyoto", note: "Le pavillon d'or.", marche: 2 },
  { date: "2026-10-24", titre: "Ryoan-ji", adresse: "Ryoan-ji, 13 Ryoanji Goryonoshitacho, Ukyo-ku, Kyoto", note: "Le jardin de galets blancs.", marche: 2 },
  { date: "2026-10-24", titre: "Ninna-ji", adresse: "Ninna-ji, 33 Omuro Ouchi, Ukyo-ku, Kyoto", marche: 2 },
  { date: "2026-10-24", titre: "Kitano Tenmangu", adresse: "Kitano Tenmangu, Bakurocho, Kamigyo-ku, Kyoto", note: "Les quatre sont à quelques minutes les uns des autres.", marche: 2 },
  { date: "2026-10-25", titre: "Kintetsu · Kyoto → Nara", adresse: "Kintetsu Kyoto Station, Kyoto", note: "30-50 min. Puis 10-15 min à pied, ou Uber en 3-5 min (700-1 200 ¥).", marche: 0 },
  { date: "2026-10-25", titre: "Check-in Miroku Nara by The Share Hotels", adresse: "Miroku Nara by The Share Hotels, Nara", marche: 0 },
  { date: "2026-10-25", titre: "Kofuku-ji", adresse: "Kofuku-ji, 48 Noboriojicho, Nara", note: "La pagode à cinq étages.", marche: 2 },
  { date: "2026-10-25", titre: "Naramachi", adresse: "Naramachi, Nara", note: "L'ancien quartier marchand.", marche: 2 },
  { date: "2026-10-25", titre: "Isuien Garden", adresse: "Isuien Garden, 74 Suimoncho, Nara", marche: 1 },
  { date: "2026-10-26", titre: "Nara Park", adresse: "Nara Park, Nara", note: "Acheter des shika senbei, les biscuits pour les biches.", marche: 3 },
  { date: "2026-10-26", titre: "Kasuga Taisha", adresse: "Kasuga Taisha, 160 Kasuganocho, Nara", note: "Dans le parc, les lanternes de pierre.", marche: 3 },
  { date: "2026-10-27", titre: "Kintetsu · Nara → Osaka Namba", adresse: "Kintetsu Nara Station, Nara", note: "Puis Uber jusqu'au logement.", marche: 0 },
  { date: "2026-10-27", titre: "Check-in Wellstay Shinsekai Wakyo", adresse: "Shinsekai, Naniwa-ku, Osaka", marche: 0 },
  { date: "2026-10-27", titre: "Round One Sennichimae", adresse: "Round1 Sennichimae, Namba, Chuo-ku, Osaka", note: "Salle de jeux. Celui du centre, à Sennichimae (choisi par Selma).", marche: 1 },
  { date: "2026-10-28", duree: 420, titre: "Universal Studios Japan", adresse: "Universal Studios Japan, 2-1-33 Sakurajima, Konohana-ku, Osaka", note: "Compter 7 h sur place. Pass 4 attractions ~150 €. Trajet 200-300 ¥ : 10 min à pied jusqu'à Shin-Imamiya, JR Osaka Loop Line jusqu'à Nishikujo, puis JR Yumesaki/Sakurajima jusqu'à Universal City. Compter 30-40 min de trajet. Express Pass 5 « Race & Minecart » : créneaux Mine Cart Madness 16h00-16h30, Super Nintendo World 15h30-16h30, Mario Kart 15h30-16h00, Minion Blast 18h00-18h30 ; Flying Dinosaur et Harry Potter au choix. Pour entrer dans Super Nintendo World, l'Express Pass vaut ticket d'accès. ⚠ Selma n'a envoyé que 3 pass d'entrée, 3 Express et 3 bons repas de 1 000 ¥ : à vérifier pour 5 personnes. Contrôle aux rayons X à l'entrée.", marche: 9, billet: "pris",
    fichiers: [{src: "billets/2026-10-28-usj-entree-1.jpg.enc", nom: "Entrée 1"}, {src: "billets/2026-10-28-usj-entree-2.jpg.enc", nom: "Entrée 2"}, {src: "billets/2026-10-28-usj-entree-3.jpg.enc", nom: "Entrée 3"}, {src: "billets/2026-10-28-usj-express-1.jpg.enc", nom: "Express 1"}, {src: "billets/2026-10-28-usj-express-2.jpg.enc", nom: "Express 2"}, {src: "billets/2026-10-28-usj-express-3.jpg.enc", nom: "Express 3"}, {src: "billets/2026-10-28-usj-repas-1.jpg.enc", nom: "Repas 1"}, {src: "billets/2026-10-28-usj-repas-2.jpg.enc", nom: "Repas 2"}, {src: "billets/2026-10-28-usj-repas-3.jpg.enc", nom: "Repas 3"}] },
  { date: "2026-10-29", titre: "Dotonbori", adresse: "Dotonbori, Chuo-ku, Osaka", note: "20-25 min du logement.", marche: 2 },
  { date: "2026-10-29", titre: "Shinsekai", adresse: "Shinsekai, Naniwa-ku, Osaka", note: "2-5 min. Plutôt le soir, avec l'arcade.", marche: 2 },
  { date: "2026-10-29", titre: "Pokémon Center", adresse: "Pokemon Center Osaka, Umeda, Kita-ku, Osaka", marche: 1 },
  { date: "2026-10-30", heure: "11:30", duree: 139, titre: "Shinkansen Nozomi · Shin-Osaka → Shinagawa", adresse: "Shin-Osaka Station, Osaka", note: "Nozomi 90, arrivée 13h49 à Shinagawa, pas à Tokyo Station. Voiture 5, places 1-B, 1-C et 1-D : trois billets, Selma a écrit « pour nous 3 ». ⚠ Vérifier le retour de Nidia. Depuis Shinagawa : JR Yamanote jusqu'à Shinjuku (~20 min) ou Uber.", marche: 1, billet: "pris",
    fichiers: [{src: "billets/2026-10-30-nozomi-1B.jpg.enc", nom: "Place 1-B"}, {src: "billets/2026-10-30-nozomi-1C.jpg.enc", nom: "Place 1-C"}, {src: "billets/2026-10-30-nozomi-1D.jpg.enc", nom: "Place 1-D"}] },
  { date: "2026-10-30", titre: "Soirée Shibuya et Shinjuku", adresse: "Shibuya, Tokyo", note: "Arcade.", marche: 2 },
  { date: "2026-10-30", titre: "Tsurutontan (udon)", adresse: "Tsurutontan Udon Noodle Brasserie Shibuya, Shibuya, Tokyo", note: "Réservation.", marche: 0, billet: "attendu" },
  { date: "2026-10-31", titre: "Harajuku", adresse: "Takeshita Street, Harajuku, Shibuya, Tokyo", marche: 3 },
  { date: "2026-10-31", titre: "Samurai Restaurant", adresse: "Samurai Restaurant, Kabukicho, Shinjuku, Tokyo", note: "Pour Syan et Selma. L'autre partie du groupe reste à Shinjuku.", marche: 0, billet: "attendu" },
  { date: "2026-10-31", titre: "Dîner à Omoide Yokocho", adresse: "Omoide Yokocho, Nishi-Shinjuku, Shinjuku, Tokyo", marche: 1 },
  { date: "2026-11-01", titre: "Akihabara", adresse: "Akihabara, Taito-ku, Tokyo", marche: 2 },
  { date: "2026-11-01", titre: "Tokyo Metropolitan Government Building", adresse: "Tokyo Metropolitan Government Building, Nishi-Shinjuku, Shinjuku, Tokyo", note: "Observatoire gratuit.", marche: 1 },
  { date: "2026-11-01", titre: "Kabukicho", adresse: "Kabukicho, Shinjuku, Tokyo", marche: 2 },
  { date: "2026-11-02", titre: "Journée libre", note: "Shopping, ou retour dans un quartier préféré.", marche: 2 },
  { date: "2026-11-03", heure: "06:00", titre: "Départ pour Narita", adresse: "Narita Airport Terminal 1, Narita, Chiba", note: "Attention, c'est Narita et pas Haneda : compter ~2 h depuis Shinjuku.", marche: 1 },
  { date: "2026-11-03", heure: "09:30", duree: 255, titre: "Vol VN311 · Narita → Hanoï", adresse: "Narita Airport Terminal 1, Narita, Chiba", vol: "HVN311", note: "Arrivée Hanoï T2 à 13h45, puis ~9h35 d'escale sans changer de terminal. ⚠ 09h30 → 13h45 avec 2h de décalage fait 4h15 de vol, pas les 6h15 notés : à vérifier.", marche: 0, billet: "attendu" },
  { date: "2026-11-03", heure: "23:20", titre: "Vol VN19 · Hanoï → Paris", adresse: "Noi Bai International Airport Terminal 2, Hanoi", tz: "Asia/Ho_Chi_Minh", vol: "HVN19", duree: 790, note: "Heure locale de Hanoï. 13h10 de vol. Syan est bien sur la réservation, confirmé par Selma.", marche: 0, billet: "attendu" },
  { date: "2026-11-04", heure: "06:30", duree: 45, titre: "Arrivée à Paris CDG 2C", adresse: "Aéroport Paris-Charles de Gaulle Terminal 2C", tz: "Europe/Paris", vol: "HVN19", note: "Heure de Paris.", marche: 0 },
];

// --- MÉTÉO --------------------------------------------------
// Prévisions jusqu'au 20, puis tendance d'après 2023-2025 (JMA).
const METEO_MAJ = "16 oct. 2026";
const METEO = [{"date": "2026-10-14", "lieu": "Tokyo", "type": "prevision", "max": 26, "min": 17, "ciel": "eclaircies", "pluie": 30, "rainy": 0, "hist": {"2023": [23, 13, 0], "2024": [26, 17, 0], "2025": [21, 16, 0]}, "src": {"JMA": [23, 17, 30], "Weather Company": [26, 17, null], "AccuWeather": [28, 17, 25]}}, {"date": "2026-10-15", "lieu": "Tokyo", "type": "prevision", "max": 24, "min": 16, "ciel": "eclaircies", "pluie": 30, "rainy": 2, "hist": {"2023": [17, 14, 43.5], "2024": [27, 18, 0], "2025": [20, 15, 3.0]}, "src": {"JMA": [25, 15, 30], "Weather Company": [23, 16, null], "AccuWeather": [24, 16, 5]}}, {"date": "2026-10-16", "lieu": "Tokyo", "type": "prevision", "max": 26, "min": 18, "ciel": "eclaircies", "pluie": 10, "rainy": 1, "hist": {"2023": [26, 12, 0], "2024": [26, 19, 0], "2025": [21, 16, 8.0]}, "src": {"timeanddate": [26, 18, 10]}}, {"date": "2026-10-17", "lieu": "Tokyo", "type": "prevision", "max": 26, "min": 16, "ciel": "soleil", "pluie": 10, "rainy": 0, "hist": {"2023": [25, 15, 0], "2024": [26, 21, 0], "2025": [25, 16, 0]}, "src": {"timeanddate": [26, 16, 10]}}, {"date": "2026-10-18", "lieu": "Kawaguchiko", "type": "prevision", "max": 19, "min": 12, "ciel": "eclaircies", "pluie": 20, "rainy": null, "hist": {}, "src": {"AccuWeather": [19, 12, 20], "timeanddate": [19, 11, 25]}}, {"date": "2026-10-19", "lieu": "Kawaguchiko", "type": "prevision", "max": 20, "min": 12, "ciel": "nuages", "pluie": 40, "rainy": null, "hist": {}, "src": {"AccuWeather": [20, 12, 40], "timeanddate": [19, 11, 45]}}, {"date": "2026-10-20", "lieu": "Kyoto", "type": "prevision", "max": 28, "min": 20, "ciel": "averses", "pluie": 70, "rainy": 2, "hist": {"2023": [25, 15, 1.0], "2024": [21, 15, 0], "2025": [24, 17, 4.5]}, "src": {"timeanddate": [28, 20, 70]}}, {"date": "2026-10-21", "lieu": "Kyoto", "type": "prevision", "max": 27, "min": 15, "ciel": "averses", "pluie": 50, "rainy": 0, "hist": {"2023": [19, 11, 0], "2024": [25, 15, 0], "2025": [19, 15, 0]}, "src": {"timeanddate": [29, 15, 50], "timeanddate (centre-ville)": [26, 14, null]}}, {"date": "2026-10-22", "lieu": "Kyoto", "type": "prevision", "max": 19, "min": 10, "ciel": "nuages", "pluie": 20, "rainy": 0, "hist": {"2023": [20, 10, 0], "2024": [24, 18, 0], "2025": [16, 13, 0.5]}, "src": {"timeanddate": [19, 10, 20]}}, {"date": "2026-10-23", "lieu": "Kyoto", "type": "prevision", "max": 22, "min": 13, "ciel": "nuages", "pluie": 10, "rainy": 1, "hist": {"2023": [24, 12, 0], "2024": [29, 22, 2.5], "2025": [24, 12, 0]}, "src": {"timeanddate": [22, 13, 10], "AccuWeather": [23, 17, null]}}, {"date": "2026-10-24", "lieu": "Kyoto", "type": "prevision", "max": 24, "min": 17, "ciel": "nuages", "pluie": 30, "rainy": 0, "hist": {"2023": [24, 12, 0], "2024": [24, 18, 0], "2025": [23, 12, 0]}, "src": {"timeanddate": [24, 17, 30], "AccuWeather": [22, 17, 30]}}, {"date": "2026-10-25", "lieu": "Nara", "type": "prevision", "max": 21, "min": 17, "ciel": "eclaircies", "pluie": 20, "rainy": 2, "hist": {"2023": [24, 12, 7.0], "2024": [25, 16, 0], "2025": [21, 13, 6.5]}, "src": {"timeanddate": [21, 17, 20]}}, {"date": "2026-10-26", "lieu": "Nara", "type": "prevision", "max": 22, "min": 17, "ciel": "eclaircies", "pluie": 10, "rainy": 1, "hist": {"2023": [23, 11, 0], "2024": [21, 16, 0], "2025": [20, 16, 2.5]}, "src": {"timeanddate": [22, 17, 10]}}, {"date": "2026-10-27", "lieu": "Osaka", "type": "prevision", "max": 20, "min": 18, "ciel": "pluie", "pluie": 70, "rainy": 2, "hist": {"2023": [24, 14, 2.5], "2024": [27, 18, 2.5], "2025": [23, 15, 0]}, "src": {"timeanddate": [20, 18, 70]}}, {"date": "2026-10-28", "lieu": "Osaka", "type": "prevision", "max": 20, "min": 17, "ciel": "averses", "pluie": 50, "rainy": 1, "hist": {"2023": [22, 13, 0], "2024": [22, 17, 32.0], "2025": [19, 12, 0]}, "src": {"timeanddate": [20, 17, 50]}}, {"date": "2026-10-29", "lieu": "Osaka", "type": "prevision", "max": 20, "min": 17, "ciel": "soleil", "pluie": 10, "rainy": 1, "hist": {"2023": [20, 14, 0], "2024": [19, 17, 4.0], "2025": [20, 10, 0]}, "src": {"timeanddate": [20, 17, 10]}}, {"date": "2026-10-30", "lieu": "Tokyo", "type": "prevision", "max": 22, "min": 15, "ciel": "soleil", "pluie": 10, "rainy": 1, "hist": {"2023": [22, 12, 0], "2024": [22, 13, 17.5], "2025": [19, 10, 0]}, "src": {"timeanddate": [22, 15, 10]}}, {"date": "2026-10-31", "lieu": "Tokyo", "type": "tendance", "max": 19, "min": 13, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [21, 14, 0], "2024": [20, 13, 0], "2025": [17, 13, 37.0]}}, {"date": "2026-11-01", "lieu": "Tokyo", "type": "tendance", "max": 22, "min": 12, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [23, 13, 0], "2024": [22, 12, 0.5], "2025": [22, 12, 0.5]}}, {"date": "2026-11-02", "lieu": "Tokyo", "type": "tendance", "max": 20, "min": 13, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [25, 13, 0], "2024": [17, 15, 33.5], "2025": [19, 12, 0]}}, {"date": "2026-11-03", "lieu": "Tokyo", "type": "tendance", "max": 22, "min": 13, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [24, 14, 0], "2024": [23, 14, 0], "2025": [19, 11, 0]}}];
