"use client"

import { useEffect, useState } from "react"
import { acquisitionApi as api } from "@/lib/acquisition-api"
import type { Locale } from "@/lib/i18n"
import {
  candidateManagementTruth,
  type DiscoveryTruth,
} from "@/lib/acquisition-management-truth"

/** Current outreach truth. Historical exploratory wave proposals are not live approvals. */
export function OutreachState({ locale }: { locale: Locale }) {
  const es = locale === "es"
  const [data, setData] = useState<DiscoveryTruth | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    let live = true
    api
      .discovery()
      .then((d) => {
        if (live) setData(d)
      })
      .catch(() => {
        if (live) setFailed(true)
      })
    return () => {
      live = false
    }
  }, [])
  if (failed)
    return (
      <p role="alert">
        {es
          ? "No se pudo verificar el estado de contacto."
          : "Outreach state could not be verified."}
      </p>
    )
  if (!data) return <p>{es ? "Consultando contacto…" : "Loading outreach…"}</p>
  const contacted = candidateManagementTruth(data).filter((c) => c.contacted)
  const current = data.routineOperatingSessions?.[0]
  return (
    <section
      className="acq-panel"
      aria-label={es ? "Contacto actual" : "Current outreach"}
    >
      <h2>{es ? "Contacto y waves" : "Outreach and waves"}</h2>
      <p>
        {es
          ? "Una candidata exploratoria contactada no es una wave de Accounts aprobada. Las propuestas históricas se conservan como evidencia; no son autoridad actual de envío."
          : "A contacted exploratory candidate is not an approved Account wave. Historical proposals remain evidence, not current send authority."}
      </p>
      {contacted.length === 0 && (
        <p>
          {es
            ? "No hay contactos exploratorios registrados."
            : "No exploratory contacts recorded."}
        </p>
      )}
      {contacted.map((c) => (
        <article className="acq-panel" key={c.id}>
          <h3>{c.name}</h3>
          <p>
            <strong>{es ? "Estado" : "State"}:</strong>{" "}
            {es
              ? "Conservada · Contactada · Esperando respuesta"
              : "Retained · Contacted · Waiting for reply"}
          </p>
          <p>
            <strong>{es ? "Intentos lógicos" : "Logical attempts"}:</strong>{" "}
            {c.exactEffect?.logical_attempts ?? "—"} ·{" "}
            <strong>
              {es ? "Seguimiento autorizado" : "Follow-up authority"}:
            </strong>{" "}
            {c.followUpAuthority ?? "NONE"}
          </p>
          {c.exactEffect?.subject && (
            <p>
              <strong>{es ? "Último mensaje" : "Last message"}:</strong>{" "}
              {c.exactEffect.subject}
            </p>
          )}
          {c.target?.hypothesis && (
            <p>
              <strong>
                {es
                  ? "Posible intervención, no dolor confirmado"
                  : "Possible intervention, not confirmed pain"}
                :
              </strong>{" "}
              {c.target.hypothesis}
            </p>
          )}
          {c.known && (
            <p>
              <strong>
                {es
                  ? "Lo que cambió con la investigación"
                  : "What research established"}
                :
              </strong>{" "}
              {c.known}
            </p>
          )}
          {c.nextReviewAt && (
            <p>
              <strong>
                {es ? "Elegible para revisión desde" : "Review eligible from"}:
              </strong>{" "}
              {new Intl.DateTimeFormat(es ? "es-MX" : "en-US", {
                dateStyle: "medium",
                timeStyle: "short",
                timeZone: "America/Mexico_City",
              }).format(new Date(c.nextReviewAt))}
              .{" "}
              {es
                ? "La fecha no autoriza otro envío."
                : "The date does not authorize another send."}
            </p>
          )}
          <details>
            <summary>
              {es
                ? "Mensaje y evidencia técnica"
                : "Message and technical evidence"}
            </summary>
            <p>{c.exactEffect?.text}</p>
            <p>
              {es ? "Estado del efecto" : "Effect status"}:{" "}
              {c.exactEffect?.effect_status}
            </p>
          </details>
        </article>
      ))}
      <p>
        {es ? "Trabajo exploratorio reciente" : "Recent exploratory work"}:{" "}
        {current
          ? `${current.local_date} · ${current.status.replaceAll("_", " ")} · ${current.recurrence_state.replaceAll("_", " ")}`
          : es
            ? "sin ventana reciente"
            : "no recent window"}
      </p>
      <p>
        {es
          ? "Ninguna nueva wave o seguimiento se ejecuta sin autorización exacta."
          : "No new wave or follow-up executes without exact authorization."}
      </p>
    </section>
  )
}
