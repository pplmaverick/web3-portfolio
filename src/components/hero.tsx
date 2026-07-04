import { Badge } from "@/components/ui/badge"
import { GitHubIcon, XIcon } from "@/components/icons"
import { CopyButton } from "@/components/copy-button"
import { projects } from "@/lib/projects"

const DEV_WALLET = "0xed2B5717c9b936ecC76d75401026A99143e278F5"
const GITHUB_HANDLE = "pplmaverick"
const TWITTER_HANDLE = "SmsmSmsm87"

export function Hero() {
  const chainCount = new Set(projects.map((p) => p.chain)).size
  const liveCount = projects.filter((p) => p.network !== "local").length

  return (
    <section className="relative overflow-hidden border-b border-border">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, rgba(129,140,248,0.12) 0%, rgba(8,9,12,0) 70%)",
        }}
      />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-20 sm:px-8 sm:py-28">
        <Badge
          variant="outline"
          className="w-fit border-primary/30 bg-primary/10 text-primary"
        >
          Strategy · Early Developer Footprint
        </Badge>

        <div className="flex flex-col gap-5">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            在每一條新鏈上,第一個用上它
            <br className="hidden sm:block" />
            chain-native primitive 的開發者。
          </h1>
          <p className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            我是 pplmaverick,一名獨立 Web3 開發者。策略很簡單:每當有新鏈或新
            L1/L2 開放測試網,我會在第一時間部署一個真正用到「該鏈獨有原生功能」的合約
            ——
            不是隨便搬一份 ERC-20,而是 Midnight 的 ZK witness、Fhenix 的 FHE
            加密型別、Ritual 的鏈上 HTTP precompile 這種只有那條鏈才有的東西。
            這個網站是那些足跡的紀錄:{chainCount} 條鏈、{projects.length}
            個專案、其中 {liveCount} 個已經有實際部署與可互動的前端。
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href={`https://github.com/${GITHUB_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-secondary/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <GitHubIcon className="size-4" />
            @{GITHUB_HANDLE}
          </a>
          <a
            href={`https://twitter.com/${TWITTER_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border bg-secondary/60 px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <XIcon className="size-4" />
            @{TWITTER_HANDLE}
          </a>
          <div className="inline-flex items-center gap-2 rounded-md border border-border bg-secondary/30 py-2 pr-1.5 pl-3.5">
            <span className="text-sm text-muted-foreground">Dev Wallet</span>
            <span className="font-mono text-sm text-foreground">
              {DEV_WALLET.slice(0, 6)}…{DEV_WALLET.slice(-4)}
            </span>
            <CopyButton value={DEV_WALLET} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-t border-border pt-6 sm:grid-cols-4">
          <Stat label="Chains" value={String(chainCount)} />
          <Stat label="Projects" value={String(projects.length)} />
          <Stat label="Live deployments" value={String(liveCount)} />
          <Stat label="Dev setup" value="MBA M3 · iMac M1 · Hetzner" small />
        </div>
      </div>
    </section>
  )
}

function Stat({
  label,
  value,
  small,
}: {
  label: string
  value: string
  small?: boolean
}) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className={
          small
            ? "text-sm font-medium text-foreground"
            : "font-mono text-2xl font-semibold text-foreground"
        }
      >
        {value}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  )
}
