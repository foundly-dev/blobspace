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
}

export const knownSubmitters: Partial<Record<KnownSubmitters, Submitter>> = {
  "Boba Network": {
    color: "#aedb02",
    url: "https://boba.network/",
  },
  Morph: {
    color: "#14a800",
    url: "https://www.morphl2.io/",
  },
  Superseed: {
    color: "#14d1ce",
    url: "https://www.superseed.xyz/",
  },
  Lumio: {
    color: "#b2317a",
    url: "https://lumio.io/",
  },
  "zkSync Era": {
    color: "#0d18eb",
    url: "https://www.zksync.io/",
  },

  Base: {
    color: "#0052fe",
    url: "https://www.base.org/",
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
