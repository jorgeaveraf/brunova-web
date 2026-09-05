import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { AcquisitionPortal } from "@/components/acquisition/portal"
import { sessionSchema } from "@/lib/acquisition-api"
import "@/app/acquisition.css"

export const dynamic = "force-dynamic"
export const metadata = {
  title: "Acquisition Portal",
  robots: { index: false, follow: false },
}

export default async function Page() {
  const jar = await cookies()
  const sessionCookie = jar.get("__Host-brunova_portal_session")
  if (!sessionCookie) redirect("/api/acquisition/v1/auth/login")
  const origin = process.env.PORTAL_BACKEND_INTERNAL_URL ?? "https://brunova.mx"
  const response = await fetch(`${origin}/api/acquisition/v1/auth/session`, {
    cache: "no-store",
    headers: { cookie: `${sessionCookie.name}=${sessionCookie.value}` },
    signal: AbortSignal.timeout(10000),
  }).catch(() => null)
  if (response?.status === 401) redirect("/api/acquisition/v1/auth/login")
  const parsed = sessionSchema.safeParse(
    response?.ok ? await response.json() : null,
  )
  if (!parsed.success)
    return (
      <main id="main-content" className="acq">
        <h1>Acquisition Portal</h1>
        <p role="alert">
          No se pudo verificar la sesión. Intenta cargar esta página de nuevo.
        </p>
      </main>
    )
  if (!parsed.data.actor.capabilities.includes("VIEW_ACQUISITION"))
    return (
      <main id="main-content" className="acq">
        <h1>Acceso restringido</h1>
        <p>Tu identidad no tiene acceso a Acquisition.</p>
      </main>
    )
  return <AcquisitionPortal session={parsed.data} />
}
