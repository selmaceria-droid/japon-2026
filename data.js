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
    note: "Arrivée le 14 depuis Paris · logement à 8 min de la station, nom à récupérer" },

  { lieu: "Kawaguchiko", du: "2026-10-18", au: "2026-10-20", nuits: 2,
    note: "Au pied du Fuji · le lac est à 830 m, les nuits sont fraîches",
    trajet: { mode: "Train Fuji Excursion", duree: "2 h", prix: "~24 €",
              depart: "Shinjuku Station, Tokyo", arrivee: "Kawaguchiko Station",
              details: ["Départ 10h30, arrivée 12h30.",
                        "Puis taxi devant la gare, 10-15 min (1 500-3 000 ¥)."] } },

  { lieu: "Kyoto", du: "2026-10-20", au: "2026-10-25", nuits: 5,
    note: "278 km depuis Kawaguchiko",
    trajet: { mode: "Bus + Shinkansen", duree: "~4 h", prix: "~80 €",
              depart: "Kawaguchiko Station", arrivee: "Kyoto Station",
              details: ["Bus express Kawaguchiko → Mishima : 10h20 → 11h50, ou 10h55 → 12h30 (~13 €).",
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
// schema  : ouvre l'app directement si elle est installée.
//           Pas documenté par les éditeurs : ceux marqués aVerifier
//           sont des suppositions. Pour tester, tapez le schéma dans
//           Safari : si l'app s'ouvre, enlevez aVerifier. Sinon,
//           videz le champ — l'app apprend toute seule à l'ignorer.
const APPS = [
  { nom: "Japan Travel", role: "Trouver son train", id: 686373726,
    schema: "japantravel://", aVerifier: true,
    desc: "Itinéraires, horaires et correspondances dans tout le Japon, avec les guides de quartier. L'app de référence sur place." },

  { nom: "Suica", role: "Payer le métro", id: 1156875272,
    schema: "suica://", aVerifier: true,
    desc: "La carte de transport rechargeable, dans Apple Pay. On pose le téléphone sur le portique, et ça sert aussi au konbini." },

  { nom: "GO", role: "Prendre un taxi", id: 1254341709,
    desc: "L'app de taxi la plus répandue au Japon. On commande, on suit la voiture sur la carte et on paie dedans." },

  { nom: "Kuli Kuli", role: "Traduire un truc", id: 6458146511,
    schema: "kulikuli://", aVerifier: true,
    desc: "Traduction à l'appareil photo, à la voix ou au texte. Pour les menus sans photos et les panneaux." },

  { nom: "Japan Wi-Fi auto-connect", role: "Se connecter au wifi", id: 1461015351,
    desc: "Connexion automatique aux wifi gratuits : aéroports, gares, trains, konbini, cafés. À installer avant de partir." },

  { nom: "Ubigi", role: "Avoir du réseau", id: 1375857674,
    schema: "ubigi://", aVerifier: true,
    desc: "L'eSIM : un forfait data activé avant le départ, sans toucher à la carte SIM française." },

  { nom: "Travel Japan Phrase", role: "Dire une phrase", id: 6739940739,
    desc: "230 phrases toutes prêtes, rangées par situation : resto, train, taxi, hôtel, pharmacie." },

  { nom: "Vietnam Airlines", role: "Le vol retour", id: 1472323081,
    schema: "vietnamairlines://", aVerifier: true,
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
  lien: "https://photos.icloud.com/shared/album/03aUuBdZ6fd6AcUGFOUW5ZPfw"
};

// --- ACTIVITÉS ----------------------------------------------
// Une ligne par activité, dans l'ordre de la journée.
// heure, duree (en minutes) et note sont facultatives.
// Le lien Google Maps se fabrique tout seul depuis l'adresse.
const ACTIVITES = [
  { date: "2026-10-13", heure: "09:40", duree: 795, titre: "Vol AF186 · Paris → Tokyo", adresse: "Aéroport Paris-Charles de Gaulle Terminal 2E", tz: "Europe/Paris", vol: "AFR186", note: "13h15 de vol. Arrivée à Haneda terminal 3 le 14 à 05h55. Selma confirme que tu as ta propre réservation : le billet vu avant était celui de l'autre Selma. Billet staff en classe Q — au comptoir, pièce d'identité avec photo + le FOID. Salon Air France seulement avec une place confirmée en Business. Aucune option payante sauf sièges et bagages.", marche: 0, billet: "pris" },
  { date: "2026-10-14", heure: "05:55", duree: 60, titre: "Arrivée à Tokyo Haneda", adresse: "Haneda Airport Terminal 3, Ota-ku, Tokyo", vol: "AFR186", note: "Vol AF186 depuis Paris, terminal 3.", marche: 0 },
  { date: "2026-10-14", titre: "Rejoindre Shinjuku", adresse: "Wakamatsu-Kawada Station, Shinjuku, Tokyo", note: "~1 h : Tokyo Monorail jusqu'à Hamamatsucho (15 min), à pied jusqu'à Daimon, puis Toei Oedo Line direction Hikarigaoka. Ou Uber, 50-100 €.", marche: 1 },
  { date: "2026-10-14", titre: "Check-in du logement à Tokyo", note: "Ce n'est pas la Villa Roppongi (confirmé par Selma) : c'est le « 26 » du carnet, à 8 min de la station, pour 5 personnes. Nom et adresse exacts à récupérer auprès d'elle.", marche: 0 },
  { date: "2026-10-14", titre: "Soirée à Shinjuku", adresse: "Shinjuku, Tokyo", marche: 2 },
  { date: "2026-10-15", titre: "Arrivée de maman · Nidia", note: "Son arrivée a été avancée du 17 au 15.", marche: 0 },
  { date: "2026-10-15", titre: "Temple Senso-ji", adresse: "Senso-ji, 2-3-1 Asakusa, Taito-ku, Tokyo", note: "Le matin, avant la foule.", marche: 2 },
  { date: "2026-10-15", titre: "Rue marchande Nakamise-dori", adresse: "Nakamise-dori, Asakusa, Taito-ku, Tokyo", marche: 1 },
  { date: "2026-10-15", titre: "Parc Ueno et quartier d'Ueno", adresse: "Ueno Park, Taito-ku, Tokyo", note: "Resto dans le quartier.", marche: 3 },
  { date: "2026-10-16", titre: "Shinjuku", adresse: "Shinjuku, Tokyo", note: "Journée échangée avec le 17, confirmé.", marche: 2 },
  { date: "2026-10-16", titre: "Shibuya", adresse: "Shibuya Crossing, Shibuya, Tokyo", marche: 2 },
  { date: "2026-10-16", titre: "Balade à Roppongi", adresse: "Roppongi, Minato-ku, Tokyo", marche: 2 },
  { date: "2026-10-17", titre: "Palais impérial", adresse: "Imperial Palace East Gardens, Chiyoda, Tokyo", note: "Les jardins sont fermés le lundi et le vendredi : d'où l'échange avec le 16, qui tombe un vendredi.", marche: 3 },
  { date: "2026-10-17", titre: "Quartier Minato", adresse: "Minato, Tokyo", marche: 2 },
  { date: "2026-10-17", titre: "Temple Zojo-ji et parc Shiba", adresse: "Zojo-ji, 4-7-35 Shibakoen, Minato-ku, Tokyo", note: "Vue sur la Tokyo Tower depuis le parvis.", marche: 2 },
  { date: "2026-10-18", heure: "10:30", duree: 120, titre: "Fuji Excursion · Shinjuku → Kawaguchiko", adresse: "Shinjuku Station, Tokyo", note: "Arrivée 12h30. ~24 €. Puis taxi, 10-15 min.", marche: 0, billet: "attendu" },
  { date: "2026-10-18", heure: "16:00", titre: "Check-in Fujisan Kingyo", adresse: "Fujisan Kingyo, Katsuyama, Fujikawaguchiko, Yamanashi", note: "Check-out à 10h, parking gratuit. Maison entière : 4 chambres, 10 lits, 1 seule salle de bain. Rien n'est payé d'avance. Les deux nuits (18 et 19) sont réservées, confirmé par Selma.", marche: 0 },
  { date: "2026-10-18", titre: "Balade en ville et repas", adresse: "Kawaguchiko, Fujikawaguchiko, Yamanashi", marche: 2 },
  { date: "2026-10-18", titre: "Vélo autour du lac Kawaguchiko", adresse: "Lake Kawaguchi, Fujikawaguchiko, Yamanashi", marche: 1 },
  { date: "2026-10-19", heure: "06:00", titre: "Lever tôt pour voir le Fuji", note: "Le sommet se dégage surtout au lever du jour.", marche: 0 },
  { date: "2026-10-19", titre: "Chureito Pagoda", adresse: "Chureito Pagoda, Arakurayama Sengen Park, Fujiyoshida, Yamanashi", note: "Environ 400 marches.", marche: 3 },
  { date: "2026-10-19", titre: "Oishi Park", adresse: "Oishi Park, Fujikawaguchiko, Yamanashi", marche: 2 },
  { date: "2026-10-19", titre: "Fuji-Q Highland", adresse: "Fuji-Q Highland, 5-6-1 Shinnishihara, Fujiyoshida, Yamanashi", note: "Le parc d'attractions au pied du Fuji, c'est le « Naruto Park » du carnet (il a une zone Naruto). Billets à prendre en ligne : la file à l'entrée est longue.", marche: 2 },
  { date: "2026-10-19", titre: "Téléphérique du Mt Fuji", adresse: "Mt. Fuji Panoramic Ropeway, Fujikawaguchiko, Yamanashi", note: "S'il n'y a pas trop de monde.", marche: 1 },
  { date: "2026-10-20", heure: "10:00", titre: "Check-out Fujisan Kingyo", adresse: "Fujisan Kingyo, Katsuyama, Fujikawaguchiko, Yamanashi", marche: 0 },
  { date: "2026-10-20", heure: "10:20", duree: 100, titre: "Bus express · Kawaguchiko → Mishima", adresse: "Kawaguchiko Station, Fujikawaguchiko, Yamanashi", note: "Ou 10h55. Arrivée 11h50 ou 12h30. Compter 1h30 à 2h. ~13 €.", marche: 0, billet: "attendu" },
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
  { date: "2026-10-28", duree: 420, titre: "Universal Studios Japan", adresse: "Universal Studios Japan, 2-1-33 Sakurajima, Konohana-ku, Osaka", note: "Compter 7 h sur place. Pass 4 attractions ~150 €. Trajet 200-300 ¥ : 10 min à pied jusqu'à Shin-Imamiya, JR Osaka Loop Line jusqu'à Nishikujo, puis JR Yumesaki/Sakurajima jusqu'à Universal City. Compter 30-40 min de trajet.", marche: 9, billet: "pris" },
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
const METEO_MAJ = "10 oct. 2026";
const METEO = [{"date": "2026-10-14", "lieu": "Tokyo", "type": "prevision", "max": 26, "min": 17, "ciel": "eclaircies", "pluie": 30, "rainy": 0, "hist": {"2023": [23, 13, 0], "2024": [26, 17, 0], "2025": [21, 16, 0]}, "src": {"JMA": [23, 17, 30], "Weather Company": [26, 17, null], "AccuWeather": [28, 17, 25]}}, {"date": "2026-10-15", "lieu": "Tokyo", "type": "prevision", "max": 24, "min": 16, "ciel": "eclaircies", "pluie": 30, "rainy": 2, "hist": {"2023": [17, 14, 43.5], "2024": [27, 18, 0], "2025": [20, 15, 3.0]}, "src": {"JMA": [25, 15, 30], "Weather Company": [23, 16, null], "AccuWeather": [24, 16, 5]}}, {"date": "2026-10-16", "lieu": "Tokyo", "type": "prevision", "max": 23, "min": 16, "ciel": "nuages", "pluie": 30, "rainy": 1, "hist": {"2023": [26, 12, 0], "2024": [26, 19, 0], "2025": [21, 16, 8.0]}, "src": {"JMA": [24, 15, 30], "Weather Company": [24, 17, null], "AccuWeather": [22, 16, 55]}}, {"date": "2026-10-17", "lieu": "Tokyo", "type": "prevision", "max": 24, "min": 16, "ciel": "nuages", "pluie": 30, "rainy": 0, "hist": {"2023": [25, 15, 0], "2024": [26, 21, 0], "2025": [25, 16, 0]}, "src": {"JMA": [25, 16, 30], "Weather Company": [24, 17, null], "AccuWeather": [23, 15, 55]}}, {"date": "2026-10-18", "lieu": "Kawaguchiko", "type": "prevision", "max": 18, "min": 11, "ciel": "nuages", "pluie": 48, "rainy": null, "hist": {}, "src": {"Open-Meteo": [18, 11, 48]}}, {"date": "2026-10-19", "lieu": "Kawaguchiko", "type": "prevision", "max": 19, "min": 11, "ciel": "pluie", "pluie": 70, "rainy": null, "hist": {}, "src": {"Open-Meteo": [19, 11, 70], "JMA": [22, 16, 70], "Weather Company": [23, 18, null], "AccuWeather": [25, 18, 4]}}, {"date": "2026-10-20", "lieu": "Kyoto", "type": "tendance", "max": 23, "min": 16, "ciel": "averses", "pluie": null, "rainy": 2, "hist": {"2023": [25, 15, 1.0], "2024": [21, 15, 0], "2025": [24, 17, 4.5]}}, {"date": "2026-10-21", "lieu": "Kyoto", "type": "tendance", "max": 21, "min": 14, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [19, 11, 0], "2024": [25, 15, 0], "2025": [19, 15, 0]}}, {"date": "2026-10-22", "lieu": "Kyoto", "type": "tendance", "max": 20, "min": 14, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [20, 10, 0], "2024": [24, 18, 0], "2025": [16, 13, 0.5]}}, {"date": "2026-10-23", "lieu": "Kyoto", "type": "tendance", "max": 26, "min": 15, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [24, 12, 0], "2024": [29, 22, 2.5], "2025": [24, 12, 0]}}, {"date": "2026-10-24", "lieu": "Kyoto", "type": "tendance", "max": 24, "min": 14, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [24, 12, 0], "2024": [24, 18, 0], "2025": [23, 12, 0]}}, {"date": "2026-10-25", "lieu": "Nara", "type": "tendance", "max": 23, "min": 14, "ciel": "averses", "pluie": null, "rainy": 2, "hist": {"2023": [24, 12, 7.0], "2024": [25, 16, 0], "2025": [21, 13, 6.5]}}, {"date": "2026-10-26", "lieu": "Nara", "type": "tendance", "max": 21, "min": 14, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [23, 11, 0], "2024": [21, 16, 0], "2025": [20, 16, 2.5]}}, {"date": "2026-10-27", "lieu": "Osaka", "type": "tendance", "max": 25, "min": 16, "ciel": "averses", "pluie": null, "rainy": 2, "hist": {"2023": [24, 14, 2.5], "2024": [27, 18, 2.5], "2025": [23, 15, 0]}}, {"date": "2026-10-28", "lieu": "Osaka", "type": "tendance", "max": 21, "min": 14, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [22, 13, 0], "2024": [22, 17, 32.0], "2025": [19, 12, 0]}}, {"date": "2026-10-29", "lieu": "Osaka", "type": "tendance", "max": 20, "min": 14, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [20, 14, 0], "2024": [19, 17, 4.0], "2025": [20, 10, 0]}}, {"date": "2026-10-30", "lieu": "Tokyo", "type": "tendance", "max": 21, "min": 12, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [22, 12, 0], "2024": [22, 13, 17.5], "2025": [19, 10, 0]}}, {"date": "2026-10-31", "lieu": "Tokyo", "type": "tendance", "max": 19, "min": 13, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [21, 14, 0], "2024": [20, 13, 0], "2025": [17, 13, 37.0]}}, {"date": "2026-11-01", "lieu": "Tokyo", "type": "tendance", "max": 22, "min": 12, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [23, 13, 0], "2024": [22, 12, 0.5], "2025": [22, 12, 0.5]}}, {"date": "2026-11-02", "lieu": "Tokyo", "type": "tendance", "max": 20, "min": 13, "ciel": "eclaircies", "pluie": null, "rainy": 1, "hist": {"2023": [25, 13, 0], "2024": [17, 15, 33.5], "2025": [19, 12, 0]}}, {"date": "2026-11-03", "lieu": "Tokyo", "type": "tendance", "max": 22, "min": 13, "ciel": "soleil", "pluie": null, "rainy": 0, "hist": {"2023": [24, 14, 0], "2024": [23, 14, 0], "2025": [19, 11, 0]}}];
