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
  | "Zircuit" //
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
  | "RACE"
  | "Binary"
  | "Inscriptions"
  | "Lambda"
  | "ZERO Network";

export interface Submitter {
  color: string;
  url?: string;
  icon?: string;
}

export const knownSubmitters: Partial<Record<KnownSubmitters, Submitter>> = {
  "Boba Network": {
    color: "#aedb02",
    url: "https://boba.network/",
    icon: "icons/boba.svg",
  },
  Morph: {
    color: "#14a800",
    url: "https://www.morphl2.io/",
    icon: "icons/morph.webp",
  },
  Superseed: {
    color: "#14d1ce",
    url: "https://www.superseed.xyz/",
    icon: "icons/superseed.webp",
  },
  Lumio: {
    color: "#b2317a",
    url: "https://lumio.io/",
    icon: "icons/lumio.png",
  },
  "zkSync Era": {
    color: "#0d18eb",
    url: "https://www.zksync.io/",
    icon: "icons/zksync-era.webp",
  },
  Mint: {
    color: "#30bf54",
    url: "https://www.mintchain.io/",
    icon: "icons/mint.webp",
  },
  Shape: {
    color: "#000000",
    url: "https://shape.network/",
    icon: "icons/shape.webp",
  },
  Abstract: {
    color: "#2ce788",
    url: "https://www.abs.xyz/",
    icon: "icons/abstract.webp",
  },
  "Swan Chain": {
    color: "#03d1ea",
    url: "https://docs.swanchain.io/",
    icon: "icons/swan.webp",
  },
  SNAXchain: {
    color: "#022546",
    url: "https://governance.synthetix.io/",
    icon: "icons/snaxchain.webp",
  },
  Blast: {
    color: "#fff76a",
    url: "https://blast.io/en",
    icon: "https://blast.io/favicon.svg",
  },
  "Debank Chain": {
    color: "#fd6d4e",
    url: "https://dbkchain.io/",
    icon: "https://dbkchain.io/DBK-chain.svg",
  },
  Kroma: {
    color: "#93f05a",
    url: "https://kroma.network/",
    icon: "icons/kroma.webp",
  },
  Fuel: {
    color: "#00d16c",
    url: "https://fuel.network/",
    icon: "icons/fuel.webp",
  },
  "Arena-Z": {
    color: "#200752",
    url: "https://arena-z.gg/",
    icon: "/icons/arenaz.webp",
  },
  ZORA: {
    color: "#121113",
    url: "https://zora.co/",
    icon: "icons/zora.ico",
  },
  "Camp Network": {
    color: "#fe6d01",
    url: "https://campnetwork.xyz/",
    icon: "icons/camp.webp",
  },
  Scroll: {
    color: "#eac28e",
    url: "https://scroll.io/",
    icon: "icons/scroll.webp",
  },
  Base: {
    color: "#0052fe",
    url: "https://www.base.org/",
    icon: "/icons/base.webp",
  },
  Mode: {
    color: "#e1fe00",
    url: "https://mode.network/",
    icon: "icons/mode.webp",
  },
  "R0AR Chain": {
    color: "#000000",
    url: "https://r0ar.xyz/",
    icon: "icons/r0ar.webp",
  },
  Soneium: {
    color: "#000000",
    url: "https://soneium.org/en/",
    icon: "icons/soneium.webp",
  },
  Ink: {
    color: "#7132f5",
    url: "https://inkonchain.com",
    icon: "icons/ink.webp",
  },
  Unichain: {
    color: "#ff38d6",
    url: "https://www.unichain.org/",
    icon: "icons/unichain.webp",
  },
  // Binary: {},
  Kinto: {
    color: "#4c7ea0",
    url: "https://www.kinto.xyz/",
    icon: "icons/kinto.webp",
  },
  Infinaeon: {
    color: "#20b1a8",
    url: "https://infinaeon.com/",
    icon: "icons/infinaeon.png",
  },
  "Arbitrum One": {
    color: "#162b4e",
    url: "https://arbitrum.io/",
    icon: "icons/arbitrum.webp",
  },
  Hemi: {
    color: "#fe6c14",
    url: "https://hemi.xyz/",
    icon: "icons/hemi.webp",
  },
  Ethernity: {
    color: "#5b8ce2",
    url: "https://www.ethernity.io/",
    icon: "icons/ethernity.webp",
  },
  Zircuit: {
    color: "#2a7e21",
    url: "https://www.zircuit.com/",
    icon: "icons/zircuit.webp",
  },
  Polynomial: {
    color: "#70971f",
    url: "https://polynomial.fi/",
    icon: "icons/polynomial.webp",
  },
  Lisk: {
    color: "#356efd",
    url: "https://lisk.com/",
    icon: "icons/lisk.webp",
  },
  Taiko: {
    color: "#e81899",
    url: "https://taiko.xyz/",
    icon: "icons/taiko.webp",
  },
  Paradex: {
    color: "#cc37ff",
    url: "https://www.paradex.trade/",
    icon: "icons/paradex.webp",
  },
  "Phala Network": {
    color: "#d5fd4e",
    url: "https://phala.network/",
    icon: "icons/phala.webp",
  },
  Linea: {
    color: "#fef067",
    url: "https://linea.build/",
    icon: "icons/linea.webp",
  },
  Optopia: {
    color: "#ff1b33",
    url: "https://optopia.ai/",
    icon: "icons/optopia.webp",
  },
  Metal: {
    color: "#122ebd",
    url: "https://metall2.com/",
    icon: "icons/metal.webp",
  },
  StarkNet: {
    color: "#0c0c4f",
    url: "https://www.starknet.io/",
    icon: "icons/starknet.webp",
  },
  "OP Mainnet": {
    color: "#fe0420",
    url: "https://www.optimism.io/",
    icon: "icons/op-mainnet.webp",
  },
  "World Chain": {
    color: "#40dbed",
    url: "https://world.org/world-chain",
    icon: "icons/world.webp",
  },
  RACE: {
    color: "#b67d68",
    url: "https://raceecosystem.com/",
    icon: "icons/race.webp",
  },
  Lambda: {
    color: "#4149df",
    url: "https://lambda.im/",
    icon: "icons/lambda.webp",
  },
  "ZERO Network": {
    color: "#fe5061",
    url: "https://zero.network/",
    icon: "icons/zeronetwork.webp",
  },

  Others: {
    color: "#efefef",
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
