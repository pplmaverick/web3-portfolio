import { Hero } from "@/components/hero"
import { ProjectCard } from "@/components/project-card"
import { SocialLinks } from "@/components/social-links"
import { projects } from "@/lib/projects"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <Hero />

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-16 sm:px-8">
        <div className="mb-8 flex flex-col gap-1">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">
            Projects
          </h2>
          <p className="text-sm text-muted-foreground">
            Each card is one chain, one native primitive, one set of deployed
            contracts.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-10 sm:px-8">
          <SocialLinks />
          <div className="flex flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
            <span>
              © {new Date().getFullYear()} pplmaverick — built via Vibe Coding
              (Claude Code)
            </span>
            <span className="font-mono">
              MacBook Air M3 · iMac M1 · Hetzner VPS
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
