import { GitHubIcon, TelegramIcon, XIcon } from "@/components/icons"

const links = [
  {
    label: "X @SmsmSmsm87",
    href: "https://x.com/SmsmSmsm87",
    icon: XIcon,
    className: "border border-white/15 bg-black text-white hover:bg-black/80",
  },
  {
    label: "Telegram @chiu69tw",
    href: "https://t.me/chiu69tw",
    icon: TelegramIcon,
    style: { backgroundColor: "#229ED9" },
    className: "text-white hover:opacity-90",
  },
  {
    label: "GitHub @pplmaverick",
    href: "https://github.com/pplmaverick",
    icon: GitHubIcon,
    style: { backgroundColor: "#6e40c9" },
    className: "text-white hover:opacity-90",
  },
]

export function SocialLinks() {
  return (
    <>
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          style={link.style}
          className={`inline-flex cursor-pointer items-center gap-2 rounded-md px-3.5 py-2 text-sm font-medium transition-colors ${link.className}`}
        >
          <link.icon className="size-4" />
          {link.label}
        </a>
      ))}
    </>
  )
}
