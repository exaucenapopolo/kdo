const GH = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/refs/heads/main/Photo";

export interface Agent {
  name: string;
  phone: string;
  available: boolean;
}

export interface Boutique {
  id: string;
  ville: string;
  image: string;
  indication: string;
  features: string[];
  agents: Agent[];
  icon: string;
  description: string;
}

export const BOUTIQUES: Boutique[] = [
  {
    id: "bertoua",
    ville: "BERTOUA",
    image: `${GH}/boutique/bertoua.jpg`,
    indication: "Quartier nkolbikon juste après Himalaya bar au niveau de l'immeuble nouvellement construit en carreau...",
    features: ["Matériel informatique", "Service après-vente", "Livraison gratuite"],
    icon: "city",
    description: "Capitale de la région de l'Est",
    agents: [
      { name: "KDO NUMERICA", phone: "681144638", available: true },
      { name: "KDO HORIZON",  phone: "653386735", available: true },
      { name: "KDO ACCESS",   phone: "678338218", available: true },
    ],
  },
  {
    id: "yaounde",
    ville: "YAOUNDÉ",
    image: `${GH}/boutique/Yaound%C3%A9.jpg`,
    indication: "Situés à biscuiterie obili au niveau de l'agence de voyage Vatican. Boutique peinte en orange, juste après l'agence Vatican.",
    features: ["Grand choix", "Experts présents", "Test des produits"],
    icon: "landmark",
    description: "Capitale politique du Cameroun",
    agents: [
      { name: "CHEZ KDO",     phone: "658327321", available: true },
      { name: "KDO TABTOUCH", phone: "672472604", available: true },
    ],
  },
  {
    id: "douala",
    ville: "DOUALA",
    image: `${GH}/boutique/Douala.jpg`,
    indication: "À Akwa derrière Hôtel Douala bar au niveau de la tombe *king akwa*.",
    features: ["Pièces détachées", "Réparation", "Garantie"],
    icon: "anchor",
    description: "Capitale économique du Cameroun",
    agents: [
      { name: "KDO SERVICE", phone: "656312299", available: true },
    ],
  },
  {
    id: "bafoussam",
    ville: "BAFOUSSAM",
    image: `${GH}/boutique/Bafoussam.jpg`,
    indication: "À la pharmacie BINAM, traversez la descente goudronnée. Immeuble en face – première boutique du premier étage.",
    features: ["Ordinateurs", "Accessoires", "Conseils experts"],
    icon: "map-pin",
    description: "Capitale de la région de l'Ouest",
    agents: [
      { name: "Flore", phone: "674056142", available: true },
    ],
  },
  {
    id: "dschang",
    ville: "DSCHANG",
    image: `${GH}/boutique/DCHANG.jpg`,
    indication: "Boutique KDO située au centre-ville de Dschang, facilement accessible depuis la route principale.",
    features: ["Prix compétitifs", "Qualité garantie", "Service client"],
    icon: "book",
    description: "Ville universitaire",
    agents: [
      { name: "KDO TECHNO", phone: "676255068", available: true },
    ],
  },
  {
    id: "maroua",
    ville: "MAROUA",
    image: `${GH}/boutique/Maroua.jpg`,
    indication: "Situés à Domayo carrefour Monsieur le maire en face de la mosquée.",
    features: ["Matériel neuf", "Occasions vérifiées", "Installation"],
    icon: "sun",
    description: "Capitale de l'Extrême-Nord",
    agents: [
      { name: "KDO VISION", phone: "683533234", available: true },
      { name: "KDO SAHEL",  phone: "690280191", available: true },
    ],
  },
  {
    id: "garoua",
    ville: "GAROUA",
    image: `${GH}/boutique/garoua.jpg`,
    indication: "Situés à l'intérieur du village artisanat de Garoua.",
    features: ["Vaste sélection", "Professionnels", "Support technique"],
    icon: "sun",
    description: "Capitale du Nord",
    agents: [
      { name: "Mr Idriss", phone: "692265070", available: true },
    ],
  },
  {
    id: "ngaoundere",
    ville: "NGAOUNDÉRÉ",
    image: `${GH}/boutique/ngaounder%C3%A9.jpg`,
    indication: "Situés à bini dang vers la dépanneuse.",
    features: ["Produits garantis", "Livraison rapide", "Paiement sécurisé"],
    icon: "train",
    description: "Capitale de l'Adamaoua",
    agents: [
      { name: "Maxime", phone: "690072808", available: true },
    ],
  },
];

export const CONTACT_REASONS = [
  { id: "info",  label: "Demande d'informations", icon: "info",         desc: "Renseignements sur nos produits et services" },
  { id: "sav",   label: "Service après-vente",    icon: "tool",         desc: "Réparation, garantie ou assistance technique" },
  { id: "devis", label: "Demande de devis",        icon: "file-text",    desc: "Obtenir un devis personnalisé pour votre projet" },
  { id: "autre", label: "Autre demande",            icon: "message-circle", desc: "Toute autre question ou demande spécifique" },
];
