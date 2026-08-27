/**
 * Grille tarifaire NOEST Express, au départ de Tizi Ouzou.
 *
 * Saisie depuis la grille fournie par le transporteur (dossier
 * « NOEST DILEVRY TARIF »). Les montants sont en dinars, par colis.
 *
 * NOEST dessert 55 des 58 wilayas : Bordj Badji Mokhtar (50), In Guezzam (54)
 * et Djanet (56) sont absentes de la grille — le formulaire le dit au client
 * au lieu de lui afficher un prix qui n'existe pas.
 *
 * Ces prix sont facturés au vendeur ; ils sont répercutés tels quels au
 * client. Les modifier ici les met à jour partout.
 */

export interface NoestRate {
  /** livraison à l'adresse du client */
  domicile: number;
  /** retrait au bureau NOEST le plus proche */
  stopdesk: number;
}

/** Clé = code wilaya sur deux chiffres. */
export const NOEST_RATES: Record<string, NoestRate> = {
  "01": { domicile: 1400, stopdesk: 900 },
  "02": { domicile: 900, stopdesk: 450 },
  "03": { domicile: 950, stopdesk: 600 },
  "04": { domicile: 900, stopdesk: 450 },
  "05": { domicile: 900, stopdesk: 450 },
  "06": { domicile: 800, stopdesk: 450 },
  "07": { domicile: 950, stopdesk: 550 },
  "08": { domicile: 1200, stopdesk: 600 },
  "09": { domicile: 700, stopdesk: 450 },
  "10": { domicile: 800, stopdesk: 450 },
  "11": { domicile: 1850, stopdesk: 900 },
  "12": { domicile: 900, stopdesk: 550 },
  "13": { domicile: 900, stopdesk: 500 },
  "14": { domicile: 950, stopdesk: 550 },
  "15": { domicile: 800, stopdesk: 450 },
  "16": { domicile: 500, stopdesk: 450 },
  "17": { domicile: 950, stopdesk: 500 },
  "18": { domicile: 900, stopdesk: 450 },
  "19": { domicile: 800, stopdesk: 450 },
  "20": { domicile: 900, stopdesk: 450 },
  "21": { domicile: 900, stopdesk: 450 },
  "22": { domicile: 900, stopdesk: 450 },
  "23": { domicile: 900, stopdesk: 450 },
  "24": { domicile: 900, stopdesk: 450 },
  "25": { domicile: 800, stopdesk: 450 },
  "26": { domicile: 800, stopdesk: 450 },
  "27": { domicile: 900, stopdesk: 450 },
  "28": { domicile: 950, stopdesk: 500 },
  "29": { domicile: 900, stopdesk: 550 },
  "30": { domicile: 950, stopdesk: 600 },
  "31": { domicile: 800, stopdesk: 450 },
  "32": { domicile: 1100, stopdesk: 600 },
  "33": { domicile: 1900, stopdesk: 1100 },
  "34": { domicile: 800, stopdesk: 450 },
  "35": { domicile: 700, stopdesk: 450 },
  "36": { domicile: 900, stopdesk: 450 },
  "37": { domicile: 1700, stopdesk: 1000 },
  "38": { domicile: 950, stopdesk: 450 },
  "39": { domicile: 1100, stopdesk: 500 },
  "40": { domicile: 900, stopdesk: 450 },
  "41": { domicile: 900, stopdesk: 450 },
  "42": { domicile: 700, stopdesk: 450 },
  "43": { domicile: 900, stopdesk: 450 },
  "44": { domicile: 900, stopdesk: 450 },
  "45": { domicile: 1000, stopdesk: 600 },
  "46": { domicile: 900, stopdesk: 550 },
  "47": { domicile: 950, stopdesk: 600 },
  "48": { domicile: 900, stopdesk: 450 },
  "49": { domicile: 1500, stopdesk: 900 },
  "51": { domicile: 1100, stopdesk: 600 },
  "52": { domicile: 1250, stopdesk: 600 },
  "53": { domicile: 1750, stopdesk: 900 },
  "55": { domicile: 1100, stopdesk: 600 },
  "57": { domicile: 1100, stopdesk: 600 },
  "58": { domicile: 1100, stopdesk: 600 },
};

/** Tarif d'une wilaya, ou `null` si NOEST ne la dessert pas. */
export function noestRate(wilayaCode: string): NoestRate | null {
  return NOEST_RATES[wilayaCode] ?? null;
}
