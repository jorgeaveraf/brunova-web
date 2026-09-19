"use client"
import { useEffect, useState, useRef } from "react"
import {
  acquisitionApi as api,
  type PortalSession,
} from "@/lib/acquisition-api"
import type { Locale } from "@/lib/i18n"

export function PolicySettings({
  locale,
  session,
  cycleId,
}: {
  locale: Locale
  session: PortalSession
  cycleId?: string
}) {
  const es = locale === "es",
    [state, setState] = useState<Awaited<
      ReturnType<typeof api.policySettings>
    > | null>(null),
    [value, setValue] = useState(""),
    [reason, setReason] = useState(""),
    [pending, setPending] = useState(false),
    [notice, setNotice] = useState(""),
    [proposal, setProposal] = useState<{
      id: string
      hash: string
      value: number
    } | null>(null)
  const retry = useRef<{ body: string; id: string } | null>(null)
  const [snapshotMaximum, setSnapshotMaximum] = useState<number | null>(null)
  useEffect(() => {
    let live = true
    if (cycleId)
      api
        .cycleReview(cycleId)
        .then((r) => {
          if (live) setSnapshotMaximum(r.review.discovery?.maximum ?? null)
        })
        .catch(() => {
          if (live) setSnapshotMaximum(null)
        })
    return () => {
      live = false
    }
  }, [cycleId])
  useEffect(() => {
    let stopped = false
    api
      .policySettings()
      .then((s) => {
        if (!stopped) {
          setState(s)
          setValue(
            String(
              s.settings.find((v) => v.key === "discoveryMaximum")?.value ?? "",
            ),
          )
        }
      })
      .catch(() => {
        if (!stopped)
          setNotice(
            es
              ? "No pudimos consultar la configuración. Intenta de nuevo."
              : "Settings could not be verified. Try again.",
          )
      })
    return () => {
      stopped = true
    }
  }, [es])
  const setting = state?.settings.find((v) => v.key === "discoveryMaximum")
  async function submit(confirm: boolean) {
    if (!state || pending) return
    const n = Number(value)
    if (!confirm && (!Number.isInteger(n) || n < 1 || n > 75)) {
      setNotice(
        es
          ? "El límite aprobado permite de 1 a 75 empresas. Aumentarlo requiere una revisión de política."
          : "The approved envelope allows 1–75 companies. Increasing it requires policy review.",
      )
      return
    }
    const body =
      confirm && proposal
        ? {
            operation: "CONFIRM",
            expectedVersion: state.version,
            proposalId: proposal.id,
            proposalHash: proposal.hash,
          }
        : {
            operation: "PROPOSE",
            expectedVersion: state.version,
            discoveryMaximum: n,
            reason: reason.trim(),
          }
    const key = JSON.stringify(body)
    if (retry.current?.body !== key)
      retry.current = { body: key, id: crypto.randomUUID() }
    setPending(true)
    setNotice("")
    try {
      const result = await api.policyChange(
        retry.current.id,
        body,
        session.csrfToken,
      )
      if (confirm) {
        setState(await api.policySettings())
        setProposal(null)
        setReason("")
        setNotice(
          es
            ? "Nueva versión guardada. El Cycle sigue sin activarse."
            : "New version saved. The Cycle remains inactive.",
        )
      } else if (result.proposalId && result.proposalHash)
        setProposal({
          id: result.proposalId,
          hash: result.proposalHash,
          value: n,
        })
      retry.current = null
    } catch {
      setNotice(
        es
          ? "No se confirmó el cambio. Actualiza la configuración: puede haber cambiado, vencido o estar bloqueada por un Cycle existente."
          : "Change not confirmed. Refresh settings: they may have changed, expired or been locked by an existing Cycle.",
      )
    } finally {
      setPending(false)
    }
  }
  return (
    <section className="acq-panel">
      <h2>{es ? "Configuración del Cycle" : "Cycle settings"}</h2>
      <p>
        {cycleId
          ? es
            ? "Este Cycle ya conserva su política aprobada. Su snapshot no puede editarse; una propuesta futura no altera la ejecución actual."
            : "This Cycle already holds its approved policy. Its snapshot cannot be edited; a future proposal does not alter current execution."
          : es
            ? "Reglas aprobadas, no permisos de ejecución. Activar el Cycle es una decisión posterior."
            : "Approved rules, not execution permission. Cycle activation is a later decision."}
      </p>
      {notice && <p role="status">{notice}</p>}
      <button
        disabled={pending}
        onClick={async () => {
          setPending(true)
          try {
            const current = await api.policySettings()
            setState(current)
            setValue(
              String(
                current.settings.find((v) => v.key === "discoveryMaximum")
                  ?.value ?? "",
              ),
            )
            setProposal(null)
            retry.current = null
            setNotice("")
          } catch {
            setNotice(
              es
                ? "No pudimos verificar la configuración. No se cambió nada."
                : "Settings could not be verified. Nothing changed.",
            )
          } finally {
            setPending(false)
          }
        }}
      >
        {es ? "Actualizar configuración" : "Refresh settings"}
      </button>
      {!state ? (
        <p>{es ? "Consultando configuración…" : "Loading settings…"}</p>
      ) : (
        <>
          <h3>{es ? "Mercado y discovery" : "Market and discovery"}</h3>
          <p>
            {es
              ? "México y Estados Unidos, sin cuotas de calidad. Cambiar mercados requiere revisión material de política."
              : "Mexico and United States, without qualification quotas. Changing markets requires material policy review."}
          </p>
          <p>
            {es
              ? "Empresas que pueden entrar a investigación"
              : "Companies that may enter research"}
            :{" "}
            <strong>
              {cycleId ? (snapshotMaximum ?? "—") : String(setting?.value)}
            </strong>
          </p>
          {cycleId && (
            <p>
              {es
                ? `La política fijada en este Cycle es su autoridad. El candidato para una futura activación tiene un máximo de ${String(setting?.value)}; no cambia este Cycle.`
                : `This Cycle's fixed policy is authoritative. The candidate for a future activation has a maximum of ${String(setting?.value)}; it does not change this Cycle.`}
            </p>
          )}
          <p>
            {setting?.editable
              ? es
                ? "Puede proponerse una nueva versión antes de crear el Cycle, dentro del límite aprobado de 75."
                : "A new version may be proposed before Cycle creation, within the approved ceiling of 75."
              : es
                ? "Bloqueado: un Cycle ya conserva su política. Sus reglas históricas no se modifican."
                : "Locked: a Cycle already holds its policy snapshot. Historical rules cannot change."}
          </p>
          {setting?.editable &&
            session.actor.capabilities.includes("MANAGE_CYCLE") && (
              <fieldset disabled={pending}>
                <legend>
                  {es
                    ? "Proponer límite de discovery"
                    : "Propose discovery limit"}
                </legend>
                {!proposal ? (
                  <>
                    <label>
                      {es ? "Nuevo máximo" : "New maximum"}
                      <input
                        type="number"
                        min={1}
                        max={75}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      />
                    </label>
                    <label>
                      {es ? "Motivo del cambio" : "Reason for change"}
                      <textarea
                        value={reason}
                        maxLength={1000}
                        onChange={(e) => setReason(e.target.value)}
                      />
                    </label>
                    <button
                      disabled={
                        !reason.trim() || Number(value) === setting.value
                      }
                      onClick={() => void submit(false)}
                    >
                      {es ? "Revisar impacto" : "Review impact"}
                    </button>
                  </>
                ) : (
                  <>
                    <h4>{es ? "Impacto del cambio" : "Change impact"}</h4>
                    <p>
                      {String(setting.value)} → {proposal.value}
                    </p>
                    <p>
                      {es
                        ? "Se creará una versión nueva. No elimina empresas, no cambia snapshots y no activa investigación ni Email. La activación futura deberá elegir una versión exacta."
                        : "Creates a new version. Does not delete companies, change snapshots or activate research or Email. Future activation must choose an exact version."}
                    </p>
                    <button onClick={() => setProposal(null)}>
                      {es ? "Cancelar" : "Cancel"}
                    </button>
                    <button onClick={() => void submit(true)}>
                      {es ? "Confirmar nueva versión" : "Confirm new version"}
                    </button>
                  </>
                )}
              </fieldset>
            )}
          <h3>{es ? "Calificación" : "Qualification"}</h3>
          <p>
            {es
              ? "Capacidad + complejidad + señal de intervención. La incertidumbre se conserva para revisión; no se convierte en rechazo automático. Cambiar esta filosofía requiere revisión material."
              : "Capacity + complexity + intervention signal. Uncertainty is retained for review, not automatically rejected. Changing this philosophy requires material review."}
          </p>
          <h3>{es ? "Ejecución y Email" : "Execution and Email"}</h3>
          <p>
            {es
              ? "Hasta 12 prospectos, en 3 waves de hasta 4. Email: 2 nuevos contactos y 4 intentos al día UTC, 24 intentos por Cycle, separación mínima de 30 minutos. Un seguimiento, después de 7 días, sólo sin respuesta y con nueva autorización."
              : "Up to 12 prospects, in 3 waves of up to 4. Email: 2 new contacts and 4 attempts per UTC day, 24 attempts per Cycle, at least 30 minutes apart. One follow-up after 7 days, only without a response and with new authorization."}
          </p>
          <p>
            {es
              ? "Estos límites requieren revisión de política, no una edición operativa. Email sigue listo pero deshabilitado."
              : "These limits require policy review, not an operational edit. Email remains ready but disabled."}
          </p>
          <h3>{es ? "Gestión" : "Management"}</h3>
          <p>
            {es
              ? "Pancracio opera dentro de una wave aprobada. La siguiente requiere revisión y autorización nuevas. La composición, retención e investigación pueden reorientarse mediante sus controles gobernados, sin cambiar la política."
              : "Pancracio operates within an approved wave. The next requires new review and authorization. Composition, retention and research can be redirected through governed controls without changing policy."}
          </p>
          <details>
            <summary>{es ? "Detalle técnico" : "Technical detail"}</summary>
            <p>
              v{state.version} · {state.policyHash}
            </p>
          </details>
        </>
      )}
    </section>
  )
}
