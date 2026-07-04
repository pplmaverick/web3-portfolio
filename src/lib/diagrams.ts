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

  "arc-projects": {
    sections: [
      {
        label: "PLACE BET",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "WeatherMarket.sol",
                subtitle: "placeBet(marketId, bucket, amount)",
                lines: [
                  "usdc.transferFrom(sender, this, amount)",
                  "native USDC precompile — no wrapping",
                ],
              },
            ],
          },
        ],
      },
      {
        label: "SETTLE — two-stage oracle, n8n-triggered",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "lockMarket(marketId)",
                subtitle: "callable by anyone, after lockTime",
                lines: ["Status: OPEN -> LOCKED"],
              },
              {
                variant: "process",
                title: "AdminOracle.submitResult(city, temp, id)",
                subtitle: "onlyOwner",
                lines: [
                  "-> WeatherMarket.submitResult(id, temp)",
                  "onlyOracle-gated",
                ],
              },
            ],
            connectors: ["n8n: stage 1 -> stage 2"],
          },
          {
            boxes: [
              {
                variant: "onchain",
                title: "claimWinnings(marketId)",
                lines: [
                  "payout = amount * netPool / bucketTotal",
                  "FEE_BPS = 200 (2%), waived if noWinner",
                ],
              },
            ],
          },
        ],
      },
    ],
    badges: [
      "Solidity 0.8.28",
      "OpenZeppelin 5",
      "Native USDC (no wrap)",
      "Arc Testnet",
    ],
  },

  "tempo-weather-market": {
    sections: [
      {
        label: "PLACE BET — fee-sponsored",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "placeBet(...) / placeBetFor(..., bettor)",
                subtitle: "placeBetFor is onlyRelayer",
                lines: [
                  "approvedRelayers[msg.sender]",
                  "gasTankBalance funds relayer gas",
                ],
                highlight: "bettor pays zero gas via placeBetFor",
              },
            ],
          },
        ],
      },
      {
        label: "SCHEDULED LOCK",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "createMarket(...)",
                subtitle: "native Scheduler precompile",
                lines: [
                  "IScheduler(scheduler).schedule(",
                  "  address(this), lockCallData, lockTime)",
                ],
              },
              {
                variant: "onchain",
                title: "lockMarket(marketId)",
                subtitle: "auto-fires at lockTime",
                lines: ["m.lockTaskId = taskId"],
              },
            ],
            connectors: ["scheduled taskId"],
          },
        ],
      },
      {
        label: "SETTLE — oracle server",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "POST /oracle/settle",
                subtitle: "Node/Express oracle-server",
                lines: [
                  "getMaxTempWithSources(city, date)",
                  "determineOutcome() -> WIN / NO_WINNER",
                ],
              },
              {
                variant: "onchain",
                title: "WeatherMarket.submitResult(id, temp, memo)",
                lines: [
                  'memo = "{city}/{type}/{temp}/{outcome}"',
                  "stored as Market.settleMemo, emitted",
                ],
              },
            ],
            connectors: ["submitResult()"],
          },
        ],
        notes: [
          {
            text: "Tempo's 0x76 transaction type is viem's fee-token serializer for gas-in-USDC.e mainnet txs — it belongs to Fee Sponsorship, not the Scheduler.",
          },
        ],
      },
    ],
    badges: [
      "Solidity 0.8.28",
      "IScheduler precompile",
      "Fee Sponsorship (gasTank)",
      "Mainnet + Testnet",
    ],
  },

  "pharos-weather-market": {
    sections: [
      {
        label: "PLACE BET — native USDC",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "placeBet(marketId, bucket, amount)",
                lines: [
                  "usdc.transferFrom(sender, this, amount)",
                  "chain 1672 (mainnet) / 688689 (testnet)",
                ],
              },
            ],
          },
        ],
      },
      {
        label: "SETTLE — the path actually live",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "lockMarket() -> AdminOracle.submitResult(...)",
                subtitle: "onlyOwner — same as testnet",
                lines: ["-> WeatherMarket.submitResult(id, temp)"],
              },
            ],
          },
        ],
        notes: [
          {
            text: "CCIPWeatherOracle.sol and the Arc-to-Pharos CCTP bridge are both deployed but not wired live: WeatherMarket.oracle still points at AdminOracle, and the frontend's bridge page is a disabled \"Coming Soon\" stub. The sub-second-finality and cross-chain-CCIP claims in the README aren't yet reflected in what's actually connected on-chain.",
            warn: true,
          },
        ],
      },
    ],
    badges: [
      "Solidity 0.8.28",
      "AggregatorV3-style oracle",
      "CCIP + CCTP (deployed, not wired)",
      "Testnet + Mainnet",
    ],
  },

  "seismic-spread-monitor": {
    sections: [
      {
        label: "SET STRATEGY — shielded state",
        rows: [
          {
            boxes: [
              {
                variant: "client",
                title: "setStrategy(saddress pair, suint256 threshold)",
                lines: [
                  "struct Strategy { saddress pair;",
                  "  suint256 threshold; bool isActive; }",
                ],
              },
            ],
          },
        ],
      },
      {
        label: "CHECK SPREAD — encrypted VM compare",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "checkSpread(suint256 currentSpread)",
                lines: [
                  "bool triggered =",
                  "  bool(currentSpread >= threshold)",
                ],
              },
              {
                variant: "onchain",
                title: "event SpreadAlert(user, triggered)",
                lines: ["only event in the contract"],
              },
            ],
            connectors: ["emits"],
          },
        ],
        notes: [
          {
            text: "README's own Known Limitations: the public currentSpread input plus the public triggered event let an observer binary-search the private threshold — a real side-channel, not yet fixed.",
            warn: true,
          },
        ],
      },
    ],
    badges: [
      "Seismic Solidity ^0.8.13",
      "sFoundry (sforge / scast)",
      "CLI only, no frontend",
      "Testnet",
    ],
  },

  "robinhood-prediction-market": {
    sections: [
      {
        label: "CREATE MARKET — bound to native stock token",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "createMarket(stockToken, priceFeed, symbol, duration)",
                lines: [
                  "Market.stockToken = native tokenized equity",
                  "e.g. TSLA / AMZN / PLTR / AMD / NVDA",
                ],
              },
            ],
          },
        ],
      },
      {
        label: "LOCK / SETTLE — Chainlink price feed",
        rows: [
          {
            boxes: [
              {
                variant: "process",
                title: "ChainlinkPriceFeed.latestRoundData()",
                subtitle: "wraps AggregatorV3Interface",
                lines: [
                  "require(answer > 0)",
                  "require(now - updatedAt <= 3 days)",
                ],
              },
              {
                variant: "onchain",
                title: "lockMarket() / settleMarket()",
                lines: [
                  "openPrice / closePrice snapshotted",
                  "winner = closePrice >= openPrice ? BULL : BEAR",
                ],
              },
            ],
            connectors: ["latestRoundData()"],
          },
        ],
      },
      {
        label: "CLAIM — parimutuel",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "claimWinnings()",
                lines: [
                  "fee = totalPool * 200 / 10000 (2%)",
                  "payout = (totalPool - fee) * bet / winnerPool",
                ],
              },
            ],
          },
        ],
      },
    ],
    badges: [
      "Solidity ^0.8.20",
      "AggregatorV3Interface",
      "Robinhood Chain Mainnet",
      "5 stock markets live",
    ],
  },

  "linera-price-market": {
    sections: [
      {
        label: "OPERATIONS — single chain today",
        rows: [
          {
            boxes: [
              {
                variant: "onchain",
                title: "Operation enum",
                lines: [
                  "CreateRound { asset,",
                  "  duration_secs, start_price }",
                  "PlaceBet { round_id,",
                  "  direction, amount }",
                  "ResolveRound { round_id, final_price }",
                  "Claim { round_id }",
                ],
              },
              {
                variant: "onchain",
                title: "PriceMarket state",
                lines: [
                  "rounds: MapView<u64, Round>",
                  "Round { bets: Vec<Bet>,",
                  "  status, deadline }",
                ],
              },
            ],
          },
        ],
        notes: [
          {
            text: "README describes a microchains architecture — a user's single-owner chain sending a cross-chain PlaceBet message to a shared market chain, with a payout message flowing back — but the deployed contract sets Message = () and execute_message() panics with \"PriceMarket does not support cross-chain messages.\" There's no emit_event! call either. This is a single-chain prototype today, not the microchains design described in the README.",
            warn: true,
          },
        ],
      },
    ],
    badges: [
      "Rust → wasm32-unknown-unknown",
      "linera-sdk 0.15",
      "Single-chain (microchains planned)",
      "Testnet (Conway)",
    ],
  },
}
