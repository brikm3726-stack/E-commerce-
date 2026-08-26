import { SHIPPING } from "@/data/site";

/** Pages d'aide. Ajouter un sujet = ajouter une entrée ici, la route et le
 *  sitemap suivent automatiquement. */

export interface HelpSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface HelpTopic {
  slug: string;
  title: string;
  eyebrow: string;
  description: string;
  sections: HelpSection[];
  /** questions/réponses, exposées aussi en données structurées FAQ */
  faq?: { question: string; answer: string }[];
}

export const HELP_TOPICS: HelpTopic[] = [
  {
    slug: "livraison",
    title: "Livraison",
    eyebrow: "Aide",
    description:
      "Délais, tarifs et zones desservies. Nous livrons dans les 58 wilayas, à domicile ou au bureau du transporteur.",
    sections: [
      {
        heading: "Délais",
        paragraphs: [
          "Votre commande est expédiée sous 24 h ouvrées après l’appel de confirmation. Comptez ensuite 48 à 72 h de transport selon la wilaya, un peu plus pour le grand Sud.",
          "Nous ne lançons jamais une expédition sans vous avoir eu au téléphone : cela évite les colis retournés et les frais inutiles.",
        ],
      },
      {
        heading: "Tarifs",
        bullets: [
          `Livraison à domicile : ${SHIPPING.domicile} DA`,
          `Retrait au bureau du transporteur : ${SHIPPING.bureau} DA`,
          `Livraison offerte à partir de ${SHIPPING.freeFrom} DA d’achat`,
        ],
      },
      {
        heading: "Zones desservies",
        paragraphs: [
          "Les 58 wilayas sont couvertes. Pour les communes éloignées, le transporteur peut proposer un retrait au bureau le plus proche — nous vous prévenons lors de l’appel de confirmation.",
        ],
      },
    ],
    faq: [
      {
        question: "Puis-je être livré le jour même à Alger ?",
        answer:
          "C’est possible sur Alger centre selon l’heure de la commande. Appelez-nous pour vérifier la faisabilité avant de valider.",
      },
      {
        question: "Que se passe-t-il si je suis absent à la livraison ?",
        answer:
          "Le livreur vous rappelle et propose un second passage. Au-delà de deux tentatives, le colis revient chez nous et la commande est annulée sans frais.",
      },
    ],
  },
  {
    slug: "retours",
    title: "Retours & échanges",
    eyebrow: "Aide",
    description:
      "La pointure ne va pas ? L’échange est possible sous 48 h après réception, dans la limite du stock disponible.",
    sections: [
      {
        heading: "Conditions",
        bullets: [
          "Demande formulée dans les 48 h suivant la réception",
          "Paire non portée à l’extérieur, semelle propre",
          "Emballage d’origine conservé",
          "Échange soumis à la disponibilité de la pointure demandée",
        ],
      },
      {
        heading: "Comment procéder",
        paragraphs: [
          "Appelez-nous ou écrivez-nous sur WhatsApp avec votre référence de commande. Nous vérifions ensemble le stock de la pointure souhaitée, puis nous organisons l’échange avec le transporteur.",
          "Les frais de retour sont à votre charge, sauf en cas d’erreur de notre part sur le modèle, le coloris ou la pointure expédiée.",
        ],
      },
      {
        heading: "Remboursement",
        paragraphs: [
          "Le stock étant limité à une paire par pointure, l’échange n’est pas toujours possible. Dans ce cas, la commande est remboursée intégralement, hors frais de livraison déjà engagés.",
        ],
      },
    ],
  },
  {
    slug: "guide-des-tailles",
    title: "Guide des tailles",
    eyebrow: "Aide",
    description:
      "Le modèle McQUENNE chausse normalement. Prenez votre pointure habituelle, et la plus grande en cas d’hésitation.",
    sections: [
      {
        heading: "Mesurer son pied",
        bullets: [
          "Posez le pied sur une feuille, talon contre le mur",
          "Marquez l’extrémité du plus long orteil",
          "Mesurez la distance en centimètres",
          "Mesurez de préférence le soir, quand le pied est légèrement gonflé",
        ],
      },
      {
        heading: "Correspondances",
        bullets: [
          "39 → 24,5 cm",
          "40 → 25,0 cm",
          "41 → 25,5 cm",
          "42 → 26,5 cm",
          "43 → 27,0 cm",
          "44 → 28,0 cm",
          "45 → 28,5 cm",
        ],
      },
      {
        heading: "Conseil",
        paragraphs: [
          "La semelle surélevée du McQUENNE ajoute environ 4 cm de hauteur sans modifier la chausse. Si vous portez des chaussettes épaisses, prenez la pointure au-dessus.",
        ],
      },
    ],
  },
  {
    slug: "faq",
    title: "Questions fréquentes",
    eyebrow: "Aide",
    description: "Les réponses aux questions qui reviennent le plus souvent.",
    sections: [],
    faq: [
      {
        question: "Faut-il payer avant la livraison ?",
        answer:
          "Non. Le paiement se fait exclusivement à la réception du colis, en espèces, entre vos mains et celles du livreur.",
      },
      {
        question: "Les pointures affichées sont-elles vraiment en stock ?",
        answer:
          "Oui. Chaque pointure affichée correspond à une paire physiquement présente chez nous. Dès qu’elle est vendue, elle disparaît du site.",
      },
      {
        question: "Puis-je essayer la paire devant le livreur ?",
        answer:
          "Vous pouvez ouvrir le colis et vérifier le modèle, le coloris et la pointure. L’essayage complet se fait chez vous ; en cas de souci, l’échange reste possible sous 48 h.",
      },
      {
        question: "Livrez-vous dans tout le pays ?",
        answer:
          "Oui, les 58 wilayas sont desservies, à domicile ou au bureau du transporteur selon votre choix.",
      },
      {
        question: "Quand arrivera la collection de vêtements ?",
        answer:
          "Elle est en préparation. Comme pour les sneakers, rien ne sera mis en ligne tant que les pièces ne seront pas reçues et contrôlées.",
      },
      {
        question: "Comment être prévenu d’un réassort ?",
        answer:
          "Écrivez-nous sur WhatsApp en précisant le modèle et la pointure recherchés : nous vous prévenons dès qu’ils reviennent.",
      },
    ],
  },
];

export function getHelpTopic(slug: string): HelpTopic | undefined {
  return HELP_TOPICS.find((topic) => topic.slug === slug);
}
