import type {
  Capability,
  Differentiator,
  HomepageSymptom,
  OperationalIntelligenceElement,
  ProcessStage,
  WorkCase,
  WorkDetail,
} from "@/content/types"

export const esHomepage = {
  hero: {
    title: "Sistemas para operaciones que ya superaron sus herramientas.",
    description:
      "Brunova diseña y construye sistemas confiables que convierten procesos fragmentados, datos desconectados y automatizaciones frágiles en operaciones empresariales escalables.",
    primaryAction: "Iniciar una conversación",
    secondaryAction: "Explorar proyectos",
  },
  problem: {
    title: "Cuando las operaciones se convierten en problemas de sistemas.",
    description:
      "El crecimiento suele revelar un problema que ninguna herramienta por sí sola puede resolver: la operación dejó de comportarse como un sistema.",
  },
  operationalIntelligence: {
    title:
      "La inteligencia operativa surge cuando los procesos, los datos y los sistemas dejan de vivir por separado.",
    description:
      "Tratamos la operación como un modelo conectado: cómo avanza el trabajo, qué significan los datos, dónde se toman decisiones, qué controla el software y dónde la automatización o la IA pueden asistir de forma segura.",
  },
  architecture: {
    question: "No empezamos preguntando «¿Qué deberíamos automatizar?»",
    answer: "Empezamos con «¿Cómo debería funcionar esta operación?»",
  },
  workTitle: "Sistemas seleccionados que hemos desarrollado",
  process: {
    title: "Cómo trabaja Brunova",
    entryTitle: "Entre donde el sistema necesita trabajo.",
    entryDescription:
      "El descubrimiento está disponible cuando el problema no es claro; no es un primer paso obligatorio. Podemos comenzar con la arquitectura, una implementación definida o un sistema existente en producción.",
  },
  differentiatorsTitle: "Principios con los que operamos",
  finalCta: {
    title: "¿Tiene una operación que ya superó la forma en que fue construida?",
    description: "Mapeemos el sistema que la sostiene.",
    action: "Iniciar una conversación",
  },
} as const

export const esHomepageSymptoms = [
  {
    name: "Sistemas desconectados",
    consequence: "El contexto crítico queda atrapado entre herramientas.",
  },
  {
    name: "Operaciones dependientes de hojas de cálculo",
    consequence:
      "El modelo operativo vive en archivos en vez de vivir en el sistema.",
  },
  {
    name: "Automatizaciones frágiles",
    consequence:
      "Pequeños cambios de origen producen fallas silenciosas más adelante.",
  },
  {
    name: "Reportes poco confiables",
    consequence:
      "Los equipos discuten las cifras antes de poder actuar sobre ellas.",
  },
  {
    name: "Relevos manuales",
    consequence: "El estado y la responsabilidad se pierden entre personas.",
  },
  {
    name: "Dependencia de personas clave",
    consequence: "La operación depende de conocimiento que no puede escalar.",
  },
  {
    name: "Excepciones que rompen el proceso",
    consequence: "El proceso estándar funciona; las excepciones lo rompen.",
  },
  {
    name: "Datos sin confianza operativa",
    consequence:
      "La información existe, pero la empresa no puede depender de ella.",
  },
] as const satisfies readonly HomepageSymptom[]

export const esOperationalIntelligenceElements = [
  {
    name: "Operaciones",
    role: "definen el trabajo y sus restricciones reales",
  },
  { name: "Datos", role: "dan significado compartido al estado operativo" },
  { name: "Sistemas", role: "establecen límites, control y responsabilidades" },
  {
    name: "Automatización",
    role: "ejecuta rutas conocidas con recuperación confiable",
  },
  {
    name: "Software",
    role: "convierte el modelo operativo en una capacidad duradera",
  },
  { name: "IA", role: "asiste donde el juicio puede delimitarse y gobernarse" },
] as const satisfies readonly OperationalIntelligenceElement[]

export const esArchitectureInputs = [
  "Operación",
  "Límites del sistema",
  "Datos",
  "Decisiones",
  "Rutas de falla",
  "Responsabilidad",
] as const

export const esDifferentiators = [
  {
    title: "Arquitectura antes que herramientas",
    description: "Entendemos el sistema antes de elegir la herramienta.",
  },
  {
    title: "Sistemas, no flujos aislados",
    description:
      "Construimos algo que la empresa pueda operar y mantener, no solo algo que se ejecute.",
  },
  {
    title: "Cerca de las operaciones",
    description:
      "Nos mantenemos lo bastante cerca del proceso real para entender excepciones, responsabilidades, relevos y puntos de falla.",
  },
] as const satisfies readonly Differentiator[]

export const esCapabilities = [
  {
    slug: "systems-architecture-internal-platforms",
    index: "01",
    name: "Arquitectura de Sistemas y Plataformas Internas",
    navigationLabel: "Arquitectura",
    shortDescription:
      "Diseñamos límites de sistemas, servicios, modelos operativos y plataformas internas alrededor de operaciones empresariales críticas.",
    problemClass:
      "Las operaciones críticas crecieron entre herramientas y decisiones locales sin un límite compartido, un modelo de servicios o responsabilidades claras.",
    approach:
      "Brunova comienza con la operación —sus datos, decisiones, rutas de falla y responsables— y después define los límites, servicios y la plataforma interna necesarios para sostenerla.",
    operationalConcerns: [
      "Límites del sistema",
      "Responsabilidad de servicios",
      "Dependencia de personas clave",
      "Mantenibilidad conforme cambia la operación",
    ],
    outcomes: [
      "Servicios internos reutilizables",
      "Plataformas internas",
      "Responsabilidad de sistema mantenible",
      "Menor dependencia de personas clave",
      "Arquitectura más clara",
    ],
    relatedWork: ["multi-tenant-financial-integration-platform"],
  },
  {
    slug: "data-integration-engineering",
    index: "02",
    name: "Ingeniería de Datos e Integraciones",
    navigationLabel: "Datos e integraciones",
    shortDescription:
      "Conectamos APIs, bases de datos, plataformas SaaS, almacenes y flujos de datos operativos con semántica y responsabilidades explícitas.",
    problemClass:
      "Los datos operativos están distribuidos entre sistemas, pero su significado, movimiento y responsabilidad no son lo bastante confiables para un uso compartido.",
    approach:
      "Brunova define la semántica y la responsabilidad de cada flujo antes de conectar APIs, bases de datos, plataformas SaaS y almacenes en un límite de integración controlado.",
    operationalConcerns: [
      "Responsabilidad de origen",
      "Resolución de referencias",
      "Sincronización y recuperación",
      "Confianza en reportes",
    ],
    outcomes: [
      "Sincronización confiable",
      "Pipelines de datos",
      "Almacenes de datos",
      "Servicios de integración compartidos",
      "Bases confiables para reportes",
    ],
    relatedWork: [
      "multi-tenant-financial-integration-platform",
      "operational-finance-data-infrastructure",
    ],
  },
  {
    slug: "financial-operational-automation",
    index: "03",
    name: "Automatización Financiera y Operativa",
    navigationLabel: "Automatización financiera",
    shortDescription:
      "Construimos automatización controlada para flujos financieros y operativos críticos, incluidas integraciones contables, conciliación, reportes, cuentas por cobrar/pagar y operaciones relacionadas con inventario.",
    problemClass:
      "El trabajo financiero y operativo importante depende de relevos manuales o automatizaciones poco conectadas entre procesos contables, de reportes e inventario.",
    approach:
      "Brunova diseña el sistema alrededor de reglas operativas, conciliación, excepciones y responsabilidades. El trabajo apoya las operaciones financieras; no es asesoría ni servicio contable.",
    operationalConcerns: [
      "Conciliación",
      "Manejo de excepciones",
      "Responsabilidad operativa",
      "Continuidad de reportes",
    ],
    outcomes: [
      "Flujos financieros controlados",
      "Infraestructura de conciliación",
      "Reportes operativos",
      "Integraciones contables confiables",
    ],
    relatedWork: [
      "multi-tenant-financial-integration-platform",
      "operational-finance-data-infrastructure",
    ],
  },
  {
    slug: "workflow-process-engineering",
    index: "04",
    name: "Ingeniería de Flujos y Procesos",
    navigationLabel: "Ingeniería de procesos",
    shortDescription:
      "Rediseñamos el proceso antes de automatizarlo: estados, responsables, aprobaciones, excepciones, revisión humana y escalamiento.",
    problemClass:
      "Un proceso funciona en su ruta estándar, pero pierde control cuando cambia la responsabilidad, aparecen excepciones o se requiere criterio.",
    approach:
      "Brunova hace explícitos los estados, responsables, aprobaciones, excepciones, revisión humana y escalamiento antes de decidir qué automatizar.",
    operationalConcerns: [
      "Estados y relevos",
      "Aprobaciones y escalamiento",
      "Rutas de excepción",
      "Revisión humana",
    ],
    outcomes: [
      "Relevos más claros",
      "Estado explícito",
      "Menos pasos manuales ocultos",
      "Automatización que resiste excepciones reales",
    ],
    relatedWork: ["document-intelligence-workflow"],
  },
  {
    slug: "modernization-fragile-automations",
    index: "05",
    name: "Modernización de Automatizaciones Frágiles",
    navigationLabel: "Modernización",
    shortDescription:
      "Llevamos automatizaciones que funcionan, pero son frágiles, opacas o dependientes de una persona, hacia una arquitectura y operación más sólidas.",
    problemClass:
      "Las automatizaciones existentes aportan valor, pero son frágiles, opacas, difíciles de recuperar o dependen de una sola persona.",
    approach:
      "Brunova conserva el comportamiento que funciona cuando es posible e incorpora límites más claros, observabilidad, recuperación, idempotencia, disciplina de despliegue y documentación.",
    operationalConcerns: [
      "Observabilidad",
      "Recuperación e idempotencia",
      "Disciplina de despliegue",
      "Documentación y responsabilidad",
    ],
    outcomes: [
      "Observabilidad",
      "Recuperación",
      "Idempotencia",
      "Documentación",
      "Mantenibilidad",
      "Responsabilidad más clara",
    ],
    relatedWork: ["fragile-automation-modernization"],
  },
] as const satisfies readonly Capability[]

export const esProcessStages = [
  {
    index: "01",
    verb: "Descubrir",
    name: "Descubrimiento de Sistemas",
    description:
      "Convertimos un problema operativo poco claro en un problema de sistema definido, con evidencia, límites y un siguiente paso recomendado.",
    timeline: "1–2 semanas",
    problemSolved:
      "La operación importa, pero el problema real del sistema, su límite y la fuente de la falla aún no están claros.",
    entryKnowledge:
      "Puede identificar la operación y las consecuencias de su comportamiento actual; no se requiere un diagnóstico técnico completo.",
    establishes: [
      "Evidencia sobre la operación actual",
      "Un problema y límite de sistema defendibles",
      "Un siguiente paso recomendado",
    ],
    nextStep:
      "Un problema de sistema conocido puede pasar a un Plano de Arquitectura cuando se necesita un diseño listo para construir.",
  },
  {
    index: "02",
    verb: "Diseñar",
    name: "Plano de Arquitectura",
    description:
      "Convertimos un problema operativo conocido en un diseño técnico y operativo listo para construir.",
    timeline: "2–4 semanas",
    problemSolved:
      "El problema se entiende, pero el diseño técnico y operativo todavía no es suficientemente preciso para construir con responsabilidad.",
    entryKnowledge:
      "El problema operativo y el límite deseado son conocidos, ya sea por Descubrimiento o por trabajo interno previo.",
    establishes: [
      "Un límite de sistema listo para construir",
      "Decisiones de diseño técnico y operativo",
      "Una ruta de implementación definida",
    ],
    nextStep:
      "Una arquitectura definida puede pasar a un Sprint de Implementación con Brunova o con un equipo de entrega adecuado.",
  },
  {
    index: "03",
    verb: "Construir",
    name: "Sprint de Implementación",
    description:
      "Construimos y ponemos en operación una capacidad de sistema de producción definida.",
    timeline: "4–8 semanas por alcance definido",
    problemSolved:
      "Una capacidad definida debe convertirse en un sistema de producción operable, no solo en un entregable técnico.",
    entryKnowledge:
      "La arquitectura, el alcance y la responsabilidad operativa se definen antes de comenzar la implementación.",
    establishes: [
      "La capacidad de producción acordada",
      "Responsabilidad operativa y transferencia",
      "Los controles requeridos por el alcance definido",
    ],
    nextStep:
      "El sistema puede transferirse a su responsable operativo o continuar a Evolución Gestionada cuando la cercanía sostenida aporta valor.",
  },
  {
    index: "04",
    verb: "Evolucionar",
    name: "Evolución Gestionada",
    description:
      "Nos mantenemos cerca de sistemas de producción importantes y mejoramos de forma continua su confiabilidad, arquitectura y capacidad conforme cambia la empresa.",
    timeline: "Colaboración mensual continua",
    problemSolved:
      "Un sistema de producción importante debe seguir mejorando conforme cambian las condiciones operativas, los riesgos y las necesidades del negocio.",
    entryKnowledge:
      "Ya existe un sistema en producción y sus responsables actuales pueden identificar la presión de confiabilidad o capacidad alrededor de él.",
    establishes: [
      "Un límite de mejora continua",
      "Trabajo priorizado de confiabilidad y arquitectura",
      "Contexto operativo que permanece cerca de la entrega",
    ],
    nextStep:
      "La evolución continúa mientras el sistema siga siendo importante y la colaboración siga siendo útil.",
  },
] as const satisfies readonly ProcessStage[]

export const esWorkCases = [
  {
    slug: "multi-tenant-financial-integration-platform",
    homepageTitle: "Plataforma de Integración Financiera Multiempresa",
    title:
      "Una capa compartida de integración financiera para múltiples entidades operativas",
    summary:
      "Una plataforma reutilizable de integración contable que centraliza el ciclo de vida de OAuth, lecturas y escrituras financieras, resolución de referencias, reportes recurrentes y acceso operativo posterior.",
    capabilitySignals: [
      "Arquitectura de Sistemas",
      "Automatización Financiera",
      "Ingeniería de APIs e Integraciones",
      "Confiabilidad",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "operational-finance-data-infrastructure",
    homepageTitle: "Infraestructura de Datos Financieros Operativos",
    title:
      "Convertir los reportes financieros recurrentes en infraestructura operativa compartida",
    summary:
      "Pipelines automatizados de extracción y reporte que conectan sistemas contables y operativos con un almacén de datos y hojas de cálculo orientadas al negocio, para dar acceso consistente a información financiera a equipos no técnicos.",
    capabilitySignals: [
      "Ingeniería de Datos",
      "Inteligencia Operativa",
      "Infraestructura de Reportes",
      "Ingeniería de Integraciones",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "document-intelligence-workflow",
    homepageTitle: "Flujo de Inteligencia Documental",
    title: "Procesamiento documental asistido por IA con control incorporado",
    summary:
      "Un sistema de procesamiento documental que combina clasificación, extracción estructurada, validación, revisión humana e integración con flujos posteriores para documentos operativamente sensibles.",
    capabilitySignals: [
      "Ingeniería de Flujos",
      "Sistemas con IA",
      "Humano en el circuito",
      "Confiabilidad",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "fragile-automation-modernization",
    homepageTitle: "Modernización de Automatizaciones Frágiles",
    title: "De flujos dependientes de personas a sistemas operables",
    summary:
      "Modernización de conjuntos de automatizaciones mediante límites más claros, observabilidad, recuperación, idempotencia, disciplina de despliegue y documentación operativa, sin reescribir innecesariamente el comportamiento que funciona.",
    capabilitySignals: [
      "Modernización",
      "Arquitectura de Sistemas",
      "Confiabilidad",
      "Ingeniería Operativa",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
] as const satisfies readonly WorkCase[]

export const esAboutNarrative = {
  observation:
    "Brunova nació de una observación sencilla: conforme las empresas crecen, las operaciones importantes suelen convertirse en conjuntos de hojas de cálculo, herramientas SaaS, scripts y automatizaciones antes de que alguien diseñe deliberadamente el sistema que las sostiene.",
  boundary:
    "Trabajamos en ese límite —donde se encuentran los procesos, los datos, el software y la automatización— para convertir esas operaciones en sistemas más confiables, operables y fáciles de evolucionar.",
} as const

export const esCompanyModel = [
  {
    title: "Arquitectura dirigida por el fundador",
    description:
      "La dirección del sistema permanece cerca del problema operativo, las decisiones críticas y las personas responsables del resultado.",
  },
  {
    title: "Entrega basada en equipos",
    description:
      "La entrega reúne las responsabilidades de ingeniería que el sistema realmente necesita, sin presentar a una sola persona generalista como toda la empresa.",
  },
  {
    title: "Cerca de las operaciones",
    description:
      "El trabajo permanece lo bastante cerca del proceso real para entender excepciones, responsabilidades, relevos y puntos de falla.",
  },
  {
    title: "Inteligencia operativa",
    description:
      "Los procesos, datos, sistemas y automatización se tratan como un solo modelo operativo que la empresa puede entender y mejorar.",
  },
] as const

export const esPrivacyContent = {
  reviewStatus: "legal-human-review-required-before-production",
  updatedLabel: "Aviso de privacidad",
  introduction:
    "Este aviso describe cómo el sitio web de Brunova maneja la información de contacto, la atribución de primer contacto y la configuración actual de analítica.",
  sections: [
    {
      id: "contact-information",
      title: "Información de contacto",
      paragraphs: [
        "El formulario de contacto recopila su nombre, correo electrónico de trabajo, empresa, puesto, categoría del problema y la descripción que proporcione sobre un problema operativo.",
        "Brunova usa esta información para revisar el contexto, determinar un siguiente paso adecuado y dar seguimiento a la conversación.",
      ],
    },
    {
      id: "attribution",
      title: "Atribución de primer contacto",
      paragraphs: [
        "Si una URL de llegada contiene parámetros UTM, el sitio almacena los primeros valores de fuente, medio, campaña, término y contenido en sessionStorage del navegador, junto con la ruta de llegada, la hora de captura y el referente disponible.",
        "Ese registro de primer contacto permanece durante la sesión actual del navegador. Los valores UTM de fuente, medio, campaña, término y contenido se incluyen con el envío del formulario cuando están disponibles.",
      ],
    },
    {
      id: "processing",
      title: "Límite de procesamiento del contacto",
      paragraphs: [
        "El navegador envía el formulario al servidor de Brunova. El servidor valida y limita el envío antes de reenviar únicamente los campos de contacto aceptados y los valores UTM de primer contacto al flujo operativo privado de Brunova en el servidor.",
        "Ese flujo apoya la revisión interna y el seguimiento operativo. El sitio no envía al flujo el campo señuelo, la información de tiempo del formulario, la dirección de red sin procesar ni una huella del navegador.",
      ],
    },
    {
      id: "analytics",
      title: "Analítica y publicidad",
      paragraphs: [
        "El sitio actual utiliza un adaptador de analítica sin operación. No hay proveedor de analítica ni cookie de analítica activos.",
        "El sitio actual no incluye rastreadores publicitarios. Como no hay analítica basada en cookies activa, no se muestra un aviso de cookies.",
      ],
    },
  ],
} as const

export const esWorkDetails = [
  {
    slug: "multi-tenant-financial-integration-platform",
    context:
      "Múltiples entidades operativas necesitaban una forma compartida de acceder a operaciones contables e información financiera recurrente.",
    operationalProblem:
      "El ciclo de autenticación, las lecturas y escrituras financieras, la resolución de referencias y los reportes pertenecían a un mismo límite operativo, pero cada aspecto requería un manejo consistente entre entidades.",
    systemApproach:
      "Una plataforma reutilizable de integración contable centralizó el ciclo de OAuth, las lecturas y escrituras financieras, la resolución de referencias, los reportes recurrentes y el acceso operativo posterior.",
    systemBoundary: {
      summary:
        "Las entidades operativas entran a un límite de integración controlado antes de que las operaciones financieras y los reportes estén disponibles para otros sistemas.",
      steps: [
        {
          label: "Entidades operativas",
          role: "Múltiples entidades que requieren acceso contable consistente",
        },
        {
          label: "Ciclo de conexión",
          role: "OAuth y resolución de referencias centralizados",
        },
        {
          label: "Operaciones financieras",
          role: "Lecturas, escrituras y reportes recurrentes",
        },
        {
          label: "Acceso operativo",
          role: "Acceso reutilizable a la capa compartida",
        },
      ],
    },
    engineeringDecisions: [
      "Centralizar el ciclo de conexión y la resolución de referencias en una capa compartida.",
      "Admitir lecturas y escrituras financieras dentro del mismo límite definido.",
      "Hacer de los reportes recurrentes y el acceso operativo consumidores de la plataforma reutilizable.",
    ],
    outcome:
      "Una capa compartida de integración financiera diseñada para reutilizarse entre múltiples entidades operativas.",
    capabilities: [
      {
        label: "Arquitectura de Sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
      {
        label: "Automatización Financiera",
        capabilitySlug: "financial-operational-automation",
      },
      {
        label: "Ingeniería de APIs e Integraciones",
        capabilitySlug: "data-integration-engineering",
      },
    ],
  },
  {
    slug: "operational-finance-data-infrastructure",
    context:
      "Los reportes financieros recurrentes dependían de información distribuida entre sistemas contables y operativos, mientras los equipos no técnicos necesitaban acceso consistente orientado al negocio.",
    operationalProblem:
      "Los sistemas de origen, el pipeline de reportes y el acceso por hojas de cálculo debían comportarse como infraestructura operativa compartida, no como tareas de reporte separadas.",
    systemApproach:
      "Pipelines automatizados de extracción y reporte conectaron sistemas contables y operativos con un almacén de datos y hojas de cálculo orientadas al negocio.",
    systemBoundary: {
      summary:
        "Los datos de origen pasan por un límite compartido de reportes antes de llegar a la capa de hojas de cálculo para el negocio.",
      steps: [
        {
          label: "Sistemas de origen",
          role: "Información contable y operativa",
        },
        {
          label: "Pipeline de extracción",
          role: "Movimiento automatizado desde fuentes operativas",
        },
        { label: "Almacén de datos", role: "Base compartida para reportes" },
        {
          label: "Acceso del negocio",
          role: "Información consistente en hojas de cálculo conocidas",
        },
      ],
    },
    engineeringDecisions: [
      "Conectar las fuentes contables y operativas mediante un solo pipeline de reportes.",
      "Usar el almacén como infraestructura compartida y no como interfaz final.",
      "Conservar el acceso mediante hojas de cálculo para equipos no técnicos.",
    ],
    outcome:
      "Una ruta de reportes que da a equipos no técnicos acceso consistente a información financiera recurrente.",
    capabilities: [
      {
        label: "Ingeniería de Datos",
        capabilitySlug: "data-integration-engineering",
      },
      {
        label: "Automatización Financiera",
        capabilitySlug: "financial-operational-automation",
      },
      {
        label: "Arquitectura de Sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
  {
    slug: "document-intelligence-workflow",
    context:
      "Documentos operativamente sensibles requerían procesamiento estructurado sin eliminar los controles que exige el juicio humano.",
    operationalProblem:
      "La clasificación y la extracción no bastaban; el flujo también necesitaba validación, revisión humana y una transferencia controlada hacia el proceso posterior.",
    systemApproach:
      "Un sistema de procesamiento documental combinó clasificación, extracción estructurada, validación, revisión humana e integración con el flujo posterior.",
    systemBoundary: {
      summary:
        "La automatización prepara información estructurada, mientras la validación y la revisión humana siguen siendo controles explícitos antes del uso posterior.",
      steps: [
        {
          label: "Ingreso de documentos",
          role: "Documentos fuente operativamente sensibles",
        },
        {
          label: "Clasificación y extracción",
          role: "Procesamiento estructurado asistido por IA",
        },
        {
          label: "Validación y revisión",
          role: "Límite de control con juicio humano",
        },
        {
          label: "Flujo posterior",
          role: "La información revisada entra al proceso operativo",
        },
      ],
    },
    engineeringDecisions: [
      "Separar la clasificación y la extracción estructurada de la validación.",
      "Mantener la revisión humana dentro del límite del sistema, no como una excepción externa.",
      "Integrar las salidas revisadas con el proceso operativo posterior.",
    ],
    safeguards: [
      "Validación estructurada antes del uso posterior",
      "Revisión humana para documentos operativamente sensibles",
      "Una transferencia definida al flujo posterior",
    ],
    outcome:
      "Un flujo controlado de inteligencia documental en el que la IA asiste mientras el juicio permanece delimitado y gobernado.",
    capabilities: [
      {
        label: "Ingeniería de Flujos",
        capabilitySlug: "workflow-process-engineering",
      },
      {
        label: "Arquitectura de Sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
  {
    slug: "fragile-automation-modernization",
    context:
      "Un conjunto existente de automatizaciones aportaba valor, pero se había vuelto frágil, opaco y dependiente del conocimiento individual.",
    operationalProblem:
      "El riesgo operativo provenía de límites poco claros, observabilidad y recuperación débiles, y documentación insuficiente de despliegue y operación.",
    scalingConstraint:
      "El comportamiento que funcionaba no justificaba una reescritura innecesaria, pero el modelo operativo que lo rodeaba no era suficientemente sólido para seguir cambiando.",
    systemApproach:
      "La modernización incorporó límites más claros, observabilidad, recuperación, idempotencia, disciplina de despliegue y documentación operativa, conservando el comportamiento funcional cuando fue posible.",
    systemBoundary: {
      summary:
        "La automatización útil permanece, mientras se añade un límite operativo explícito alrededor de fallas, recuperación, despliegue y responsabilidad.",
      steps: [
        {
          label: "Comportamiento funcional",
          role: "Automatización existente que vale la pena conservar",
        },
        {
          label: "Límites claros",
          role: "Responsabilidades y propiedad definidas",
        },
        {
          label: "Controles de operabilidad",
          role: "Observabilidad, recuperación e idempotencia",
        },
        {
          label: "Sistema gestionado",
          role: "Despliegue disciplinado y documentación operativa",
        },
      ],
    },
    engineeringDecisions: [
      "Conservar el comportamiento funcional en vez de reescribirlo sin causa.",
      "Introducir límites de sistema más claros antes de ampliar capacidades.",
      "Tratar la disciplina de despliegue y la documentación como parte del sistema.",
    ],
    safeguards: [
      "Observabilidad",
      "Recuperación",
      "Idempotencia",
      "Documentación operativa",
    ],
    outcome:
      "Un conjunto de automatizaciones más operable, con responsabilidades más claras y mejor mantenibilidad.",
    capabilities: [
      {
        label: "Modernización",
        capabilitySlug: "modernization-fragile-automations",
      },
      {
        label: "Arquitectura de Sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
] as const satisfies readonly WorkDetail[]
