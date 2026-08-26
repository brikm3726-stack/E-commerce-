/** Les 58 wilayas et un échantillon de communes par wilaya, pour le checkout.
 *  Remplaçable par un appel API sans changer le formulaire. */

export interface Wilaya {
  code: string;
  name: string;
  communes: string[];
}

export const WILAYAS: Wilaya[] = [
  { code: "01", name: "Adrar", communes: ["Adrar", "Reggane", "Aoulef", "Timimoun", "Zaouiet Kounta"] },
  { code: "02", name: "Chlef", communes: ["Chlef", "Ténès", "Ouled Fares", "Boukadir", "Chettia"] },
  { code: "03", name: "Laghouat", communes: ["Laghouat", "Aflou", "Ksar El Hirane", "Hassi R'Mel"] },
  { code: "04", name: "Oum El Bouaghi", communes: ["Oum El Bouaghi", "Aïn Beïda", "Aïn M'lila", "Meskiana"] },
  { code: "05", name: "Batna", communes: ["Batna", "Barika", "Merouana", "Aïn Touta", "N'Gaous"] },
  { code: "06", name: "Béjaïa", communes: ["Béjaïa", "Akbou", "Kherrata", "Amizour", "El Kseur", "Tichy"] },
  { code: "07", name: "Biskra", communes: ["Biskra", "Tolga", "Ouled Djellal", "Sidi Okba", "El Kantara"] },
  { code: "08", name: "Béchar", communes: ["Béchar", "Kenadsa", "Abadla", "Beni Ounif"] },
  { code: "09", name: "Blida", communes: ["Blida", "Boufarik", "Larbaa", "Ouled Yaïch", "Bougara", "Mouzaïa"] },
  { code: "10", name: "Bouira", communes: ["Bouira", "Lakhdaria", "Sour El Ghozlane", "M'Chedallah", "Aïn Bessem"] },
  { code: "11", name: "Tamanrasset", communes: ["Tamanrasset", "In Salah", "In Guezzam", "Abalessa"] },
  { code: "12", name: "Tébessa", communes: ["Tébessa", "Bir El Ater", "Cheria", "El Aouinet", "Morsott"] },
  { code: "13", name: "Tlemcen", communes: ["Tlemcen", "Maghnia", "Ghazaouet", "Remchi", "Sebdou", "Chetouane"] },
  { code: "14", name: "Tiaret", communes: ["Tiaret", "Sougueur", "Frenda", "Ksar Chellala", "Mahdia"] },
  { code: "15", name: "Tizi Ouzou", communes: ["Tizi Ouzou", "Azazga", "Draâ Ben Khedda", "Tigzirt", "Larbaâ Nath Irathen", "Boghni", "Azeffoun"] },
  { code: "16", name: "Alger", communes: ["Alger Centre", "Bab Ezzouar", "El Harrach", "Hussein Dey", "Kouba", "Bir Mourad Raïs", "Chéraga", "Draria", "Dar El Beïda", "Bordj El Kiffan", "Baraki", "Birtouta", "Rouiba", "Zéralda", "Aïn Benian", "El Biar", "Bologhine", "Hydra", "Reghaïa", "Staoueli"] },
  { code: "17", name: "Djelfa", communes: ["Djelfa", "Aïn Oussera", "Messaad", "Hassi Bahbah", "El Idrissia"] },
  { code: "18", name: "Jijel", communes: ["Jijel", "Taher", "El Milia", "Chekfa", "El Aouana"] },
  { code: "19", name: "Sétif", communes: ["Sétif", "El Eulma", "Aïn Oulmène", "Bougaa", "Aïn Arnat", "Bouandas"] },
  { code: "20", name: "Saïda", communes: ["Saïda", "Aïn El Hadjar", "Ouled Brahim", "Youb"] },
  { code: "21", name: "Skikda", communes: ["Skikda", "Collo", "Azzaba", "El Harrouch", "Tamalous"] },
  { code: "22", name: "Sidi Bel Abbès", communes: ["Sidi Bel Abbès", "Telagh", "Ras El Ma", "Sfisef", "Ben Badis"] },
  { code: "23", name: "Annaba", communes: ["Annaba", "El Bouni", "El Hadjar", "Berrahal", "Aïn Berda", "Sidi Amar"] },
  { code: "24", name: "Guelma", communes: ["Guelma", "Oued Zenati", "Bouchegouf", "Héliopolis", "Kalaa"] },
  { code: "25", name: "Constantine", communes: ["Constantine", "El Khroub", "Aïn Smara", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef"] },
  { code: "26", name: "Médéa", communes: ["Médéa", "Berrouaghia", "Ksar El Boukhari", "Tablat", "Beni Slimane"] },
  { code: "27", name: "Mostaganem", communes: ["Mostaganem", "Aïn Tédelès", "Sidi Ali", "Hassi Mameche", "Bouguirat"] },
  { code: "28", name: "M'Sila", communes: ["M'Sila", "Bou Saâda", "Sidi Aïssa", "Aïn El Melh", "Magra"] },
  { code: "29", name: "Mascara", communes: ["Mascara", "Sig", "Mohammadia", "Tighennif", "Bouhanifia"] },
  { code: "30", name: "Ouargla", communes: ["Ouargla", "Hassi Messaoud", "Touggourt", "N'Goussa", "Rouissat"] },
  { code: "31", name: "Oran", communes: ["Oran", "Bir El Djir", "Es Senia", "Aïn El Turk", "Arzew", "Gdyel", "Bethioua", "Misserghin"] },
  { code: "32", name: "El Bayadh", communes: ["El Bayadh", "Bougtoub", "Brezina", "Labiodh Sidi Cheikh"] },
  { code: "33", name: "Illizi", communes: ["Illizi", "Djanet", "In Amenas"] },
  { code: "34", name: "Bordj Bou Arreridj", communes: ["Bordj Bou Arreridj", "Ras El Oued", "Mansoura", "El Achir", "Bordj Zemoura"] },
  { code: "35", name: "Boumerdès", communes: ["Boumerdès", "Boudouaou", "Dellys", "Bordj Menaïel", "Khemis El Khechna", "Thénia"] },
  { code: "36", name: "El Tarf", communes: ["El Tarf", "El Kala", "Dréan", "Ben M'Hidi", "Bouhadjar"] },
  { code: "37", name: "Tindouf", communes: ["Tindouf", "Oum El Assel"] },
  { code: "38", name: "Tissemsilt", communes: ["Tissemsilt", "Théniet El Had", "Bordj Bou Naama", "Lardjem"] },
  { code: "39", name: "El Oued", communes: ["El Oued", "Guemar", "Robbah", "Debila", "Magrane"] },
  { code: "40", name: "Khenchela", communes: ["Khenchela", "Kais", "Chechar", "El Hamma", "Bouhmama"] },
  { code: "41", name: "Souk Ahras", communes: ["Souk Ahras", "Sedrata", "M'Daourouch", "Taoura"] },
  { code: "42", name: "Tipaza", communes: ["Tipaza", "Cherchell", "Koléa", "Hadjout", "Fouka", "Bou Ismaïl"] },
  { code: "43", name: "Mila", communes: ["Mila", "Chelghoum Laïd", "Ferdjioua", "Grarem Gouga", "Tadjenanet"] },
  { code: "44", name: "Aïn Defla", communes: ["Aïn Defla", "Khemis Miliana", "Miliana", "El Attaf", "Djelida"] },
  { code: "45", name: "Naâma", communes: ["Naâma", "Mécheria", "Aïn Sefra", "Moghrar"] },
  { code: "46", name: "Aïn Témouchent", communes: ["Aïn Témouchent", "Hammam Bouhadjar", "Beni Saf", "El Malah"] },
  { code: "47", name: "Ghardaïa", communes: ["Ghardaïa", "Metlili", "Berriane", "El Menia", "Guerrara"] },
  { code: "48", name: "Relizane", communes: ["Relizane", "Oued Rhiou", "Mazouna", "Zemmoura", "Ammi Moussa"] },
  { code: "49", name: "Timimoun", communes: ["Timimoun", "Aougrout", "Charouine"] },
  { code: "50", name: "Bordj Badji Mokhtar", communes: ["Bordj Badji Mokhtar", "Timiaouine"] },
  { code: "51", name: "Ouled Djellal", communes: ["Ouled Djellal", "Sidi Khaled", "Doucen"] },
  { code: "52", name: "Béni Abbès", communes: ["Béni Abbès", "Igli", "Kerzaz"] },
  { code: "53", name: "In Salah", communes: ["In Salah", "Foggaret Ezzoua"] },
  { code: "54", name: "In Guezzam", communes: ["In Guezzam", "Tin Zaouatine"] },
  { code: "55", name: "Touggourt", communes: ["Touggourt", "Témacine", "Megarine", "El Hadjira"] },
  { code: "56", name: "Djanet", communes: ["Djanet", "Bordj El Haouas"] },
  { code: "57", name: "El M'Ghair", communes: ["El M'Ghair", "Djamaa", "Sidi Khelil"] },
  { code: "58", name: "El Meniaa", communes: ["El Meniaa", "Hassi Gara"] },
];

export function communesOf(wilayaName: string): string[] {
  return WILAYAS.find((w) => w.name === wilayaName)?.communes ?? [];
}
