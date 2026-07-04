import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import type {
  DiagramBoxData,
  DiagramRowData,
  DiagramSectionData,
  ProjectDiagram,
} from "@/lib/diagrams"

const variantStyles: Record<
  DiagramBoxData["variant"],
  { box: string; title: string; subtitle: string; line: string }
> = {
  client: {
    box: "bg-violet-100 border-violet-300/50",
    title: "text-violet-950",
    subtitle: "text-violet-700",
    line: "border-violet-400/40 bg-white/50 text-violet-950",
  },
  onchain: {
    box: "bg-emerald-50 border-emerald-300/50",
    title: "text-emerald-950",
    subtitle: "text-emerald-700",
    line: "border-emerald-400/40 bg-white/50 text-emerald-950",
  },
  process: {
    box: "bg-amber-100 border-amber-300/50",
    title: "text-amber-950",
    subtitle: "text-amber-800",
    line: "border-amber-400/40 bg-white/50 text-amber-950",
  },
}

function DiagramBox({ box }: { box: DiagramBoxData }) {
  const style = variantStyles[box.variant]
  return (
    <div className={`min-w-[11rem] flex-1 rounded-lg border p-2.5 ${style.box}`}>
      <p className={`text-[11px] font-semibold leading-tight ${style.title}`}>
        {box.title}
      </p>
      {box.subtitle ? (
        <p
          className={`mt-0.5 font-mono text-[9.5px] leading-tight ${style.subtitle}`}
        >
          {box.subtitle}
        </p>
      ) : null}
      {box.lines && box.lines.length > 0 ? (
        <div className="mt-1.5 flex flex-col gap-1">
          {box.lines.map((line, i) => (
            <div
              key={i}
              className={`whitespace-pre-wrap break-words rounded border px-1.5 py-1 font-mono text-[9.5px] leading-snug ${style.line}`}
            >
              {line}
            </div>
          ))}
        </div>
      ) : null}
      {box.highlight ? (
        <div className="mt-1.5 rounded bg-emerald-950 px-1.5 py-1 font-mono text-[9.5px] leading-snug text-emerald-300">
          {box.highlight}
        </div>
      ) : null}
    </div>
  )
}

function DiagramRow({ row }: { row: DiagramRowData }) {
  const items: ReactNode[] = []
  row.boxes.forEach((box, i) => {
    items.push(<DiagramBox key={`box-${i}`} box={box} />)
    if (i < row.boxes.length - 1) {
      items.push(
        <div
          key={`connector-${i}`}
          className="flex shrink-0 flex-col items-center justify-center gap-1 px-0.5 text-muted-foreground"
        >
          <ArrowRight className="size-3.5" aria-hidden />
          {row.connectors?.[i] ? (
            <span className="whitespace-nowrap rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[9px] text-primary">
              {row.connectors[i]}
            </span>
          ) : null}
        </div>
      )
    }
  })
  return <div className="flex flex-wrap items-center gap-2">{items}</div>
}

function renderNoteText(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) => {
    if (part.length > 1 && part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          className="rounded bg-white/10 px-1 py-0.5 font-mono text-foreground"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

function DiagramSection({ section }: { section: DiagramSectionData }) {
  return (
    <div className="flex flex-col gap-2">
      {section.label ? (
        <div className="flex items-center gap-2">
          <span className="whitespace-nowrap font-mono text-[9.5px] tracking-wide text-muted-foreground uppercase">
            {section.label}
          </span>
          <span className="h-px flex-1 border-t border-dashed border-border" />
        </div>
      ) : null}
      <div className="flex flex-col gap-2">
        {section.rows.map((row, i) => (
          <DiagramRow key={i} row={row} />
        ))}
      </div>
      {section.notes?.map((note, i) => (
        <div
          key={i}
          className={`rounded-md border border-dashed px-2.5 py-1.5 text-[10px] leading-relaxed ${
            note.warn
              ? "border-amber-500/40 text-amber-300"
              : "border-border text-muted-foreground"
          }`}
        >
          {renderNoteText(note.text)}
        </div>
      ))}
    </div>
  )
}

export function DetailDiagram({ diagram }: { diagram: ProjectDiagram }) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-black/30 p-3">
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        Architecture
      </p>
      {diagram.sections.map((section, i) => (
        <DiagramSection key={i} section={section} />
      ))}
      <div className="flex flex-wrap gap-1.5 border-t border-border pt-2.5">
        {diagram.badges.map((badge) => (
          <span
            key={badge}
            className="rounded-full border border-border bg-secondary/40 px-2 py-0.5 font-mono text-[9.5px] text-muted-foreground"
          >
            {badge}
          </span>
        ))}
      </div>
    </div>
  )
}
