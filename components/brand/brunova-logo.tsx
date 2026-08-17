import Image from "next/image"
import Link from "next/link"

export function BrunovaLogo({ location }: { location: "header" | "footer" }) {
  return (
    <Link
      aria-label="Brunova home"
      className={`brunova-logo brunova-logo--${location}`}
      href="/"
    >
      <Image
        alt="Brunova"
        height={295}
        priority={location === "header"}
        sizes={
          location === "header" ? "(min-width: 960px) 172px, 132px" : "172px"
        }
        src="/brand/brunova-wordmark-dark.webp"
        width={1045}
      />
    </Link>
  )
}
