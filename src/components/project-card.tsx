import { ExternalLink, Globe } from "lucide-react"
import { GitHubIcon } from "@/components/icons"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CopyButton } from "@/components/copy-button"
import { ArchitectureFlow } from "@/components/architecture-flow"
import type { Project } from "@/lib/projects"
import { cn } from "@/lib/utils"

function truncateAddress(address: string) {
  if (address.length <= 18) return address
  return `${address.slice(0, 8)}…${address.slice(-6)}`
}

const networkBadgeClass: Record<Project["network"], string> = {
  mainnet: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
  testnet: "bg-amber-400/10 text-amber-300 border-amber-400/20",
  local: "bg-slate-400/10 text-slate-300 border-slate-400/20",
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card className="h-full border border-zinc-700 bg-zinc-900 ring-0">
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: project.chainColor }}
            />
            <span className="text-xs font-medium text-muted-foreground">
              {project.chain}
            </span>
          </div>
          <Badge
            variant="outline"
            className={cn("border", networkBadgeClass[project.network])}
          >
            {project.statusLabel}
          </Badge>
        </div>
        <CardTitle className="mt-1 text-lg">{project.name}</CardTitle>
        <CardDescription>{project.tagline}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="rounded-lg border border-border bg-secondary/40 p-3">
          <p className="font-mono text-[11px] font-medium text-primary">
            {project.primitive}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {project.primitiveDetail}
          </p>
        </div>

        <ArchitectureFlow nodes={project.flow} note={project.flowNote} />

        {project.contracts.length > 0 ? (
          <div className="flex flex-col gap-1.5">
            {project.contracts.map((contract) => (
              <div
                key={contract.address}
                className="flex items-center justify-between gap-2 rounded-md border border-border bg-secondary/20 px-2.5 py-1.5"
              >
                <div className="flex min-w-0 flex-col">
                  <span className="text-[11px] text-muted-foreground">
                    {contract.label}
                  </span>
                  {contract.explorerUrl ? (
                    <a
                      href={contract.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate font-mono text-xs text-foreground hover:text-primary hover:underline"
                    >
                      {truncateAddress(contract.address)}
                    </a>
                  ) : (
                    <span className="truncate font-mono text-xs text-foreground">
                      {truncateAddress(contract.address)}
                    </span>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-0.5">
                  <CopyButton value={contract.address} />
                  {contract.explorerUrl ? (
                    <a
                      href={contract.explorerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View ${contract.label} on Explorer`}
                      className="cursor-pointer rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    >
                      <ExternalLink className="size-3.5" />
                    </a>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : null}

        <div className="flex flex-wrap gap-1.5">
          {project.techStack.map((tech) => (
            <Badge key={tech} variant="secondary" className="font-mono text-[10px]">
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>

      <Separator />

      <CardFooter className="!bg-transparent flex items-center gap-2 pt-3">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <GitHubIcon className="size-3.5" />
          Repo
        </a>
        {project.frontendUrl ? (
          <a
            href={project.frontendUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-secondary"
          >
            <Globe className="size-3.5" />
            Live Demo
          </a>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1.5 text-xs text-muted-foreground">
            <Globe className="size-3.5" />
            No frontend yet
          </span>
        )}
      </CardFooter>
    </Card>
  )
}
