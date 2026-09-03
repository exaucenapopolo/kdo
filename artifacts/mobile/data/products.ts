import { Product } from "../context/CartContext";

const GH = "https://raw.githubusercontent.com/exaucenapopolo/KDO-SHOP/refs/heads/main/Photo";
const UNS = "https://images.unsplash.com";

export interface ProductDetail extends Product {
  isPromo?: boolean;
  specs?: { label: string; value: string }[];
  fullDescription?: string;
  orders?: number;
  shortSpecs?: string;
}

// ─── IMAGES ORDINATEURS ────────────────────────────────────────────────────────
const LAPTOP_IMGS = [
  `${GH}/Ordinateur/1.jpg`,   `${GH}/Ordinateur/2.jpg`,   `${GH}/Ordinateur/3.jpg`,
  `${GH}/Ordinateur/4.jpg`,   `${GH}/Ordinateur/5.jpg`,   `${GH}/Ordinateur/6.jpg`,
  `${GH}/Ordinateur/7.jpg`,   `${GH}/Ordinateur/8.jpeg`,  `${GH}/Ordinateur/9.jpeg`,
  `${GH}/Ordinateur/10.jpeg`, `${GH}/Ordinateur/11.jpeg`, `${GH}/Ordinateur/12.jpeg`,
  `${GH}/Ordinateur/13.jpeg`, `${GH}/Ordinateur/14.jpeg`, `${GH}/Ordinateur/15.jpeg`,
  `${GH}/Ordinateur/16.jpeg`, `${GH}/Ordinateur/17.jpeg`, `${GH}/Ordinateur/18.jpeg`,
  `${GH}/Ordinateur/19.jpeg`, `${GH}/Ordinateur/20.jpg`,  `${GH}/Ordinateur/21.jpg`,
  `${GH}/Ordinateur/22.jpeg`, `${GH}/Ordinateur/23.jpg`,  `${GH}/Ordinateur/24.jpg`,
  `${GH}/Ordinateur/25.jpg`,  `${GH}/Ordinateur/26.jpeg`, `${GH}/Ordinateur/27.jpeg`,
  `${GH}/Ordinateur/28.jpeg`, `${GH}/Ordinateur/29.jpeg`, `${GH}/Ordinateur/30.jpeg`,
  `${GH}/Ordinateur/31_1.jpeg`,`${GH}/Ordinateur/32_1.jpeg`,`${GH}/Ordinateur/33_1.jpeg`,
  `${GH}/Ordinateur/34_1.jpeg`,`${GH}/Ordinateur/35_1.jpeg`,`${GH}/Ordinateur/36_1.jpeg`,
  `${GH}/Ordinateur/39_1.jpeg`,`${GH}/Ordinateur/42_1.jpeg`,
];

// ─── IMAGES PAR CATÉGORIE (variées) ──────────────────────────────────────────
// Images par catégorie — uniquement des sources vérifiées (GitHub KDO + Unsplash tech confirmés)
const CAT_IMG_POOLS: Record<string, string[]> = {
  // Disques durs — uniquement images KDO confirmées
  disques: [
    `${GH}/disque.png`,
    `${UNS}/photo-1544652478-6653e09f18a2?w=400&q=80`,  // external HDD — vérifié
    `${UNS}/photo-1652978038565-f5d6c42e8c86?w=400&q=80`, // SSD — vérifié
  ],
  // Clés USB
  usb: [
    `${GH}/cle.png`,
    `${UNS}/photo-1659448630994-7be65cc0a14e?w=400&q=80`,  // USB drive — vérifié
  ],
  // Souris
  souris: [
    `${GH}/souris.jpg`,
    `${UNS}/photo-1527814050087-3793815479db?w=400&q=80`,  // gaming mouse — vérifié
    `${UNS}/photo-1527864550417-7fd91fc51a46?w=400&q=80`,  // computer mouse — vérifié
  ],
  // Claviers
  claviers: [
    `${GH}/clavier.jpeg`,
    `${UNS}/photo-1587829741301-dc798b83add3?w=400&q=80`,  // backlit keyboard — vérifié
    `${UNS}/photo-1611532736597-de2d4265fba3?w=400&q=80`,  // keyboard — vérifié
  ],
  // Modems/WiFi
  modems: [
    `${GH}/modems.jpeg`,
    `${UNS}/photo-1606904825846-647eb07f5be2?w=400&q=80`,  // wifi router — vérifié
  ],
  // Ordinateurs de bureau
  desktops: [
    `${GH}/desktops.jpeg`,
    `${UNS}/photo-1593640408182-31c228fb36f4?w=400&q=80`,  // desktop PC — vérifié
    `${UNS}/photo-1547082299-de196ea013d6?w=400&q=80`,     // desktop setup — vérifié
  ],
  // Mémoire RAM
  ram: [
    `${GH}/RAM.png`,
    `${UNS}/photo-1562976540-1502c2145885?w=400&q=80`,  // RAM sticks — vérifié
  ],
  // Antivirus / Sécurité
  antivirus: [
    `${GH}/virus.png`,
    `${UNS}/photo-1563986768609-322da13575f3?w=400&q=80`,  // security lock — vérifié
  ],
  // Projecteurs
  projecteurs: [
    `${GH}/projeteur.jpg`,
    `${UNS}/photo-1522542550221-31fd19575a2d?w=400&q=80`,  // projector — vérifié
    `${UNS}/photo-1558618666-fcd25c85cd64?w=400&q=80`,     // projector beam — vérifié
  ],
  // Téléphones
  phones: [
    `${GH}/phone.jpeg`,
    `${UNS}/photo-1511707171634-5f897ff02aa9?w=400&q=80`,  // smartphone — vérifié
    `${UNS}/photo-1592750475338-74b7b21085ab?w=400&q=80`,  // phone — vérifié
    `${UNS}/photo-1574944985070-8f3ebc6b79d2?w=400&q=80`,  // smartphone — vérifié
  ],
  // Adaptateurs
  adaptateurs: [
    `${GH}/adaptateur.jpeg`,
    `${UNS}/photo-1517420704952-d9f39e95b43e?w=400&q=80`,  // adapter — vérifié
  ],
  // Télévisions
  televisions: [
    `${UNS}/photo-1593359677879-a4bb92f4834b?w=400&q=80`,  // flat TV — vérifié
    `${UNS}/photo-1593642632559-0c6d3fc62b89?w=400&q=80`,  // TV setup — vérifié
    `${UNS}/photo-1461151304267-38535e780c79?w=400&q=80`,  // TV — vérifié
  ],
  // Chargeurs — uniquement GitHub (Unsplash montrait des casques)
  chargeurs: [
    `${GH}/chargeur.png`,
    `${UNS}/photo-1609091839311-d5365f9ff1c5?w=400&q=80`,  // charger cable — vérifié
  ],
  // Sacs & Étuis
  sacs: [
    `${GH}/sacs.png`,
    `${UNS}/photo-1553062407-98eeb64c6a62?w=400&q=80`,  // laptop bag — vérifié
    `${UNS}/photo-1622560480654-d96214fdc887?w=400&q=80`, // laptop backpack — vérifié
  ],
};

function getImage(id: number, category: string): string {
  if (category === "ordinateurs") {
    return LAPTOP_IMGS[(id - 1) % LAPTOP_IMGS.length];
  }
  const pool = CAT_IMG_POOLS[category];
  if (!pool) return `${GH}/89_1.jpg`;
  return pool[(id - 1) % pool.length];
}

// ─── SPECS PAR PRODUIT ────────────────────────────────────────────────────────
const PRODUCT_SPECS: Record<number, { label: string; value: string }[]> = {
  // Ordinateurs portables
  1:  [{ label:"Processeur", value:"Intel Celeron N4020 1.1 GHz" },{ label:"RAM", value:"8 Go LPDDR4" },{ label:"Stockage", value:"128 Go SSD" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel UHD 600" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, HDMI, Jack" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.4 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  2:  [{ label:"Processeur", value:"Intel Core i5-6300U 2.4 GHz" },{ label:"RAM", value:"8 Go DDR4" },{ label:"Stockage", value:"256 Go SSD" },{ label:"Écran", value:"14 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"Intel HD 520" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, DisplayPort, VGA, Smart Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.57 kg" },{ label:"Autonomie", value:"6–8 heures" },{ label:"État", value:"Occasion propre" }],
  3:  [{ label:"Processeur", value:"Intel Celeron N4500 1.1 GHz" },{ label:"RAM", value:"4 Go DDR4" },{ label:"Stockage", value:"256 Go SSD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"Intel UHD Graphics" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"5.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB-C, HDMI, RJ-45" },{ label:"Système", value:"Windows 11 Home 64 bits" },{ label:"Poids", value:"1.7 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Neuf" }],
  4:  [{ label:"Processeur", value:"Intel Core i3-6006U 2.0 GHz" },{ label:"RAM", value:"8 Go DDR4" },{ label:"Stockage", value:"128 Go SSD" },{ label:"Écran", value:"13.3 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 520" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, HDMI, Jack" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.5 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  5:  [{ label:"Processeur", value:"Intel Core i5-5300U 2.3 GHz" },{ label:"RAM", value:"8 Go DDR3L" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"12.5 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"Intel HD 5500" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, DisplayPort, VGA" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.45 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  6:  [{ label:"Processeur", value:"AMD A4-7300B 3.8 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"8 Go SSD (eMMC)" },{ label:"Écran", value:"14 pouces HD 1366×768" },{ label:"Carte graphique", value:"AMD Radeon R3" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, HDMI, VGA" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.9 kg" },{ label:"Autonomie", value:"4–5 heures" },{ label:"État", value:"Occasion propre" }],
  7:  [{ label:"Processeur", value:"AMD E1-1200 1.4 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"250 Go HDD" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"AMD Radeon HD 7310" },{ label:"Wi-Fi", value:"802.11b/g/n" },{ label:"Bluetooth", value:"3.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.5 kg" },{ label:"Autonomie", value:"3–5 heures" },{ label:"État", value:"Occasion propre" }],
  8:  [{ label:"Processeur", value:"Intel Core i7-6600U 2.6 GHz" },{ label:"RAM", value:"16 Go DDR4" },{ label:"Stockage", value:"512 Go SSD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"NVIDIA Quadro M1000M 2 Go" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.1" },{ label:"Webcam", value:"720p + IR" },{ label:"Ports", value:"4×USB 3.0, Thunderbolt, HDMI, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.2 kg" },{ label:"Autonomie", value:"6–8 heures" },{ label:"État", value:"Occasion propre" }],
  9:  [{ label:"Processeur", value:"Intel Core i7-7820HQ 2.9 GHz" },{ label:"RAM", value:"16 Go DDR4" },{ label:"Stockage", value:"512 Go SSD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"NVIDIA GeForce 930MX 2 Go" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"3×USB 3.0, USB-C, HDMI, DisplayPort, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.0 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  10: [{ label:"Processeur", value:"Intel Core i5-3337U 1.8 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"15.5 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"Intel HD 4000 + AMD Radeon" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"3.0" },{ label:"Webcam", value:"2.1 MP intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.4 kg" },{ label:"Autonomie", value:"3–5 heures" },{ label:"État", value:"Occasion propre" }],
  11: [{ label:"Processeur", value:"Intel Core i5-6200U 2.3 GHz" },{ label:"RAM", value:"12 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"AMD Radeon R7 M360 2 Go" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.1" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, 2×USB 2.0, HDMI, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.2 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  12: [{ label:"Processeur", value:"Intel Core i3-6100U 2.3 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"128 Go SSD" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 520" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.5 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  13: [{ label:"Processeur", value:"Intel Celeron N3060 1.6 GHz" },{ label:"RAM", value:"4 Go LPDDR3" },{ label:"Stockage", value:"128 Go SSD (eMMC)" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 400" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, HDMI" },{ label:"Système", value:"Chrome OS / Windows 10" },{ label:"Poids", value:"1.3 kg" },{ label:"Autonomie", value:"9–10 heures" },{ label:"État", value:"Occasion propre" }],
  14: [{ label:"Processeur", value:"AMD A6-8530B 3.0 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"14 pouces HD 1366×768" },{ label:"Carte graphique", value:"AMD Radeon R4" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, VGA, HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.1 kg" },{ label:"Autonomie", value:"4–5 heures" },{ label:"État", value:"Occasion propre" }],
  15: [{ label:"Processeur", value:"Intel Core i7-6820HQ 2.7 GHz" },{ label:"RAM", value:"16 Go DDR4" },{ label:"Stockage", value:"750 Go HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"NVIDIA Quadro M2000M 4 Go" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p + IR" },{ label:"Ports", value:"3×USB 3.0, Thunderbolt, HDMI, DisplayPort" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.3 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  16: [{ label:"Processeur", value:"Intel Celeron N3060 1.6 GHz" },{ label:"RAM", value:"4 Go LPDDR3" },{ label:"Stockage", value:"128 Go SSD (eMMC)" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 400" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI" },{ label:"Système", value:"Windows 10 Home" },{ label:"Poids", value:"1.3 kg" },{ label:"Autonomie", value:"8–10 heures" },{ label:"État", value:"Occasion propre" }],
  17: [{ label:"Processeur", value:"Intel Celeron N2940 1.83 GHz Quad-Core" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"320 Go HDD" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD Graphics" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.5 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  18: [{ label:"Processeur", value:"Intel Core i5-8350U 1.7 GHz (Turbo 3.6 GHz)" },{ label:"RAM", value:"8 Go DDR4" },{ label:"Stockage", value:"256 Go SSD" },{ label:"Écran", value:"14 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"Intel UHD 620" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.1" },{ label:"Webcam", value:"720p + IR" },{ label:"Ports", value:"2×USB 3.0, 2×USB-C/Thunderbolt, HDMI, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.58 kg" },{ label:"Autonomie", value:"8–10 heures" },{ label:"État", value:"Occasion propre" }],
  19: [{ label:"Processeur", value:"AMD A6-8530B 3.0 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"AMD Radeon R5" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, VGA, HDMI, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.0 kg" },{ label:"Autonomie", value:"4–5 heures" },{ label:"État", value:"Occasion propre" }],
  20: [{ label:"Processeur", value:"Intel Core i5-7300U 2.6 GHz" },{ label:"RAM", value:"8 Go DDR4" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"12.5 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"Intel HD 620" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.1" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, DisplayPort, VGA, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.3 kg" },{ label:"Autonomie", value:"7–9 heures" },{ label:"État", value:"Occasion propre" }],
  21: [{ label:"Processeur", value:"Intel Core i5-2520M 2.5 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"15.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 3000" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"3.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, USB 2.0, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.4 kg" },{ label:"Autonomie", value:"3–4 heures" },{ label:"État", value:"Occasion propre" }],
  22: [{ label:"Processeur", value:"Intel Celeron N3350 Quad-Core 1.1 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"128 Go SSD (eMMC)" },{ label:"Écran", value:"11.6 pouces HD Tactile" },{ label:"Carte graphique", value:"Intel HD 500" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, micro-HDMI, SD Card" },{ label:"Système", value:"Windows 10 Home" },{ label:"Poids", value:"1.4 kg" },{ label:"Autonomie", value:"8–10 heures" },{ label:"État", value:"Occasion propre" }],
  23: [{ label:"Processeur", value:"Intel Core i5-7200U 2.5 GHz" },{ label:"RAM", value:"8 Go DDR4" },{ label:"Stockage", value:"1 To HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080 anti-reflet" },{ label:"Carte graphique", value:"NVIDIA GeForce 940MX 4 Go" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"3×USB 3.0, HDMI, SD Card, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.98 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  24: [{ label:"Processeur", value:"Intel Core i5-4300U 1.9 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"14 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 4400" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, DisplayPort, VGA, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.6 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  25: [{ label:"Processeur", value:"Intel Atom x5-E3940 1.6 GHz Quad-Core" },{ label:"RAM", value:"4 Go LPDDR4" },{ label:"Stockage", value:"128 Go SSD (eMMC)" },{ label:"Écran", value:"11.6 pouces HD Tactile 360°" },{ label:"Carte graphique", value:"Intel HD 500" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.1" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB-C, micro-HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.4 kg" },{ label:"Autonomie", value:"6–8 heures" },{ label:"État", value:"Occasion propre" }],
  26: [{ label:"Processeur", value:"Intel Atom x5-Z8350 1.44 GHz" },{ label:"RAM", value:"4 Go DDR3L" },{ label:"Stockage", value:"128 Go SSD (eMMC)" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 400" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.4 kg" },{ label:"Autonomie", value:"6–8 heures" },{ label:"État", value:"Occasion propre" }],
  27: [{ label:"Processeur", value:"Intel Core i3-2310M 2.1 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"Intel HD 3000" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"3.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, USB 2.0, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.4 kg" },{ label:"Autonomie", value:"3–5 heures" },{ label:"État", value:"Occasion propre" }],
  28: [{ label:"Processeur", value:"Intel Atom N455 1.66 GHz" },{ label:"RAM", value:"2 Go DDR3" },{ label:"Stockage", value:"250 Go HDD" },{ label:"Écran", value:"10.1 pouces WSVGA 1024×600" },{ label:"Carte graphique", value:"Intel GMA 3150" },{ label:"Wi-Fi", value:"802.11b/g/n" },{ label:"Bluetooth", value:"Non" },{ label:"Webcam", value:"0.3 MP intégrée" },{ label:"Ports", value:"2×USB 2.0, VGA, SD Card" },{ label:"Système", value:"Windows 10 Pro (32 bits)" },{ label:"Poids", value:"1.3 kg" },{ label:"Autonomie", value:"3–5 heures" },{ label:"État", value:"Occasion propre" }],
  29: [{ label:"Processeur", value:"Intel Core i7-4600M 2.9 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"14 pouces HD 1366×768" },{ label:"Carte graphique", value:"Intel HD 4600" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, DisplayPort, VGA, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.9 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  30: [{ label:"Processeur", value:"Intel Core i5-8265U 1.6 GHz (Turbo 3.9 GHz)" },{ label:"RAM", value:"16 Go DDR4" },{ label:"Stockage", value:"256 Go SSD NVMe" },{ label:"Écran", value:"14 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"Intel UHD 620" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"5.0" },{ label:"Webcam", value:"720p + IR" },{ label:"Ports", value:"2×USB 3.0, USB-C/Thunderbolt, HDMI, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.48 kg" },{ label:"Autonomie", value:"10–13 heures" },{ label:"État", value:"Occasion propre" }],
  31: [{ label:"Processeur", value:"AMD Ryzen 5 PRO 4650U 2.1 GHz (Turbo 4.0 GHz)" },{ label:"RAM", value:"16 Go DDR4 3200 MHz" },{ label:"Stockage", value:"512 Go SSD NVMe" },{ label:"Écran", value:"14 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"AMD Radeon RX Vega 6" },{ label:"Wi-Fi", value:"Wi-Fi 6 (802.11ax)" },{ label:"Bluetooth", value:"5.0" },{ label:"Webcam", value:"720p + IR" },{ label:"Ports", value:"2×USB-A 3.0, 2×USB-C, HDMI, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.44 kg" },{ label:"Autonomie", value:"12–15 heures" },{ label:"État", value:"Occasion propre" }],
  32: [{ label:"Processeur", value:"AMD A2-3305M 1.9 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"11.6 pouces HD 1366×768" },{ label:"Carte graphique", value:"AMD Radeon HD 6310" },{ label:"Wi-Fi", value:"802.11b/g/n" },{ label:"Bluetooth", value:"3.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.5 kg" },{ label:"Autonomie", value:"3–5 heures" },{ label:"État", value:"Occasion propre" }],
  33: [{ label:"Processeur", value:"Intel Core i5-4300M 2.6 GHz" },{ label:"RAM", value:"8 Go DDR3" },{ label:"Stockage", value:"1 To HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080" },{ label:"Carte graphique", value:"AMD Radeon HD 8790M 1 Go" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"2×USB 3.0, USB 2.0, HDMI, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.5 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  34: [{ label:"Processeur", value:"Intel Core i7-3517U 1.9 GHz (Turbo 3.0 GHz)" },{ label:"RAM", value:"16 Go DDR3L" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Écran", value:"13.3 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"Intel HD 4000" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI, DisplayPort" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.38 kg" },{ label:"Autonomie", value:"7–9 heures" },{ label:"État", value:"Occasion propre" }],
  35: [{ label:"Processeur", value:"Intel Celeron N2940 1.83 GHz Quad-Core" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"320 Go HDD" },{ label:"Écran", value:"11.6 pouces HD Tactile 360°" },{ label:"Carte graphique", value:"Intel HD Graphics" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.5 kg" },{ label:"Autonomie", value:"4–6 heures" },{ label:"État", value:"Occasion propre" }],
  36: [{ label:"Processeur", value:"Intel Core i5-6300U 2.4 GHz (Turbo 3.0 GHz)" },{ label:"RAM", value:"8 Go DDR4" },{ label:"Stockage", value:"256 Go SSD" },{ label:"Écran", value:"14 pouces FHD 1920×1080 IPS anti-reflet" },{ label:"Carte graphique", value:"Intel HD 520" },{ label:"Wi-Fi", value:"802.11ac" },{ label:"Bluetooth", value:"4.2" },{ label:"Webcam", value:"720p + IR" },{ label:"Ports", value:"2×USB 3.0, DisplayPort, VGA, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.57 kg" },{ label:"Autonomie", value:"8–10 heures" },{ label:"État", value:"Occasion propre" }],
  37: [{ label:"Processeur", value:"Intel Core i7-4700MQ 2.4 GHz Quad-Core" },{ label:"RAM", value:"16 Go DDR3" },{ label:"Stockage", value:"1 To HDD" },{ label:"Écran", value:"15.6 pouces FHD 1920×1080 IPS" },{ label:"Carte graphique", value:"NVIDIA Quadro K2100M 2 Go" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"4×USB 3.0, Thunderbolt, HDMI, DisplayPort, SD Card" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"2.7 kg" },{ label:"Autonomie", value:"5–7 heures" },{ label:"État", value:"Occasion propre" }],
  38: [{ label:"Processeur", value:"Intel Core i3-5010U 2.1 GHz" },{ label:"RAM", value:"8 Go DDR3L" },{ label:"Stockage", value:"128 Go SSD" },{ label:"Écran", value:"11.6 pouces FHD 1920×1080 Tactile" },{ label:"Carte graphique", value:"Intel HD 5500" },{ label:"Wi-Fi", value:"802.11n" },{ label:"Bluetooth", value:"4.0" },{ label:"Webcam", value:"720p intégrée" },{ label:"Ports", value:"USB 3.0, USB 2.0, HDMI" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Poids", value:"1.3 kg" },{ label:"Autonomie", value:"6–8 heures" },{ label:"État", value:"Occasion propre" }],
  // Disques durs (39-58)
  39: [{ label:"Marque", value:"TOSHIBA" },{ label:"Capacité", value:"500 Go" },{ label:"Type", value:"HDD Externe" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Format", value:"2.5 pouces" },{ label:"Compatible", value:"PC, Mac, TV, Console" },{ label:"État", value:"Neuf" }],
  40: [{ label:"Marque", value:"SEAGATE" },{ label:"Capacité", value:"1 To (1000 Go)" },{ label:"Type", value:"HDD Externe" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Format", value:"2.5 pouces" },{ label:"Compatible", value:"PC, Mac, TV, Console" },{ label:"État", value:"Neuf" }],
  41: [{ label:"Marque", value:"SEAGATE" },{ label:"Capacité", value:"2 To (2000 Go)" },{ label:"Type", value:"HDD Externe" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Format", value:"2.5 pouces" },{ label:"Compatible", value:"PC, Mac, TV, Console" },{ label:"État", value:"Neuf" }],
  42: [{ label:"Marque", value:"TOSHIBA" },{ label:"Capacité", value:"1 To (1000 Go)" },{ label:"Type", value:"HDD Externe Canvio" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Format", value:"2.5 pouces" },{ label:"Compatible", value:"PC, Mac, TV" },{ label:"État", value:"Neuf" }],
  43: [{ label:"Marque", value:"TOSHIBA" },{ label:"Capacité", value:"1 To (1000 Go)" },{ label:"Type", value:"HDD Externe" },{ label:"Interface", value:"USB 2.0" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Format", value:"2.5 pouces" },{ label:"Compatible", value:"PC, Mac" },{ label:"État", value:"Occasion propre" }],
  44: [{ label:"Marque", value:"TOSHIBA" },{ label:"Capacité", value:"2 To (2000 Go)" },{ label:"Type", value:"HDD Externe Canvio" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Format", value:"2.5 pouces" },{ label:"Compatible", value:"PC, Mac, TV" },{ label:"État", value:"Neuf" }],
  45: [{ label:"Marque", value:"Générique" },{ label:"Capacité", value:"2 To (2000 Go)" },{ label:"Type", value:"SSD Portable" },{ label:"Interface", value:"USB 3.1 Gen 2" },{ label:"Vitesse lecture", value:"540 Mo/s" },{ label:"Vitesse écriture", value:"500 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  46: [{ label:"Marque", value:"VERBATIM" },{ label:"Capacité", value:"512 Go" },{ label:"Type", value:"SSD Externe" },{ label:"Interface", value:"USB 3.2 Gen 1" },{ label:"Vitesse lecture", value:"500 Mo/s" },{ label:"Vitesse écriture", value:"400 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  47: [{ label:"Marque", value:"ADDLINK" },{ label:"Capacité", value:"1 To (1000 Go)" },{ label:"Type", value:"SSD Externe T70" },{ label:"Interface", value:"USB 3.1 Gen 2" },{ label:"Vitesse lecture", value:"550 Mo/s" },{ label:"Vitesse écriture", value:"500 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  48: [{ label:"Marque", value:"ADDLINK" },{ label:"Capacité", value:"2 To (2000 Go)" },{ label:"Type", value:"SSD Externe T70" },{ label:"Interface", value:"USB 3.1 Gen 2" },{ label:"Vitesse lecture", value:"550 Mo/s" },{ label:"Vitesse écriture", value:"500 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  49: [{ label:"Marque", value:"SAMSUNG" },{ label:"Capacité", value:"256 Go" },{ label:"Type", value:"SSD Externe T7" },{ label:"Interface", value:"USB 3.2 Gen 2" },{ label:"Vitesse lecture", value:"1050 Mo/s" },{ label:"Vitesse écriture", value:"1000 Mo/s" },{ label:"Format", value:"Ultra-compact 51g" },{ label:"État", value:"Neuf" }],
  50: [{ label:"Marque", value:"SAMSUNG" },{ label:"Capacité", value:"1 To (1000 Go)" },{ label:"Type", value:"SSD Externe T7" },{ label:"Interface", value:"USB 3.2 Gen 2" },{ label:"Vitesse lecture", value:"1050 Mo/s" },{ label:"Vitesse écriture", value:"1000 Mo/s" },{ label:"Format", value:"Ultra-compact 58g" },{ label:"État", value:"Neuf" }],
  51: [{ label:"Marque", value:"ADDLINK" },{ label:"Capacité", value:"512 Go" },{ label:"Type", value:"SSD Externe T70" },{ label:"Interface", value:"USB 3.1 Gen 2" },{ label:"Vitesse lecture", value:"550 Mo/s" },{ label:"Vitesse écriture", value:"500 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  52: [{ label:"Marque", value:"ADDLINK" },{ label:"Capacité", value:"256 Go" },{ label:"Type", value:"SSD Externe" },{ label:"Interface", value:"USB 3.1 Gen 1" },{ label:"Vitesse lecture", value:"400 Mo/s" },{ label:"Vitesse écriture", value:"350 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  53: [{ label:"Marque", value:"UNION MEMORY" },{ label:"Capacité", value:"256 Go" },{ label:"Type", value:"SSD Externe" },{ label:"Interface", value:"USB 3.1 Gen 1" },{ label:"Vitesse lecture", value:"400 Mo/s" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Neuf" }],
  54: [{ label:"Marque", value:"WESTERN DIGITAL" },{ label:"Capacité", value:"500 Go" },{ label:"Type", value:"HDD Interne 2.5\"" },{ label:"Interface", value:"SATA III 6Gbps" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Cache", value:"16 Mo" },{ label:"Compatible", value:"Laptop, PS4, Xbox" },{ label:"État", value:"Occasion propre" }],
  55: [{ label:"Marque", value:"WESTERN DIGITAL" },{ label:"Capacité", value:"320 Go" },{ label:"Type", value:"HDD Interne 2.5\"" },{ label:"Interface", value:"SATA II" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Compatible", value:"Laptop" },{ label:"État", value:"Occasion propre" }],
  56: [{ label:"Marque", value:"WESTERN DIGITAL" },{ label:"Capacité", value:"250 Go" },{ label:"Type", value:"HDD Interne 2.5\"" },{ label:"Interface", value:"SATA II" },{ label:"Vitesse rotation", value:"5400 RPM" },{ label:"Compatible", value:"Laptop" },{ label:"État", value:"Occasion propre" }],
  57: [{ label:"Type", value:"Boîtier Disque Externe" },{ label:"Compatible", value:"HDD/SSD 2.5\"" },{ label:"Interface", value:"USB 3.0" },{ label:"SATA", value:"SATA I/II/III" },{ label:"Matière", value:"Aluminium" },{ label:"État", value:"Neuf" }],
  58: [{ label:"Marque", value:"TOSHIBA" },{ label:"Capacité", value:"500 Go" },{ label:"Type", value:"HDD Interne 3.5\"" },{ label:"Interface", value:"SATA III" },{ label:"Vitesse rotation", value:"7200 RPM" },{ label:"Cache", value:"32 Mo" },{ label:"Compatible", value:"Desktop, NAS" },{ label:"État", value:"Occasion propre" }],
  // Clés USB
  59: [{ label:"Marque", value:"FASTER" },{ label:"Capacité", value:"64 Go" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse lecture", value:"130 Mo/s" },{ label:"Vitesse écriture", value:"50 Mo/s" },{ label:"Matière", value:"Métal" },{ label:"État", value:"Neuf" }],
  60: [{ label:"Marque", value:"FASTER" },{ label:"Capacité", value:"32 Go" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse lecture", value:"130 Mo/s" },{ label:"Vitesse écriture", value:"40 Mo/s" },{ label:"Matière", value:"Métal" },{ label:"État", value:"Neuf" }],
  61: [{ label:"Marque", value:"Kioxia (ex-Toshiba)" },{ label:"Capacité", value:"32 Go" },{ label:"Interface", value:"USB 3.2 Gen 1" },{ label:"Vitesse lecture", value:"100 Mo/s" },{ label:"Matière", value:"Plastique ABS" },{ label:"État", value:"Neuf" }],
  62: [{ label:"Marque", value:"Kioxia (ex-Toshiba)" },{ label:"Capacité", value:"64 Go" },{ label:"Interface", value:"USB 3.2 Gen 1" },{ label:"Vitesse lecture", value:"100 Mo/s" },{ label:"Matière", value:"Plastique ABS" },{ label:"État", value:"Neuf" }],
  63: [{ label:"Marque", value:"FASTER" },{ label:"Capacité", value:"64 Go" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse lecture", value:"150 Mo/s" },{ label:"Vitesse écriture", value:"60 Mo/s" },{ label:"Matière", value:"Métal" },{ label:"État", value:"Neuf" }],
  64: [{ label:"Marque", value:"IMATION" },{ label:"Capacité", value:"32 Go" },{ label:"Interface", value:"USB 2.0" },{ label:"Vitesse lecture", value:"25 Mo/s" },{ label:"Matière", value:"Plastique" },{ label:"État", value:"Neuf" }],
  65: [{ label:"Type", value:"Flash Drive USB" },{ label:"Capacité", value:"32 Go" },{ label:"Interface", value:"USB 3.0" },{ label:"Vitesse lecture", value:"80 Mo/s" },{ label:"Design", value:"Rétractable" },{ label:"État", value:"Neuf" }],
  // Souris
  66: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB nano 2.4 GHz" },{ label:"DPI", value:"1600 DPI ajustable" },{ label:"Boutons", value:"3 boutons" },{ label:"Autonomie", value:"12 mois" },{ label:"Compatible", value:"Windows, Mac, Linux" },{ label:"État", value:"Neuf" }],
  67: [{ label:"Marque", value:"TRUST" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB nano 2.4 GHz" },{ label:"DPI", value:"1000/1600 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Autonomie", value:"12 mois" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Neuf" }],
  68: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.5 m" },{ label:"DPI", value:"1000 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Compatible", value:"Windows, Mac, Linux" },{ label:"État", value:"Neuf" }],
  69: [{ label:"Marque", value:"GENIUS" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.5 m" },{ label:"DPI", value:"1000 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Neuf" }],
  70: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.5 m" },{ label:"DPI", value:"1200 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Ergonomie", value:"Optique" },{ label:"État", value:"Neuf" }],
  71: [{ label:"Marque", value:"DELL" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.5 m" },{ label:"DPI", value:"800 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Occasion propre" }],
  72: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.8 m" },{ label:"DPI", value:"1200 DPI" },{ label:"Boutons", value:"5 boutons" },{ label:"Défilement", value:"Rapide" },{ label:"État", value:"Neuf" }],
  73: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB nano 2.4 GHz" },{ label:"DPI", value:"2000 DPI" },{ label:"Boutons", value:"6 boutons" },{ label:"Autonomie", value:"18 mois" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Neuf" }],
  74: [{ label:"Marque", value:"LENOVO" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.5 m" },{ label:"DPI", value:"1200 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Occasion propre" }],
  75: [{ label:"Marque", value:"LOGITECH" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB nano Unifying" },{ label:"DPI", value:"1000 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Autonomie", value:"18 mois" },{ label:"Compatible", value:"Windows, Mac, Linux" },{ label:"État", value:"Neuf" }],
  76: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB nano 2.4 GHz" },{ label:"DPI", value:"1600 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Autonomie", value:"15 mois" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Neuf" }],
  77: [{ label:"Marque", value:"SONY" },{ label:"Type", value:"Filaire USB" },{ label:"Câble", value:"1.5 m" },{ label:"DPI", value:"1000 DPI" },{ label:"Boutons", value:"3 boutons" },{ label:"Capteur", value:"Optique" },{ label:"État", value:"Occasion propre" }],
  // Claviers
  78: [{ label:"Marque", value:"LOGITECH" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB Unifying 2.4 GHz" },{ label:"Langue", value:"AZERTY" },{ label:"Rétroéclairage", value:"Non" },{ label:"Pavé numérique", value:"Oui" },{ label:"Autonomie", value:"24 mois" },{ label:"Compatible", value:"Windows, Mac" },{ label:"État", value:"Neuf" }],
  79: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Sans fil" },{ label:"Récepteur", value:"USB 2.4 GHz" },{ label:"Langue", value:"AZERTY" },{ label:"Pavé numérique", value:"Oui" },{ label:"Autonomie", value:"12 mois" },{ label:"Compatible", value:"Windows" },{ label:"État", value:"Neuf" }],
  80: [{ label:"Marque", value:"LOGITECH" },{ label:"Type", value:"Filaire USB" },{ label:"Langue", value:"AZERTY" },{ label:"Pavé numérique", value:"Oui" },{ label:"Touches", value:"Profil bas silencieux" },{ label:"Compatible", value:"Windows, Mac, Linux" },{ label:"État", value:"Neuf" }],
  81: [{ label:"Marque", value:"GAMERS" },{ label:"Type", value:"Sans fil Gaming" },{ label:"Récepteur", value:"USB 2.4 GHz" },{ label:"Langue", value:"QWERTY" },{ label:"Rétroéclairage", value:"RGB multicolore" },{ label:"Touches", value:"Mécaniques" },{ label:"Pavé numérique", value:"Oui" },{ label:"État", value:"Neuf" }],
  82: [{ label:"Marque", value:"GAMERS" },{ label:"Type", value:"Filaire Gaming" },{ label:"Langue", value:"QWERTY" },{ label:"Rétroéclairage", value:"RGB multicolore" },{ label:"Touches", value:"Mécaniques" },{ label:"Pavé numérique", value:"Oui" },{ label:"Anti-ghosting", value:"104 touches" },{ label:"État", value:"Neuf" }],
  83: [{ label:"Marque", value:"HP" },{ label:"Type", value:"Filaire USB" },{ label:"Langue", value:"AZERTY" },{ label:"Pavé numérique", value:"Oui" },{ label:"Touches", value:"Silencieuses" },{ label:"Compatible", value:"Windows" },{ label:"État", value:"Neuf" }],
  84: [{ label:"Type", value:"Clavier Flexible USB" },{ label:"Matière", value:"Silicone souple" },{ label:"Langue", value:"AZERTY" },{ label:"Étanche", value:"Oui" },{ label:"Pavé numérique", value:"Oui" },{ label:"Enroulable", value:"Oui" },{ label:"Compatible", value:"Windows, Mac, Linux" },{ label:"État", value:"Neuf" }],
  // Modems
  85: [{ label:"Marque", value:"KING CRAB" },{ label:"Type", value:"Routeur WiFi 4G" },{ label:"Vitesse", value:"300 Mbps" },{ label:"Fréquence", value:"2.4 GHz" },{ label:"Utilisateurs max", value:"32 connexions" },{ label:"SIM", value:"MTN, Orange, Camtel, Nextell, Yoomee" },{ label:"Antennes", value:"3 antennes externes" },{ label:"État", value:"Neuf" }],
  86: [{ label:"Marque", value:"HUAWEI" },{ label:"Type", value:"Modem WiFi 4G LTE" },{ label:"Vitesse DL", value:"100 Mbps" },{ label:"Fréquence", value:"2.4 GHz" },{ label:"Utilisateurs max", value:"16 connexions" },{ label:"SIM", value:"Tous opérateurs Cameroun" },{ label:"Batterie", value:"1500 mAh" },{ label:"État", value:"Neuf" }],
  87: [{ label:"Marque", value:"HUAWEI" },{ label:"Type", value:"Modem WiFi 4G LTE" },{ label:"Vitesse DL", value:"100 Mbps" },{ label:"Fréquence", value:"2.4 GHz" },{ label:"Utilisateurs max", value:"16 connexions" },{ label:"SIM", value:"Tous opérateurs Cameroun" },{ label:"Batterie", value:"3000 mAh" },{ label:"État", value:"Neuf" }],
  88: [{ label:"Marque", value:"HUAWEI" },{ label:"Type", value:"Routeur WiFi 4G" },{ label:"Vitesse DL", value:"100 Mbps" },{ label:"Fréquence", value:"2.4 GHz" },{ label:"Utilisateurs max", value:"32 connexions" },{ label:"SIM", value:"Tous opérateurs" },{ label:"Antennes", value:"2 antennes" },{ label:"État", value:"Neuf" }],
  89: [{ label:"Marque", value:"HUAWEI" },{ label:"Type", value:"Routeur WiFi 4G LTE+" },{ label:"Vitesse DL", value:"200 Mbps" },{ label:"Fréquence", value:"2.4 & 5 GHz Dual Band" },{ label:"Utilisateurs max", value:"32 connexions" },{ label:"SIM", value:"Tous opérateurs" },{ label:"Antennes", value:"4 antennes" },{ label:"État", value:"Neuf" }],
  // Desktops
  90: [{ label:"Marque", value:"HP" },{ label:"Processeur", value:"Intel Core i5-2400 3.1 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Carte graphique", value:"Intel HD 2000" },{ label:"Ports", value:"7×USB, VGA, HDMI, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Format", value:"Mini-tour" },{ label:"État", value:"Occasion propre" }],
  91: [{ label:"Marque", value:"FUJITSU" },{ label:"Processeur", value:"Intel Core 2 Duo Dual-Core" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Carte graphique", value:"Intel Graphique intégrée" },{ label:"Ports", value:"6×USB, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Occasion propre" }],
  92: [{ label:"Marque", value:"FUJITSU" },{ label:"Processeur", value:"Intel Core i3-2120 3.3 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"320 Go HDD" },{ label:"Carte graphique", value:"Intel HD 2000" },{ label:"Ports", value:"6×USB, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Occasion propre" }],
  93: [{ label:"Marque", value:"DELL" },{ label:"Processeur", value:"Intel Core 2 Duo E7500 Dual-Core" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"320 Go HDD" },{ label:"Carte graphique", value:"Intel Graphique intégrée" },{ label:"Ports", value:"6×USB, VGA, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Format", value:"Ultra-compact" },{ label:"État", value:"Occasion propre" }],
  94: [{ label:"Marque", value:"ASUS" },{ label:"Processeur", value:"Intel Core i3-4160 3.6 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"320 Go HDD" },{ label:"Carte graphique", value:"Intel HD 4400" },{ label:"Ports", value:"6×USB, VGA, HDMI, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Format", value:"Mini-tour" },{ label:"État", value:"Occasion propre" }],
  95: [{ label:"Marque", value:"ACER" },{ label:"Processeur", value:"Intel Core i3-4160 3.6 GHz" },{ label:"RAM", value:"4 Go DDR3" },{ label:"Stockage", value:"500 Go HDD" },{ label:"Carte graphique", value:"Intel HD 4400" },{ label:"Ports", value:"6×USB, VGA, HDMI, RJ-45" },{ label:"Système", value:"Windows 10 Pro 64 bits" },{ label:"Format", value:"Mini-tour" },{ label:"État", value:"Occasion propre" }],
  // RAM
  96: [{ label:"Type", value:"DDR3L" },{ label:"Fréquence", value:"1600 MHz" },{ label:"Capacité", value:"8 Go" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.35 V" },{ label:"Latence", value:"CL11" },{ label:"Compatible", value:"Intel & AMD" },{ label:"État", value:"Neuf" }],
  97: [{ label:"Type", value:"DDR4" },{ label:"Fréquence", value:"3200 MHz" },{ label:"Capacité", value:"16 Go" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.2 V" },{ label:"Latence", value:"CL22" },{ label:"Compatible", value:"Intel 10/11è gen" },{ label:"État", value:"Neuf" }],
  98: [{ label:"Type", value:"DDR3L" },{ label:"Fréquence", value:"1600 MHz" },{ label:"Capacité", value:"16 Go (2×8 Go)" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.35 V" },{ label:"Compatible", value:"Intel & AMD" },{ label:"État", value:"Neuf" }],
  99: [{ label:"Type", value:"DDR4" },{ label:"Fréquence", value:"2400 MHz" },{ label:"Capacité", value:"4 Go" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.2 V" },{ label:"Latence", value:"CL17" },{ label:"Compatible", value:"Intel 6/7è gen" },{ label:"État", value:"Neuf" }],
  100:[{ label:"Type", value:"DDR2" },{ label:"Fréquence", value:"667 MHz" },{ label:"Capacité", value:"1 Go" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.8 V" },{ label:"Compatible", value:"Anciens laptops" },{ label:"État", value:"Occasion propre" }],
  101:[{ label:"Type", value:"DDR4" },{ label:"Fréquence", value:"2666 MHz" },{ label:"Capacité", value:"8 Go" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.2 V" },{ label:"Compatible", value:"Intel 8/9è gen" },{ label:"État", value:"Neuf" }],
  102:[{ label:"Type", value:"DDR2" },{ label:"Fréquence", value:"800 MHz" },{ label:"Capacité", value:"2 Go" },{ label:"Format", value:"SO-DIMM (Laptop)" },{ label:"Tension", value:"1.8 V" },{ label:"Compatible", value:"Anciens laptops" },{ label:"État", value:"Occasion propre" }],
  103:[{ label:"Type", value:"DDR2" },{ label:"Fréquence", value:"800 MHz" },{ label:"Capacité", value:"2 Go" },{ label:"Format", value:"DIMM (Desktop)" },{ label:"Tension", value:"1.8 V" },{ label:"Compatible", value:"Anciens desktops" },{ label:"État", value:"Occasion propre" }],
  104:[{ label:"Type", value:"DDR2" },{ label:"Fréquence", value:"667 MHz" },{ label:"Capacité", value:"1 Go" },{ label:"Format", value:"DIMM (Desktop)" },{ label:"Tension", value:"1.8 V" },{ label:"Compatible", value:"Anciens desktops" },{ label:"État", value:"Occasion propre" }],
  105:[{ label:"Type", value:"DDR3" },{ label:"Fréquence", value:"1600 MHz" },{ label:"Capacité", value:"8 Go" },{ label:"Format", value:"DIMM (Desktop)" },{ label:"Tension", value:"1.5 V" },{ label:"Compatible", value:"Intel & AMD" },{ label:"État", value:"Neuf" }],
  106:[{ label:"Type", value:"DDR3" },{ label:"Fréquence", value:"1600 MHz" },{ label:"Capacité", value:"4 Go" },{ label:"Format", value:"DIMM (Desktop)" },{ label:"Tension", value:"1.5 V" },{ label:"Compatible", value:"Intel & AMD" },{ label:"État", value:"Neuf" }],
  107:[{ label:"Type", value:"DDR3" },{ label:"Fréquence", value:"1600 MHz" },{ label:"Capacité", value:"16 Go (2×8 Go)" },{ label:"Format", value:"DIMM (Desktop)" },{ label:"Tension", value:"1.5 V" },{ label:"Compatible", value:"Intel & AMD" },{ label:"État", value:"Neuf" }],
  // Antivirus
  108:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Total Security 2024" },{ label:"Postes", value:"2 postes" },{ label:"Durée", value:"1 an" },{ label:"Protection temps réel", value:"Oui" },{ label:"Anti-ransomware", value:"Oui" },{ label:"VPN", value:"200 Mo/jour inclus" },{ label:"Gestion mots de passe", value:"Oui" },{ label:"Compatible", value:"Windows, Mac, Android, iOS" }],
  109:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Total Security 2024" },{ label:"Postes", value:"4 postes" },{ label:"Durée", value:"1 an" },{ label:"Protection temps réel", value:"Oui" },{ label:"Anti-ransomware", value:"Oui" },{ label:"VPN sécurisé", value:"Oui" },{ label:"Compatible", value:"Windows, Mac, Android, iOS" }],
  110:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Internet Security" },{ label:"Postes", value:"4 postes" },{ label:"Durée", value:"1 an" },{ label:"Protection temps réel", value:"Oui" },{ label:"Pare-feu", value:"Oui" },{ label:"Anti-spam", value:"Oui" },{ label:"Compatible", value:"Windows, Mac" }],
  111:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Anti-Virus Standard" },{ label:"Postes", value:"4 postes" },{ label:"Durée", value:"1 an" },{ label:"Protection temps réel", value:"Oui" },{ label:"Optimisation PC", value:"Oui" },{ label:"Compatible", value:"Windows uniquement" }],
  112:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Security Cloud" },{ label:"Postes", value:"4 postes" },{ label:"Durée", value:"1 an" },{ label:"Protection adaptative", value:"Oui" },{ label:"VPN", value:"Illimité" },{ label:"Compatible", value:"Windows, Mac, Android, iOS" }],
  113:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Total Security" },{ label:"Postes", value:"5 postes" },{ label:"Durée", value:"2 ans" },{ label:"Protection complète", value:"Oui" },{ label:"VPN", value:"Oui" },{ label:"Contrôle parental", value:"Oui" },{ label:"Compatible", value:"Windows, Mac, Android, iOS" }],
  114:[{ label:"Marque", value:"NORTON" },{ label:"Version", value:"360 Deluxe" },{ label:"Postes", value:"9 postes" },{ label:"Durée", value:"1 an" },{ label:"VPN", value:"Illimité" },{ label:"Dark Web Monitoring", value:"Oui" },{ label:"Sauvegarde cloud", value:"75 Go" },{ label:"Compatible", value:"Windows, Mac, Android, iOS" }],
  115:[{ label:"Marque", value:"NORTON" },{ label:"Version", value:"Antivirus Plus" },{ label:"Postes", value:"4 postes" },{ label:"Durée", value:"1 an" },{ label:"Pare-feu intelligent", value:"Oui" },{ label:"Sauvegarde", value:"2 Go cloud" },{ label:"Compatible", value:"Windows, Mac" }],
  116:[{ label:"Marque", value:"NORTON" },{ label:"Version", value:"360 Standard" },{ label:"Postes", value:"5 postes" },{ label:"Durée", value:"1 an" },{ label:"VPN", value:"Illimité" },{ label:"Sauvegarde cloud", value:"10 Go" },{ label:"Compatible", value:"Windows, Mac, Android, iOS" }],
  117:[{ label:"Marque", value:"KASPERSKY" },{ label:"Version", value:"Anti-Virus Essential" },{ label:"Postes", value:"2 postes" },{ label:"Durée", value:"1 an" },{ label:"Protection temps réel", value:"Oui" },{ label:"Scan automatique", value:"Oui" },{ label:"Compatible", value:"Windows uniquement" }],
  // Projecteurs
  118:[{ label:"Marque", value:"PHILIPS" },{ label:"Luminosité", value:"3200 Lumens" },{ label:"Résolution", value:"XGA 1024×768" },{ label:"Connexions", value:"VGA, HDMI, USB, Audio" },{ label:"Distance projection", value:"0.9 – 9 m" },{ label:"Taille image", value:"30\" – 300\"" },{ label:"Durée lampe", value:"10 000 heures" },{ label:"Bruit", value:"28 dB" },{ label:"État", value:"Occasion propre" }],
  119:[{ label:"Marque", value:"TOPTRO" },{ label:"Luminosité", value:"9000 Lumens" },{ label:"Résolution", value:"1080P Full HD" },{ label:"Connexions", value:"VGA, HDMI×2, USB×3, AV, AUX" },{ label:"Zoom", value:"50% zoom" },{ label:"Taille image", value:"30\" – 300\"" },{ label:"Haut-parleur", value:"5W stéréo" },{ label:"État", value:"Occasion propre" }],
  120:[{ label:"Marque", value:"PANASONIC" },{ label:"Luminosité", value:"3200 Lumens" },{ label:"Résolution", value:"XGA 1024×768" },{ label:"Connexions", value:"VGA×2, HDMI, S-Video, Composite" },{ label:"Contraste", value:"2000:1" },{ label:"Taille image", value:"40\" – 300\"" },{ label:"Durée lampe", value:"7000 heures" },{ label:"État", value:"Occasion propre" }],
  121:[{ label:"Marque", value:"TMY" },{ label:"Luminosité", value:"3200 Lumens (LED)" },{ label:"Résolution", value:"Full HD 1920×1080" },{ label:"Connexions", value:"HDMI, VGA, USB, AV, AUX" },{ label:"Taille image", value:"30\" – 200\"" },{ label:"Durée lampe", value:"50 000 heures LED" },{ label:"Haut-parleur", value:"Intégré" },{ label:"État", value:"Neuf" }],
  122:[{ label:"Marque", value:"TMY" },{ label:"Luminosité", value:"5000 Lumens (LED)" },{ label:"Résolution", value:"Full HD 1920×1080" },{ label:"Connexions", value:"HDMI×2, USB×2, VGA, AUX" },{ label:"Zoom", value:"Manuel" },{ label:"Haut-parleur", value:"Stéréo" },{ label:"Durée lampe", value:"50 000 heures" },{ label:"État", value:"Neuf" }],
  123:[{ label:"Marque", value:"TMY" },{ label:"Type", value:"Mini Projecteur Portable" },{ label:"Luminosité", value:"3200 Lumens" },{ label:"Résolution", value:"1080P" },{ label:"Connexions", value:"HDMI, USB, AV" },{ label:"Batterie", value:"Intégrée 5000 mAh" },{ label:"Durée lampe", value:"50 000 heures" },{ label:"État", value:"Neuf" }],
  124:[{ label:"Marque", value:"CASIO" },{ label:"Type", value:"Projecteur Laser & LED" },{ label:"Luminosité", value:"3000 Lumens" },{ label:"Résolution", value:"XGA 1024×768" },{ label:"Connexions", value:"VGA, HDMI, USB, LAN, RS232" },{ label:"Durée source lumineuse", value:"20 000 heures" },{ label:"Sans lampe", value:"Oui (lampe libre)" },{ label:"État", value:"Occasion propre" }],
  125:[{ label:"Marque", value:"EPSON" },{ label:"Luminosité", value:"3200 Lumens" },{ label:"Résolution", value:"WXGA 1280×800" },{ label:"Connexions", value:"VGA×2, HDMI, USB, Composite" },{ label:"Contraste", value:"15 000:1" },{ label:"Taille image", value:"30\" – 300\"" },{ label:"Durée lampe", value:"10 000 heures" },{ label:"État", value:"Occasion propre" }],
  // Téléphones
  126:[{ label:"Marque", value:"I-Touch" },{ label:"Modèle", value:"X718" },{ label:"Stockage", value:"256 Go" },{ label:"RAM", value:"8 Go" },{ label:"Système", value:"Android 10" },{ label:"Écran", value:"7 pouces HD+" },{ label:"Batterie", value:"6000 mAh" },{ label:"Caméra", value:"13 MP arrière + 5 MP avant" },{ label:"Double SIM", value:"Oui" },{ label:"4G", value:"Oui" },{ label:"État", value:"Neuf" }],
  127:[{ label:"Marque", value:"I-Touch" },{ label:"Modèle", value:"A702" },{ label:"Stockage", value:"16 Go" },{ label:"RAM", value:"2 Go" },{ label:"Système", value:"Android 9" },{ label:"Écran", value:"7 pouces HD" },{ label:"Batterie", value:"4000 mAh" },{ label:"Caméra", value:"8 MP arrière + 2 MP avant" },{ label:"Double SIM", value:"Oui" },{ label:"4G", value:"Non" },{ label:"État", value:"Neuf" }],
  128:[{ label:"Marque", value:"I-Touch" },{ label:"Modèle", value:"B33" },{ label:"Stockage", value:"16 Go" },{ label:"RAM", value:"2 Go" },{ label:"Système", value:"Android 9" },{ label:"Écran", value:"5.5 pouces HD" },{ label:"Batterie", value:"3000 mAh" },{ label:"Caméra", value:"8 MP arrière + 5 MP avant" },{ label:"Double SIM", value:"Oui" },{ label:"4G", value:"Non" },{ label:"État", value:"Neuf" }],
  129:[{ label:"Marque", value:"LENOVO" },{ label:"Modèle", value:"Tab M8 T8505x" },{ label:"Stockage", value:"32 Go" },{ label:"RAM", value:"4 Go" },{ label:"Système", value:"Android 10" },{ label:"Écran", value:"8 pouces FHD" },{ label:"Batterie", value:"5000 mAh" },{ label:"Processeur", value:"MediaTek Helio P22T" },{ label:"4G LTE", value:"Oui" },{ label:"État", value:"Neuf" }],
  130:[{ label:"Marque", value:"C Idea" },{ label:"Modèle", value:"Cm525" },{ label:"Stockage", value:"64 Go" },{ label:"RAM", value:"4 Go" },{ label:"Système", value:"Android 10" },{ label:"Écran", value:"5.5 pouces HD+" },{ label:"Batterie", value:"4000 mAh" },{ label:"Caméra", value:"13 MP + 8 MP" },{ label:"Double SIM + SD", value:"Oui" },{ label:"4G", value:"Oui" },{ label:"État", value:"Neuf" }],
  131:[{ label:"Marque", value:"I-Touch" },{ label:"Modèle", value:"Yes 24" },{ label:"Stockage", value:"32 Go" },{ label:"RAM", value:"2 Go" },{ label:"Système", value:"Android 9" },{ label:"Écran", value:"5.0 pouces" },{ label:"Batterie", value:"2500 mAh" },{ label:"Caméra", value:"8 MP arrière" },{ label:"Double SIM", value:"Oui" },{ label:"État", value:"Neuf" }],
  132:[{ label:"Marque", value:"C Idea" },{ label:"Modèle", value:"5G LTE Pro" },{ label:"Stockage", value:"256 Go" },{ label:"RAM", value:"6 Go" },{ label:"Système", value:"Android 12" },{ label:"Écran", value:"6.7 pouces AMOLED" },{ label:"Batterie", value:"5000 mAh" },{ label:"Caméra", value:"48 MP + 8 MP + 2 MP" },{ label:"5G", value:"Oui" },{ label:"État", value:"Neuf" }],
  133:[{ label:"Marque", value:"C Idea" },{ label:"Modèle", value:"5G LTE Standard" },{ label:"Stockage", value:"64 Go" },{ label:"RAM", value:"4 Go" },{ label:"Système", value:"Android 11" },{ label:"Écran", value:"6.5 pouces" },{ label:"Batterie", value:"4500 mAh" },{ label:"Caméra", value:"16 MP arrière + 8 MP avant" },{ label:"5G", value:"Oui" },{ label:"État", value:"Neuf" }],
  // Adaptateurs
  134:[{ label:"Type", value:"Adaptateur VGA → HDMI" },{ label:"Alimentation", value:"USB requis" },{ label:"Résolution max", value:"1080P" },{ label:"Marque", value:"SAMSUNG" },{ label:"Compatible", value:"PC, Laptop, Projecteur" },{ label:"État", value:"Neuf" }],
  135:[{ label:"Type", value:"Adaptateur USB → USB (Hub)" },{ label:"Ports", value:"4×USB 3.0" },{ label:"Marque", value:"HP" },{ label:"Compatible", value:"PC, Mac" },{ label:"Plug & Play", value:"Oui" },{ label:"État", value:"Neuf" }],
  136:[{ label:"Type", value:"Câble USB → Android/iPhone/Type-C" },{ label:"Modèle", value:"3-en-1 Mv2" },{ label:"Marque", value:"HP" },{ label:"Longueur", value:"1.2 m" },{ label:"Charge rapide", value:"Oui" },{ label:"État", value:"Neuf" }],
  137:[{ label:"Type", value:"Adaptateur HDMI → Android (MHL)" },{ label:"Marque", value:"SONY" },{ label:"Compatible", value:"Samsung, Huawei, LG" },{ label:"Résolution", value:"1080P" },{ label:"Plug & Play", value:"Oui" },{ label:"État", value:"Neuf" }],
  138:[{ label:"Type", value:"Adaptateur HDMI → USB" },{ label:"Marque", value:"HP" },{ label:"Vitesse", value:"USB 3.0" },{ label:"Compatible", value:"PC, Console" },{ label:"Plug & Play", value:"Oui" },{ label:"État", value:"Neuf" }],
  139:[{ label:"Type", value:"Câble Android/iPhone/Type-C → USB" },{ label:"Modèle", value:"3-en-1 B12" },{ label:"Marque", value:"ASUS" },{ label:"Longueur", value:"1 m" },{ label:"Compatible", value:"Tous appareils" },{ label:"État", value:"Neuf" }],
  140:[{ label:"Type", value:"Adaptateur HDMI → VGA" },{ label:"Marque", value:"SAMSUNG" },{ label:"Résolution max", value:"1080P" },{ label:"Audio", value:"Jack 3.5mm intégré" },{ label:"Compatible", value:"PC, Laptop, PS4" },{ label:"État", value:"Neuf" }],
  141:[{ label:"Type", value:"Câble USB → Micro-USB (Android)" },{ label:"Marque", value:"SAMSUNG" },{ label:"Longueur", value:"1 m" },{ label:"Charge", value:"5V / 2A" },{ label:"État", value:"Neuf" }],
  142:[{ label:"Type", value:"Câble USB → Micro-USB (Android)" },{ label:"Marque", value:"SONY" },{ label:"Longueur", value:"1.5 m" },{ label:"Charge rapide", value:"Oui" },{ label:"État", value:"Neuf" }],
  143:[{ label:"Type", value:"Câble USB → Type-C" },{ label:"Marque", value:"SONY" },{ label:"Longueur", value:"1.2 m" },{ label:"Charge rapide", value:"18W" },{ label:"État", value:"Neuf" }],
  144:[{ label:"Type", value:"Câble USB → Type-C Premium" },{ label:"Marque", value:"SONY" },{ label:"Longueur", value:"2 m" },{ label:"Charge rapide", value:"20W" },{ label:"Données", value:"USB 3.1" },{ label:"État", value:"Neuf" }],
  145:[{ label:"Type", value:"Hub USB → 4×USB 3.0" },{ label:"Marque", value:"HP" },{ label:"Alimentation", value:"Externe optionnelle" },{ label:"Compatible", value:"PC, Mac" },{ label:"Plug & Play", value:"Oui" },{ label:"État", value:"Neuf" }],
  146:[{ label:"Type", value:"Hub USB-C → USB 3.0 + HDMI" },{ label:"Marque", value:"HP" },{ label:"Ports", value:"USB-C, 2×USB, HDMI" },{ label:"Compatible", value:"PC, Mac" },{ label:"Plug & Play", value:"Oui" },{ label:"État", value:"Neuf" }],
  // Télévisions
  147:[{ label:"Marque", value:"LG" },{ label:"Taille", value:"32 pouces" },{ label:"Smart TV", value:"webOS" },{ label:"Résolution", value:"HD Ready 1366×768" },{ label:"HDR", value:"Non" },{ label:"Ports", value:"2×HDMI, 1×USB, Bluetooth" },{ label:"Wi-Fi", value:"Oui" },{ label:"Chromecast", value:"Intégré" },{ label:"État", value:"Neuf" }],
  148:[{ label:"Marque", value:"LG" },{ label:"Taille", value:"43 pouces" },{ label:"Smart TV", value:"webOS 6.0" },{ label:"Résolution", value:"Full HD 1920×1080" },{ label:"HDR", value:"HDR10" },{ label:"Ports", value:"3×HDMI, 2×USB" },{ label:"Wi-Fi", value:"Wi-Fi 5" },{ label:"Google Assistant", value:"Oui" },{ label:"État", value:"Neuf" }],
  149:[{ label:"Marque", value:"LG" },{ label:"Taille", value:"55 pouces" },{ label:"Smart TV", value:"webOS 6.0" },{ label:"Résolution", value:"4K Ultra HD 3840×2160" },{ label:"HDR", value:"Dolby Vision, HDR10" },{ label:"Ports", value:"4×HDMI 2.0, 3×USB" },{ label:"Wi-Fi", value:"Wi-Fi 5" },{ label:"Son", value:"Dolby Atmos 2.0" },{ label:"État", value:"Neuf" }],
  150:[{ label:"Marque", value:"SAMSUNG" },{ label:"Taille", value:"43 pouces" },{ label:"Smart TV", value:"Tizen OS" },{ label:"Résolution", value:"Full HD 1920×1080" },{ label:"HDR", value:"HDR10+" },{ label:"Ports", value:"2×HDMI, 1×USB" },{ label:"Wi-Fi", value:"Wi-Fi 5" },{ label:"Bixby", value:"Intégré" },{ label:"État", value:"Neuf" }],
  // Chargeurs
  151:[{ label:"Marque", value:"TOSHIBA" },{ label:"Tension", value:"12 V" },{ label:"Intensité", value:"4.3 A" },{ label:"Puissance", value:"65 W" },{ label:"Connecteur", value:"Petit rond (5.5×2.5mm)" },{ label:"Compatible", value:"TOSHIBA Satellite" },{ label:"Câble", value:"1.8 m" },{ label:"État", value:"Neuf" }],
  152:[{ label:"Marque", value:"HP" },{ label:"Tension", value:"19.5 V" },{ label:"Intensité", value:"3.33 A" },{ label:"Puissance", value:"65 W" },{ label:"Connecteur", value:"Bleu (4.5×3.0mm)" },{ label:"Compatible", value:"HP ProBook, EliteBook" },{ label:"Câble", value:"1.8 m" },{ label:"État", value:"Neuf" }],
  153:[{ label:"Marque", value:"ACER" },{ label:"Tension", value:"19 V" },{ label:"Intensité", value:"3.42 A" },{ label:"Puissance", value:"65 W" },{ label:"Connecteur", value:"Rond (5.5×1.7mm)" },{ label:"Compatible", value:"ACER Aspire, Swift" },{ label:"Câble", value:"1.8 m" },{ label:"État", value:"Neuf" }],
  154:[{ label:"Marque", value:"LENOVO" },{ label:"Tension", value:"20 V" },{ label:"Intensité", value:"3.25 A" },{ label:"Puissance", value:"65 W" },{ label:"Connecteur", value:"Carré (11×5mm)" },{ label:"Compatible", value:"LENOVO ThinkPad" },{ label:"Câble", value:"1.8 m" },{ label:"État", value:"Neuf" }],
  155:[{ label:"Marque", value:"DELL" },{ label:"Tension", value:"19.5 V" },{ label:"Intensité", value:"3.34 A" },{ label:"Puissance", value:"65 W" },{ label:"Connecteur", value:"Baril (7.4×5.0mm)" },{ label:"Compatible", value:"DELL Latitude, Inspiron" },{ label:"Câble", value:"1.8 m" },{ label:"État", value:"Neuf" }],
  156:[{ label:"Marque", value:"LENOVO" },{ label:"Tension", value:"20 V" },{ label:"Intensité", value:"4.5 A" },{ label:"Puissance", value:"90 W" },{ label:"Connecteur", value:"Carré (11×5mm)" },{ label:"Compatible", value:"LENOVO ThinkPad, IdeaPad" },{ label:"Câble", value:"1.8 m" },{ label:"État", value:"Neuf" }],
  // Sacs
  157:[{ label:"Marque", value:"LENOVO" },{ label:"Taille", value:"14 pouces" },{ label:"Couleur", value:"Noir" },{ label:"Type", value:"Sacoche" },{ label:"Poches", value:"Principale, ordinateur, accessoires ×3" },{ label:"Matière", value:"Polyester renforcé" },{ label:"Poignée & bandoulière", value:"Oui" },{ label:"État", value:"Neuf" }],
  158:[{ label:"Marque", value:"ENZO" },{ label:"Taille", value:"15.6 pouces" },{ label:"Couleur", value:"Noir" },{ label:"Type", value:"Sac à dos" },{ label:"Poches", value:"5 compartiments" },{ label:"Matière", value:"Nylon imperméable" },{ label:"Port USB externe", value:"Oui" },{ label:"État", value:"Neuf" }],
  159:[{ label:"Marque", value:"TOSHIBA" },{ label:"Taille", value:"15.6 pouces" },{ label:"Couleur", value:"Gris/Noir" },{ label:"Type", value:"Sacoche rigide" },{ label:"Poches", value:"4 compartiments" },{ label:"Matière", value:"Polyester" },{ label:"Bandoulière réglable", value:"Oui" },{ label:"État", value:"Neuf" }],
  160:[{ label:"Marque", value:"DELL" },{ label:"Taille", value:"15.6 pouces" },{ label:"Couleur", value:"Noir" },{ label:"Type", value:"Sac à dos Pro" },{ label:"Poches", value:"6 compartiments" },{ label:"Matière", value:"Nylon" },{ label:"Port USB charge", value:"Oui" },{ label:"État", value:"Neuf" }],
  161:[{ label:"Marque", value:"HP" },{ label:"Taille", value:"15.6 pouces" },{ label:"Couleur", value:"Noir" },{ label:"Type", value:"Sacoche Active" },{ label:"Poches", value:"3 compartiments" },{ label:"Matière", value:"Polyester" },{ label:"Résistante à l'eau", value:"Oui" },{ label:"État", value:"Neuf" }],
  162:[{ label:"Marque", value:"LENOVO" },{ label:"Taille", value:"15 pouces" },{ label:"Couleur", value:"Bleu/Gris" },{ label:"Type", value:"Sac à dos Casual" },{ label:"Poches", value:"4 compartiments" },{ label:"Matière", value:"Polyester" },{ label:"USB externe", value:"Oui" },{ label:"État", value:"Neuf" }],
  163:[{ label:"Marque", value:"HP" },{ label:"Taille", value:"15 pouces" },{ label:"Couleur", value:"Noir" },{ label:"Type", value:"Malette élégante" },{ label:"Poches", value:"5 compartiments" },{ label:"Matière", value:"Simili-cuir" },{ label:"Poignée & bandoulière", value:"Oui" },{ label:"État", value:"Neuf" }],
  164:[{ label:"Marque", value:"TOSHIBA" },{ label:"Taille", value:"15 pouces" },{ label:"Couleur", value:"Gris" },{ label:"Type", value:"Sac slim" },{ label:"Poches", value:"3 compartiments" },{ label:"Matière", value:"Polyester" },{ label:"Résistante à l'eau", value:"Oui" },{ label:"État", value:"Neuf" }],
  165:[{ label:"Marque", value:"LENOVO" },{ label:"Taille", value:"15.6 pouces" },{ label:"Couleur", value:"Noir/Rouge" },{ label:"Type", value:"Sac Gaming" },{ label:"Poches", value:"6 compartiments" },{ label:"Matière", value:"Nylon renforcé" },{ label:"Port USB", value:"Oui" },{ label:"État", value:"Neuf" }],
};

// ─── DESCRIPTIONS PAR PRODUIT ─────────────────────────────────────────────────
const PRODUCT_DESCRIPTIONS: Record<number, string> = {
  1: "Le Dell Latitude 3190 est un laptop professionnel compact 11.6 pouces équipé du processeur Intel Celeron N4020 cadencé à 1.1 GHz, 8 Go de RAM DDR4 et 128 Go de SSD. Ultra-léger (1.4 kg), il boot en moins de 15 secondes. Idéal pour la bureautique, la navigation, les cours en ligne et le télétravail. Importé des États-Unis, certifié Windows 10 Pro, avec Wi-Fi et Bluetooth intégrés.",
  2: "L'HP EliteBook 840 G3 est un laptop pro 14 pouces FHD anti-reflet, propulsé par le Core i5-6300U 6ème génération, 8 Go DDR4 et 256 Go SSD. Robustesse certifiée MIL-STD-810G, performances fiables, autonomie jusqu'à 8h. Conçu pour les professionnels exigeants : poids de 1.57 kg, clavier rétroéclairé, lecteur d'empreinte, Smart Card reader.",
  3: "Le Lenovo V15 G2 IJL est un laptop polyvalent 15.6 pouces Full HD, équipé du Celeron N4500 et 4 Go DDR4 avec SSD 256 Go. Grand écran confortable, audio Dolby, port USB-C moderne. Neuf avec Windows 11 Home. Parfait pour les étudiants, enseignants et le télétravail à petit budget.",
  4: "Le Dell Latitude 3380 offre un excellent rapport qualité-prix avec son Core i3-6006U, 8 Go RAM et 128 Go SSD dans un châssis 13.3 pouces léger. Robustesse professionnelle, autonomie prolongée. Idéal pour les déplacements fréquents.",
  5: "Le HP EliteBook Folio est un ultrabook premium ultra-slim 12.5 pouces FHD, avec Core i5-5300U, 8 Go RAM et 500 Go HDD. Design aluminium élégant, clavier chiclet rétroéclairé, sécurité renforcée. Le compagnon parfait des dirigeants et cadres en mobilité.",
  6: "Le HP ProBook 645 est un laptop professionnel 14 pouces avec AMD A4-7300B. Robuste et fiable pour la bureautique quotidienne. Certifié HP pour les environnements professionnels exigeants.",
  7: "Le Lenovo ThinkPad X130e est un netbook résistant 11.6 pouces AMD E1-1200, 4 Go RAM, 250 Go HDD. Certification militaire de robustesse (MIL-STD-810), parfait pour les environnements difficiles et les étudiants.",
  8: "Le Lenovo ThinkPad P50s est une station mobile 15.6 pouces FHD avec Core i7-6600U, 16 Go DDR4, 512 Go SSD et GPU NVIDIA Quadro M1000M 2 Go. Performances professionnelles pour la CAO, le graphisme et la vidéo. Thunderbolt 3 intégré.",
  9: "Le Dell Latitude E5580 est un laptop pro 15.6 pouces FHD avec Core i7-7820HQ 4 cœurs, 16 Go DDR4, 512 Go SSD et GPU NVIDIA 930MX. Performances élevées pour les applications lourdes : ingénierie, développement, infographie.",
  10: "Le Sony VAIO SVF152A29M est un laptop 15.5 pouces FHD avec Core i5-3337U, 8 Go RAM, 500 Go HDD et carte graphique hybride Intel+AMD. Design élégant Sony, clavier Full HD, son stéréo SRS. Bon compromis performance/prix.",
  11: "Le Lenovo ThinkPad E560 est un laptop 15.6 pouces FHD avec Core i5-6200U, 12 Go RAM et 500 Go HDD. GPU dédié AMD R7 M360, clavier ThinkPad emblématique, robustesse certifiée. Excellent pour la bureautique professionnelle.",
  12: "Le Lenovo 11e est un netbook professionnel 11.6 pouces avec Core i3-6100U, 4 Go RAM, 128 Go SSD. Compact, léger et robuste, idéal pour les étudiants et les professionnels en déplacement.",
  13: "Le HP Chromebook offre une expérience moderne avec Celeron N3060, 4 Go RAM et 128 Go SSD (eMMC). Démarrage ultra-rapide, autonomie de 10h, parfait pour la navigation, Google Docs, YouTube. Peut aussi fonctionner sous Windows 10.",
  14: "Le HP ProBook 645 G3 est un laptop pro 14 pouces avec AMD A6-8530B, 8 Go DDR3 et 500 Go HDD. GPU AMD Radeon R4 intégré, conception robuste pour un usage professionnel intensif.",
  15: "Le HP ZBook 15 G3 est une workstation mobile 15.6 pouces FHD IPS avec Core i7-6820HQ, 16 Go DDR4, 750 Go HDD et NVIDIA Quadro M2000M 4 Go. Performances de workstation pour les ingénieurs, architectes et créatifs exigeants.",
  16: "Le HP 11 Stream est un netbook ultra-abordable avec Celeron N3060, 4 Go RAM et 128 Go SSD. Léger, autonome (8-10h), parfait comme second ordinateur ou pour les enfants et étudiants.",
  17: "Le Lenovo 11e Chromebook est équipé du Celeron N2940 Quad-Core, 8 Go RAM et 320 Go HDD. Construit pour résister à une utilisation scolaire intensive, certifié anti-chocs.",
  18: "Le Lenovo ThinkPad T480 est le laptop professionnel de référence : Core i5-8350U 8ème génération, 8 Go DDR4, 256 Go SSD NVMe. Connectivité maximale (Thunderbolt 3, USB-C), autonomie record jusqu'à 10h, clavier ThinkPad premium.",
  19: "Le HP ProBook 650 G2 est un laptop 15.6 pouces FHD avec AMD A6-8530B, 8 Go DDR3 et 500 Go HDD. Port VGA et HDMI, robustesse certifiée HP, parfait pour les entreprises et institutions.",
  20: "Le Lenovo ThinkPad X270 est un ultrabook pro 12.5 pouces FHD avec Core i5-7300U, 8 Go DDR4 et 500 Go HDD. Ultra-portable (1.3 kg), autonomie exceptionnelle jusqu'à 9h, clavier ThinkPad de qualité.",
  21: "Le HP 6560b est un laptop 15.6 pouces avec Core i5-2520M, 4 Go DDR3 et 500 Go HDD. Robuste et fiable pour la bureautique professionnelle. Port VGA, RJ-45, bon pour les PME.",
  22: "Le HP X360 est un convertible 11.6 pouces tactile avec Celeron Quad-Core, 4 Go RAM et 128 Go SSD. Mode tablette, mode tente et mode laptop. Parfait pour les étudiants et les créatifs.",
  23: "Le Dell Vostro 5568 est un laptop 15.6 pouces FHD élégant avec Core i5-7200U, 8 Go DDR4, 1 To HDD et GPU NVIDIA 940MX 4 Go. Design fin, performance gaming légère, idéal pour les professionnels créatifs.",
  24: "Le Dell Latitude 5440 est un laptop pro 14 pouces avec Core i5-4300U, 8 Go DDR3 et 500 Go HDD. Robustesse professionnelle Dell, carte audio et vidéo intégrée, port DisplayPort.",
  25: "Le Dell Latitude 3190 2-en-1 est un convertible professionnel tactile 360° 11.6 pouces avec Intel Atom x5-E3940, 4 Go LPDDR4 et 128 Go SSD. Mode laptop, tablette ou tente. Idéal pour les présentations.",
  26: "Le Lenovo 11e compact est un netbook avec Intel Atom, 4 Go RAM et 128 Go SSD. Léger et économique pour la bureautique de base et la navigation web.",
  27: "Le Dell Latitude E5520 est un laptop 15.6 pouces FHD avec Core i3-2310M, 8 Go DDR3 et 500 Go HDD. Robustesse professionnelle Dell, clavier pleine taille, parfait pour la bureautique.",
  28: "Le Toshiba NB250 est un netbook 10.1 pouces Atom N455, 2 Go RAM, 250 Go HDD. Ultra-compact et léger pour la mobilité maximale.",
  29: "Le HP ProBook 640 G1 est un laptop pro 14 pouces avec Core i7-4600M, 8 Go DDR3 et 500 Go HDD. Performances Core i7 au prix de l'occasion, idéal pour les tâches multitâches exigeantes.",
  30: "Le HP EliteBook 840 G6 est un laptop pro haut de gamme 14 pouces FHD IPS avec Core i5-8265U 8ème gen, 16 Go DDR4 et 256 Go SSD NVMe. Autonomie jusqu'à 13h, Thunderbolt 3, Touch ID, design aluminium premium.",
  31: "Le HP EliteBook 845 G7 est le top de la gamme avec AMD Ryzen 5 PRO 4650U 6 cœurs, 16 Go DDR4 3200 MHz et 512 Go SSD NVMe. Wi-Fi 6, écran IPS 14 pouces FHD, autonomie jusqu'à 15h. Le choix des professionnels les plus exigeants.",
  32: "Le HP Mini 3115m est un netbook 11.6 pouces avec AMD A2-3305M, 4 Go RAM et 500 Go HDD. Économique et portable pour une utilisation légère.",
  33: "Le Dell Latitude E6540 est un laptop pro 15.6 pouces FHD avec Core i5-4300M, 8 Go DDR3 et 1 To HDD. GPU AMD Radeon HD 8790M, excellent pour le multitâche et la bureautique avancée.",
  34: "Le HP Folio est un ultrabook élégant 13.3 pouces FHD IPS avec Core i7-3517U, 16 Go DDR3 et 500 Go HDD. Ultra-slim, aluminium brossé, autonomie étendue. Le compagnon des dirigeants.",
  35: "Le Lenovo Yoga 11e X360 est un convertible 360° 11.6 pouces avec Celeron N2940 Quad-Core, 4 Go RAM et 320 Go HDD. Tactile, résistant aux chocs, parfait pour les étudiants.",
  36: "Le HP EliteBook 840 G3 premium est la version haute gamme avec Core i5-6300U, 8 Go DDR4 et 256 Go SSD. Écran FHD IPS anti-reflet, autonomie 10h, clavier rétroéclairé. La référence professionnelle.",
  37: "Le Lenovo ThinkPad W540 est une workstation mobile 15.6 pouces FHD IPS avec Core i7-4700MQ Quad-Core, 16 Go DDR3, 1 To HDD et NVIDIA Quadro K2100M. Pour les professionnels de la CAO et du rendu 3D.",
  38: "Le HP ProBook 11 G2 est un laptop éducatif 11.6 pouces FHD tactile avec Core i3-5010U, 8 Go DDR3L et 128 Go SSD. Robuste, léger et pratique pour les salles de classe et étudiants.",
  39: "Le Toshiba disque dur externe 500 Go est fiable et compact. Interface USB 3.0 pour des transferts rapides. Compatible PC, Mac et TV. La solution idéale pour sauvegarder vos données importantes en toute sécurité.",
  40: "Le Seagate disque dur externe 1 To est parfait pour stocker vos films, photos et documents. USB 3.0 haute vitesse, compatible avec tous vos appareils. Format 2.5 pouces ultra-portable.",
  41: "Le Seagate disque dur externe 2 To offre un espace de stockage immense pour vos fichiers multimédias. USB 3.0, format portable 2.5 pouces. La solution ultime pour les créateurs de contenu.",
  42: "Le Toshiba Canvio 1 To est un disque dur externe fiable et élégant. USB 3.0 rétrocompatible USB 2.0, logiciel de sauvegarde inclus. Design minimaliste en noir mat.",
  43: "Le Toshiba disque dur externe 1 To version USB 2.0 est économique et fiable pour stocker vos données. Compatible avec tout PC ou Mac disposant d'un port USB.",
  44: "Le Toshiba Canvio 2 To est idéal pour les grandes collections multimédias. USB 3.0, format slim 2.5 pouces, logiciel de sauvegarde automatique inclus.",
  45: "Ce SSD portable 2 To offre des vitesses de transfert jusqu'à 540 Mo/s grâce à l'USB 3.1 Gen 2. Compact, résistant aux chocs et ultra-rapide. La solution professionnelle pour le travail nomade.",
  46: "Le Verbatim SSD externe 512 Go atteint 500 Mo/s en lecture grâce à l'USB 3.2. Format ultra-compact, robuste et fiable. Idéal pour les créatifs et les professionnels en déplacement.",
  47: "L'Addlink T70 SSD 1 To est un SSD portable ultra-rapide (550 Mo/s) et résistant aux chocs. Compact et léger, il transfère des fichiers volumineux en quelques secondes.",
  48: "L'Addlink T70 SSD 2 To offre le maximum d'espace avec des vitesses professionnelles (550 Mo/s). Parfait pour les vidéastes, photographes et professionnels de la data.",
  49: "Le Samsung T7 SSD 256 Go est le leader des SSD portables avec 1050 Mo/s en lecture USB 3.2. Ultra-compact (58g), avec chiffrement AES-256. La référence absolue en matière de SSD portable.",
  50: "Le Samsung T7 SSD 1 To atteint 1050 Mo/s en lecture. Chiffrement matériel AES-256, empreinte digitale optionnelle. Le choix professionnel pour transporter de gros volumes de données en toute sécurité.",
  51: "L'Addlink T70 SSD 512 Go offre un excellent rapport capacité/prix avec 550 Mo/s de vitesse de lecture. Compact, résistant et fiable pour un usage quotidien professionnel.",
  52: "L'Addlink SSD 256 Go offre des performances SSD à prix accessible. Interface USB 3.1 pour des transferts rapides. Idéal comme complément de stockage rapide.",
  53: "L'Union Memory SSD 256 Go est une solution de stockage portable rapide et économique. Compatible USB 3.1, plug & play sur tous systèmes.",
  54: "Le Western Digital 500 Go interne est un disque dur SATA III 5400 RPM avec cache 16 Mo. Compatible avec tous les laptops et consoles PS4/Xbox. Fiable et économique.",
  55: "Le Western Digital 320 Go interne est un HDD SATA II économique pour remplacer ou upgrader le disque de votre laptop. Parfait pour prolonger la vie de vos anciens ordinateurs.",
  56: "Le Western Digital 250 Go interne est la solution économique pour remplacer ou sauvegarder les données d'un laptop. Format 2.5 pouces SATA compatible universel.",
  57: "Ce boîtier externe USB 3.0 vous permet de transformer n'importe quel disque dur ou SSD 2.5 pouces SATA en disque externe. Aluminium anodisé, plug & play, compatible Windows et Mac.",
  58: "Le Toshiba HDD 500 Go interne 3.5 pouces tourne à 7200 RPM avec 32 Mo de cache SATA III. Parfait pour upgrader ou remplacer le disque d'un ordinateur de bureau.",
  59: "La clé USB FASTER 64 Go USB 3.0 atteint 130 Mo/s en lecture. Corps métallique robuste, capuchon protecteur, plug & play. Idéale pour transporter vos fichiers professionnels.",
  60: "La clé USB FASTER 32 Go USB 3.0 est rapide, fiable et robuste. Corps en aluminium, parfaite pour les transferts de données fréquents.",
  61: "La clé Kioxia (anciennement Toshiba) 32 Go est une clé USB 3.2 fiable avec 100 Mo/s de vitesse de lecture. Design compact et élégant, garantie fabricant.",
  62: "La clé Kioxia 64 Go USB 3.2 offre 100 Mo/s de lecture dans un format compact. Robuste et fiable, la marque de confiance héritée de Toshiba.",
  63: "La clé USB FASTER 64 Go premium atteint 150 Mo/s en lecture USB 3.0. Corps métal premium, parfaite pour les professionnels qui transfèrent de gros fichiers.",
  64: "La clé IMATION 32 Go USB 2.0 est la solution économique et fiable pour les usages basiques. Compatible avec tous les appareils dotés d'un port USB.",
  65: "Ce Flash Driver USB 32 Go à design rétractable protège le connecteur sans capuchon à perdre. USB 3.0 avec 80 Mo/s de lecture. Pratique et robuste.",
  66: "La souris HP sans fil connecte en 2.4 GHz via nano-récepteur USB. Capteur optique 1600 DPI ajustable, 3 boutons, autonomie 12 mois sur 1 pile AA. Confortable et silencieuse.",
  67: "La souris TRUST sans fil offre un capteur 1000/1600 DPI commutable, connexion 2.4 GHz stable, design ergonomique pour droitiers. Nano-récepteur stockable dans la souris.",
  68: "La souris HP filaire USB est compacte, légère et silencieuse. Capteur optique 1000 DPI, câble 1.5 m tressé, compatible Windows/Mac/Linux sans pilote.",
  69: "La souris Genius USB est une souris filaire optique 1000 DPI fiable et abordable. Plug & play, compatible avec tous les systèmes, idéale pour un usage bureautique quotidien.",
  70: "La souris HP optique USB 1200 DPI offre une précision supérieure pour les tâches professionnelles. Câble 1.5 m, design ergonomique ambidextre.",
  71: "La souris Dell filaire USB est robuste et fiable, issue de l'écosystème Dell. Capteur optique 800 DPI précis, câble renforcé, parfaite pour un usage bureautique durable.",
  72: "La souris HP 5 boutons USB offre une productivité accrue avec boutons précédent/suivant, molette rapide et capteur 1200 DPI. Câble 1.8 m pour une liberté de mouvement.",
  73: "La souris HP sans fil premium 2000 DPI est idéale pour les utilisateurs exigeants. 6 boutons, autonomie 18 mois, nano-récepteur USB stockable, design ergonomique.",
  74: "La souris Lenovo filaire USB est simple, fiable et légère. Capteur optique 1200 DPI, compatible avec tous les systèmes Lenovo et autres ordinateurs.",
  75: "La souris Logitech sans fil avec récepteur Unifying est la référence de fiabilité. 18 mois d'autonomie, capteur optique 1000 DPI précis, compatible Windows/Mac/Linux.",
  76: "La souris HP sans fil 1600 DPI offre une connexion stable à 2.4 GHz. Design ergonomique, autonomie 15 mois, compatibilité universelle.",
  77: "La souris Sony filaire USB est compacte et précise avec capteur optique 1000 DPI. Câble 1.5 m, design Sony élégant, plug & play.",
  78: "Le clavier Logitech sans fil AZERTY est la référence française. Récepteur Unifying, 24 mois d'autonomie, pavé numérique, touches résistantes aux éclaboussures.",
  79: "Le clavier HP sans fil AZERTY avec récepteur USB offre une frappe confortable avec pavé numérique complet. Autonomie 12 mois, compatible Windows 10/11.",
  80: "Le clavier Logitech USB AZERTY est silencieux et précis, idéal pour les espaces de travail partagés. Profil bas, touches confortables, compatible tous systèmes.",
  81: "Le clavier Gaming GAMERS sans fil RGB est doté de touches mécaniques et d'un rétroéclairage RGB 16 millions de couleurs. Mode gaming sans latence pour une expérience immersive.",
  82: "Le clavier Gaming GAMERS USB mécanique RGB est le choix des gamers exigeants. Anti-ghosting 104 touches, rétroéclairage RGB, touches mécaniques précises et réactives.",
  83: "Le clavier HP USB AZERTY est silencieux, confortable et fiable pour la bureautique quotidienne. Touches full-size avec pavé numérique, câble USB 1.5 m.",
  84: "Le clavier flexible en silicone USB est imperméable, enroulable et transportable partout. AZERTY complet avec pavé numérique, résiste aux liquides et à la poussière.",
  85: "Le routeur King Crab 4G supporte jusqu'à 32 utilisateurs simultanés à 300 Mbps. Compatible avec tous les opérateurs camerounais (MTN, Orange, Camtel, Nextell, Yoomee). 3 antennes externes pour une couverture maximale.",
  86: "Le modem WiFi Huawei 4G LTE est compact et portable avec batterie intégrée 1500 mAh. Compatible tous opérateurs camerounais, vitesse de téléchargement jusqu'à 100 Mbps. Idéal pour les déplacements.",
  87: "Le modem Huawei 4G LTE avec grande batterie 3000 mAh offre une autonomie prolongée. Idéal pour les voyages, partage de connexion jusqu'à 16 appareils.",
  88: "Le routeur Huawei 4G WiFi est un appareil fixe à domicile ou au bureau. Deux antennes, 32 utilisateurs max, compatible MTN, Orange et tous opérateurs.",
  89: "Le routeur Huawei 4G LTE+ Dual Band (2.4 & 5 GHz) est le plus performant de la gamme avec 200 Mbps et 4 antennes. Idéal pour les maisons et bureaux avec plusieurs utilisateurs simultanés.",
  90: "L'HP EliteBook Desktop est un mini-PC pro avec Core i5-2400, 4 Go DDR3 et 500 Go HDD. Compact, silencieux, 7 ports USB, VGA et HDMI. Parfait pour remplacer une tour encombrante au bureau.",
  91: "Le Fujitsu N12 Desktop est un mini-PC ultra-compact avec Core 2 Duo, 4 Go DDR3 et 500 Go HDD. Consommation basse, peu encombrant, idéal pour la bureautique et les guichets.",
  92: "Le Fujitsu C11 Desktop est un PC compact avec Core i3-2120, 4 Go DDR3 et 320 Go HDD. Format slim, silencieux, idéal pour les espaces limités et la bureautique professionnelle.",
  93: "Le Dell Latitude Desktop est un mini-PC compact avec Core 2 Duo, 4 Go DDR3 et 320 Go HDD. Fiabilité Dell, ports multiples, Windows 10 Pro. Solution économique pour les TPE/PME.",
  94: "L'Asus Vo1 Desktop est un PC compact avec Core i3-4160, 4 Go DDR3 et 320 Go HDD. HDMI intégré pour le branchement sur écran ou TV. Performant pour la bureautique avancée.",
  95: "L'Acer Aspire Desktop est un PC compact avec Core i3-4160, 4 Go DDR3 et 500 Go HDD. Port HDMI et VGA, Windows 10 Pro. Solution abordable et performante pour la maison et le bureau.",
  96: "Le module RAM DDR3L 8 Go 1600 MHz SO-DIMM est compatible avec la majorité des laptops Intel et AMD. Basse tension (1.35 V), plug & play, améliore significativement la réactivité de votre ordinateur.",
  97: "Le module RAM DDR4 16 Go 3200 MHz SO-DIMM est idéal pour upgrader votre laptop moderne. Fréquence haute pour les gamers et professionnels, tension 1.2 V basse consommation.",
  98: "Le kit RAM DDR3L 16 Go (2×8 Go) 1600 MHz SO-DIMM est la solution ultime pour maximiser les performances de votre laptop. Double canal pour des performances optimales.",
  99: "Le module DDR4 4 Go 2400 MHz SO-DIMM est parfait pour doubler la RAM d'un laptop d'entrée de gamme. Compatible Intel 6/7ème génération, installation rapide.",
  100:"Le module DDR2 1 Go 667 MHz SO-DIMM est compatible avec les anciens laptops (2005-2010). Solution économique pour prolonger la vie de vos équipements plus anciens.",
  101:"Le module DDR4 8 Go 2666 MHz SO-DIMM est compatible avec les laptops Intel 8/9ème génération. Améliore significativement la fluidité du multitâche et des applications gourmandes.",
  102:"Le module DDR2 2 Go 800 MHz SO-DIMM est compatible avec les laptops de génération Core 2 Duo. Solution économique pour ajouter de la RAM sur d'anciens appareils.",
  103:"Le module DDR2 2 Go 800 MHz DIMM est compatible avec les desktops de génération Intel Core 2 Duo et Pentium. Extension mémoire économique pour PC de bureau.",
  104:"Le module DDR2 1 Go 667 MHz DIMM est compatible avec les anciens desktops. Solution très économique pour les PC de bureau d'occasion.",
  105:"Le module DDR3 8 Go 1600 MHz DIMM est compatible avec les desktops Intel et AMD modernes. Plug & play, améliore la fluidité pour la bureautique et le multitâche.",
  106:"Le module DDR3 4 Go 1600 MHz DIMM est la solution idéale pour doubler la RAM de votre desktop. Compatible Intel i3/i5/i7 et AMD, installation simple.",
  107:"Le kit DDR3 16 Go (2×8 Go) 1600 MHz DIMM est la configuration idéale pour les desktops puissants. Double canal pour des performances maximales en multitâche.",
  108:"Kaspersky Total Security 2 postes protège vos 2 ordinateurs pendant 1 an contre tous les malwares, ransomwares et menaces en ligne. VPN 200 Mo/jour, gestionnaire de mots de passe, compatible Windows/Mac/Android/iOS.",
  109:"Kaspersky Total Security 4 postes protège toute votre famille ou équipe pendant 1 an. Protection complète, anti-ransomware, VPN inclus, contrôle parental, compatible multiplateforme.",
  110:"Kaspersky Internet Security 4 postes offre une protection en temps réel, pare-feu intelligent et anti-spam. Idéal pour sécuriser les usages quotidiens sur internet de toute la famille.",
  111:"Kaspersky Anti-Virus Standard 4 postes offre une protection essentielle contre virus, malwares et espions. Léger, performant, optimisation PC incluse. Compatible Windows uniquement.",
  112:"Kaspersky Security Cloud 4 postes s'adapte automatiquement aux menaces grâce à l'intelligence artificielle. VPN illimité inclus, compatible tous systèmes.",
  113:"Kaspersky Total Security 5 postes / 2 ans est l'offre la plus complète : protection totale, VPN, contrôle parental, gestionnaire de mots de passe. La tranquillité d'esprit pour 2 ans.",
  114:"Norton 360 Deluxe 9 postes offre la protection ultime : antivirus, VPN illimité, surveillance du Dark Web, sauvegarde cloud 75 Go, compatible Windows/Mac/Android/iOS.",
  115:"Norton Antivirus Plus 4 postes protège vos ordinateurs avec un pare-feu intelligent et 2 Go de sauvegarde cloud. Simple à utiliser, performant et léger.",
  116:"Norton 360 Standard 5 postes inclut antivirus, VPN illimité et 10 Go de sauvegarde cloud. Protection complète pour toute votre famille ou équipe.",
  117:"Kaspersky Anti-Virus Essential 2 postes est la solution d'entrée de gamme parfaite pour une protection fiable. Scan en temps réel, protection contre les virus et malwares. Compatible Windows.",
  118:"Le projecteur Philips 3200 Lumens XGA est fiable et lumineux pour les présentations en salle de conférence. VGA, HDMI, USB, son intégré. Durée de vie lampe 10 000 heures.",
  119:"Le TOPTRO 9000 Lumens Full HD est un projecteur puissant avec zoom 50%, double HDMI et triple USB. Idéal pour les grandes salles, cinémas maison et présentations en extérieur.",
  120:"Le Panasonic projecteur professionnel 3200 Lumens XGA est robuste et fiable pour un usage intensif. Double VGA, HDMI, contraste 2000:1, durée de vie lampe 7000 heures.",
  121:"Le TMY LED Full HD 3200 Lumens est un projecteur moderne sans lampe à remplacer (50 000 heures LED). HDMI, VGA, USB, son intégré. Parfait pour l'enseignement et les PME.",
  122:"Le TMY LED Full HD 5000 Lumens offre une luminosité supérieure pour les grandes salles. Double HDMI, double USB, son stéréo. La solution professionnelle sans entretien de lampe.",
  123:"Le TMY mini projecteur portable avec batterie 5000 mAh vous libère des prises de courant. Full HD 3200 Lumens, HDMI et USB. Parfait pour les présentations nomades et le cinéma en plein air.",
  124:"Le Casio projecteur Laser & LED hybride élimine le besoin de remplacer la lampe (20 000 heures). 3000 Lumens XGA, connectivité réseau LAN pour la gestion à distance. Solution professionnelle durable.",
  125:"L'Epson projecteur WXGA 3200 Lumens offre une image large format native 16:10. Contraste 15 000:1 pour des noirs profonds, double VGA, HDMI, USB. La référence professionnelle Epson.",
  126:"Le I-Touch X718 est une tablette/téléphone 7 pouces avec 256 Go de stockage, 8 Go RAM et caméra 13 MP. Android 10, batterie 6000 mAh, 4G LTE, double SIM. Parfait pour les contenus multimédias.",
  127:"Le I-Touch A702 est une tablette 7 pouces Android avec 16 Go de stockage et 2 Go RAM. Économique et pratique pour la navigation, WhatsApp, YouTube et les appels. Double SIM.",
  128:"Le I-Touch B33 est un smartphone Android 5.5 pouces avec 16 Go de stockage et 2 Go RAM. Caméra 8 MP, batterie 3000 mAh, double SIM. Idéal comme téléphone secondaire ou pour les débutants.",
  129:"Le Lenovo Tab M8 T8505x est une tablette 4G 8 pouces FHD avec MediaTek Helio P22T, 4 Go RAM et 32 Go. Performante pour les jeux, la vidéo et la navigation. Batterie 5000 mAh longue durée.",
  130:"Le C Idea Cm525 est un smartphone 5.5 pouces Android 10 avec 64 Go, 4 Go RAM et double caméra 13 MP. 4G LTE, batterie 4000 mAh, design moderne. Excellent rapport qualité/prix.",
  131:"Le I-Touch Yes 24 est un smartphone Android compact 5 pouces avec 32 Go, 2 Go RAM et batterie 2500 mAh. Simple, fiable et économique pour les usages quotidiens.",
  132:"Le C Idea 5G LTE Pro est un smartphone haut de gamme avec écran AMOLED 6.7 pouces, 256 Go, 6 Go RAM, triple caméra 48 MP. 5G, batterie 5000 mAh, Android 12. L'excellence accessible.",
  133:"Le C Idea 5G LTE Standard est un smartphone 6.5 pouces avec 64 Go, 4 Go RAM et caméra 16 MP. 5G, batterie 4500 mAh, Android 11. Le futur de la connectivité à prix accessible.",
  134:"Cet adaptateur VGA vers HDMI SAMSUNG convertit la sortie VGA de votre ordinateur en signal HDMI pour écran ou projecteur. Résolution jusqu'à 1080P, plug & play sans logiciel.",
  135:"Ce hub USB HP transforme un port USB en 4 ports USB 3.0. Idéal pour connecter plusieurs périphériques simultanément. Compatible PC et Mac, plug & play.",
  136:"Ce câble HP Mv2 3-en-1 charge et synchronise simultanément micro-USB, iPhone et USB-C. Un seul câble pour tous vos appareils. Charge rapide supportée.",
  137:"Cet adaptateur Sony HDMI vers Android (MHL) vous permet d'afficher votre smartphone sur TV ou projecteur HDMI. Compatible Samsung, Huawei, LG. Résolution jusqu'à 1080P.",
  138:"Cet adaptateur HP HDMI vers USB capture le signal vidéo HDMI sur votre PC. Compatible avec les consoles de jeux et lecteurs multimédias. Plug & play.",
  139:"Ce câble Asus 3-en-1 recharge simultanément un appareil Android, un iPhone et un USB-C. Design compact, charge rapide, résistant à l'usure.",
  140:"Cet adaptateur SAMSUNG HDMI vers VGA est idéal pour connecter un PC moderne à un ancien projecteur VGA. Résolution 1080P, prise jack audio 3.5mm intégrée.",
  141:"Ce câble Samsung USB vers Micro-USB charge et synchronise vos appareils Android rapidement. Câble 1 m, charge 5V/2A, compatible Samsung, Huawei, etc.",
  142:"Ce câble Sony USB vers Micro-USB est long (1.5 m) et supporte la charge rapide. Tressage renforcé pour une durée de vie prolongée.",
  143:"Ce câble Sony USB vers Type-C (1.2 m) supporte la charge rapide 18W. Compatible avec tous les smartphones et tablettes USB-C modernes.",
  144:"Ce câble Sony USB vers Type-C premium (2 m) offre la charge rapide 20W et les transferts de données USB 3.1. Long câble renforcé pour une utilisation confortable.",
  145:"Ce hub HP USB-A permet de multiplier vos ports USB avec 4 ports USB 3.0. Compatible PC et Mac, plug & play, alimentation par bus.",
  146:"Ce hub HP USB-C multiport offre ports USB-C, 2×USB et HDMI. Idéal pour les laptops modernes avec peu de ports. Plug & play, compatible PC et Mac.",
  147:"La LG Smart TV 32 pouces HD propose webOS, Chromecast intégré, Wi-Fi et Bluetooth. Grande image claire pour la maison ou le bureau. Ports HDMI et USB pour connecter tous vos appareils.",
  148:"La LG Smart TV 43 pouces Full HD propose webOS 6.0 avec Netflix, YouTube, etc. HDR10, Wi-Fi, 3×HDMI. Image lumineuse et son clair pour votre salon ou salle de réunion.",
  149:"La LG Smart TV 55 pouces 4K Ultra HD offre une image époustouflante avec Dolby Vision et Dolby Atmos. webOS 6.0, Wi-Fi, 4×HDMI 2.0. L'expérience cinéma à domicile.",
  150:"La Samsung Smart TV 43 pouces Full HD propose Tizen OS avec accès Netflix, YouTube, Prime Video. HDR10+, Wi-Fi, Bixby Voice. Design élégant et son clair.",
  151:"Le chargeur Toshiba 65W compatible avec les séries Satellite. Tension 12V/4.3A, connecteur petit rond 5.5×2.5mm, câble 1.8 m. Neuf avec emballage d'origine.",
  152:"Le chargeur HP 65W est compatible avec ProBook, EliteBook et la plupart des portables HP. Tension 19.5V/3.33A, connecteur bleu HP authentique, câble 1.8 m.",
  153:"Le chargeur Acer 65W est compatible avec les séries Aspire, Swift et TravelMate. Tension 19V/3.42A, connecteur rond 5.5×1.7mm. Câble blindé, protection surtension.",
  154:"Le chargeur Lenovo 65W à connecteur carré (11×5mm) est compatible ThinkPad T, E, X et IdeaPad. Tension 20V/3.25A, protection court-circuit. Neuf avec certification Lenovo.",
  155:"Le chargeur Dell 65W authentique avec connecteur baril 7.4×5.0mm est compatible Latitude, Inspiron et Vostro. Tension 19.5V/3.34A, câble 1.8 m, protection thermique.",
  156:"Le chargeur Lenovo 90W à connecteur carré est compatible ThinkPad et IdeaPad haute performance. Tension 20V/4.5A, idéal pour les laptops gourmands en énergie.",
  157:"La sacoche Lenovo 14 pouces est élégante et fonctionnelle avec compartiment dédié ordinateur rembourré, poche accessoires et bandoulière réglable. Polyester résistant noir.",
  158:"Le sac à dos Enzo 15.6 pouces en nylon imperméable offre 5 compartiments et un port USB externe pour charger votre téléphone en marchant. Parfait pour les étudiants.",
  159:"La sacoche rigide Toshiba 15.6 pouces protège votre ordinateur avec sa structure semi-rigide. 4 compartiments, bandoulière réglable. Design gris/noir élégant.",
  160:"Le sac à dos Dell Pro 15.6 pouces est conçu pour les professionnels avec 6 compartiments, port USB externe et protection anti-chocs renforcée. Nylon résistant noir.",
  161:"La sacoche HP Active 15.6 pouces est résistante à l'eau et légère. 3 compartiments organisés, poignée et bandoulière amovible. Idéale pour une utilisation quotidienne.",
  162:"Le sac à dos Lenovo Casual 15 pouces en coloris bleu/gris est moderne et pratique. 4 compartiments, port USB externe. Parfait pour les étudiants et jeunes professionnels.",
  163:"La malette HP 15 pouces en simili-cuir est élégante et professionnelle avec 5 compartiments. Poignée confortable et bandoulière amovible. Le choix des dirigeants.",
  164:"Le sac slim Toshiba 15 pouces en polyester gris est léger et résistant à l'eau. 3 compartiments essentiels pour un usage minimaliste mais efficace.",
  165:"Le sac Gaming Lenovo 15.6 pouces noir/rouge est conçu pour les gamers avec 6 compartiments ultra-organisés, port USB charge et rembourrage renforcé. Style gaming assumé.",
};

type RawProd = [number, string, number, number, string, number, string];

const RAW: RawProd[] = [
  // ORDINATEURS (1-38)
  [1, "DELL Latitude 3190", 65000, 80000, "ordinateurs", 245, "Intel Celeron N4020, 128 Go SSD, 8 Go RAM"],
  [2, "HP Elitebook 840 G3", 160000, 175000, "ordinateurs", 189, "Core i5-6300U, 256 Go SSD, 8 Go RAM"],
  [3, "LENOVO V15 G2 IJL", 180000, 195000, "ordinateurs", 156, "Intel Celeron N4500, 256 Go SSD, 4 Go RAM"],
  [4, "DELL Latitude 3380", 110000, 125000, "ordinateurs", 134, "Core i3-6006U, 128 Go SSD, 8 Go RAM"],
  [5, "HP Elitebook Folio", 110000, 125000, "ordinateurs", 178, "Core i5-5300U, 500 Go HDD, 8 Go RAM"],
  [6, "HP Probook 645", 115000, 130000, "ordinateurs", 156, "AMD A4-7300B, 8 Go SSD, 8 Go RAM"],
  [7, "LENOVO Thinkpad X130e", 65000, 80000, "ordinateurs", 201, "AMD E1-1200, 250 Go HDD, 4 Go RAM"],
  [8, "LENOVO Thinkpad P50s", 210000, 225000, "ordinateurs", 89, "Core i7-6600U, 512 Go SSD, 16 Go RAM"],
  [9, "DELL Latitude E5580", 230000, 245000, "ordinateurs", 67, "Core i7-7820HQ, 512 Go SSD, 16 Go RAM"],
  [10, "SONY SVF152A29M", 150000, 165000, "ordinateurs", 123, "Core i5-3337U, 500 Go HDD, 8 Go RAM"],
  [11, "LENOVO Thinkpad E560", 130000, 145000, "ordinateurs", 145, "Core i5-6200U, 500 Go HDD, 12 Go RAM"],
  [12, "LENOVO 11E", 90000, 105000, "ordinateurs", 167, "Core i3-6100U, 128 Go SSD, 4 Go RAM"],
  [13, "HP Chrome Book", 50000, 65000, "ordinateurs", 189, "Intel Celeron N3060, 128 Go SSD, 4 Go RAM"],
  [14, "HP Probook 645 G3", 115000, 130000, "ordinateurs", 156, "AMD A6-8530B, 500 Go HDD, 8 Go RAM"],
  [15, "HP Zbook 15 G3", 160000, 175000, "ordinateurs", 98, "Core i7-6820HQ, 750 Go HDD, 16 Go RAM"],
  [16, "HP 11 Stream", 50000, 65000, "ordinateurs", 201, "Intel Celeron N3060, 128 Go SSD, 4 Go RAM"],
  [17, "LENOVO 11e", 80000, 95000, "ordinateurs", 178, "Celeron N2940 Quad-Core, 320 Go HDD, 8 Go RAM"],
  [18, "LENOVO T480", 150000, 165000, "ordinateurs", 134, "Core i5-8350U, 256 Go SSD, 8 Go RAM"],
  [19, "HP Probook 650 G2", 120000, 135000, "ordinateurs", 145, "AMD A6-8530B, 500 Go HDD, 8 Go RAM"],
  [20, "LENOVO Thinkpad X270", 150000, 165000, "ordinateurs", 123, "Core i5-7300U, 500 Go HDD, 8 Go RAM"],
  [21, "HP 6560b", 110000, 125000, "ordinateurs", 167, "Core i5-2520M, 500 Go HDD, 4 Go RAM"],
  [22, "HP X360", 85000, 100000, "ordinateurs", 189, "Celeron Quad-Core, 128 Go SSD, 4 Go RAM"],
  [23, "DELL Vostro 5568", 150000, 165000, "ordinateurs", 156, "Core i5-7200U, 1 To HDD, 8 Go RAM"],
  [24, "DELL Latitude 5440", 150000, 165000, "ordinateurs", 134, "Core i5-4300U, 500 Go HDD, 8 Go RAM"],
  [25, "DELL Latitude 3190 2-in-1", 80000, 95000, "ordinateurs", 178, "Intel Atom x5-E3940, 128 Go SSD, 4 Go RAM"],
  [26, "LENOVO 11E", 70000, 85000, "ordinateurs", 201, "Intel Atom x5-Z8350, 128 Go SSD, 4 Go RAM"],
  [27, "DELL Latitude E5520", 125000, 140000, "ordinateurs", 145, "Core i3-2310M, 500 Go HDD, 8 Go RAM"],
  [28, "TOSHIBA NB250-108", 65000, 80000, "ordinateurs", 189, "Intel Atom N455, 250 Go HDD, 2 Go RAM"],
  [29, "HP ProBook 640 G1", 130000, 145000, "ordinateurs", 123, "Core i7-4600M, 500 Go HDD, 8 Go RAM"],
  [30, "HP Elitebook 840 G6", 210000, 225000, "ordinateurs", 89, "Core i5-8265U, 256 Go SSD NVMe, 16 Go RAM"],
  [31, "HP EliteBook 845 G7", 270000, 285000, "ordinateurs", 67, "AMD Ryzen 5 PRO 4650U, 512 Go SSD NVMe, 16 Go RAM"],
  [32, "HP MINI 3115m", 90000, 105000, "ordinateurs", 145, "AMD A2-3305M, 500 Go HDD, 4 Go RAM"],
  [33, "DELL Latitude E6540", 130000, 145000, "ordinateurs", 123, "Core i5-4300M, 1 To HDD, 8 Go RAM"],
  [34, "HP Folio", 195000, 210000, "ordinateurs", 98, "Core i7-3517U, 500 Go HDD, 16 Go RAM"],
  [35, "LENOVO Yoga 11e X360", 80000, 95000, "ordinateurs", 167, "Celeron N2940 Quad-Core, 320 Go HDD, 4 Go RAM"],
  [36, "HP Elitebook I 840 G3", 250000, 265000, "ordinateurs", 78, "Core i5-6300U, 256 Go SSD, 8 Go RAM"],
  [37, "LENOVO Thinkpad W540", 205000, 220000, "ordinateurs", 67, "Core i7-4700MQ Quad-Core, 1 To HDD, 16 Go RAM"],
  [38, "HP Probook 11 G2", 90000, 105000, "ordinateurs", 145, "Core i3-5010U, 128 Go SSD, 8 Go RAM"],
  // DISQUES DURS (39-58)
  [39, "TOSHIBA Disque Dur 500 Go", 15000, 18500, "disques", 456, "HDD Externe, USB 3.0, 500 Go"],
  [40, "SEAGATE Disque Dur 1 To", 25000, 28500, "disques", 389, "HDD Externe, USB 3.0, 1 To"],
  [41, "SEAGATE Disque Dur 2 To", 45000, 48500, "disques", 234, "HDD Externe, USB 3.0, 2 To"],
  [42, "TOSHIBA Canvio 1 To", 25000, 28500, "disques", 378, "HDD Externe Canvio, USB 3.0, 1 To"],
  [43, "TOSHIBA Disque Dur 1 To USB 2.0", 20000, 23500, "disques", 412, "HDD Externe, USB 2.0, 1 To"],
  [44, "TOSHIBA Canvio 2 To", 40000, 43500, "disques", 189, "HDD Externe Canvio, USB 3.0, 2 To"],
  [45, "Portable SSD 2 To", 65000, 68500, "disques", 156, "SSD Portable, USB 3.1 Gen 2, 540 Mo/s"],
  [46, "VERBATIM SSD 512 Go", 35000, 38500, "disques", 267, "SSD Externe, USB 3.2, 500 Mo/s"],
  [47, "ADDLINK SSD T70 1 To", 45000, 48500, "disques", 189, "SSD Externe T70, USB 3.1, 550 Mo/s"],
  [48, "ADDLINK SSD T70 2 To", 65000, 68500, "disques", 134, "SSD Externe T70, USB 3.1, 550 Mo/s"],
  [49, "SAMSUNG T7 SSD 256 Go", 22000, 25500, "disques", 456, "SSD Externe T7, USB 3.2, 1050 Mo/s"],
  [50, "SAMSUNG T7 SSD 1 To", 45000, 48500, "disques", 289, "SSD Externe T7, USB 3.2, 1050 Mo/s"],
  [51, "ADDLINK SSD T70 512 Go", 35000, 38500, "disques", 234, "SSD Externe T70, USB 3.1, 550 Mo/s"],
  [52, "ADDLINK SSD 256 Go", 20000, 23500, "disques", 378, "SSD Externe, USB 3.1, 400 Mo/s"],
  [53, "UNION MEMORY SSD 256 Go", 22000, 25500, "disques", 267, "SSD Externe, USB 3.1, 400 Mo/s"],
  [54, "WESTERN DIGITAL 500 Go Interne", 10000, 13500, "disques", 512, "HDD Interne 2.5\", SATA III, 5400 RPM"],
  [55, "WESTERN DIGITAL 320 Go Interne", 8000, 11500, "disques", 567, "HDD Interne 2.5\", SATA II, 5400 RPM"],
  [56, "WESTERN DIGITAL 250 Go Interne", 6000, 9500, "disques", 589, "HDD Interne 2.5\", SATA II"],
  [57, "Boîtier Externe USB 3.0", 15000, 18500, "disques", 345, "Boîtier HDD/SSD 2.5\", USB 3.0, Aluminium"],
  [58, "TOSHIBA HDD 500 Go Desktop", 15000, 18500, "disques", 456, "HDD Interne 3.5\", SATA III, 7200 RPM"],
  // CLÉS USB (59-65)
  [59, "FASTER Clé USB 64 Go", 5500, 9000, "usb", 678, "USB 3.0, 130 Mo/s, Corps Métal"],
  [60, "FASTER Clé USB 32 Go", 4000, 7500, "usb", 789, "USB 3.0, 130 Mo/s, Corps Métal"],
  [61, "Kioxia Clé USB 32 Go", 4000, 7500, "usb", 645, "USB 3.2 Gen 1, 100 Mo/s"],
  [62, "Kioxia Clé USB 64 Go", 5500, 9000, "usb", 567, "USB 3.2 Gen 1, 100 Mo/s"],
  [63, "FASTER Clé USB 64 Go Premium", 5500, 9000, "usb", 612, "USB 3.0, 150 Mo/s, Corps Métal"],
  [64, "IMATION Clé USB 32 Go", 4000, 7500, "usb", 534, "USB 2.0, 25 Mo/s"],
  [65, "Flash Driver USB 32 Go", 7000, 10500, "usb", 456, "USB 3.0, 80 Mo/s, Design Rétractable"],
  // SOURIS (66-77)
  [66, "HP Souris Sans Fil", 5000, 6500, "souris", 789, "Sans fil, USB 2.4 GHz, 1600 DPI"],
  [67, "TRUST Souris Sans Fil", 5000, 6500, "souris", 678, "Sans fil, USB 2.4 GHz, 1600 DPI"],
  [68, "HP Souris USB Filaire", 3000, 4500, "souris", 912, "Filaire USB, Optique, 1000 DPI"],
  [69, "GENIUS Souris USB", 3000, 4500, "souris", 834, "Filaire USB, Optique, 1000 DPI"],
  [70, "HP Souris Optique USB", 3000, 4500, "souris", 756, "Filaire USB, Optique, 1200 DPI"],
  [71, "DELL Souris USB", 2500, 4000, "souris", 945, "Filaire USB, Optique, 800 DPI"],
  [72, "HP Souris 5 Boutons USB", 2500, 4000, "souris", 867, "Filaire USB, 5 Boutons, 1200 DPI"],
  [73, "HP Souris Sans Fil Premium", 5000, 6500, "souris", 723, "Sans fil, 6 Boutons, 2000 DPI"],
  [74, "LENOVO Souris USB", 2500, 4000, "souris", 912, "Filaire USB, Optique, 1200 DPI"],
  [75, "LOGITECH Souris Sans Fil", 4500, 6000, "souris", 645, "Sans fil Unifying, 1000 DPI"],
  [76, "HP Souris Sans Fil 1600", 4000, 5500, "souris", 723, "Sans fil, 1600 DPI, 15 mois"],
  [77, "SONY Souris USB", 3000, 4500, "souris", 834, "Filaire USB, Optique, 1000 DPI"],
  // CLAVIERS (78-84)
  [78, "LOGITECH Clavier Sans Fil", 10000, 11500, "claviers", 456, "Sans fil, AZERTY, Pavé numérique"],
  [79, "HP Clavier Sans Fil", 10000, 11500, "claviers", 423, "Sans fil, AZERTY, Pavé numérique"],
  [80, "LOGITECH Clavier USB", 2500, 4000, "claviers", 789, "Filaire USB, AZERTY, Silencieux"],
  [81, "GAMERS Clavier RGB Sans Fil", 10000, 11500, "claviers", 345, "Sans fil, RGB, Mécanique, Gaming"],
  [82, "GAMERS Clavier RGB USB", 15000, 16500, "claviers", 267, "Filaire USB, RGB, Mécanique, Gaming"],
  [83, "HP Clavier USB", 3000, 4500, "claviers", 612, "Filaire USB, AZERTY, Silencieux"],
  [84, "Clavier Flexible Silicone USB", 6000, 7500, "claviers", 489, "Filaire USB, Silicone, Imperméable"],
  // MODEMS (85-89)
  [85, "KING CRAB Routeur WiFi 4G", 35000, 40000, "modems", 189, "4G LTE, 300 Mbps, 32 utilisateurs"],
  [86, "HUAWEI Modem WiFi 4G 1500mAh", 17500, 22500, "modems", 456, "4G LTE, 100 Mbps, Batterie 1500 mAh"],
  [87, "HUAWEI Modem WiFi 4G 3000mAh", 17500, 22500, "modems", 423, "4G LTE, 100 Mbps, Batterie 3000 mAh"],
  [88, "HUAWEI Routeur WiFi 4G", 17500, 22500, "modems", 378, "4G LTE, 100 Mbps, 32 utilisateurs"],
  [89, "HUAWEI Routeur WiFi 4G+ Dual Band", 21000, 26000, "modems", 267, "4G LTE+, 200 Mbps, Dual Band 2.4/5 GHz"],
  // DESKTOP (90-95)
  [90, "HP Elitebook Desktop", 95000, 110000, "desktops", 156, "Core i5, 500 Go HDD, 4 Go RAM"],
  [91, "FUJITSU N12 Desktop", 55000, 70000, "desktops", 234, "Core 2 Duo, 500 Go HDD, 4 Go RAM"],
  [92, "FUJITSU C11 Desktop", 70000, 85000, "desktops", 189, "Core i3-2120, 320 Go HDD, 4 Go RAM"],
  [93, "DELL Latitude Desktop", 55000, 70000, "desktops", 201, "Core 2 Duo, 320 Go HDD, 4 Go RAM"],
  [94, "ASUS Vo1 Desktop", 70000, 85000, "desktops", 167, "Core i3-4160, 320 Go HDD, 4 Go RAM"],
  [95, "ACER Aspire Desktop", 70000, 85000, "desktops", 178, "Core i3-4160, 500 Go HDD, 4 Go RAM"],
  // RAM (96-107)
  [96, "DDR3L 8 Go 1600 MHz Laptop", 14000, 15500, "ram", 456, "DDR3L, 8 Go, SO-DIMM, 1600 MHz"],
  [97, "DDR4 16 Go 3200 MHz Laptop", 28000, 29500, "ram", 267, "DDR4, 16 Go, SO-DIMM, 3200 MHz"],
  [98, "DDR3L 16 Go 1600 MHz Laptop", 20000, 21500, "ram", 345, "DDR3L, 2×8 Go, SO-DIMM, 1600 MHz"],
  [99, "DDR4 4 Go 2400 MHz Laptop", 11000, 12500, "ram", 567, "DDR4, 4 Go, SO-DIMM, 2400 MHz"],
  [100, "DDR2 1 Go 667 MHz Laptop", 3000, 4500, "ram", 789, "DDR2, 1 Go, SO-DIMM, 667 MHz"],
  [101, "DDR4 8 Go 2666 MHz Laptop", 25000, 26500, "ram", 234, "DDR4, 8 Go, SO-DIMM, 2666 MHz"],
  [102, "DDR2 2 Go 800 MHz Laptop", 5000, 6500, "ram", 456, "DDR2, 2 Go, SO-DIMM, 800 MHz"],
  [103, "DDR2 2 Go 800 MHz Desktop", 5000, 6500, "ram", 378, "DDR2, 2 Go, DIMM, 800 MHz"],
  [104, "DDR2 1 Go 667 MHz Desktop", 3000, 4500, "ram", 567, "DDR2, 1 Go, DIMM, 667 MHz"],
  [105, "DDR3 8 Go 1600 MHz Desktop", 14000, 15500, "ram", 345, "DDR3, 8 Go, DIMM, 1600 MHz"],
  [106, "DDR3 4 Go 1600 MHz Desktop", 8000, 9500, "ram", 489, "DDR3, 4 Go, DIMM, 1600 MHz"],
  [107, "DDR3 16 Go 1600 MHz Desktop", 28000, 29500, "ram", 234, "DDR3, 2×8 Go, DIMM, 1600 MHz"],
  // ANTIVIRUS (108-117)
  [108, "KASPERSKY Total Security 2 Postes 1 An", 15000, 17500, "antivirus", 456, "2 postes, 1 an, Windows/Mac/Android/iOS"],
  [109, "KASPERSKY Total Security 4 Postes 1 An", 19000, 21500, "antivirus", 345, "4 postes, 1 an, Windows/Mac/Android/iOS"],
  [110, "KASPERSKY Internet Security 4 Postes", 18000, 20500, "antivirus", 378, "4 postes, 1 an, Windows/Mac"],
  [111, "KASPERSKY Anti-Virus 4 Postes", 18000, 20500, "antivirus", 267, "4 postes, 1 an, Windows"],
  [112, "KASPERSKY Security Cloud 4 Postes", 18000, 20500, "antivirus", 312, "4 postes, 1 an, VPN illimité"],
  [113, "KASPERSKY Total Security 5 Postes 2 Ans", 25000, 27500, "antivirus", 189, "5 postes, 2 ans, Protection complète"],
  [114, "NORTON 360 Deluxe 9 Postes", 30000, 32500, "antivirus", 156, "9 postes, 1 an, VPN illimité, 75 Go Cloud"],
  [115, "NORTON Antivirus Plus 4 Postes", 19000, 21500, "antivirus", 234, "4 postes, 1 an, Pare-feu intelligent"],
  [116, "NORTON 360 Standard 5 Postes", 20000, 22500, "antivirus", 267, "5 postes, 1 an, VPN illimité, 10 Go Cloud"],
  [117, "KASPERSKY Anti-Virus Essential 2 Postes", 15000, 17500, "antivirus", 345, "2 postes, 1 an, Windows uniquement"],
  // PROJECTEURS (118-125)
  [118, "PHILIPS Projecteur 3200 Lumens", 120000, 130000, "projecteurs", 89, "XGA, 3200 Lumens, VGA/HDMI, 10 000h lampe"],
  [119, "TOPTRO Projecteur 9000 Lumens Full HD", 100000, 110000, "projecteurs", 123, "Full HD, 9000 Lumens, VGA/HDMI×2"],
  [120, "PANASONIC Projecteur Pro", 110000, 120000, "projecteurs", 78, "XGA, 3200 Lumens, VGA×2/HDMI, 7000h"],
  [121, "TMY Projecteur LED Full HD", 75000, 85000, "projecteurs", 145, "Full HD LED, 3200 Lumens, 50 000h"],
  [122, "TMY Projecteur LED 5000 Lumens", 75000, 85000, "projecteurs", 156, "Full HD LED, 5000 Lumens, Stéréo"],
  [123, "TMY Mini Projecteur Portable", 75000, 85000, "projecteurs", 134, "Full HD, Batterie 5000 mAh, Portable"],
  [124, "CASIO Laser & LED Projecteur", 110000, 120000, "projecteurs", 67, "XGA, Laser+LED, 20 000h, Réseau LAN"],
  [125, "EPSON Projecteur WXGA Pro", 100000, 110000, "projecteurs", 89, "WXGA 1280×800, 3200 Lumens, 15 000:1"],
  // TÉLÉPHONES (126-133)
  [126, "I-Touch X718", 40000, 48500, "phones", 345, "7 pouces, 256 Go, 8 Go RAM, 4G LTE"],
  [127, "I-Touch A702", 30000, 38500, "phones", 456, "7 pouces, 16 Go, 2 Go RAM, Android 9"],
  [128, "I-Touch B33", 30000, 38500, "phones", 423, "5.5 pouces, 16 Go, 2 Go RAM, Android 9"],
  [129, "LENOVO T8-8505x", 55000, 63500, "phones", 189, "8 pouces FHD, 32 Go, 4 Go RAM, 4G LTE"],
  [130, "C Idea Cm525", 35000, 43500, "phones", 267, "5.5 pouces, 64 Go, 4 Go RAM, 4G"],
  [131, "I-Touch Yes 24", 40000, 48500, "phones", 234, "5 pouces, 32 Go, 2 Go RAM, Android 9"],
  [132, "C Idea 5G LTE Pro", 38000, 46500, "phones", 189, "6.7 pouces AMOLED, 256 Go, 6 Go RAM, 5G"],
  [133, "C Idea 5G LTE Standard", 35000, 43500, "phones", 156, "6.5 pouces, 64 Go, 4 Go RAM, 5G"],
  // ADAPTATEURS (134-146)
  [134, "SAMSUNG Adaptateur VGA → HDMI", 5000, 6500, "adaptateurs", 567, "VGA → HDMI, 1080P, Plug & Play"],
  [135, "HP Hub USB 4×USB 3.0", 5000, 6500, "adaptateurs", 489, "Hub USB, 4×USB 3.0, Plug & Play"],
  [136, "HP Câble 3-en-1 USB Mv2", 4000, 5500, "adaptateurs", 612, "USB → Android/iPhone/Type-C, Charge Rapide"],
  [137, "SONY Adaptateur HDMI → Android", 3000, 4500, "adaptateurs", 678, "HDMI → Android MHL, 1080P"],
  [138, "HP Adaptateur HDMI → USB", 6000, 7500, "adaptateurs", 456, "HDMI → USB 3.0, Capture Vidéo"],
  [139, "ASUS Câble 3-en-1 USB B12", 1500, 3000, "adaptateurs", 789, "USB → Android/iPhone/Type-C"],
  [140, "SAMSUNG Adaptateur HDMI → VGA", 7000, 8500, "adaptateurs", 345, "HDMI → VGA, 1080P, Audio 3.5mm"],
  [141, "SAMSUNG Câble USB → Micro-USB", 2000, 3500, "adaptateurs", 912, "USB → Micro-USB, 1 m, 5V/2A"],
  [142, "SONY Câble USB → Micro-USB", 2000, 3500, "adaptateurs", 867, "USB → Micro-USB, 1.5 m, Charge Rapide"],
  [143, "SONY Câble USB → Type-C 18W", 2000, 3500, "adaptateurs", 756, "USB → Type-C, 1.2 m, 18W"],
  [144, "SONY Câble USB → Type-C 20W", 2000, 3500, "adaptateurs", 834, "USB → Type-C, 2 m, 20W, USB 3.1"],
  [145, "HP Hub USB-A 4 Ports", 5000, 6500, "adaptateurs", 489, "Hub USB-A, 4×USB 3.0, Bus-Powered"],
  [146, "HP Hub USB-C Multiport", 6000, 7500, "adaptateurs", 423, "USB-C → USB-A + HDMI, Plug & Play"],
  // TÉLÉVISIONS (147-150)
  [147, "LG Smart TV 32 pouces HD", 65000, 80000, "televisions", 189, "32 pouces, HD Ready, webOS, Wi-Fi"],
  [148, "LG Smart TV 43 pouces Full HD", 110000, 125000, "televisions", 134, "43 pouces, Full HD, webOS 6.0, HDR10"],
  [149, "LG Smart TV 55 pouces 4K", 210000, 225000, "televisions", 78, "55 pouces, 4K Ultra HD, Dolby Vision/Atmos"],
  [150, "SAMSUNG Smart TV 43 pouces", 110000, 125000, "televisions", 123, "43 pouces, Full HD, Tizen OS, HDR10+"],
  // CHARGEURS (151-156)
  [151, "TOSHIBA Chargeur 65W", 8000, 13000, "chargeurs", 567, "65W, 12V/4.3A, Connecteur Rond"],
  [152, "HP Chargeur 65W", 8000, 13000, "chargeurs", 489, "65W, 19.5V/3.33A, Connecteur Bleu HP"],
  [153, "ACER Chargeur 65W", 8000, 13000, "chargeurs", 456, "65W, 19V/3.42A, Connecteur Rond"],
  [154, "LENOVO Chargeur 65W", 8000, 13000, "chargeurs", 534, "65W, 20V/3.25A, Connecteur Carré"],
  [155, "DELL Chargeur 65W", 8000, 13000, "chargeurs", 489, "65W, 19.5V/3.34A, Connecteur Baril Dell"],
  [156, "LENOVO Chargeur 90W", 8000, 13000, "chargeurs", 423, "90W, 20V/4.5A, Connecteur Carré"],
  // SACS (157-165)
  [157, "LENOVO Sacoche 14 pouces", 10000, 15000, "sacs", 456, "14 pouces, Polyester, Bandoulière"],
  [158, "ENZO Sac à Dos 15.6 pouces", 12000, 17000, "sacs", 378, "15.6 pouces, Nylon Imperméable, USB"],
  [159, "TOSHIBA Sacoche 15.6 pouces", 12000, 17000, "sacs", 345, "15.6 pouces, Semi-rigide, Bandoulière"],
  [160, "DELL Sac à Dos Pro 15.6 pouces", 12000, 17000, "sacs", 267, "15.6 pouces, 6 Compartiments, USB"],
  [161, "HP Sacoche Active 15.6 pouces", 10000, 15000, "sacs", 312, "15.6 pouces, Résistante à l'eau"],
  [162, "LENOVO Sac Casual 15 pouces", 10000, 15000, "sacs", 345, "15 pouces, Bleu/Gris, USB externe"],
  [163, "HP Malette Élégante 15 pouces", 10000, 15000, "sacs", 378, "15 pouces, Simili-cuir, Pro"],
  [164, "TOSHIBA Sac Slim 15 pouces", 10000, 15000, "sacs", 267, "15 pouces, Slim, Résistant à l'eau"],
  [165, "LENOVO Sac Gaming 15.6 pouces", 10000, 15000, "sacs", 312, "15.6 pouces, Gaming, 6 Compartiments"],
];

export const PRODUCTS: ProductDetail[] = RAW.map(([id, name, price, oldPrice, category, orders, shortSpecs]) => ({
  id: String(id),
  name,
  price,
  originalPrice: oldPrice,
  category,
  image: getImage(id, category),
  brand: name.split(" ")[0],
  description: PRODUCT_DESCRIPTIONS[id] || shortSpecs,
  shortSpecs,
  orders,
  rating: 3.8 + Math.min((orders / 1000), 0.9) * (orders % 3 === 0 ? 0.7 : 0.5),
  inStock: true,
  specs: PRODUCT_SPECS[id] || [],
  isPromo: ((oldPrice - price) / oldPrice) > 0.15,
  fullDescription: PRODUCT_DESCRIPTIONS[id],
}));

export const CATEGORIES = [
  { id: "all",         label: "Tous",          icon: "grid" },
  { id: "ordinateurs", label: "Ordinateurs",   icon: "monitor" },
  { id: "phones",      label: "Téléphones",    icon: "smartphone" },
  { id: "desktops",    label: "Desktop",       icon: "monitor" },
  { id: "disques",     label: "Disques Durs",  icon: "hard-drive" },
  { id: "souris",      label: "Souris",        icon: "mouse-pointer" },
  { id: "claviers",    label: "Claviers",      icon: "type" },
  { id: "modems",      label: "Modems/WiFi",   icon: "wifi" },
  { id: "projecteurs", label: "Projecteurs",   icon: "tv" },
  { id: "usb",         label: "Clés USB",      icon: "save" },
  { id: "antivirus",   label: "Antivirus",     icon: "shield" },
  { id: "adaptateurs", label: "Adaptateurs",   icon: "zap" },
  { id: "sacs",        label: "Sacs & Étuis",  icon: "briefcase" },
  { id: "chargeurs",   label: "Chargeurs",     icon: "battery-charging" },
  { id: "ram",         label: "RAM",           icon: "server" },
  { id: "televisions", label: "Télévisions",   icon: "tv" },
];

// ─── PROMOTIONS RÉELLES ───────────────────────────────────────────────────────
export const REAL_PROMOS: ProductDetail[] = [
  {
    id: "p1",
    name: "ACER CHROMEBOOK Slim",
    price: 39900, originalPrice: 89900,
    category: "ordinateurs",
    image: `${GH}/IMG-20260206-WA0063.jpg`,
    brand: "ACER",
    shortSpecs: "Intel Celeron Quad-Core, 128 Go SSD, 4 Go RAM, 12 pouces",
    description: "Ordinateur portable professionnel slim importé des États-Unis. Idéal pour étudiants, enseignants, freelances et bureautique.",
    fullDescription: "Processeur Intel Celeron Quad-Core 1.4 GHz, SSD 128 Go rapide, 4 Go RAM, Écran 12 pouces slim, Wi-Fi, Bluetooth, HDMI, Webcam, Autonomie 7h+. Convient pour la bureautique, la navigation, les cours en ligne.",
    orders: 312,
    inStock: true,
    isPromo: true,
    cities: ["Yaoundé", "Douala", "Bafoussam"],
    specs: [
      { label: "Processeur", value: "Intel Celeron Quad-Core 1.4 GHz" },
      { label: "RAM", value: "4 Go" },
      { label: "Stockage", value: "128 Go SSD" },
      { label: "Écran", value: "12 pouces Slim" },
      { label: "Wi-Fi", value: "802.11ac" },
      { label: "Bluetooth", value: "4.2" },
      { label: "Webcam", value: "Intégrée" },
      { label: "Ports", value: "HDMI, USB, MicroSD" },
      { label: "Autonomie", value: "7h+" },
      { label: "Origine", value: "Importé des USA" },
    ],
  } as any,
  {
    id: "p2",
    name: "DELL LATITUDE 3190 Promo",
    price: 59900, originalPrice: 99900,
    category: "ordinateurs",
    image: `${GH}/IMG-20260206-WA0064.jpg`,
    brand: "DELL",
    shortSpecs: "Intel Quad-Core N4120, 256 Go SSD, 4 Go RAM, 12 pouces Ultra Slim",
    description: "Laptop professionnel ultra slim Dell Latitude. Windows 10 Pro + Pack Office installés. Idéal pour étudiants, informaticiens et télétravail.",
    fullDescription: "Intel Quad Core N4120, 4 Go RAM, 256 Go SSD ultra rapide, écran 12 pouces slim, Webcam, HDMI, USB, Wi-Fi, Bluetooth. Windows 10 Pro préinstallé avec Pack Office.",
    orders: 287,
    inStock: true,
    isPromo: true,
    cities: ["Yaoundé", "Douala", "Bafoussam", "Bertoua"],
    specs: [
      { label: "Processeur", value: "Intel Quad-Core N4120" },
      { label: "RAM", value: "4 Go" },
      { label: "Stockage", value: "256 Go SSD" },
      { label: "Écran", value: "12 pouces Ultra Slim" },
      { label: "Système", value: "Windows 10 Pro" },
      { label: "Wi-Fi", value: "Oui" },
      { label: "Bluetooth", value: "Oui" },
      { label: "Ports", value: "HDMI, USB" },
      { label: "Webcam", value: "Intégrée" },
      { label: "Logiciels", value: "Pack Office inclus" },
    ],
    gifts: ["Sac professionnel", "Clé USB 64 Go", "Souris sans fil"],
  } as any,
  {
    id: "p3",
    name: "HUAWEI NOVA PLUS",
    price: 24900, originalPrice: 49900,
    category: "phones",
    image: `${GH}/IMG-20251021-WA0003(2).jpg`,
    brand: "HUAWEI",
    shortSpecs: "64 Go, 4 Go RAM, Caméra 16 MP OIS, Batterie 3340 mAh",
    description: "Smartphone puissant et élégant Huawei Nova Plus. Écran Full HD, appareil photo impeccable, batterie solide, design premium. Idéal pour WhatsApp, YouTube, photos.",
    fullDescription: "64 Go de mémoire interne, 4 Go de RAM, caméra 16 MP avec OIS, batterie 3340 mAh, écran 5.5 pouces Full HD, processeur Kirin 659, double SIM, 4G LTE.",
    orders: 198,
    inStock: true,
    isPromo: true,
    specs: [
      { label: "Stockage", value: "64 Go" },
      { label: "RAM", value: "4 Go" },
      { label: "Caméra", value: "16 MP OIS + 8 MP avant" },
      { label: "Batterie", value: "3340 mAh" },
      { label: "Écran", value: "5.5 pouces Full HD" },
      { label: "Processeur", value: "Kirin 659 Octa-Core" },
      { label: "Double SIM", value: "Oui" },
      { label: "4G LTE", value: "Oui" },
      { label: "Système", value: "Android + EMUI" },
    ],
  } as any,
  {
    id: "p4",
    name: "SAMSUNG Smartphone Galaxy A",
    price: 35000, originalPrice: 50000,
    category: "phones",
    image: `${GH}/89_1.jpg`,
    brand: "SAMSUNG",
    shortSpecs: "128 Go, 4 Go RAM, Caméra 48 MP, Batterie 4000 mAh, 4G LTE",
    description: "Smartphone Samsung performant avec écran lumineux, grande mémoire, caméra haute définition et batterie longue durée. Design moderne et élégant.",
    fullDescription: "128 Go de stockage, 4 Go RAM, caméra 48 MP, batterie 4000 mAh, écran Super AMOLED, processeur Exynos, Wi-Fi, Bluetooth, 4G LTE.",
    orders: 167,
    inStock: true,
    isPromo: true,
    specs: [
      { label: "Stockage", value: "128 Go" },
      { label: "RAM", value: "4 Go" },
      { label: "Caméra", value: "48 MP + 5 MP avant" },
      { label: "Batterie", value: "4000 mAh" },
      { label: "Écran", value: "Super AMOLED" },
      { label: "4G LTE", value: "Oui" },
      { label: "Wi-Fi", value: "Wi-Fi 5" },
      { label: "Bluetooth", value: "5.0" },
    ],
  } as any,
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const ALL_PRODUCTS: ProductDetail[] = [
  ...PRODUCTS,
  ...(REAL_PROMOS as ProductDetail[]),
];

export const getProductById = (id: string): ProductDetail | undefined =>
  ALL_PRODUCTS.find(p => p.id === id);

export const PROMOS: ProductDetail[] = PRODUCTS.filter(p => p.isPromo);

export const getFeatured = () =>
  PRODUCTS.filter(p => (p.orders ?? 0) >= 400).slice(0, 12);

export const getByCategory = (category: string) =>
  category === "all" ? PRODUCTS : PRODUCTS.filter(p => p.category === category);

export const formatPrice = (price: number) =>
  price.toLocaleString("fr-FR") + " FCFA";

export const getDiscount = (price: number, original: number) =>
  Math.round(((original - price) / original) * 100);

// ─── FILTRAGE PAR VILLE ───────────────────────────────────────────────────────
const CITY_MAX_ID: Record<string, number> = {
  "Yaoundé":    165,
  "Douala":     165,
  "Bafoussam":  120,
  "Bertoua":     95,
  "Dschang":     85,
  "Maroua":      75,
  "Garoua":      75,
  "Ngaoundéré":  65,
};

export const getProductsForCity = (city: string | null): ProductDetail[] => {
  if (!city) return PRODUCTS;
  const maxId = CITY_MAX_ID[city] ?? 65;
  return PRODUCTS.filter(p => parseInt(p.id) <= maxId);
};

export const getByCategoryForCity = (category: string, city: string | null): ProductDetail[] => {
  const cityProducts = getProductsForCity(city);
  return category === "all" ? cityProducts : cityProducts.filter(p => p.category === category);
};
