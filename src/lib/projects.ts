export type NetworkStage = "mainnet" | "testnet" | "local"

export type Contract = {
  label: string
  address: string
  explorerUrl?: string
}

export type FlowNode = {
  label: string
  sub?: string
}

export type Project = {
  slug: string
  name: string
  chain: string
  chainColor: string
  tagline: string
  primitive: string
  primitiveDetail: string
  network: NetworkStage
  statusLabel: string
  repoUrl: string
  frontendUrl?: string
  contracts: Contract[]
  techStack: string[]
  flow: FlowNode[]
  flowNote?: string
}

export const projects: Project[] = [
  {
    slug: "midnight-private-auction",
    name: "Midnight Private Auction",
    chain: "Midnight",
    chainColor: "#A78BFA",
    tagline: "Sealed-bid auction — bid amounts stay hidden until reveal, then disclosed on-chain via commit-reveal.",
    primitive: "Compact witnesses + commit-reveal ZK",
    primitiveDetail:
      "Bids are hashed client-side (secret key, amount, salt) inside a Compact circuit into a single commitment; disclose() only publishes the amount at reveal time.",
    network: "mainnet",
    statusLabel: "Live — Mainnet",
    repoUrl: "https://github.com/pplmaverick/midnight-private-auction",
    frontendUrl: "https://midnight-private-auction.vercel.app",
    contracts: [
      {
        label: "Auction Contract",
        address:
          "4fd31443997bd04bbf0b94e2ef3d5b0ff05479c4fb80bcac0dc74b2c763282e5",
        explorerUrl:
          "https://explorer.1am.xyz/contract/4fd31443997bd04bbf0b94e2ef3d5b0ff05479c4fb80bcac0dc74b2c763282e5",
      },
    ],
    techStack: ["Compact 0.23", "midnight-js SDK", "React 19", "Vite", "Tailwind 4"],
    flow: [
      { label: "React frontend", sub: "in-browser ZK proving" },
      { label: "Compact contract", sub: "Midnight ledger" },
      { label: "Indexer GraphQL", sub: "public reads" },
    ],
    flowNote: "No external oracle — all state sourced from the Midnight ledger/indexer.",
  },
  {
    slug: "fhenix-confidential-prediction-market",
    name: "Fhenix Confidential Prediction Market",
    chain: "Fhenix (CoFHE)",
    chainColor: "#60A5FA",
    tagline: "Prediction market where bet size and side stay encrypted end-to-end.",
    primitive: "FHE euint64 / ebool via CoFHE coprocessor",
    primitiveDetail:
      "Client-encrypted InEuint64/InEbool inputs are combined on-chain with FHE.select/FHE.eq, settled via the CoFHE threshold network's publishDecryptResult signature.",
    network: "testnet",
    statusLabel: "Live — Testnet (Arbitrum Sepolia)",
    repoUrl: "https://github.com/pplmaverick/fhenix-confidential-prediction-market",
    frontendUrl: "https://fhenix-confidential-prediction-mark.vercel.app",
    contracts: [
      {
        label: "ConfidentialPredictionMarket",
        address: "0x9DE6ba0f6901e366BbCf373F7c8F63b5c955138d",
        explorerUrl:
          "https://sepolia.arbiscan.io/address/0x9DE6ba0f6901e366BbCf373F7c8F63b5c955138d",
      },
      {
        label: "MarketFactory",
        address: "0x575FF2bb9f8F5Ef5Bd0198F316Cd7a1a7e8482FA",
        explorerUrl:
          "https://sepolia.arbiscan.io/address/0x575FF2bb9f8F5Ef5Bd0198F316Cd7a1a7e8482FA",
      },
    ],
    techStack: ["Solidity 0.8.28", "CoFHE / FHE.sol", "Hardhat 2", "React", "wagmi"],
    flow: [
      { label: "React + cofhe-sdk", sub: "local encryption" },
      { label: "ConfidentialPredictionMarket.sol", sub: "Arbitrum Sepolia" },
      { label: "CoFHE threshold network", sub: "off-chain decrypt" },
    ],
    flowNote: "No price oracle yet — outcomes submitted manually by market owner (Chainlink integration on roadmap).",
  },
  {
    slug: "aztec-private-voting",
    name: "Aztec Private Voting",
    chain: "Aztec",
    chainColor: "#E879F9",
    tagline: "Cast a vote that proves validity without revealing choice or voter identity.",
    primitive: "Noir ZK circuits + nullifier-based privacy",
    primitiveDetail:
      "A Noir circuit proves cast_vote() validity client-side; a SingleUseClaim nullifier blocks double-voting while the choice itself never leaves the device.",
    network: "mainnet",
    statusLabel: "Live — Mainnet",
    repoUrl: "https://github.com/pplmaverick/aztec-private-voting",
    contracts: [
      {
        label: "PrivateVoting",
        address:
          "0x25bb47296b98070aaef61167a966cc6416d8a3f7b18b285796b7fd47c1a3e38e",
      },
    ],
    techStack: ["Noir 1.0.0-beta.22", "aztec-nr v5.0.0", "Barretenberg (UltraHonk)"],
    flow: [
      { label: "Noir circuit", sub: "client-side proof" },
      { label: "cast_vote + nullifier", sub: "private call" },
      { label: "Public tally", sub: "PublicMutable map" },
    ],
    flowNote: "11/11 contract tests passing. Deployed first to Aztec Testnet, then to Alpha Mainnet (v5.0.1, post AZUP-2) with a full create_poll/cast_vote/end_poll e2e run verified on-chain. Aztec Ecosystem Grant application in progress; React frontend still planned.",
  },
  {
    slug: "arc-projects",
    name: "Arc Weather Market",
    chain: "Arc (Circle)",
    chainColor: "#22D3EE",
    tagline: "Weather prediction market settled directly in native USDC.",
    primitive: "Native USDC precompile + ERC-8004 agent",
    primitiveDetail:
      "Bets settle in USDC via Arc's native precompile (no bridging/wrapping); a separately registered ERC-8004 agent identity (id 6762) exists as off-chain metadata — WeatherMarket.sol has no on-chain dependency on it.",
    network: "testnet",
    statusLabel: "Live — Testnet",
    repoUrl: "https://github.com/pplmaverick/arc-projects",
    frontendUrl: "https://arc-projects.vercel.app",
    contracts: [
      {
        label: "WeatherMarket",
        address: "0xcac5b9d2817325e78090e3ce4b9c299c819cf953",
        explorerUrl:
          "https://testnet.arcscan.app/address/0xcac5b9d2817325e78090e3ce4b9c299c819cf953",
      },
      {
        label: "AdminOracle",
        address: "0xbdc53e50b1167ce1199bfad54a034f7ab1741051",
        explorerUrl:
          "https://testnet.arcscan.app/address/0xbdc53e50b1167ce1199bfad54a034f7ab1741051",
      },
      {
        label: "USDC (native precompile)",
        address: "0x3600000000000000000000000000000000000000",
        explorerUrl:
          "https://testnet.arcscan.app/address/0x3600000000000000000000000000000000000000",
      },
    ],
    techStack: ["Solidity 0.8.28", "OpenZeppelin 5", "Hardhat 3", "React", "wagmi", "n8n"],
    flow: [
      { label: "React + wagmi", sub: "place bet in USDC" },
      { label: "WeatherMarket.sol", sub: "Arc testnet" },
      { label: "n8n oracle", sub: "OpenWeather API" },
    ],
    flowNote: "Self-hosted n8n workflow locks the market then submits the result through AdminOracle (onlyOracle-gated); decentralized oracle is on the roadmap.",
  },
  {
    slug: "tempo-weather-market",
    name: "Tempo Weather Market",
    chain: "Tempo",
    chainColor: "#FB923C",
    tagline: "Weather market built on Stripe's payments-native chain, gas-sponsored for bettors.",
    primitive: "Payment Memo + Fee Sponsorship + Scheduled Transactions",
    primitiveDetail:
      "Settlement writes a structured Payment Memo on-chain, bettors never hold gas thanks to Tempo's Fee Sponsorship relayers, and markets auto-lock via the native Scheduler precompile.",
    network: "mainnet",
    statusLabel: "Live — Mainnet + Testnet",
    repoUrl: "https://github.com/pplmaverick/tempo-weather-market",
    frontendUrl: "https://tempo-weather-market.vercel.app",
    contracts: [
      {
        label: "WeatherMarket (Mainnet, 4217)",
        address: "0x072a3a0c04cf8cdcaf5b4a73a4ed4ff5a841531f",
        explorerUrl:
          "https://explore.tempo.xyz/address/0x072a3a0c04cf8cdcaf5b4a73a4ed4ff5a841531f",
      },
      {
        label: "WeatherMarket (Moderato Testnet, 42431)",
        address: "0xcAC5B9d2817325E78090E3Ce4b9C299C819cF953",
        explorerUrl:
          "https://explore.tempo.xyz/address/0xcAC5B9d2817325E78090E3Ce4b9C299C819cF953",
      },
    ],
    techStack: ["Solidity 0.8.28", "Hardhat 3", "React 19", "wagmi/viem", "Node.js oracle server"],
    flow: [
      { label: "React + wagmi", sub: "pathUSD / USDC.e bets" },
      { label: "WeatherMarket.sol", sub: "Tempo scheduled lock" },
      { label: "Express oracle server", sub: "OpenWeather + median" },
    ],
    flowNote: "n8n triggers the oracle server's /oracle/settle after lockTime; server signs and submits the result on-chain.",
  },
  {
    slug: "miden-weather-market",
    name: "Miden Weather Market",
    chain: "Miden",
    chainColor: "#C084FC",
    tagline: "Weather bets on a STARK rollup — client-side bet commitments, CLI-assisted proving. Oracle signature verification — planned (Miden rpo_falcon512 roadmap).",
    primitive: "Client-side ZK commitments + Poseidon2 hashing",
    primitiveDetail:
      "Bet commitments are Poseidon2 hashes computed in-browser WASM, keeping the user's secret local to the device. Oracle signature verification via rpo_falcon512 is planned for a future milestone.",
    network: "testnet",
    statusLabel: "Live — Testnet",
    repoUrl: "https://github.com/pplmaverick/miden-weather-market",
    frontendUrl: "https://miden-weather-market.vercel.app",
    contracts: [
      {
        label: "WeatherMarket Account (v7)",
        address: "0x72df3f2c728125716878e6af1422af",
        explorerUrl:
          "https://testnet.midenscan.com/account/0x72df3f2c728125716878e6af1422af",
      },
    ],
    techStack: ["Rust → wasm32-wasip2", "MASM", "React 19", "@miden-sdk/miden-sdk", "Python oracle"],
    flow: [
      { label: "React + in-browser WASM", sub: "Poseidon2 commitment" },
      { label: "Miden account (StorageMap)", sub: "MASM contract" },
      { label: "Python oracle (VPS)", sub: "Falcon512-signed weather data" },
    ],
    flowNote: "Automated oracle → settle_market pipeline not yet wired end-to-end; settlement is CLI-triggered today.",
  },
  {
    slug: "pharos-weather-market",
    name: "Pharos Weather Market",
    chain: "Pharos",
    chainColor: "#2DD4BF",
    tagline: "High-throughput weather market on Pharos — CCIP oracle and CCTP bridging are deployed but not yet wired live.",
    primitive: "Native USDC settlement + CCIP/CCTP (deployed, not yet live)",
    primitiveDetail:
      "Bets settle directly in USDC on Pharos. A CCIPWeatherOracle contract and an Arc-to-Pharos CCTP bridge script both exist in the repo, but the live settlement path still runs through the same single-owner AdminOracle used on testnet, and the frontend's bridge page is a disabled placeholder.",
    network: "mainnet",
    statusLabel: "Live — Mainnet + Testnet",
    repoUrl: "https://github.com/pplmaverick/pharos-weather-market",
    frontendUrl: "https://frontend-two-phi-14.vercel.app",
    contracts: [
      {
        label: "WeatherMarket (Mainnet, 1672)",
        address: "0xcac5b9d2817325e78090e3ce4b9c299c819cf953",
        explorerUrl:
          "https://pharosscan.xyz/address/0xcac5b9d2817325e78090e3ce4b9c299c819cf953",
      },
      {
        label: "CCIPWeatherOracle (Mainnet)",
        address: "0x914c40a644493b47336de847b0404e729e06c68d",
        explorerUrl:
          "https://pharosscan.xyz/address/0x914c40a644493b47336de847b0404e729e06c68d",
      },
      {
        label: "WeatherMarket (Atlantic Testnet, 688689)",
        address: "0x072a3a0c04cf8cdcaf5b4a73a4ed4ff5a841531f",
        explorerUrl:
          "https://atlantic.pharosscan.xyz/address/0x072a3a0c04cf8cdcaf5b4a73a4ed4ff5a841531f",
      },
    ],
    techStack: ["Solidity 0.8.28", "OpenZeppelin 5", "Hardhat 3", "React 18", "wagmi 2 / viem 2"],
    flow: [
      { label: "React + wagmi", sub: "native USDC bets" },
      { label: "WeatherMarket.sol", sub: "Pharos testnet + mainnet" },
      { label: "AdminOracle", sub: "single-owner (the live path)" },
    ],
    flowNote: "CCIPWeatherOracle and the CCTP bridge are deployed on mainnet but not wired into WeatherMarket.oracle yet — the settlement path actually in use is the same admin-gated oracle as testnet.",
  },
  {
    slug: "seismic-spread-monitor",
    name: "Seismic Spread Monitor",
    chain: "Seismic",
    chainColor: "#F87171",
    tagline: "Privacy-preserving spread alert contract using Seismic's shielded EVM types.",
    primitive: "Shielded types: suint256 / saddress",
    primitiveDetail:
      "Trading-pair identifier and alert threshold are stored as encrypted saddress/suint256; checkSpread() compares an input spread against the private threshold inside Seismic's encrypted VM.",
    network: "testnet",
    statusLabel: "Contracts only — CLI, no frontend yet",
    repoUrl: "https://github.com/pplmaverick/seismic-spread-monitor",
    contracts: [
      {
        label: "SpreadMonitor",
        address: "0xBdC53E50b1167cE1199bFaD54A034f7ab1741051",
        explorerUrl:
          "https://seismic-testnet.socialscan.io/address/0xBdC53E50b1167cE1199bFaD54A034f7ab1741051",
      },
    ],
    techStack: ["Seismic Solidity ^0.8.13", "sFoundry (sforge/scast)"],
    flow: [
      { label: "CLI (scast signed calls)", sub: "seismic-viem planned" },
      { label: "SpreadMonitor.sol", sub: "encrypted VM compare" },
    ],
    flowNote: "No live price feed yet — checkSpread() takes a manually supplied value; README documents a known side-channel limitation.",
  },
  {
    slug: "ritual-weather-market",
    name: "Ritual Weather Market",
    chain: "Ritual",
    chainColor: "#F472B6",
    tagline: "Weather market that calls the OpenWeather API directly from Solidity, no oracle bot.",
    primitive: "TEE HTTP precompile (0x0801) + ERC-8004 identity",
    primitiveDetail:
      "resolveMarket() calls Ritual's HTTP precompile directly; a TEE node selected from TEEServiceRegistry fetches the real HTTPS response, which replays on-chain via Ritual's SPC execution model.",
    network: "testnet",
    statusLabel: "Live — Testnet",
    repoUrl: "https://github.com/pplmaverick/ritual-weather-market",
    frontendUrl: "https://ritual-weather-market.vercel.app",
    contracts: [
      {
        label: "WeatherMarket",
        address: "0x072A3A0C04Cf8CDcaf5B4A73a4Ed4fF5A841531f",
        explorerUrl:
          "https://explorer.ritualfoundation.org/address/0x072A3A0C04Cf8CDcaf5B4A73a4Ed4fF5A841531f",
      },
      {
        label: "IdentityRegistry (ERC-8004)",
        address: "0x4fcee9aab1f5c9a675db1957fe5d5cfd19b0d75b",
        explorerUrl:
          "https://explorer.ritualfoundation.org/address/0x4fcee9aab1f5c9a675db1957fe5d5cfd19b0d75b",
      },
    ],
    techStack: ["Solidity ^0.8.20", "Foundry", "Next.js 14", "wagmi 2", "RainbowKit 2"],
    flow: [
      { label: "Next.js + RainbowKit", sub: "wagmi + viem" },
      { label: "WeatherMarket.sol", sub: "TEEServiceRegistry" },
      { label: "HTTP precompile 0x0801", sub: "OpenWeather, in-protocol" },
    ],
    flowNote: "No off-chain oracle bot — the TEE executor fetches live HTTPS data as part of Ritual's own execution pipeline.",
  },
  {
    slug: "robinhood-prediction-market",
    name: "Robinhood Chain Prediction Market",
    chain: "Robinhood Chain",
    chainColor: "#4ADE80",
    tagline: "Prediction markets bound directly to Robinhood Chain's native tokenized stock tokens.",
    primitive: "Native tokenized equity tokens (TSLA, AMZN, PLTR, AMD, NVDA)",
    primitiveDetail:
      "createMarket() binds each market directly to the on-chain address of a Robinhood Chain tokenized stock; settlement reads Chainlink price feed wrappers mirroring AggregatorV3Interface.",
    network: "mainnet",
    statusLabel: "Live — Mainnet (since 2026-07-03)",
    repoUrl: "https://github.com/pplmaverick/robinhood-prediction-market",
    frontendUrl: "https://frontend-tau-azure-50.vercel.app",
    contracts: [
      {
        label: "StockPredictionMarket",
        address: "0x72DAb8B1B53b3CF028e9A0d1E21178981f264245",
        explorerUrl:
          "https://robinhoodchain.blockscout.com/address/0x72DAb8B1B53b3CF028e9A0d1E21178981f264245",
      },
    ],
    techStack: ["Solidity ^0.8.20", "Hardhat 2", "ethers.js", "React 18", "wagmi 2 / viem"],
    flow: [
      { label: "React + wagmi", sub: "BULL / BEAR pools" },
      { label: "StockPredictionMarket.sol", sub: "bound to stock token" },
      { label: "Chainlink price feed", sub: "AggregatorV3Interface" },
    ],
    flowNote: "Parimutuel settlement minus a 2% fee, with a 3-day staleness tolerance on the price feed for market closures.",
  },
  {
    slug: "linera-price-market",
    name: "Linera Price Market",
    chain: "Linera",
    chainColor: "#FACC15",
    tagline: "Price market on Linera — the microchains cross-chain design is the roadmap, not what's deployed today.",
    primitive: "Single-chain price market (microchains architecture planned)",
    primitiveDetail:
      "CreateRound/PlaceBet/ResolveRound/Claim all run on one chain today. The README's user-microchain-to-market-microchain messaging design is the intended architecture, but the deployed contract sets Message = () and execute_message() panics — there is no cross-chain messaging yet.",
    network: "testnet",
    statusLabel: "Contracts only — single-chain prototype, no frontend",
    repoUrl: "https://github.com/pplmaverick/linera-price-market",
    contracts: [
      {
        label: "Application ID",
        address:
          "a788ba8f89da75939e1b59b4bedcf8914132ba1ce7268dad3b85bafacd8b6a1c",
      },
    ],
    techStack: ["Rust → wasm32-unknown-unknown", "linera-sdk 0.15", "async-graphql"],
    flow: [
      { label: "CLI / GraphQL service", sub: "linera service --port 8080" },
      { label: "PriceMarket contract", sub: "single chain today" },
    ],
    flowNote: "Cross-chain microchain messaging, emit_event!, and the payout-message flow are described in the README as the intended design but aren't implemented in contract.rs yet — Message = () and execute_message() panics. CoinGecko calls are also blocked by Conway testnet's http_request_allow_list, so prices are fed in by an external bot via ResolveRound.",
  },
]
