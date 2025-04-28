export type KnownSubmitters =
  | "Boba Network"
  | "Morph"
  | "Superseed"
  | "Lumio"
  | "zkSync Era"
  | "Mint"
  | "Shape"
  | "Abstract"
  | "Swan Chain"
  | "Others"
  | "SNAXchain"
  | "Blast"
  | "Debank Chain"
  | "Kroma"
  | "Fuel"
  | "Arena-Z"
  | "ZORA"
  | "pegglecoin"
  | "Camp Network"
  | "Scroll"
  | "Base"
  | "Mode"
  | "R0AR Chain"
  | "Soneium"
  | "Ink"
  | "Unichain"
  | "Binary"
  | "Kinto"
  | "Infinaeon"
  | "Arbitrum One"
  | "Hemi"
  | "Ethernity"
  | "Zircuit"
  | "Polynomial"
  | "Lisk"
  | "Taiko"
  | "Paradex"
  | "Phala Network"
  | "Linea"
  | "Optopia"
  | "Metal"
  | "StarkNet"
  | "OP Mainnet"
  | "World Chain"
  | "RACE";

export interface Submitter {
  color: string;
  url: string;
  icon?: string;
}

export const knownSubmitters: Partial<Record<KnownSubmitters, Submitter>> = {
  "Boba Network": {
    color: "#aedb02",
    url: "https://boba.network/",
    icon: "https://boba.network/wp-content/uploads/2024/04/Footer-Boba-small-icon.svg",
  },
  Morph: {
    color: "#14a800",
    url: "https://www.morphl2.io/",
    icon: "https://www.morphl2.io/favicon.ico",
  },
  Superseed: {
    color: "#14d1ce",
    url: "https://www.superseed.xyz/",
    icon: "https://www.superseed.xyz/favicon.ico",
  },
  Lumio: {
    color: "#b2317a",
    url: "https://lumio.io/",
    icon: "https://cdn.prod.website-files.com/657070a218c26531b4335f61/65707a4ba9f8c0c0ee5efaf2_lumi-logo-sign.png",
  },
  "zkSync Era": {
    color: "#0d18eb",
    url: "https://www.zksync.io/",
    icon: "https://www.zksync.io/favicon.ico",
  },

  Base: {
    color: "#0052fe",
    url: "https://www.base.org/",
    icon: "https://www.base.org/document/android-chrome-192x192.png",
  },
};

export const getSubmitter = (submitter: string) => {
  const known = knownSubmitters[submitter as KnownSubmitters];

  if (!known) {
    return {
      color: "#e6e6e6",
      url: "",
    };
  }

  return known;
};
