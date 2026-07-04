export type DiagramVariant = "client" | "onchain" | "process"

export type DiagramBoxData = {
  variant: DiagramVariant
  title: string
  subtitle?: string
  lines?: string[]
  highlight?: string
}

export type DiagramRowData = {
  boxes: DiagramBoxData[]
  connectors?: string[]
}

export type DiagramNoteData = {
  text: string
  warn?: boolean
}

export type DiagramSectionData = {
  label?: string
  rows: DiagramRowData[]
  notes?: DiagramNoteData[]
}

export type ProjectDiagram = {
  sections: DiagramSectionData[]
  badges: string[]
}

export const diagrams: Record<string, ProjectDiagram> = {
  "midnight-private-auction": {
    sections: [
      {
        rows: [
          {
            boxes: [
              {
                variant: "client",
                title: "Bidder — private witnesses",
                subtitle: "never leaves device",
                lines: [
                  "localSecretKey(): Bytes<32>",
                  "myBidAmount(auctionId): Uint<32>",
                  "myBidSalt(auctionId): Bytes<32>",
                ],
              },
              {
                variant: "onchain",
                title: "Midnight ledger",
                subtitle: "sealedBids: Map<Uint, Map<Bytes, Bytes>>",
                lines: [
                  "sealedBids[auctionId][bidderPK]",
                  '= persistentHash("auction:seal:",',
                  "  sk, auctionId, amount, salt)",
                ],
              },
            ],
            connectors: ["ZK proof"],
          },
        ],
        notes: [
          {
            text: "Chain observers see: bidderPK + sealed hash. Cannot see: amount · salt · secretKey.",
          },
        ],
      },
      {
        label: "REVEAL PHASE — after closeAuction()",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "Bidder discloses",
                subtitle: "revealBid(auctionId, amount, salt)",
                lines: ["amount = disclose(amount)"],
              },
              {
                variant: "onchain",
                title: "Ledger verifies & updates",
                lines: [
                  "assert computeCommitment(sk, auctionId,",
                  "  amount, salt) == sealedBids[id][pk]",
                  "if amount > highestBid:",
                  "  highestBid = amount",
                  "  highestBidderPK = pk",
                ],
                highlight:
                  "sk stays local — only a ZK proof is submitted, never sk",
              },
            ],
            connectors: ["ZK verify"],
          },
        ],
        notes: [
          {
            text: "Multi-auction architecture: one contract, many concurrent auctions, each with isolated bidCount / highestBid / highestBidderPK.",
          },
        ],
      },
    ],
    badges: [
      "Compact language",
      "persistentHash (built-in)",
      "@midnight-ntwrk/wallet-sdk-facade",
      "Mainnet ✓",
    ],
  },

  "fhenix-confidential-prediction-market": {
    sections: [
      {
        label: "PLACE BET",
        rows: [
          {
            boxes: [
              {
                variant: "client",
                title: "cofheClient (browser)",
                subtitle: "@cofhe/sdk",
                lines: [
                  "encryptInputs([",
                  "  Encryptable.uint64(amountWei),",
                  "  Encryptable.bool(choice)])",
                ],
              },
              {
                variant: "onchain",
                title: "ConfidentialPredictionMarket.sol",
                subtitle: "placeBet(marketId, InEuint64, InEbool)",
                lines: [
                  "euint64 encAmount; ebool encChoice;",
                  "FHE.allowThis / FHE.allowSender",
                ],
              },
            ],
            connectors: ["InEuint64 / InEbool"],
          },
        ],
      },
      {
        label: "SETTLE — reveal & claim",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "revealWinnerPool() / claimWinnings()",
                lines: [
                  "FHE.eq(encChoice, outcomeEnc)",
                  "FHE.select(isWinner, encAmount, 0)",
                ],
              },
              {
                variant: "process",
                title: "CoFHE threshold network",
                subtitle: "off-chain signers",
                lines: [
                  "decryptForTx(ctHash)",
                  "→ { decryptedValue, signature }",
                ],
              },
              {
                variant: "onchain",
                title: "submitWinnerPool() / withdraw()",
                lines: [
                  "FHE.publishDecryptResult(",
                  "  ctHash, value, signature)",
                ],
              },
            ],
            connectors: ["ctHash", "signature"],
          },
        ],
        notes: [
          {
            text: "No price oracle yet — outcome set manually via submitResult(); Chainlink integration is on the roadmap.",
            warn: true,
          },
        ],
      },
    ],
    badges: [
      "Solidity 0.8.28",
      "FHE.sol (euint64 / ebool)",
      "@cofhe/sdk",
      "Arbitrum Sepolia",
    ],
  },

  "aztec-private-voting": {
    sections: [
      {
        label: 'CAST VOTE — #[external("private")]',
        rows: [
          {
            boxes: [
              {
                variant: "client",
                title: "cast_vote(poll_id, choice)",
                subtitle: "choice never leaves this call",
                lines: [
                  "vote_claims.at(poll_id)",
                  "  .at(msg_sender()).claim()",
                  "→ app-siloed nullifier",
                ],
              },
              {
                variant: "onchain",
                title: "add_to_tally_public(poll_id, choice)",
                subtitle: '#[external("public")] #[only_self]',
                lines: [
                  "tally: Map<PollId,",
                  "  Map<Field, PublicMutable<Field>>>",
                  "tally[poll][choice] += 1",
                ],
              },
            ],
            connectors: ["enqueue_self"],
          },
        ],
        notes: [
          {
            text: 'Double-voting is blocked at the nullifier: reusing a claim fails with "duplicate siloed nullifier" — proven in voting_tests.nr.',
          },
        ],
      },
    ],
    badges: [
      "Noir 1.0.0-beta.21",
      "aztec-nr v4.3.1",
      "Barretenberg (UltraHonk)",
      "Local network only",
    ],
  },

  "miden-weather-market": {
    sections: [
      {
        label: "PLACE BET — client-side commitment",
        rows: [
          {
            boxes: [
              {
                variant: "client",
                title: "Browser WASM",
                subtitle: "@miden-sdk/miden-sdk",
                lines: [
                  "Poseidon2.hashElements([",
                  "  marketId, outcome, amount, userSecret])",
                ],
              },
              {
                variant: "onchain",
                title: "bets: StorageMap<Word, Felt>",
                subtitle: "place_bet(...)",
                lines: ["bets[commitment] = amount"],
                highlight:
                  "userSecret never leaves the device — only the commitment is sent",
              },
            ],
            connectors: ["commitment (Word)"],
          },
        ],
      },
      {
        label: "SETTLE — time-lock, not signature",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "settle_market(...)",
                lines: [
                  "assert status == STATUS_OPEN",
                  "assert close_time <= now",
                ],
              },
            ],
          },
        ],
        notes: [
          {
            text: 'README describes a Falcon512 oracle-signature check ("M1.5 — completed"), but the deployed settle_market() has no signature verification — Miden 0.15\'s rpo_falcon512_verify only signs the tx commitment, not arbitrary messages. Current trust = wallet-key holder + on-chain time-lock only.',
            warn: true,
          },
        ],
      },
    ],
    badges: ["Rust → wasm32-wasip2", "MASM", "Poseidon2 (RPO)", "Testnet"],
  },

  "ritual-weather-market": {
    sections: [
      {
        label: "resolveMarket() — HTTP call, on-chain",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "resolveMarket(marketId)",
                lines: [
                  "require !resolved",
                  "require block.timestamp >= resolutionTime",
                ],
              },
              {
                variant: "process",
                title: "TEEServiceRegistry",
                lines: [
                  "pickServiceByCapability(",
                  "  HTTP_CALL=0) → executor",
                ],
              },
              {
                variant: "process",
                title: "0x…0801 precompile",
                subtitle: "Ritual SPC model",
                lines: [
                  "1st call: empty output, returns early",
                  "TEE fetches OpenWeather off-chain",
                  "replay: decode statusCode / body",
                ],
              },
            ],
            connectors: ["pickServiceByCapability", "HTTP_PRECOMPILE.call()"],
          },
        ],
      },
      {
        label: "SETTLE",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "Settle & emit",
                lines: [
                  "actualTemp = _parseTemp(body)",
                  "resultIsAbove = actualTemp > targetTemp",
                  "emit MarketResolved(...)",
                ],
              },
            ],
          },
        ],
        notes: [
          {
            text: "ERC-8004 IdentityRegistry is deployed standalone — WeatherMarket.sol has zero references to it; the link is off-chain metadata only.",
          },
        ],
      },
    ],
    badges: [
      "Solidity ^0.8.20",
      "Foundry (26/26 tests)",
      "Next.js 14 + RainbowKit",
      "Ritual Testnet",
    ],
  },
}
