import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingBag,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Minus,
  Trash2,
  Check,
  Sparkles,
  Heart,
  Eye,
  ZoomIn,
  Truck,
  Scale,
  Award,
  User,
  LogOut,
  Tag,
  AlertCircle,
  MessageCircle,
  Copy,
  Wallet,
  MapPin,
  Store,
  Key,
  Users,
  ClipboardList,
  CheckSquare,
  Phone,
  Clock,
  Send,
  ArrowRight,
  Home
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInAnonymously,
  signInWithCustomToken,
  onAuthStateChanged
} from 'firebase/auth';
import {
  getFirestore,
  collection,
  addDoc,
  setDoc,
  doc,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

// ============================================================================
// CONFIGURACIÓN DE FIREBASE Y CONSTANTES DEL NEGOCIO
// ============================================================================
const firebaseConfig =
  typeof __firebase_config !== 'undefined'
    ? JSON.parse(__firebase_config)
    : {
        apiKey: 'AIzaSyDl3PGabDSxVFVezfPpCJHU9fbQ4ZSIGRQ',
        authDomain: 'cabana-san-ignacio.firebaseapp.com',
        projectId: 'cabana-san-ignacio',
        storageBucket: 'cabana-san-ignacio.firebasestorage.app',
        messagingSenderId: '759261659964',
        appId: '1:759261659964:web:f5e7858c257391ce645439',
        measurementId: 'G-TGJN7ZGVD7'
      };

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const appId = typeof __app_id !== 'undefined' ? __app_id : 'cabana-san-ignacio';

const MP_ALIAS = 'CABANA.SANIGNACIO.MP';
const MP_TITULAR = 'Cabaña San Ignacio S.R.L.';
const WHATSAPP_NUMBER = '5493512601310';
const FACEBOOK_URL = 'https://www.facebook.com/carnessanignacio/';
const INSTAGRAM_URL = 'https://www.instagram.com/carnessanignacio/?hl=en';
const ADMIN_SECRET_KEY = 'SANIGNACIO2026';

const CATEGORIES_META = [
  {
    title: 'Bolsones de Carnes',
    subtitle: 'Combos familiares, parrilleros y semanales armados al mejor precio por kilo'
  },
  {
    title: 'Cortes para Parrilla / Asado',
    subtitle: 'Novillo seleccionado con infiltración justa y maduración controlada para las brasas'
  },
  {
    title: 'Cortes Magros y Plancha',
    subtitle: 'Cortes tiernos sin hueso ideales para bife, plancha, sartén o milanesas'
  },
  {
    title: 'Cortes para Guisos y Horno',
    subtitle: 'Piezas sabrosas de cocción lenta, estofados, pucheros y braseados'
  }
];

const MEAT_PRODUCTS = [
  // BOLSONES DE CARNES
  {
    id: 'bol-1',
    name: 'Bolsón Clásico Diario (3 kg)',
    category: 'Bolsones de Carnes',
    origin: '1 kg Bifes + 1 kg Molida + 1 kg Costeletas',
    pricePerKg: 25500,
    offerPricePerKg: 22900,
    wholesalePricePerKg: 19800,
    isDailyOffer: true,
    isPack: true,
    badge: 'Más Vendido',
    description:
      'Combo ideal para resolver la semana: incluye 1 kg de bifes tiernos de cuadril/nalga, 1 kg de carne molida especial sin grasa y 1 kg de costeletas anchas.',
    chefTip: 'Cada corte viene separado en bolsas individuales listas para freezar.',
    weights: [
      { label: '1 Bolsón (3 kg)', multiplier: 1 },
      { label: '2 Bolsones (6 kg)', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'bol-2',
    name: 'Bolsón Parrillero Completo (4 kg)',
    category: 'Bolsones de Carnes',
    origin: '1,5 kg Asado + 1,5 kg Vacío + 1 kg Chorizo y Morcilla',
    pricePerKg: 36800,
    offerPricePerKg: 32900,
    wholesalePricePerKg: 28500,
    isDailyOffer: true,
    isPack: true,
    badge: 'Ideal Asado',
    description:
      'Todo listo para prender el fuego: 1,5 kg de asado de tira del centro, 1,5 kg de vacío fino de novillo y 1 kg de chorizos puros de cerdo y morcilla bombón.',
    chefTip: 'Rinde cómodamente para 6 a 8 comensales.',
    weights: [
      { label: '1 Bolsón (4 kg)', multiplier: 1 },
      { label: '2 Bolsones (8 kg)', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'bol-3',
    name: 'Bolsón Familiar Milanesas y Horno (4 kg)',
    category: 'Bolsones de Carnes',
    origin: '1,5 kg Nalga Feteada + 1,5 kg Paleta + 1 kg Roast Beef',
    pricePerKg: 34200,
    offerPricePerKg: 30900,
    wholesalePricePerKg: 26800,
    isDailyOffer: false,
    isPack: true,
    badge: 'Ahorro Familiar',
    description:
      'Pensado para las comidas de todos los días: 1,5 kg de nalga feteada lista para empanar, 1,5 kg de paleta limpia y 1 kg de roast beef tierno.',
    chefTip: 'Podés pedir las milanesas cortadas finas o gruesas.',
    weights: [
      { label: '1 Bolsón (4 kg)', multiplier: 1 },
      { label: '2 Bolsones (8 kg)', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'bol-4',
    name: 'Bolsón Económico Olla y Guisos (3,5 kg)',
    category: 'Bolsones de Carnes',
    origin: '1,5 kg Osobuco + 1 kg Picada + 1 kg Tortuguita',
    pricePerKg: 24900,
    offerPricePerKg: 21900,
    wholesalePricePerKg: 18900,
    isDailyOffer: false,
    isPack: true,
    badge: 'Súper Precio',
    description:
      'Rendidor y sabroso: 1,5 kg de osobuco en rodajas con caracú, 1 kg de carne picada fresca y 1 kg de tortuguita magra para estofados o mechada.',
    chefTip: 'Excelente rendimiento para cocciones largas y salsas.',
    weights: [
      { label: '1 Bolsón (3,5 kg)', multiplier: 1 },
      { label: '2 Bolsones (7 kg)', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // CORTES PARA PARRILLA / ASADO
  {
    id: 'par-1',
    name: 'Asado de Tira del Centro',
    category: 'Cortes para Parrilla / Asado',
    origin: 'Novillo Especial • Corte 3 costillas',
    pricePerKg: 9800,
    offerPricePerKg: 8400,
    wholesalePricePerKg: 7200,
    isDailyOffer: true,
    badge: 'Clásico Parrillero',
    description:
      'Costillar seleccionado del centro con hueso fino y excelente veteado intramuscular que garantiza terneza y sabor ahumado en la parrilla.',
    chefTip: 'Comenzar del lado del hueso a fuego medio durante 40 minutos.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 },
      { label: '5 kg', multiplier: 5 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'par-2',
    name: 'Vacío Fino de Novillo',
    category: 'Cortes para Parrilla / Asado',
    origin: 'Ternera / Novillito • Envasado al vacío',
    pricePerKg: 11200,
    offerPricePerKg: 9600,
    wholesalePricePerKg: 8300,
    isDailyOffer: true,
    badge: 'Tierno y Jugoso',
    description:
      'Corte tradicional de la región abdominal, con su cuero fino crocante por fuera y fibras jugosas por dentro.',
    chefTip: 'Salar con sal entrefina 15 minutos antes de llevar a la brasa.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 },
      { label: '5 kg', multiplier: 5 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'par-3',
    name: 'Entraña Fina Seleccionada',
    category: 'Cortes para Parrilla / Asado',
    origin: 'Novillo Premium • Limpia',
    pricePerKg: 12900,
    offerPricePerKg: 11200,
    wholesalePricePerKg: 9500,
    isDailyOffer: false,
    badge: 'Favorito',
    description:
      'Corte del diafragma de sabor intenso y cocción rápida, ideal como entrada o plato principal a fuego fuerte.',
    chefTip: 'Cocinar vuelta y vuelta a fuego vivo para conservar todo su jugo.',
    weights: [
      { label: '500 g', multiplier: 0.5 },
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'par-4',
    name: 'Matambre Tiernizado',
    category: 'Cortes para Parrilla / Asado',
    origin: 'Ternera • Parejo para parrilla o pizza',
    pricePerKg: 10400,
    offerPricePerKg: 9100,
    wholesalePricePerKg: 7900,
    isDailyOffer: false,
    badge: 'Ideal a la Pizza',
    description:
      'Corte fino y parejo, desgrasado a mano, perfecto para hacer a la pizza, a la leche o arrollado.',
    chefTip: 'Remojar en leche tibia 30 minutos antes para máxima terneza.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // CORTES MAGROS Y PLANCHA
  {
    id: 'mag-1',
    name: 'Bife de Chorizo Madurado',
    category: 'Cortes Magros y Plancha',
    origin: 'Novillo Exportación • 21 días maduración',
    pricePerKg: 13500,
    offerPricePerKg: 11600,
    wholesalePricePerKg: 9900,
    isDailyOffer: true,
    badge: 'Exportación',
    description:
      'Bife angosto sin hueso con su característico cordón de grasa lateral que aporta sabor único en plancha o parrilla.',
    chefTip: 'Cortar en medallones de 3 cm y sellar 4 minutos por lado.',
    weights: [
      { label: '500 g', multiplier: 0.5 },
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'mag-2',
    name: 'Ojo de Bife (Ribeye)',
    category: 'Cortes Magros y Plancha',
    origin: 'Novillo Premium • Marmoleo superior',
    pricePerKg: 14200,
    offerPricePerKg: 12400,
    wholesalePricePerKg: 10500,
    isDailyOffer: false,
    badge: 'Premium',
    description:
      'El corazón del bife ancho: ternura incomparable y marmoleo natural que se funde durante la cocción.',
    chefTip: 'Ideal para sellar en sartén de hierro con manteca, ajo y romero.',
    weights: [
      { label: '500 g', multiplier: 0.5 },
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'mag-3',
    name: 'Lomo Fino Limpio',
    category: 'Cortes Magros y Plancha',
    origin: 'Ternera • Sin cordón',
    pricePerKg: 15800,
    offerPricePerKg: 13900,
    wholesalePricePerKg: 11800,
    isDailyOffer: false,
    badge: '100% Magro',
    description:
      'El corte más tierno de la res, completamente limpio y magro, ideal para medallones, strogonoff o lomo al champiñón.',
    chefTip: 'No sobrecocinar: punto jugoso a rosado conserva toda su suavidad.',
    weights: [
      { label: '500 g', multiplier: 0.5 },
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'mag-4',
    name: 'Nalga Feteada para Milanesas',
    category: 'Cortes Magros y Plancha',
    origin: 'Ternera • Feteada pareja',
    pricePerKg: 10200,
    offerPricePerKg: 8900,
    wholesalePricePerKg: 7600,
    isDailyOffer: true,
    badge: 'Sin Nervios',
    description:
      'Nalga seleccionada, desgrasada y feteada a máquina para obtener milanesas grandes, parejas y súper tiernas.',
    chefTip: 'Lista para pasar por huevo condimentado y pan rallado.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 },
      { label: '5 kg', multiplier: 5 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80'
    ]
  },

  // CORTES PARA GUISOS Y HORNO
  {
    id: 'gui-1',
    name: 'Osobuco en Rodajas con Caracú',
    category: 'Cortes para Guisos y Horno',
    origin: 'Novillo • Corte 4 cm',
    pricePerKg: 6900,
    offerPricePerKg: 5900,
    wholesalePricePerKg: 4950,
    isDailyOffer: true,
    badge: 'Súper Rendidor',
    description:
      'Rodajas gruesas de garrón con hueso y abundante caracú que aportan colágeno y sabor profundo a guisos, pucheros y braseados.',
    chefTip: 'Brasear 2 horas y media con vino tinto, cebolla y zanahoria.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 },
      { label: '5 kg', multiplier: 5 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'gui-2',
    name: 'Roast Beef / Aguja Seleccionada',
    category: 'Cortes para Guisos y Horno',
    origin: 'Novillo • Ideal para desmechar',
    pricePerKg: 8400,
    offerPricePerKg: 7300,
    wholesalePricePerKg: 6200,
    isDailyOffer: false,
    badge: 'Ideal Desmechada',
    description:
      'Corte veteado del cuarto delantero, perfecto para carne desmechada, empanadas cortadas a cuchillo o cocción lenta al horno.',
    chefTip: 'Cocinar tapado con papel aluminio al horno bajo por 2 horas.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 },
      { label: '5 kg', multiplier: 5 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=900&q=80'
    ]
  },
  {
    id: 'gui-3',
    name: 'Paleta Limpia para Horno o Bifes',
    category: 'Cortes para Guisos y Horno',
    origin: 'Ternera • Versátil',
    pricePerKg: 8600,
    offerPricePerKg: 7500,
    wholesalePricePerKg: 6400,
    isDailyOffer: false,
    badge: 'Multiuso',
    description:
      'Corte magro y sabroso que se adapta tanto para hacer entera al horno como cortada en bifes a la criolla o estofados.',
    chefTip: 'Ideal para hacer a la cacerola con papas y arvejas.',
    weights: [
      { label: '1 kg', multiplier: 1 },
      { label: '2 kg', multiplier: 2 }
    ],
    photos: [
      'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=900&q=80'
    ]
  }
];

function formatCurrency(amount) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount || 0);
}

function getEffectivePricePerKg(product, currentUser) {
  if (currentUser?.accountType === 'mayorista') {
    return product.wholesalePricePerKg;
  }
  if (currentUser && product.isDailyOffer) {
    return product.offerPricePerKg;
  }
  return product.pricePerKg;
}

// ============================================================================
// COMPONENTE LOGO E ÍCONO OFICIAL: CABAÑA SAN IGNACIO (IDÉNTICO AL EMBLEMA)
// ============================================================================
const CABANA_FAVICON_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
  <defs>
    <radialGradient id="favBlue" cx="35%" cy="35%" r="70%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="55%" stop-color="#1d4ed8"/>
      <stop offset="100%" stop-color="#090d16"/>
    </radialGradient>
  </defs>
  <circle cx="60" cy="60" r="56" fill="url(#favBlue)" stroke="#dc2626" stroke-width="5"/>
  <!-- Cuernos -->
  <path d="M35 34 C24 27, 25 16, 33 17 C31 23, 35 28, 41 31 Z" fill="#f8fafc"/>
  <path d="M85 34 C96 27, 95 16, 87 17 C89 23, 85 28, 79 31 Z" fill="#111827"/>
  <!-- Orejas -->
  <ellipse cx="28" cy="43" rx="11" ry="5.5" transform="rotate(-18 28 43)" fill="#ffffff" stroke="#111827" stroke-width="2.5"/>
  <ellipse cx="92" cy="43" rx="11" ry="5.5" transform="rotate(18 92 43)" fill="#111827"/>
  <!-- Cabeza base negra -->
  <path d="M38 33 Q60 26 82 33 L86 58 L77 88 Q60 98 43 88 L34 58 Z" fill="#111827"/>
  <!-- Mancha blanca frontal característica -->
  <path d="M42 34 Q56 30 67 34 L63 58 L71 74 L73 86 Q60 95 45 86 L40 65 L45 48 Z" fill="#ffffff"/>
  <!-- Ojos -->
  <ellipse cx="44" cy="52" rx="3.2" ry="2.4" fill="#111827"/>
  <ellipse cx="75" cy="52" rx="3.2" ry="2.4" fill="#ffffff"/>
  <circle cx="74.5" cy="52" r="1.4" fill="#111827"/>
  <!-- Hocico -->
  <path d="M44 76 Q60 71 76 76 Q78 88 60 92 Q42 88 44 76 Z" fill="#f3f4f6" stroke="#111827" stroke-width="2.5"/>
  <ellipse cx="52" cy="82" rx="3" ry="2.2" fill="#111827"/>
  <ellipse cx="68" cy="82" rx="3" ry="2.2" fill="#111827"/>
</svg>
`.trim();

function CabanaEmblemBadge({ sizeClass = 'w-11 h-11' }) {
  const uid = useRef(`csi-grad-${Math.random().toString(36).slice(2, 8)}`).current;
  return (
    <svg
      viewBox="0 0 120 120"
      className={`${sizeClass} flex-shrink-0 drop-shadow-xs`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <radialGradient id={uid} cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="55%" stopColor="#1d4ed8" />
          <stop offset="100%" stopColor="#090d16" />
        </radialGradient>
        <path id={`${uid}-arc`} d="M 18,60 A 42,42 0 1,1 102,60" />
      </defs>

      {/* Círculo azul degradado */}
      <circle cx="60" cy="62" r="46" fill={`url(#${uid})`} />

      {/* Arco superior CARNES PREMIUM */}
      <text
        fill="#111827"
        fontSize="9.2"
        fontWeight="900"
        letterSpacing="1.3"
        fontFamily="system-ui, -apple-system, sans-serif"
      >
        <textPath href={`#${uid}-arc`} startOffset="50%" textAnchor="middle">
          CARNES PREMIUM
        </textPath>
      </text>

      {/* Cuernos */}
      <path
        d="M37 37 C26 30, 27 20, 35 21 C33 26, 37 31, 43 34 Z"
        fill="#ffffff"
        stroke="#111827"
        strokeWidth="1.5"
      />
      <path
        d="M83 37 C94 30, 93 20, 85 21 C87 26, 83 31, 77 34 Z"
        fill="#111827"
      />

      {/* Orejas */}
      <ellipse
        cx="30"
        cy="46"
        rx="10.5"
        ry="5"
        transform="rotate(-18 30 46)"
        fill="#ffffff"
        stroke="#111827"
        strokeWidth="2.2"
      />
      <ellipse
        cx="90"
        cy="46"
        rx="10.5"
        ry="5"
        transform="rotate(18 90 46)"
        fill="#111827"
      />

      {/* Cabeza vacuna en blanco y negro */}
      <path
        d="M40 36 Q60 29 80 36 L84 60 L75 88 Q60 97 45 88 L36 60 Z"
        fill="#111827"
      />
      <path
        d="M43 37 Q56 33 66 37 L62 59 L70 74 L72 86 Q60 94 46 86 L41 66 L46 50 Z"
        fill="#ffffff"
      />

      {/* Ojos */}
      <ellipse cx="45" cy="54" rx="3" ry="2.2" fill="#111827" />
      <ellipse cx="74" cy="54" rx="3" ry="2.2" fill="#ffffff" />
      <circle cx="73.5" cy="54" r="1.3" fill="#111827" />

      {/* Hocico y fosas nasales */}
      <path
        d="M45 76 Q60 71 75 76 Q77 88 60 91 Q43 88 45 76 Z"
        fill="#f3f4f6"
        stroke="#111827"
        strokeWidth="2.2"
      />
      <ellipse cx="53" cy="82" rx="2.8" ry="2" fill="#111827" />
      <ellipse cx="67" cy="82" rx="2.8" ry="2" fill="#111827" />
    </svg>
  );
}

function CabanaLogo({ compact = false }) {
  return (
    <div className="flex items-center gap-2 select-none">
      <CabanaEmblemBadge sizeClass={compact ? 'w-10 h-10' : 'w-12 h-12 sm:w-14 sm:h-14'} />
      <div className="leading-none text-left flex flex-col">
        <span
          className={`${
            compact ? 'text-[9px]' : 'text-[10px] sm:text-xs'
          } font-black tracking-[0.16em] text-stone-950 uppercase self-end pr-0.5`}
        >
          CABAÑA
        </span>
        <span
          className={`${
            compact ? 'text-base' : 'text-xl sm:text-2xl'
          } font-black tracking-tight text-red-600 block -mt-0.5`}
          style={{
            textShadow: '0 1px 0 rgba(17,24,39,0.25)'
          }}
        >
          San Ignacio
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE TARJETA DE PRODUCTO CON GALERÍA Y SELECTOR DE PESO / KG MAYORISTA
// ============================================================================
function ProductCard({
  product,
  currentUser,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenGallery
}) {
  const [photoIdx, setPhotoIdx] = useState(0);
  const [selectedWeight, setSelectedWeight] = useState(product.weights[0]);
  const [wholesaleKgInput, setWholesaleKgInput] = useState('10');

  const isWholesale = currentUser?.accountType === 'mayorista';
  const effectiveUnitPrice = getEffectivePricePerKg(product, currentUser);
  const hasDiscount = effectiveUnitPrice < product.pricePerKg;

  const parsedWholesaleKg = Math.max(1, parseFloat(wholesaleKgInput) || 1);
  const displayWeight = isWholesale
    ? {
        label: product.isPack
          ? `${parsedWholesaleKg} Bolsón(es)`
          : `${parsedWholesaleKg} kg`,
        multiplier: parsedWholesaleKg
      }
    : selectedWeight;

  const finalItemPrice = effectiveUnitPrice * displayWeight.multiplier;

  const nextPhoto = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev + 1) % product.photos.length);
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    setPhotoIdx((prev) => (prev === 0 ? product.photos.length - 1 : prev - 1));
  };

  return (
    <article className="snap-start flex-shrink-0 w-72 sm:w-80 bg-white rounded-3xl border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Galería de fotos de la tarjeta */}
      <div
        onClick={() => onOpenGallery(product, photoIdx, displayWeight)}
        className="relative h-48 w-full bg-stone-100 overflow-hidden cursor-pointer"
      >
        <img
          src={product.photos[photoIdx]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {product.badge && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-stone-950/85 text-white text-[10px] font-black uppercase tracking-wider">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          aria-label="Favorito"
          className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-xs transition-transform active:scale-90"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-red-600 text-red-600' : 'text-stone-600'
            }`}
          />
        </button>

        {product.photos.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevPhoto}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/45 hover:bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={nextPhoto}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/45 hover:bg-black/75 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5">
              {product.photos.map((_, idx) => (
                <span
                  key={idx}
                  className={`h-1.5 rounded-full transition-all ${
                    photoIdx === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/60'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Información y selector */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <span className="text-[11px] font-bold text-stone-500 block">
            {product.origin}
          </span>
          <h3
            onClick={() => onOpenGallery(product, photoIdx, displayWeight)}
            className="text-base font-black text-stone-900 group-hover:text-red-600 transition-colors cursor-pointer line-clamp-1 mt-0.5"
          >
            {product.name}
          </h3>
          <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Selector de presentación o input de kg para Mayorista */}
        <div className="space-y-2.5 pt-2 border-t border-stone-100">
          {isWholesale ? (
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5">
              <label className="text-[11px] font-extrabold text-sky-950 flex items-center justify-between mb-1">
                <span>
                  {product.isPack
                    ? 'Cantidad de bolsones:'
                    : 'Escribí cuántos kg querés:'}
                </span>
                <span className="text-sky-700">Lista Mayorista</span>
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  step="0.5"
                  value={wholesaleKgInput}
                  onChange={(e) => setWholesaleKgInput(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-white border border-sky-300 text-sm font-black text-stone-900 focus:outline-none focus:border-sky-600"
                />
                <span className="text-xs font-extrabold text-sky-900">
                  {product.isPack ? 'un.' : 'kg'}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {product.weights.map((w) => {
                const active = selectedWeight.label === w.label;
                return (
                  <button
                    key={w.label}
                    type="button"
                    onClick={() => setSelectedWeight(w)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-extrabold transition-all ${
                      active
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {w.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Precio y botones */}
          <div className="flex items-end justify-between gap-2 pt-1">
            <div>
              {hasDiscount && (
                <span className="text-[11px] line-through text-stone-400 block">
                  {formatCurrency(product.pricePerKg * displayWeight.multiplier)}
                </span>
              )}
              <span
                className={`text-lg font-black leading-none ${
                  isWholesale ? 'text-sky-800' : 'text-stone-950'
                }`}
              >
                {formatCurrency(finalItemPrice)}
              </span>
              <span className="text-[10px] text-stone-500 block mt-0.5">
                {formatCurrency(effectiveUnitPrice)}{' '}
                {product.isPack ? 'c/bolsón' : 'x kg'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => onOpenGallery(product, photoIdx, displayWeight)}
                title="Ver galería y detalles"
                className="p-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onAddToCart(product, displayWeight, 1)}
                className={`px-3.5 py-2.5 rounded-xl text-white text-xs font-black shadow-xs transition-all flex items-center gap-1.5 ${
                  isWholesale
                    ? 'bg-sky-700 hover:bg-sky-800'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

// ============================================================================
// COMPONENTE FILA DE CARRUSEL POR CATEGORÍA
// ============================================================================
function CategoryCarouselRow({
  title,
  subtitle,
  products,
  currentUser,
  favorites,
  onToggleFavorite,
  onAddToCart,
  onOpenGallery,
  accentBadge
}) {
  const rowRef = useRef(null);

  if (!products || products.length === 0) return null;

  const scrollRow = (direction) => {
    if (!rowRef.current) return;
    const offset = direction === 'left' ? -340 : 340;
    rowRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <section className="mb-10">
      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 tracking-tight">
              {title}
            </h2>
            {accentBadge && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[11px] font-black uppercase">
                {accentBadge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs sm:text-sm text-stone-600 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="hidden sm:flex items-center gap-2">
          <button
            type="button"
            onClick={() => scrollRow('left')}
            aria-label={`Desplazar ${title} a la izquierda`}
            className="p-2.5 rounded-full bg-white border border-stone-200 hover:border-stone-900 text-stone-800 shadow-2xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollRow('right')}
            aria-label={`Desplazar ${title} a la derecha`}
            className="p-2.5 rounded-full bg-white border border-stone-200 hover:border-stone-900 text-stone-800 shadow-2xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={rowRef}
        className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth"
        style={{ scrollbarWidth: 'none' }}
      >
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            currentUser={currentUser}
            isFavorite={favorites.includes(product.id)}
            onToggleFavorite={onToggleFavorite}
            onAddToCart={onAddToCart}
            onOpenGallery={onOpenGallery}
          />
        ))}
      </div>
    </section>
  );
}

// ============================================================================
// MODAL DE GALERÍA DETALLADA DEL PRODUCTO
// ============================================================================
function ProductGalleryModal({
  product,
  initialPhotoIndex = 0,
  initialWeight,
  currentUser,
  onClose,
  onAddToCart
}) {
  const [activePhoto, setActivePhoto] = useState(initialPhotoIndex);
  const [selectedWeight, setSelectedWeight] = useState(
    initialWeight || product.weights[0]
  );
  const [wholesaleKgInput, setWholesaleKgInput] = useState(
    initialWeight ? String(initialWeight.multiplier) : '10'
  );
  const [quantity, setQuantity] = useState(1);

  const isWholesale = currentUser?.accountType === 'mayorista';
  const effectiveUnitPrice = getEffectivePricePerKg(product, currentUser);
  const parsedWholesaleKg = Math.max(1, parseFloat(wholesaleKgInput) || 1);

  const activeWeightObj = isWholesale
    ? {
        label: product.isPack
          ? `${parsedWholesaleKg} Bolsón(es)`
          : `${parsedWholesaleKg} kg`,
        multiplier: parsedWholesaleKg
      }
    : selectedWeight;

  const totalPrice = effectiveUnitPrice * activeWeightObj.multiplier * quantity;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full overflow-hidden shadow-2xl border border-stone-200 grid grid-cols-1 md:grid-cols-2 my-auto">
        {/* Visor de fotos */}
        <div className="bg-stone-100 p-4 sm:p-6 flex flex-col justify-between">
          <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden bg-white shadow-inner">
            <img
              src={product.photos[activePhoto]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/60 text-white text-[11px] font-bold flex items-center gap-1">
              <ZoomIn className="w-3.5 h-3.5" />
              <span>
                Foto {activePhoto + 1} de {product.photos.length}
              </span>
            </span>
          </div>

          <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
            {product.photos.map((photo, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActivePhoto(idx)}
                className={`w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                  activePhoto === idx
                    ? 'border-red-600 scale-105 shadow-sm'
                    : 'border-transparent opacity-65 hover:opacity-100'
                }`}
              >
                <img
                  src={photo}
                  alt={`${product.name} ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Detalles y compra */}
        <div className="p-6 sm:p-7 flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-red-600">
                  {product.category}
                </span>
                <h2 className="text-2xl font-black text-stone-900 mt-1">
                  {product.name}
                </h2>
                <span className="text-xs font-semibold text-stone-500">
                  {product.origin}
                </span>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-stone-700 mt-4 leading-relaxed">
              {product.description}
            </p>

            {product.chefTip && (
              <div className="mt-4 p-3 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950">
                <strong>Tip del Maestro Parrillero:</strong> {product.chefTip}
              </div>
            )}

            {/* Selector de peso / kg */}
            <div className="mt-5">
              {isWholesale ? (
                <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200">
                  <label className="text-xs font-black text-sky-950 block mb-1.5">
                    {product.isPack
                      ? 'Cantidad de bolsones mayoristas:'
                      : 'Ingresá los kg exactos que necesitás:'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={wholesaleKgInput}
                      onChange={(e) => setWholesaleKgInput(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-sky-300 text-base font-black text-stone-900"
                    />
                    <span className="text-sm font-black text-sky-900">
                      {product.isPack ? 'bolsones' : 'kg'}
                    </span>
                  </div>
                </div>
              ) : (
                <div>
                  <span className="text-xs font-extrabold text-stone-700 block mb-2">
                    Elegí la presentación:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {product.weights.map((w) => (
                      <button
                        key={w.label}
                        type="button"
                        onClick={() => setSelectedWeight(w)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                          selectedWeight.label === w.label
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {w.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">
                  Total ({activeWeightObj.label} x {quantity})
                </span>
                <span className="text-2xl font-black text-stone-950">
                  {formatCurrency(totalPrice)}
                </span>
              </div>

              <div className="flex items-center gap-2 bg-stone-100 rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 rounded-lg bg-white shadow-2xs text-stone-800"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-8 text-center text-sm font-black">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-2 rounded-lg bg-white shadow-2xs text-stone-800"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                onAddToCart(product, activeWeightObj, quantity);
                onClose();
              }}
              className={`w-full py-3.5 rounded-2xl text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2 ${
                isWholesale
                  ? 'bg-sky-700 hover:bg-sky-800'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Agregar al Pedido</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MODAL DE AUTENTICACIÓN (CONSUMIDOR FINAL VS MAYORISTA)
// ============================================================================
function AuthModal({
  isOpen,
  initialMode = 'login',
  initialAccountType = 'consumidor',
  onClose,
  onAuthSuccess
}) {
  const [mode, setMode] = useState(initialMode);
  const [accountType, setAccountType] = useState(initialAccountType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [businessName, setBusinessName] = useState('');

  useEffect(() => {
    setMode(initialMode);
    setAccountType(initialAccountType);
  }, [initialMode, initialAccountType, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanEmail = email.trim() || 'cliente@sanignacio.com';
    const cleanName =
      name.trim() ||
      (accountType === 'mayorista' ? 'Comercio Mayorista' : 'Cliente Minorista');

    onAuthSuccess(
      {
        name: cleanName,
        email: cleanEmail,
        accountType,
        businessName: accountType === 'mayorista' ? businessName.trim() : ''
      },
      mode === 'register'
    );
    onClose();
  };

  const handleQuickDemo = (type) => {
    onAuthSuccess(
      type === 'mayorista'
        ? {
            name: 'Parrilla Don Julio (Demo)',
            email: 'mayorista@sanignacio.com',
            accountType: 'mayorista',
            businessName: 'Parrilla y Restaurante S.R.L.'
          }
        : {
            name: 'Juan Pérez (Demo)',
            email: 'minorista@sanignacio.com',
            accountType: 'consumidor',
            businessName: ''
          },
      false
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-stone-200 space-y-5">
        <div className="flex items-center justify-between">
          <CabanaLogo compact />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector Consumidor Final vs Mayorista */}
        <div>
          <span className="text-xs font-extrabold text-stone-600 block mb-2">
            Seleccioná tu tipo de cuenta:
          </span>
          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setAccountType('consumidor')}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                accountType === 'consumidor'
                  ? 'border-red-600 bg-red-50 text-red-950'
                  : 'border-stone-200 bg-white text-stone-700'
              }`}
            >
              <User className="w-4 h-4 text-red-600 mb-1" />
              <span className="text-xs font-black block">Consumidor Final</span>
              <span className="text-[10px] text-stone-500">
                Desbloquea Ofertas del Día
              </span>
            </button>

            <button
              type="button"
              onClick={() => setAccountType('mayorista')}
              className={`p-3 rounded-2xl border-2 text-left transition-all ${
                accountType === 'mayorista'
                  ? 'border-sky-600 bg-sky-50 text-sky-950'
                  : 'border-stone-200 bg-white text-stone-700'
              }`}
            >
              <Store className="w-4 h-4 text-sky-600 mb-1" />
              <span className="text-xs font-black block">Mayorista</span>
              <span className="text-[10px] text-stone-500">
                Precios especiales x kg
              </span>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="text-xs font-extrabold text-stone-700 block mb-1">
              Nombre y Apellido
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Carlos Gómez"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          {accountType === 'mayorista' && (
            <div>
              <label className="text-xs font-extrabold text-sky-900 block mb-1">
                Comercio / Razón Social (Opcional)
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Ej. Parrilla El Buen Gusto"
                className="w-full px-3.5 py-2.5 rounded-xl border border-sky-300 bg-sky-50/50 text-sm focus:outline-none focus:border-sky-600"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-extrabold text-stone-700 block mb-1">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tuemail@ejemplo.com"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="text-xs font-extrabold text-stone-700 block mb-1">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-2xl text-white font-black text-sm shadow-md transition-all ${
              accountType === 'mayorista'
                ? 'bg-sky-700 hover:bg-sky-800'
                : 'bg-red-600 hover:bg-red-700'
            }`}
          >
            {mode === 'register'
              ? `Crear Cuenta ${accountType === 'mayorista' ? 'Mayorista' : 'Minorista'}`
              : `Ingresar como ${accountType === 'mayorista' ? 'Mayorista' : 'Minorista'}`}
          </button>
        </form>

        <div className="pt-3 border-t border-stone-100 space-y-2">
          <span className="text-[11px] font-bold text-stone-500 block text-center">
            Acceso rápido de prueba en 1 clic:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('consumidor')}
              className="py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold"
            >
              Demo Minorista
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('mayorista')}
              className="py-2 px-3 rounded-xl bg-sky-100 hover:bg-sky-200 text-sky-900 text-xs font-extrabold"
            >
              Demo Mayorista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// CARRITO LATERAL CON MERCADO PAGO, WHATSAPP Y AVISO DE UBICACIÓN
// ============================================================================
function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  currentUser,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onRecordOrderInDB,
  onRecordWhatsAppInDB
}) {
  const [copiedField, setCopiedField] = useState(null);
  const [wantsShipping, setWantsShipping] = useState(true);
  const [showLocationWarningModal, setShowLocationWarningModal] = useState(false);
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  if (!isOpen) return null;

  const isWholesale = currentUser?.accountType === 'mayorista';

  const subtotal = cartItems.reduce((sum, item) => {
    const unit = getEffectivePricePerKg(item, currentUser);
    return sum + unit * item.weight.multiplier * item.quantity;
  }, 0);

  const regularSubtotal = cartItems.reduce(
    (sum, item) => sum + item.pricePerKg * item.weight.multiplier * item.quantity,
    0
  );
  const totalSavings = Math.max(0, regularSubtotal - subtotal);
  const shippingCost = isWholesale ? (wantsShipping ? 3500 : 0) : subtotal >= 45000 ? 0 : 2500;
  const totalAmount = cartItems.length > 0 ? subtotal + shippingCost : 0;

  const handleCopy = (text, field) => {
    navigator.clipboard?.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const prepareWhatsAppFlow = async () => {
    const orderNumber = `CSI-${Math.floor(100000 + Math.random() * 900000)}`;
    const snapshot = {
      orderNumber,
      customerName: currentUser?.name || 'Cliente Web',
      customerEmail: currentUser?.email || '',
      businessName: currentUser?.businessName || '',
      isWholesale,
      wantsShipping: isWholesale ? wantsShipping : true,
      items: cartItems.map((item) => {
        const unitPrice = getEffectivePricePerKg(item, currentUser);
        return {
          id: item.id,
          name: item.name,
          weightLabel: item.weight.label,
          quantity: item.quantity,
          unitPrice,
          lineTotal: unitPrice * item.weight.multiplier * item.quantity
        };
      }),
      total: totalAmount
    };

    setOrderSnapshot(snapshot);
    await onRecordOrderInDB(snapshot);
    setShowLocationWarningModal(true);
  };

  const handleConfirmRedirectWhatsApp = async () => {
    if (!orderSnapshot) return;
    await onRecordWhatsAppInDB(orderSnapshot);

    const lines = orderSnapshot.items
      .map(
        (i) =>
          `• ${i.name} (${i.weightLabel}) x${i.quantity} = ${formatCurrency(
            i.lineTotal
          )}`
      )
      .join('\n');

    const deliveryText = orderSnapshot.isWholesale
      ? orderSnapshot.wantsShipping
        ? 'CON ENVÍO REFRIGERADO (adjunto mi ubicación actual)'
        : 'RETIRO EN CABAÑA (Sin envío)'
      : 'ENVÍO A DOMICILIO (adjunto mi ubicación actual)';

    const message = [
      `Hola *Cabaña San Ignacio*! Envío mi comprobante de pago por Mercado Pago:`,
      ``,
      `*Pedido:* ${orderSnapshot.orderNumber}`,
      `*Cliente:* ${orderSnapshot.customerName} (${
        orderSnapshot.isWholesale ? 'MAYORISTA' : 'MINORISTA'
      })`,
      orderSnapshot.businessName ? `*Comercio:* ${orderSnapshot.businessName}` : null,
      `*Entrega:* ${deliveryText}`,
      ``,
      `*Detalle del pedido:*`,
      lines,
      ``,
      `*Total transferido:* ${formatCurrency(orderSnapshot.total)}`,
      `*Alias destino:* ${MP_ALIAS}`,
      ``,
      `Adjunto el recibo de Mercado Pago y mi *ubicación* para coordinar.`
    ]
      .filter(Boolean)
      .join('\n');

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;
    setShowLocationWarningModal(false);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-lg bg-white h-full flex flex-col shadow-2xl">
        {/* Header carrito */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-red-600" />
            <h2 className="text-lg font-black text-stone-900">Tu Pedido</h2>
            {isWholesale && (
              <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-900 text-[11px] font-black">
                Lista Mayorista
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white border border-stone-200 hover:bg-stone-100 text-stone-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Lista de productos + Mercado Pago */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {cartItems.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto" />
              <p className="text-sm font-extrabold text-stone-700">
                Todavía no agregaste cortes a tu pedido
              </p>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-red-600 text-white text-xs font-black"
              >
                Explorar Cortes y Bolsones
              </button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {cartItems.map((item) => {
                  const unitPrice = getEffectivePricePerKg(item, currentUser);
                  const lineTotal =
                    unitPrice * item.weight.multiplier * item.quantity;

                  return (
                    <div
                      key={`${item.id}-${item.weight.label}`}
                      className="p-3.5 rounded-2xl border border-stone-200 bg-white flex items-center gap-3.5"
                    >
                      <img
                        src={item.photos[0]}
                        alt={item.name}
                        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs sm:text-sm font-black text-stone-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-[11px] font-bold text-stone-500 block">
                          Presentación: {item.weight.label}
                        </span>
                        <span className="text-sm font-black text-red-600 block mt-0.5">
                          {formatCurrency(lineTotal)}
                        </span>
                      </div>

                      <div className="flex flex-col items-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            onRemoveItem(item.id, item.weight.label)
                          }
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <div className="flex items-center gap-1.5 bg-stone-100 rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.weight.label,
                                item.quantity - 1
                              )
                            }
                            className="p-1 rounded bg-white text-stone-800"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-5 text-center text-xs font-black">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              onUpdateQuantity(
                                item.id,
                                item.weight.label,
                                item.quantity + 1
                              )
                            }
                            className="p-1 rounded bg-white text-stone-800"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pregunta de envío si es Mayorista */}
              {isWholesale && (
                <div className="p-4 rounded-2xl bg-sky-50 border-2 border-sky-200 space-y-2.5">
                  <span className="text-xs font-black text-sky-950 flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-sky-700" />
                    <span>¿Como mayorista necesitás envío refrigerado?</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setWantsShipping(true)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                        wantsShipping
                          ? 'bg-sky-700 text-white border-sky-700'
                          : 'bg-white text-sky-950 border-sky-200'
                      }`}
                    >
                      Sí, con Envío (+{formatCurrency(3500)})
                    </button>
                    <button
                      type="button"
                      onClick={() => setWantsShipping(false)}
                      className={`py-2.5 px-3 rounded-xl text-xs font-black border transition-all ${
                        !wantsShipping
                          ? 'bg-sky-700 text-white border-sky-700'
                          : 'bg-white text-sky-950 border-sky-200'
                      }`}
                    >
                      No, Retiro Local ($0)
                    </button>
                  </div>
                </div>
              )}

              {/* Datos de Pago por Mercado Pago */}
              <div className="p-4 rounded-2xl bg-sky-950 text-white space-y-3 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-sky-300 flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    <span>Pago Directo por Mercado Pago</span>
                  </span>
                  <span className="text-[10px] bg-sky-800 px-2 py-0.5 rounded-full font-bold">
                    Transferencia
                  </span>
                </div>

                <div className="bg-white/10 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sky-200 block text-[10px]">
                        Alias Mercado Pago ({MP_TITULAR}):
                      </span>
                      <strong className="text-sm font-black tracking-wide">
                        {MP_ALIAS}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(MP_ALIAS, 'alias')}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-stone-950 font-black text-[11px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'alias' ? 'Copiado' : 'Copiar alias'}</span>
                    </button>
                  </div>

                  <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <div>
                      <span className="text-sky-200 block text-[10px]">
                        Monto exacto a transferir:
                      </span>
                      <strong className="text-base font-black text-emerald-300">
                        {formatCurrency(totalAmount)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(String(totalAmount), 'price')}
                      className="px-2.5 py-1.5 rounded-lg bg-white/15 hover:bg-white/25 text-white font-bold text-[11px] flex items-center gap-1"
                    >
                      <Copy className="w-3 h-3" />
                      <span>{copiedField === 'price' ? 'Copiado' : 'Copiar precio'}</span>
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-sky-200 leading-relaxed">
                  <strong>Importante:</strong> Luego de realizar la transferencia en Mercado Pago, enviá el recibo por WhatsApp junto con tu ubicación para confirmar el despacho.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer totales + botón WhatsApp */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal cortes</span>
                <span className="font-bold">{formatCurrency(subtotal)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 font-extrabold">
                  <span>
                    {isWholesale ? 'Ahorro Lista Mayorista' : 'Ahorro Ofertas del Día'}
                  </span>
                  <span>-{formatCurrency(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-stone-600">
                <span>Envío refrigerado</span>
                <span className="font-bold">
                  {shippingCost === 0 ? 'GRATIS' : formatCurrency(shippingCost)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-stone-950 pt-2 border-t border-stone-200">
                <span>Total a Abonar</span>
                <span>{formatCurrency(totalAmount)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={prepareWhatsAppFlow}
              className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enviar Recibo y Ubicación por WhatsApp</span>
            </button>

            <button
              type="button"
              onClick={onClearCart}
              className="w-full py-1.5 text-[11px] font-bold text-stone-500 hover:text-red-600"
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>

      {/* Modal emergente de advertencia de ubicación antes de ir a WhatsApp */}
      {showLocationWarningModal && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-500 space-y-4">
            <div className="flex items-center gap-3 text-emerald-700">
              <div className="p-3 rounded-2xl bg-emerald-100">
                <MapPin className="w-6 h-6 text-emerald-700" />
              </div>
              <div>
                <h3 className="text-base font-black text-stone-900">
                  Redirección a WhatsApp
                </h3>
                <span className="text-xs font-bold text-emerald-700">
                  Recordatorio antes de enviar
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2 leading-relaxed">
              <p className="font-extrabold flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <span>¡Atención! Se abrirá WhatsApp con tu pedido armado.</span>
              </p>
              <p>
                Recordá adjuntar en el chat el <strong>comprobante de pago de Mercado Pago</strong> y enviar tu <strong>ubicación actual</strong> para que podamos coordinar la entrega.
              </p>
            </div>

            <div className="flex gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowLocationWarningModal(false)}
                className="flex-1 py-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmRedirectWhatsApp}
                className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black shadow-md flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Entendido, ir a WhatsApp</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// MODAL PANEL ADMINISTRADOR BAJO LLAVE
// ============================================================================
function AdminPanelModal({ isOpen, onClose, fbUser, showToast }) {
  const [secretInput, setSecretInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState('pedidos');
  const [orders, setOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [whatsappEvents, setWhatsappEvents] = useState([]);

  useEffect(() => {
    if (!isOpen || !isUnlocked || !fbUser) return;

    const unsubOrders = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'pedidos'),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.createdAtMs || 0) - (a.createdAtMs || 0));
        setOrders(list);
      },
      (err) => console.error('Error leyendo pedidos:', err)
    );

    const unsubUsers = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'usuarios'),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.updatedAtMs || 0) - (a.updatedAtMs || 0));
        setUsersList(list);
      },
      (err) => console.error('Error leyendo usuarios:', err)
    );

    const unsubWa = onSnapshot(
      collection(db, 'artifacts', appId, 'public', 'data', 'eventos_whatsapp'),
      (snap) => {
        const list = snap.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => (b.sentAtMs || 0) - (a.sentAtMs || 0));
        setWhatsappEvents(list);
      },
      (err) => console.error('Error leyendo eventos whatsapp:', err)
    );

    return () => {
      unsubOrders();
      unsubUsers();
      unsubWa();
    };
  }, [isOpen, isUnlocked, fbUser]);

  if (!isOpen) return null;

  const handleUnlock = (e) => {
    e.preventDefault();
    if (secretInput.trim() === ADMIN_SECRET_KEY) {
      setIsUnlocked(true);
      showToast('Panel Administrador desbloqueado.');
    } else {
      showToast('Clave incorrecta. Intente nuevamente.');
    }
  };

  const handleMarkOrderPaid = async (orderId) => {
    try {
      await updateDoc(
        doc(db, 'artifacts', appId, 'public', 'data', 'pedidos', orderId),
        { status: 'pagado_verificado' }
      );
      showToast('Pedido marcado como Pagado Verificado.');
    } catch (err) {
      console.error('Error actualizando pedido:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[88vh] flex flex-col overflow-hidden shadow-2xl border border-stone-200">
        <div className="p-5 bg-stone-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-black">
              Panel Administrador • Cabaña San Ignacio
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-stone-800 hover:bg-stone-700 text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isUnlocked ? (
          <form onSubmit={handleUnlock} className="p-8 max-w-sm mx-auto w-full space-y-4">
            <div className="text-center space-y-1">
              <span className="text-xs font-black uppercase tracking-wider text-amber-600">
                Acceso Restringido
              </span>
              <h3 className="text-lg font-black text-stone-900">
                Ingresá la llave maestra
              </h3>
            </div>
            <input
              type="password"
              required
              value={secretInput}
              onChange={(e) => setSecretInput(e.target.value)}
              placeholder="Clave de administrador..."
              className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm text-center font-bold focus:outline-none focus:border-amber-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-stone-950 hover:bg-amber-600 text-white font-black text-sm transition-colors"
            >
              Desbloquear Base de Datos
            </button>
          </form>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="px-5 pt-3 border-b border-stone-200 bg-stone-50 flex gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('pedidos')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-black flex items-center gap-1.5 ${
                  activeTab === 'pedidos'
                    ? 'bg-white text-red-600 border-t border-x border-stone-200'
                    : 'text-stone-600'
                }`}
              >
                <ClipboardList className="w-4 h-4" />
                <span>Pedidos ({orders.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('usuarios')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-black flex items-center gap-1.5 ${
                  activeTab === 'usuarios'
                    ? 'bg-white text-sky-700 border-t border-x border-stone-200'
                    : 'text-stone-600'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Usuarios ({usersList.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('whatsapp')}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-black flex items-center gap-1.5 ${
                  activeTab === 'whatsapp'
                    ? 'bg-white text-emerald-700 border-t border-x border-stone-200'
                    : 'text-stone-600'
                }`}
              >
                <MessageCircle className="w-4 h-4" />
                <span>Envíos WhatsApp ({whatsappEvents.length})</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-3 text-xs">
              {activeTab === 'pedidos' &&
                (orders.length === 0 ? (
                  <p className="text-center text-stone-500 py-10">
                    Aún no hay pedidos registrados.
                  </p>
                ) : (
                  orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-stone-900">
                            {ord.orderNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              ord.isWholesale
                                ? 'bg-sky-100 text-sky-900'
                                : 'bg-red-100 text-red-900'
                            }`}
                          >
                            {ord.isWholesale ? 'Mayorista' : 'Minorista'}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              ord.status === 'pagado_verificado'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {ord.status === 'pagado_verificado'
                              ? 'Pagado Verificado'
                              : 'Pendiente Comprobante'}
                          </span>
                        </div>
                        <p className="font-bold text-stone-700">
                          Cliente: {ord.customerName}{' '}
                          {ord.businessName ? `(${ord.businessName})` : ''}
                        </p>
                        <p className="text-stone-600">
                          Total: <strong>{formatCurrency(ord.total)}</strong> •{' '}
                          {ord.wantsShipping ? 'Con Envío' : 'Retiro Local'}
                        </p>
                      </div>

                      {ord.status !== 'pagado_verificado' && (
                        <button
                          type="button"
                          onClick={() => handleMarkOrderPaid(ord.id)}
                          className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black flex items-center gap-1.5 self-start sm:self-center"
                        >
                          <CheckSquare className="w-4 h-4" />
                          <span>Verificar Pago</span>
                        </button>
                      )}
                    </div>
                  ))
                ))}

              {activeTab === 'usuarios' &&
                (usersList.length === 0 ? (
                  <p className="text-center text-stone-500 py-10">
                    Aún no hay usuarios registrados.
                  </p>
                ) : (
                  usersList.map((u) => (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-2xl border border-stone-200 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-black text-stone-900 block">
                          {u.name}
                        </span>
                        <span className="text-stone-500">{u.email}</span>
                      </div>
                      <span
                        className={`px-2.5 py-1 rounded-full font-black text-[10px] ${
                          u.accountType === 'mayorista'
                            ? 'bg-sky-100 text-sky-900'
                            : 'bg-red-100 text-red-900'
                        }`}
                      >
                        {u.accountType === 'mayorista' ? 'Mayorista' : 'Minorista'}
                      </span>
                    </div>
                  ))
                ))}

              {activeTab === 'whatsapp' &&
                (whatsappEvents.length === 0 ? (
                  <p className="text-center text-stone-500 py-10">
                    Aún no hay envíos registrados hacia WhatsApp.
                  </p>
                ) : (
                  whatsappEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between"
                    >
                      <div>
                        <span className="font-black text-stone-900 block">
                          {ev.orderNumber} • {ev.customerName}
                        </span>
                        <span className="text-stone-600">
                          Monto: {formatCurrency(ev.total)} •{' '}
                          {ev.wantsShipping ? 'Solicita Envío' : 'Sin Envío'}
                        </span>
                      </div>
                      <span className="text-[11px] font-bold text-emerald-700">
                        {ev.sentAtMs
                          ? new Date(ev.sentAtMs).toLocaleString('es-AR')
                          : 'Reciente'}
                      </span>
                    </div>
                  ))
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// COMPONENTE AUXILIAR: ANIMACIÓN REVEAL AL HACER SCROLL (COMO CERDOVA)
// ============================================================================
function ScrollReveal({ children, className = '', delay = 0 }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ============================================================================
// COMPONENTE: BOTÓN FLOTANTE DE WHATSAPP ABAJO A LA DERECHA (ESTILO CERDOVA)
// ============================================================================
function FloatingWhatsAppWidget({ onRecordWhatsAppInDB }) {
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);

  const handleOpenChat = async (branchLabel) => {
    const text = `Hola *Cabaña San Ignacio*! Les escribo desde la web (${branchLabel}) para hacer una consulta.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    if (onRecordWhatsAppInDB) {
      await onRecordWhatsAppInDB({
        orderNumber: 'CONSULTA-WEB',
        customerName: `Consulta ${branchLabel}`,
        isWholesale: false,
        wantsShipping: false,
        total: 0
      });
    }
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsWidgetOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {isWidgetOpen && (
        <div className="w-72 sm:w-80 bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden">
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h4 className="text-sm font-black leading-none">Escribinos</h4>
                <span className="text-[11px] text-emerald-100">
                  Nuestro equipo responderá pronto.
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsWidgetOpen(false)}
              className="p-1.5 rounded-full hover:bg-emerald-700 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3.5 bg-stone-50 space-y-2">
            <button
              type="button"
              onClick={() => handleOpenChat('Ventas Minoristas / Envíos')}
              className="w-full p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-left flex items-center justify-between transition-all group"
            >
              <div>
                <span className="text-xs font-black text-stone-900 block group-hover:text-emerald-800">
                  Atención Minorista y Envíos
                </span>
                <span className="text-[11px] text-stone-500">
                  Pedidos y consultas en el día
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>

            <button
              type="button"
              onClick={() => handleOpenChat('Abastecimiento Mayorista')}
              className="w-full p-3 rounded-2xl bg-white hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 text-left flex items-center justify-between transition-all group"
            >
              <div>
                <span className="text-xs font-black text-stone-900 block group-hover:text-emerald-800">
                  Ventas por Mayor y Comercios
                </span>
                <span className="text-[11px] text-stone-500">
                  Parrillas, restaurantes y carnicerías
                </span>
              </div>
              <ArrowRight className="w-4 h-4 text-emerald-600" />
            </button>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setIsWidgetOpen((prev) => !prev)}
        aria-label="Contactar por WhatsApp"
        className="group flex items-center gap-2.5 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3.5 rounded-full shadow-2xl border-2 border-white transition-all hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
        <span className="text-xs font-black tracking-wide hidden sm:inline">
          WhatsApp
        </span>
      </button>
    </div>
  );
}

// ============================================================================
// COMPONENTE: PÁGINA DE INICIO (ESTILO CERDOVA ADAPTADO A CABAÑA SAN IGNACIO)
// ============================================================================
function LandingHomeView({
  onEnterStore,
  onOpenAuth,
  currentUser,
  onLogout,
  onOpenAdmin,
  fbUser,
  showToast
}) {
  const [heroSlide, setHeroSlide] = useState(0);
  const [cutsTab, setCutsTab] = useState('vaca');
  const [contactForm, setContactForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    city: '',
    message: ''
  });
  const [sendingContact, setSendingContact] = useState(false);

  const heroSlides = [
    {
      badge: 'Calidad y precio',
      title: 'La mejor calidad y el mejor precio en cortes de vaca y bolsones.',
      subtitle:
        'Abastecimiento directo desde Cabaña San Ignacio para tu hogar, parrilla o comercio gastronómico con cadena de frío garantizada.',
      image:
        'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1600&q=80'
    },
    {
      badge: 'Mayorista & Minorista',
      title: 'Cortes seleccionados de novillo y ternera directo a tu mesa.',
      subtitle:
        'Explorá nuestra tienda online, elegí por corte o bolsón armado, pagá por Mercado Pago y recibilo en tu puerta.',
      image:
        'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=1600&q=80'
    },
    {
      badge: 'Precios Especiales por Volumen',
      title: 'Abastecimiento integral para parrillas, restaurantes y carnicerías.',
      subtitle:
        'Ingresá como Mayorista en nuestra tienda online para acceder a listas diferenciadas y pedidos por kilogramo.',
      image:
        'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1600&q=80'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const beefCutsCatalog = [
    { name: 'Asado de Tira', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' },
    { name: 'Vacío Fino', img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bife de Chorizo', img: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=500&q=80' },
    { name: 'Ojo de Bife', img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=500&q=80' },
    { name: 'Entraña Fina', img: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=500&q=80' },
    { name: 'Lomo Fino', img: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=500&q=80' },
    { name: 'Matambre', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Nalga p/ Milanesa', img: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=500&q=80' },
    { name: 'Colita de Cuadril', img: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?auto=format&fit=crop&w=500&q=80' },
    { name: 'Osobuco', img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=500&q=80' },
    { name: 'Roast Beef / Aguja', img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80' },
    { name: 'Paleta', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Tapa de Asado', img: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=500&q=80' },
    { name: 'Tortuguita', img: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=500&q=80' },
    { name: 'Carne Molida', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Costeletas', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' }
  ];

  const packsCatalog = [
    { name: 'Bolsón Clásico Diario (3 kg)', img: 'https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bolsón Parrillero Completo (4 kg)', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bolsón Familiar Milanesas (4 kg)', img: 'https://images.unsplash.com/photo-1615937657715-bc7b4b7962c1?auto=format&fit=crop&w=500&q=80' },
    { name: 'Bolsón Económico Olla (3,5 kg)', img: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?auto=format&fit=crop&w=500&q=80' }
  ];

  const wholesaleSegments = [
    'Restaurantes',
    'Parrillas',
    'Hoteles',
    'Servicios de Catering',
    'Carnicerías de barrio',
    'Despensas y/o Almacenes',
    'Eventos',
    'Otros rubros'
  ];

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (!contactForm.fullName.trim() || !contactForm.phone.trim() || !contactForm.message.trim()) {
      showToast('Completá los campos obligatorios (*) para enviar tu consulta.');
      return;
    }
    setSendingContact(true);
    try {
      if (fbUser) {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'consultas_web'), {
          ...contactForm,
          createdAtMs: Date.now()
        });
      }
      showToast('¡Consulta enviada! Nuestro equipo de Cabaña San Ignacio te responderá pronto.');
      setContactForm({ fullName: '', phone: '', email: '', city: '', message: '' });
    } catch (err) {
      console.error('Error enviando consulta:', err);
      showToast('Consulta recibida. También podés escribirnos directo por WhatsApp.');
    } finally {
      setSendingContact(false);
    }
  };

  return (
    <div id="inicio" className="min-h-screen bg-white text-stone-900 flex flex-col">
      {/* BARRA SUPERIOR DE CONTACTO Y REDES */}
      <div className="bg-stone-950 text-stone-200 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <a
              href="#contacto"
              className="hover:text-red-400 transition-colors font-bold flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>Consulta Online</span>
            </a>
            <span className="hidden sm:inline text-stone-600">|</span>
            <span className="hidden sm:inline text-stone-400">
              Abastecimiento Mayorista y Minorista
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-stone-400 hidden sm:inline">Seguinos:</span>
            <a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white font-bold transition-colors"
            >
              Facebook
            </a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white font-bold transition-colors"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR PRINCIPAL */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <a href="#inicio">
            <CabanaLogo />
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-extrabold text-stone-700">
            <a href="#inicio" className="hover:text-red-600 transition-colors">
              Inicio
            </a>
            <a href="#quienes-somos" className="hover:text-red-600 transition-colors">
              Quiénes somos
            </a>
            <a href="#nuestros-cortes" className="hover:text-red-600 transition-colors">
              Nuestros cortes
            </a>
            <a href="#ventas-mayor" className="hover:text-red-600 transition-colors">
              Ventas por mayor
            </a>
            <a href="#contacto" className="hover:text-red-600 transition-colors">
              Contacto
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onEnterStore('Todas')}
              className="px-4 sm:px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Comprar Online</span>
            </button>

            {currentUser ? (
              <div className="hidden sm:flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onEnterStore('Todas')}
                  className="px-3 py-2 rounded-full bg-stone-100 text-stone-900 text-xs font-extrabold"
                >
                  {currentUser.name}
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  title="Cerrar sesión"
                  className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onOpenAuth('consumidor')}
                className="hidden sm:flex items-center gap-1.5 px-3.5 py-2.5 rounded-full border border-stone-300 hover:border-stone-900 text-stone-800 text-xs font-extrabold transition-colors"
              >
                <User className="w-3.5 h-3.5" />
                <span>Acceso</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* SECCIÓN 1: HERO SLIDER FULL-WIDTH */}
      <section className="relative h-[540px] sm:h-[620px] w-full overflow-hidden bg-stone-950">
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              heroSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover object-center scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-stone-950/90 via-stone-950/65 to-stone-950/30" />

            <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 flex flex-col justify-center">
              <div className="max-w-2xl space-y-5">
                <span className="inline-block px-4 py-1.5 rounded-full bg-red-600 text-white text-xs sm:text-sm font-black uppercase tracking-widest shadow-md">
                  {slide.badge}
                </span>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                  {slide.title}
                </h1>
                <p className="text-sm sm:text-lg text-stone-200 leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => onEnterStore('Todas')}
                    className="px-7 py-4 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm sm:text-base shadow-xl hover:scale-105 transition-all flex items-center gap-2.5"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>Ir a Comprar Ahora</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <a
                    href="#nuestros-cortes"
                    className="px-6 py-4 rounded-2xl bg-white/15 hover:bg-white/25 backdrop-blur-md text-white border border-white/30 font-extrabold text-sm sm:text-base transition-all"
                  >
                    Ver Nuestros Cortes
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() =>
            setHeroSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
          }
          aria-label="Anterior"
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-red-600 text-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setHeroSlide((prev) => (prev + 1) % heroSlides.length)}
          aria-label="Siguiente"
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/40 hover:bg-red-600 text-white transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setHeroSlide(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                heroSlide === i ? 'w-8 bg-red-600' : 'w-2 bg-white/60'
              }`}
            />
          ))}
        </div>
      </section>

      {/* SECCIÓN 2: TARJETAS DESTACADAS FLOTANTES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-12 relative z-30">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-7 shadow-xl border border-stone-100 flex flex-col sm:flex-row items-center gap-6 hover:-translate-y-1 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=400&q=80"
                alt="Cortes de Vaca"
                className="w-28 h-28 rounded-2xl object-cover flex-shrink-0 shadow-md"
              />
              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-xl font-black text-stone-900">
                  Cortes de Vaca Premium
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Ofrecemos cortes de carne vacuna con calidad 100% verificada, maduración controlada y envasado al vacío.
                </p>
                <button
                  type="button"
                  onClick={() => onEnterStore('Cortes para Parrilla / Asado')}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700 pt-1"
                >
                  <span>Comprar cortes vacunos</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-xl border border-stone-100 flex flex-col sm:flex-row items-center gap-6 hover:-translate-y-1 transition-transform">
              <img
                src="https://images.unsplash.com/photo-1607623814075-e51df1bdc82f?auto=format&fit=crop&w=400&q=80"
                alt="Bolsones de Carnes"
                className="w-28 h-28 rounded-2xl object-cover flex-shrink-0 shadow-md"
              />
              <div className="text-center sm:text-left space-y-2">
                <h3 className="text-xl font-black text-stone-900">
                  Bolsones de Carnes Armados
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Combos seleccionados para la semana o el asado del domingo al mejor precio directo de cabaña.
                </p>
                <button
                  type="button"
                  onClick={() => onEnterStore('Bolsones de Carnes')}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 hover:text-red-700 pt-1"
                >
                  <span>Ver bolsones y precios</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECCIÓN 3: QUIÉNES SOMOS */}
      <section id="quienes-somos" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-5">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600 block">
                Quiénes somos
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
                Carne de calidad directa de Cabaña San Ignacio
              </h2>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Somos una empresa dedicada a la venta mayorista y minorista de cortes frescos vacunos y bolsones armados. Nuestra meta principal es acercarle al cliente la mejor calidad en cortes de carne centrando la atención en los más altos estándares de higiene y cadena de frío.
              </p>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                Contamos con listas diferenciadas para <strong>Consumidor Final</strong> y <strong>Mayoristas</strong>, compra ágil con <strong>Mercado Pago</strong> y envío coordinado por <strong>WhatsApp</strong>.
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => onEnterStore('Todas')}
                  className="px-6 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md transition-all flex items-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Ir a la Tienda Online</span>
                </button>
                <a
                  href="#contacto"
                  className="px-6 py-3.5 rounded-2xl border-2 border-stone-900 text-stone-900 hover:bg-stone-900 hover:text-white font-black text-sm transition-all"
                >
                  Visitanos / Contactanos
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=1000&q=80"
                  alt="Cabaña San Ignacio - Carnes Seleccionadas"
                  className="w-full h-80 sm:h-96 object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-4 sm:-left-6 bg-stone-950 text-white p-5 rounded-2xl shadow-xl border border-stone-800">
                <span className="text-2xl font-black text-red-500 block">100%</span>
                <span className="text-xs font-bold text-stone-300">
                  Calidad Verificada y Cadena de Frío
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECCIÓN 4: TODOS LOS CORTES (GRILLA) */}
      <section id="nuestros-cortes" className="py-20 px-4 sm:px-6 bg-stone-100 border-y border-stone-200">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                En Cabaña San Ignacio tenemos
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
                Todos los cortes
              </h2>
              <p className="text-sm text-stone-600">
                Hacé clic en cualquier corte o bolsón para ir directo a nuestra tienda online, ver su galería de fotos y agregarlo a tu pedido.
              </p>

              <div className="inline-flex bg-white p-1.5 rounded-2xl shadow-xs border border-stone-200 mt-4">
                <button
                  type="button"
                  onClick={() => setCutsTab('vaca')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    cutsTab === 'vaca'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Cortes de Vaca
                </button>
                <button
                  type="button"
                  onClick={() => setCutsTab('bolsones')}
                  className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all ${
                    cutsTab === 'bolsones'
                      ? 'bg-red-600 text-white shadow-sm'
                      : 'text-stone-700 hover:text-stone-950'
                  }`}
                >
                  Bolsones de Carnes
                </button>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={120}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {(cutsTab === 'vaca' ? beefCutsCatalog : packsCatalog).map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    onEnterStore(
                      cutsTab === 'bolsones' ? 'Bolsones de Carnes' : 'Todas'
                    )
                  }
                  className="group bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl border border-stone-200/80 transition-all hover:-translate-y-1 text-left"
                >
                  <div className="h-36 sm:h-44 w-full overflow-hidden bg-stone-200 relative">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
                    <span className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-full bg-red-600 text-white text-[10px] font-black opacity-0 group-hover:opacity-100 transition-opacity">
                      Comprar
                    </span>
                  </div>
                  <div className="p-3.5 text-center">
                    <h3 className="text-sm sm:text-base font-black text-stone-900 group-hover:text-red-600 transition-colors">
                      {item.name}
                    </h3>
                  </div>
                </button>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                type="button"
                onClick={() => onEnterStore('Todas')}
                className="px-8 py-4 rounded-2xl bg-stone-950 hover:bg-red-600 text-white font-black text-sm shadow-lg transition-all inline-flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Ver Catálogo Completo con Precios y Comprar</span>
              </button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECCIÓN 5: VENTAS POR MAYOR */}
      <section id="ventas-mayor" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-sky-950 text-white p-8 sm:p-12 shadow-2xl grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-5">
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-black uppercase">
                  Calidad de exportación
                </span>
                <span className="px-3 py-1 rounded-full bg-red-500/20 border border-red-400/40 text-red-300 text-xs font-black uppercase">
                  Mayorista & Minorista
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Venta por mayor
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                <strong>Cabaña San Ignacio</strong> ofrece la posibilidad de comprar todos los cortes vacunos y bolsones por mayor, al mejor precio, escribiendo directamente cuántos kg necesitás y recibiendo el pedido en la puerta de tu local o negocio.
              </p>

              <div>
                <p className="text-xs font-extrabold uppercase tracking-wider text-sky-300 mb-3">
                  Este servicio está pensado para:
                </p>
                <div className="grid grid-cols-2 gap-2.5 text-xs sm:text-sm font-bold">
                  {wholesaleSegments.map((seg) => (
                    <div key={seg} className="flex items-center gap-2 text-stone-200">
                      <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{seg}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => onOpenAuth('mayorista')}
                  className="px-6 py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-sm shadow-lg transition-all flex items-center gap-2"
                >
                  <Store className="w-4 h-4" />
                  <span>Ingresar como Mayorista</span>
                </button>
                <a
                  href="#contacto"
                  className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm transition-all"
                >
                  Quiero + info
                </a>
              </div>
            </div>

            <div className="rounded-3xl overflow-hidden border-4 border-white/10 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=900&q=80"
                alt="Abastecimiento mayorista Cabaña San Ignacio"
                className="w-full h-80 sm:h-96 object-cover"
              />
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SECCIÓN 6: FORMULARIO DE CONTACTO */}
      <section id="contacto" className="py-20 px-4 sm:px-6 bg-stone-100 border-t border-stone-200">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              <div className="lg:col-span-5 space-y-5">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-red-600">
                  Desde el campo a su hogar
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-stone-900">
                  Contactanos
                </h2>
                <p className="text-sm text-stone-600 leading-relaxed">
                  Dejanos tu consulta por abastecimiento mayorista, compras particulares o pedidos especiales y nuestro equipo te responderá a la brevedad.
                </p>

                <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <Clock className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <div>
                      <span className="font-black text-stone-900 block">Horarios de Atención</span>
                      <span className="text-stone-600 block">Lun - Sáb: 9:00 a 18:30 hs </span>
                      <span className="text-stone-600 block">Sab: 9:00 a 13:30 hs</span>
                      <span className="text-stone-600 block">Mercado Norte, local 12</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-stone-100">
                    <Wallet className="w-5 h-5 text-sky-600 flex-shrink-0" />
                    <div>
                      <span className="font-black text-stone-900 block">Pagos y Envíos</span>
                      <span className="text-stone-600 block">
                        Mercado Pago (Alias: <strong>{MP_ALIAS}</strong>) y coordinación por WhatsApp.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-stone-200">
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-1">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={contactForm.fullName}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, fullName: e.target.value })
                        }
                        placeholder="Nombre y Apellido"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-1">
                        Tel / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={contactForm.phone}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, phone: e.target.value })
                        }
                        placeholder="+54 9 351 000 0000"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, email: e.target.value })
                        }
                        placeholder="ejemplo@gmail.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-extrabold text-stone-700 block mb-1">
                        Ciudad / Provincia
                      </label>
                      <input
                        type="text"
                        value={contactForm.city}
                        onChange={(e) =>
                          setContactForm({ ...contactForm, city: e.target.value })
                        }
                        placeholder="Ej. Córdoba Capital"
                        className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-stone-700 block mb-1">
                      Mensaje *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={contactForm.message}
                      onChange={(e) =>
                        setContactForm({ ...contactForm, message: e.target.value })
                      }
                      placeholder="Dejá aquí tu consulta o pedido mayorista..."
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-none focus:border-red-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sendingContact}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sendingContact ? 'Enviando...' : 'Enviar Consulta'}</span>
                  </button>
                </form>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* SECCIÓN 7: FOOTER COMPLETO */}
      <footer className="bg-stone-950 text-stone-400 pt-14 pb-8 px-4 sm:px-6 border-t border-stone-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-stone-800">
          <div className="space-y-3">
            <div className="inline-block bg-white px-3.5 py-2 rounded-2xl">
              <CabanaLogo compact />
            </div>
            <p className="text-xs leading-relaxed text-stone-300">
              Vendemos la mejor carne. Calidad de exportación. Ventas mayoristas y minoristas.
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-white font-black uppercase tracking-wider">Horarios</h4>
            <p>Lun - Sáb: 9 a 13:30 hs / 17:30 a 21 hs</p>
            <p>Dom: 9 a 13:30 hs</p>
            <p className="pt-1 text-stone-300">
              Alias MP: <strong className="text-white">{MP_ALIAS}</strong>
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <h4 className="text-white font-black uppercase tracking-wider">Navegación</h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#inicio" className="hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#nuestros-cortes" className="hover:text-white transition-colors">
                  Nuestros cortes
                </a>
              </li>
              <li>
                <a href="#ventas-mayor" className="hover:text-white transition-colors">
                  Venta por mayor
                </a>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onEnterStore('Todas')}
                  className="text-red-400 hover:text-red-300 font-extrabold"
                >
                  Tienda Online (Comprar)
                </button>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-xs">
            <h4 className="text-white font-black uppercase tracking-wider">Seguinos!</h4>
            <div className="flex flex-col gap-2">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-400 hover:text-sky-300 font-bold"
              >
                Facebook • /carnessanignacio
              </a>
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 hover:text-pink-300 font-bold"
              >
                Instagram • @carnessanignacio
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <p>
            CABAÑA SAN IGNACIO © {new Date().getFullYear()} - Todos los derechos reservados.
          </p>
          <button
            type="button"
            onClick={onOpenAdmin}
            title="Acceso Panel Administrador"
            aria-label="Acceso Panel Administrador"
            className="p-2 rounded-full bg-stone-900 hover:bg-amber-500/20 text-stone-500 hover:text-amber-400 border border-stone-800 transition-colors"
          >
            <Key className="w-3.5 h-3.5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

// ============================================================================
// COMPONENTE PRINCIPAL: APP
// ============================================================================
export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [fbUser, setFbUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedSession = localStorage.getItem('cabana_san_ignacio_session');
      return savedSession ? JSON.parse(savedSession) : null;
    } catch {
      return null;
    }
  });
  const [authModalState, setAuthModalState] = useState({
    isOpen: false,
    mode: 'login',
    accountType: 'consumidor'
  });
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [galleryModalState, setGalleryModalState] = useState({
    isOpen: false,
    product: null,
    initialPhotoIndex: 0,
    initialWeight: null
  });
  const [favorites, setFavorites] = useState(['par-1', 'mag-1']);
  const [toastMessage, setToastMessage] = useState(null);

  // Sincronizar el ícono de la pestaña del navegador (favicon) y el título con el logo
  useEffect(() => {
    document.title = 'Cabaña San Ignacio • Carnes Premium';
    const encodedSvg = encodeURIComponent(CABANA_FAVICON_SVG);
    const faviconDataUrl = `data:image/svg+xml;utf8,${encodedSvg}`;

    let link = document.querySelector("link[rel*='icon']");
    if (!link) {
      link = document.createElement('link');
      link.rel = 'icon';
      document.head.appendChild(link);
    }
    link.type = 'image/svg+xml';
    link.href = faviconDataUrl;
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (err) {
        console.error('Error inicializando autenticación Firebase:', err);
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFbUser(user);
    });
    return () => unsubscribe();
  }, []);

  const isLoggedIn = Boolean(currentUser);
  const isWholesale = currentUser?.accountType === 'mayorista';

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3400);
  };

  const handleAuthSuccess = async (user, isNewRegistration) => {
    setCurrentUser(user);
    try {
      localStorage.setItem('cabana_san_ignacio_session', JSON.stringify(user));
    } catch {
      // Ignorar si localStorage no está disponible
    }

    if (fbUser) {
      try {
        const userDocId = user.email.replace(/[^a-zA-Z0-9]/g, '_');
        await setDoc(
          doc(db, 'artifacts', appId, 'public', 'data', 'usuarios', userDocId),
          {
            name: user.name,
            email: user.email,
            accountType: user.accountType,
            businessName: user.businessName || '',
            isNewRegistration: Boolean(isNewRegistration),
            updatedAtMs: Date.now()
          },
          { merge: true }
        );
      } catch (err) {
        console.error('Error guardando usuario en Firestore:', err);
      }
    }

    if (user.accountType === 'mayorista') {
      showToast(
        `¡Bienvenido ${user.name}! Lista de Precios Mayoristas activada y guardada.`
      );
    } else {
      showToast(
        isNewRegistration
          ? `¡Bienvenido ${user.name}! Cuenta registrada y Ofertas del Día desbloqueadas.`
          : `¡Hola ${user.name}! Ofertas del Día para Consumidor Final activadas.`
      );
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('cabana_san_ignacio_session');
    } catch {
      // Ignorar
    }
    if (
      selectedCategory === 'Ofertas del Día' ||
      selectedCategory === 'Precios Mayoristas'
    ) {
      setSelectedCategory('Todas');
    }
    showToast('Sesión cerrada correctamente.');
  };

  const handleRecordOrderInDB = async (orderSnapshot) => {
    if (!fbUser) return;
    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'pedidos'), {
        orderNumber: orderSnapshot.orderNumber,
        customerName: orderSnapshot.customerName,
        customerEmail: orderSnapshot.customerEmail,
        businessName: orderSnapshot.businessName,
        isWholesale: orderSnapshot.isWholesale,
        wantsShipping: orderSnapshot.wantsShipping,
        items: orderSnapshot.items.map((i) => ({
          id: i.id,
          name: i.name,
          weightLabel: i.weightLabel,
          quantity: i.quantity,
          unitPrice: i.unitPrice
        })),
        total: orderSnapshot.total,
        status: 'pendiente_comprobante',
        createdAtMs: Date.now()
      });
    } catch (err) {
      console.error('Error registrando pedido en Firestore:', err);
    }
  };

  const handleRecordWhatsAppInDB = async (orderSnapshot) => {
    if (!fbUser) return;
    try {
      await addDoc(
        collection(db, 'artifacts', appId, 'public', 'data', 'eventos_whatsapp'),
        {
          orderNumber: orderSnapshot.orderNumber || 'WEB',
          customerName: orderSnapshot.customerName || 'Cliente Web',
          businessName: orderSnapshot.businessName || '',
          isWholesale: Boolean(orderSnapshot.isWholesale),
          wantsShipping: Boolean(orderSnapshot.wantsShipping),
          total: orderSnapshot.total || 0,
          sentAtMs: Date.now()
        }
      );
    } catch (err) {
      console.error('Error registrando evento WhatsApp en Firestore:', err);
    }
  };

  const handleAddToCart = (product, weight, quantity = 1) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.id === product.id && item.weight.label === weight.label
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity
        };
        return updated;
      }
      return [...prev, { ...product, weight, quantity }];
    });
    showToast(`${product.name} (${weight.label}) agregado al pedido.`);
  };

  const handleUpdateQuantity = (productId, weightLabel, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveItem(productId, weightLabel);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === productId && item.weight.label === weightLabel
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const handleRemoveItem = (productId, weightLabel) => {
    setCartItems((prev) =>
      prev.filter(
        (item) => !(item.id === productId && item.weight.label === weightLabel)
      )
    );
  };

  const handleToggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleOpenGallery = (product, initialPhotoIndex = 0, initialWeight = null) => {
    setGalleryModalState({
      isOpen: true,
      product,
      initialPhotoIndex,
      initialWeight
    });
  };

  const handleEnterStore = (category = 'Todas') => {
    setSelectedCategory(category);
    setActiveView('store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalCartItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const filteredProducts = MEAT_PRODUCTS.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.origin.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  const dailyOfferProducts = filteredProducts.filter((p) => p.isDailyOffer);
  const exclusiveCategoryTitle = isWholesale
    ? 'Precios Mayoristas'
    : 'Ofertas del Día';

  const filterChips = [
    'Todas',
    ...(isLoggedIn ? [exclusiveCategoryTitle] : []),
    ...CATEGORIES_META.map((c) => c.title)
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col">
      {activeView === 'home' ? (
        <LandingHomeView
          onEnterStore={handleEnterStore}
          onOpenAuth={(accountType) =>
            setAuthModalState({
              isOpen: true,
              mode: 'login',
              accountType
            })
          }
          currentUser={currentUser}
          onLogout={handleLogout}
          onOpenAdmin={() => setIsAdminModalOpen(true)}
          fbUser={fbUser}
          showToast={showToast}
        />
      ) : (
        <>
          {/* BARRA DE NAVEGACIÓN SUPERIOR (TIENDA ONLINE) */}
          <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-2xs">
            <div className="bg-stone-950 text-stone-200 text-[11px] py-1.5 px-4">
              <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
                <span className="font-semibold flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-red-500" />
                  <span>Envíos refrigerados en el día • Alias MP: {MP_ALIAS}</span>
                </span>

                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveView('home')}
                    className="text-amber-400 hover:text-amber-300 font-extrabold flex items-center gap-1"
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Volver al Inicio</span>
                  </button>
                  <a
                    href={FACEBOOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors font-semibold flex items-center gap-1"
                  >
                    <span>Facebook</span>
                  </a>
                  <a
                    href={INSTAGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors font-semibold flex items-center gap-1"
                  >
                    <span>Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <a
                  href="#top"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveView('home');
                  }}
                >
                  <CabanaLogo />
                </a>
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-extrabold transition-colors"
                >
                  <Home className="w-3.5 h-3.5 text-red-600" />
                  <span>Inicio</span>
                </button>
              </div>

              <div className="order-3 md:order-2 w-full md:w-80 lg:w-96 relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar asado, bife, bolsones, molida..."
                  className="w-full pl-10 pr-8 py-2 rounded-full bg-stone-100 border border-stone-200 text-xs sm:text-sm focus:bg-white focus:outline-none focus:border-red-600 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="order-2 md:order-3 flex items-center gap-2">
                {isLoggedIn ? (
                  <div className="flex items-center gap-2">
                    <div
                      className={`px-3 py-1.5 rounded-full text-xs font-extrabold flex items-center gap-1.5 ${
                        isWholesale
                          ? 'bg-sky-100 text-sky-950 border border-sky-300'
                          : 'bg-red-50 text-red-900 border border-red-200'
                      }`}
                    >
                      {isWholesale ? (
                        <Store className="w-3.5 h-3.5 text-sky-700" />
                      ) : (
                        <User className="w-3.5 h-3.5 text-red-600" />
                      )}
                      <span className="max-w-[110px] truncate">{currentUser.name}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-white rounded-full">
                        {isWholesale ? 'Mayorista' : 'Minorista'}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      title="Cerrar sesión"
                      className="p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        setAuthModalState({
                          isOpen: true,
                          mode: 'login',
                          accountType: 'consumidor'
                        })
                      }
                      className="px-3 sm:px-3.5 py-2 rounded-full bg-stone-900 hover:bg-red-600 text-white text-xs font-extrabold transition-colors flex items-center gap-1.5"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Acceso Minorista</span>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setAuthModalState({
                          isOpen: true,
                          mode: 'login',
                          accountType: 'mayorista'
                        })
                      }
                      className="px-3 sm:px-3.5 py-2 rounded-full bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold transition-colors flex items-center gap-1.5"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Acceso Mayorista</span>
                    </button>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Abrir carrito de compras"
                  className="relative p-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all"
                >
                  <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                  {totalCartItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-stone-950 text-white text-[10px] font-black flex items-center justify-center border-2 border-white">
                      {totalCartItems}
                    </span>
                  )}
                </button>
              </div>
            </div>

            <div className="border-t border-stone-100 bg-stone-50/80 px-4 py-2 overflow-x-auto">
              <div className="max-w-7xl mx-auto flex items-center gap-2">
                {filterChips.map((cat) => {
                  const active = selectedCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all ${
                        active
                          ? 'bg-red-600 text-white shadow-2xs'
                          : 'bg-white text-stone-700 border border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </header>

          {/* HERO PRINCIPAL Y BANNER DE CATEGORÍA EXCLUSIVA / OFERTAS */}
          <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
            <div className="rounded-3xl bg-gradient-to-r from-stone-950 via-stone-900 to-red-950 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden mb-6">
              <div className="max-w-2xl relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/25 border border-red-500/40 text-red-200 text-xs font-extrabold">
                  <Award className="w-3.5 h-3.5 text-red-400" />
                  <span>Cortes Seleccionados de Novillo y Ternera</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
                  Del campo argentino directo a tu parrilla y cocina
                </h1>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  Explorá nuestras galerías de fotos por categoría, armá tu pedido con precios diferenciados para <strong>Consumidor Final</strong> o <strong>Mayorista</strong>, aboná por Mercado Pago y enviá tu comprobante por WhatsApp.
                </p>
              </div>
            </div>

            {!isLoggedIn ? (
              <div className="rounded-3xl bg-gradient-to-r from-amber-50 via-red-50 to-sky-50 border-2 border-red-200 p-5 sm:p-6 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-red-600 text-white shadow-sm flex-shrink-0">
                    <Tag className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base sm:text-lg font-black text-stone-900">
                        ¿Querés ver las Ofertas del Día? ¡Registrate gratis!
                      </h2>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-sky-100 text-sky-900">
                        Si sos mayorista tendrás otros precios especiales
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-stone-700 mt-1">
                      Ingresá como <strong>Consumidor Final</strong> para desbloquear la categoría exclusiva de <strong>Ofertas del Día</strong>, o ingresá como <strong>Mayorista</strong> para acceder a precios por caja y volumen.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={() =>
                      setAuthModalState({
                        isOpen: true,
                        mode: 'register',
                        accountType: 'consumidor'
                      })
                    }
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    Registrarme (Ofertas)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setAuthModalState({
                        isOpen: true,
                        mode: 'login',
                        accountType: 'mayorista'
                      })
                    }
                    className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold shadow-sm transition-all"
                  >
                    Soy Mayorista
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`rounded-2xl p-4 mb-6 border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isWholesale
                    ? 'bg-sky-50 border-sky-200 text-sky-950'
                    : 'bg-red-50 border-red-200 text-red-950'
                }`}
              >
                <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
                  <Sparkles
                    className={`w-5 h-5 flex-shrink-0 ${
                      isWholesale ? 'text-sky-700' : 'text-red-600'
                    }`}
                  />
                  <span>
                    {isWholesale
                      ? 'Categoría Exclusiva Mayorista Activa: estás viendo tarifas mayoristas por corte y podés escribir los kg exactos que necesitás.'
                      : 'Categoría Exclusiva Desbloqueada: estás viendo las Ofertas del Día. Recordá que si sos mayorista tendrás otros precios especiales.'}
                  </span>
                </div>
                {!isWholesale && (
                  <button
                    type="button"
                    onClick={() =>
                      setAuthModalState({
                        isOpen: true,
                        mode: 'login',
                        accountType: 'mayorista'
                      })
                    }
                    className="px-3.5 py-1.5 rounded-xl bg-sky-700 hover:bg-sky-800 text-white text-xs font-extrabold self-start sm:self-auto whitespace-nowrap"
                  >
                    Cambiar a Mayorista
                  </button>
                )}
              </div>
            )}

            {/* FILAS DE CARRUSELES POR CATEGORÍA */}
            {isLoggedIn &&
              (selectedCategory === 'Todas' ||
                selectedCategory === exclusiveCategoryTitle) && (
                <CategoryCarouselRow
                  title={exclusiveCategoryTitle}
                  subtitle={
                    isWholesale
                      ? 'Precios mayoristas vigentes hoy en Cabaña San Ignacio • Ingresá los kg que necesitás en cada corte'
                      : 'Descuentos exclusivos para clientes registrados • Si sos mayorista tendrás otros precios'
                  }
                  products={dailyOfferProducts}
                  currentUser={currentUser}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onOpenGallery={handleOpenGallery}
                  accentBadge={isWholesale ? 'Precios Mayoristas' : 'Exclusivo Registrados'}
                />
              )}

            {CATEGORIES_META.filter(
              (cat) => selectedCategory === 'Todas' || selectedCategory === cat.title
            ).map((cat) => {
              const catProducts = filteredProducts.filter(
                (p) => p.category === cat.title
              );
              return (
                <CategoryCarouselRow
                  key={cat.title}
                  title={cat.title}
                  subtitle={cat.subtitle}
                  products={catProducts}
                  currentUser={currentUser}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onAddToCart={handleAddToCart}
                  onOpenGallery={handleOpenGallery}
                  accentBadge={cat.title === 'Bolsones de Carnes' ? 'Combos Ahorro' : null}
                />
              );
            })}

            {filteredProducts.length === 0 && (
              <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 my-6">
                <p className="text-base font-extrabold text-stone-800">
                  No encontramos cortes que coincidan con "{searchQuery}"
                </p>
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="mt-3 px-4 py-2 rounded-xl bg-red-600 text-white text-xs font-bold"
                >
                  Ver todos los cortes
                </button>
              </div>
            )}
          </main>

          {/* PIE DE PÁGINA */}
          <footer className="bg-stone-950 text-stone-400 py-8 px-4 sm:px-6 mt-12 border-t border-stone-800">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <div className="bg-white px-3.5 py-2 rounded-2xl">
                  <CabanaLogo compact />
                </div>
                <div className="text-xs space-y-1">
                  <p className="text-stone-200 font-bold">
                    Cabaña San Ignacio • Carnes Vacunas Seleccionadas
                  </p>
                  <p>
                    Pagos por Mercado Pago (Alias: <strong className="text-white">{MP_ALIAS}</strong>) y coordinación directa por WhatsApp.
                  </p>
                  <div className="flex items-center justify-center sm:justify-start gap-4 pt-1">
                    <a
                      href={FACEBOOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sky-400 hover:text-sky-300 font-bold underline"
                    >
                      Facebook Oficial
                    </a>
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300 font-bold underline"
                    >
                      Instagram Oficial
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setActiveView('home')}
                  className="text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Inicio
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Bolsones de Carnes')}
                  className="hover:text-white transition-colors"
                >
                  Bolsones
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Cortes para Parrilla / Asado')}
                  className="hover:text-white transition-colors"
                >
                  Parrilla
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Cortes Magros y Plancha')}
                  className="hover:text-white transition-colors"
                >
                  Plancha
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Cortes para Guisos y Horno')}
                  className="hover:text-white transition-colors"
                >
                  Guisos y Horno
                </button>
                <button
                  type="button"
                  onClick={() => setIsAdminModalOpen(true)}
                  title="Acceso Panel Administrador"
                  aria-label="Acceso Panel Administrador"
                  className="ml-2 p-2 rounded-full bg-stone-900 hover:bg-amber-500/20 text-stone-500 hover:text-amber-400 border border-stone-800 transition-colors"
                >
                  <Key className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </footer>
        </>
      )}

      {/* Botón Flotante de WhatsApp abajo a la derecha */}
      <FloatingWhatsAppWidget onRecordWhatsAppInDB={handleRecordWhatsAppInDB} />

      {/* MODALES */}
      {galleryModalState.isOpen && galleryModalState.product && (
        <ProductGalleryModal
          product={galleryModalState.product}
          initialPhotoIndex={galleryModalState.initialPhotoIndex}
          initialWeight={galleryModalState.initialWeight}
          currentUser={currentUser}
          onClose={() =>
            setGalleryModalState({
              isOpen: false,
              product: null,
              initialPhotoIndex: 0,
              initialWeight: null
            })
          }
          onAddToCart={handleAddToCart}
        />
      )}

      <AuthModal
        isOpen={authModalState.isOpen}
        initialMode={authModalState.mode}
        initialAccountType={authModalState.accountType}
        onClose={() => setAuthModalState({ ...authModalState, isOpen: false })}
        onAuthSuccess={handleAuthSuccess}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currentUser={currentUser}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        onRecordOrderInDB={handleRecordOrderInDB}
        onRecordWhatsAppInDB={handleRecordWhatsAppInDB}
      />

      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        fbUser={fbUser}
        showToast={showToast}
      />

      {/* Notificación Flotante */}
      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-stone-900 text-white text-xs sm:text-sm font-bold shadow-2xl border border-stone-700 flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}