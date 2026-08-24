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
    title:
      "Sistemas para operaciones que han crecido más allá de sus herramientas.",
    description:
      "Brunova diseña y construye sistemas operacionales confiables que integran procesos, datos y automatizaciones hoy fragmentados, para que operaciones complejas puedan crecer con control.",
    primaryAction: "Hablemos",
    secondaryAction: "Explorar sistemas",
  },
  category:
    "Ingeniería de sistemas para operaciones cuya complejidad ya no se resuelve sumando herramientas.",
  problem: {
    title:
      "Cuando el crecimiento convierte la operación en un problema de sistemas.",
    description:
      "El crecimiento revela problemas que ninguna herramienta aislada puede resolver: la operación necesita un sistema detrás.",
    transition:
      "La respuesta no es sumar otra herramienta, sino diseñar mejor el sistema.",
  },
  operationalIntelligence: {
    title:
      "La inteligencia operativa conecta procesos, datos y sistemas en una sola operación.",
    description:
      "Modelamos la operación como un sistema conectado: cómo fluye el trabajo, qué significan los datos, dónde se toman las decisiones, qué funciones corresponden al software y dónde la automatización o la IA pueden aportar valor con control.",
  },
  architecture: {
    question: "No empezamos por «¿qué automatizamos?»",
    answer: "Primero definimos «¿cómo debe funcionar la operación?»",
  },
  workTitle: "Sistemas que hemos diseñado y construido",
  process: {
    title: "Cómo trabaja Brunova",
    entryTitle: "Empezamos donde el sistema lo necesita.",
    entryDescription:
      "Cuando el problema aún no está claro, podemos empezar con un diagnóstico; si ya existe claridad suficiente, avanzamos desde ahí.",
  },
  differentiatorsTitle: "Principios que guían nuestro trabajo",
} as const

export const esHomepageSymptoms = [
  {
    name: "Sistemas desconectados",
    consequence: "La información crítica queda atrapada entre herramientas.",
  },
  {
    name: "Operaciones dependientes de hojas de cálculo",
    consequence:
      "La lógica de la operación queda dispersa en archivos, fuera del sistema.",
  },
  {
    name: "Automatizaciones frágiles",
    consequence:
      "Un cambio en el origen provoca fallas silenciosas en etapas posteriores.",
  },
  {
    name: "Reportes poco confiables",
    consequence: "Los equipos primero deben acordar qué cifra es correcta.",
  },
  {
    name: "Transferencias manuales",
    consequence:
      "El estado, el contexto y la gobernanza se diluyen entre equipos.",
  },
  {
    name: "Dependencia de personas clave",
    consequence:
      "La operación depende de conocimiento que no está institucionalizado.",
  },
  {
    name: "Excepciones que rompen el proceso",
    consequence:
      "El flujo funciona en condiciones normales, pero pierde control ante las excepciones.",
  },
  {
    name: "Datos sin confianza operativa",
    consequence: "La información existe, pero no es confiable para operar.",
  },
] as const satisfies readonly HomepageSymptom[]

export const esOperationalIntelligenceElements = [
  {
    name: "Operaciones",
    role: "marcan el trabajo real y sus restricciones",
  },
  { name: "Datos", role: "dan un significado común al estado operativo" },
  { name: "Sistemas", role: "definen límites, controles y gobernanza" },
  {
    name: "Automatización",
    role: "ejecuta rutas conocidas con mecanismos de recuperación",
  },
  {
    name: "Software",
    role: "convierte el modelo en una capacidad operativa duradera",
  },
  {
    name: "IA",
    role: "asiste donde el criterio tiene límites y controles claros",
  },
] as const satisfies readonly OperationalIntelligenceElement[]

export const esArchitectureInputs = [
  "Operación",
  "Límites del sistema",
  "Datos",
  "Decisiones",
  "Escenarios de falla",
  "Gobernanza",
] as const

export const esDifferentiators = [
  {
    title: "Arquitectura antes que herramientas",
    description:
      "Primero definimos el sistema; después elegimos las herramientas.",
  },
  {
    title: "Sistemas, no automatizaciones aisladas.",
    description:
      "Construimos capacidades que la empresa puede operar y mantener, no automatizaciones que solo logran ejecutarse.",
  },
  {
    title: "Con la operación en el centro",
    description:
      "Trabajamos sobre el proceso real para entender excepciones, responsables, relevos y puntos de falla.",
  },
] as const satisfies readonly Differentiator[]

export const esCapabilities = [
  {
    slug: "systems-architecture-internal-platforms",
    index: "01",
    name: "Arquitectura de sistemas y plataformas internas",
    navigationLabel: "Arquitectura",
    shortDescription:
      "Diseñamos límites, servicios, modelos operativos y plataformas internas para sostener operaciones críticas.",
    problemClass:
      "Las operaciones críticas crecieron sin límites compartidos ni una gobernanza clara.",
    approach:
      "Definimos el modelo operativo, los servicios y la plataforma alrededor de la operación.",
    operationalConcerns: [
      "Límites del sistema",
      "Gobernanza de servicios",
      "Mantenibilidad",
    ],
    outcomes: [
      "Servicios internos reutilizables",
      "Plataformas internas",
      "Arquitectura más clara",
    ],
    relatedWork: ["multi-tenant-financial-integration-platform"],
  },
  {
    slug: "data-integration-engineering",
    index: "02",
    name: "Ingeniería de datos e integraciones",
    navigationLabel: "Datos e integraciones",
    shortDescription:
      "Conectamos APIs, bases de datos, plataformas SaaS y almacenes con definiciones y gobernanza claras para cada flujo de datos.",
    problemClass:
      "Los datos distribuidos carecen de significado, recorrido y gobernanza consistentes.",
    approach:
      "Definimos la semántica y gobernanza de los datos antes de conectar sus fuentes dentro de un límite controlado.",
    operationalConcerns: [
      "Fuentes y gobernanza definidas",
      "Resolución de referencias",
      "Sincronización y recuperación",
    ],
    outcomes: [
      "Sincronización confiable",
      "Flujos de datos",
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
    name: "Automatización financiera y operativa",
    navigationLabel: "Automatización financiera",
    shortDescription:
      "Construimos automatizaciones controladas para procesos financieros y operativos críticos: integraciones contables, conciliación, reportes, cuentas por cobrar y por pagar e inventario.",
    problemClass:
      "El trabajo financiero crítico depende de relevos manuales y automatizaciones desconectadas.",
    approach:
      "Integramos reglas, conciliaciones, excepciones y gobernanza en un sistema controlado.",
    operationalConcerns: [
      "Conciliación",
      "Manejo de excepciones",
      "Gobernanza operativa",
    ],
    outcomes: [
      "Flujos financieros controlados",
      "Infraestructura de conciliación",
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
    name: "Ingeniería de flujos y procesos",
    navigationLabel: "Ingeniería de procesos",
    shortDescription:
      "Rediseñamos el proceso antes de automatizarlo: estados, responsables, aprobaciones, excepciones, revisión humana y escalamiento.",
    problemClass:
      "Un proceso pierde control cuando cambia de manos, aparecen excepciones o se requiere criterio.",
    approach:
      "Definimos estados, responsables, aprobaciones, excepciones y revisión humana antes de automatizar.",
    operationalConcerns: [
      "Estados y relevos",
      "Aprobaciones y escalamiento",
      "Rutas de excepción",
    ],
    outcomes: [
      "Relevos más claros",
      "Estado explícito",
      "Automatización que resiste excepciones reales",
    ],
    relatedWork: ["document-intelligence-workflow"],
  },
  {
    slug: "modernization-fragile-automations",
    index: "05",
    name: "Modernización de automatizaciones frágiles",
    navigationLabel: "Modernización",
    shortDescription:
      "Modernizamos automatizaciones valiosas que se han vuelto frágiles, opacas o dependientes de una persona, sin reemplazar lo que todavía funciona.",
    problemClass:
      "Automatizaciones útiles se han vuelto frágiles, opacas o dependientes de una persona.",
    approach:
      "Conservamos el comportamiento útil e incorporamos los controles necesarios para operarlo y hacerlo evolucionar.",
    operationalConcerns: [
      "Observabilidad",
      "Recuperación e idempotencia",
      "Disciplina de despliegue",
    ],
    outcomes: ["Observabilidad", "Recuperación", "Mantenibilidad"],
    relatedWork: ["fragile-automation-modernization"],
  },
] as const satisfies readonly Capability[]

export const esProcessStages = [
  {
    index: "01",
    verb: "Diagnosticar",
    name: "Diagnóstico del sistema",
    description:
      "Convertimos una situación operativa poco clara en un problema de sistema definido.",
    timeline: "1–2 semanas",
    problemSolved:
      "El problema de sistema, sus límites y el origen de la falla no están claros.",
    entryKnowledge:
      "Se conocen la operación y las consecuencias de su funcionamiento actual.",
    establishes: [
      "Evidencia sobre la operación actual",
      "Un problema y límites sustentados en evidencia",
      "Un siguiente paso concreto",
    ],
    nextStep:
      "Con el problema definido, el trabajo puede avanzar al Diseño de arquitectura.",
  },
  {
    index: "02",
    verb: "Diseñar",
    name: "Diseño de arquitectura",
    description:
      "Convertimos un problema definido en un diseño operativo y técnico listo para implementar.",
    timeline: "2–4 semanas",
    problemSolved:
      "El problema está claro, pero el sistema aún no está suficientemente definido para construirlo.",
    entryKnowledge:
      "El problema y los límites deseados están claros por el Diagnóstico o por trabajo previo.",
    establishes: [
      "Límites del sistema listos para implementar",
      "Decisiones de diseño técnico y operativo",
      "Una ruta de implementación definida",
    ],
    nextStep:
      "Con la arquitectura definida, el trabajo puede avanzar al Sprint de implementación.",
  },
  {
    index: "03",
    verb: "Construir",
    name: "Sprint de implementación",
    description:
      "Construimos y ponemos en operación una capacidad definida del sistema.",
    timeline: "4–8 semanas por alcance definido",
    problemSolved:
      "El diseño debe convertirse en un sistema operable en producción.",
    entryKnowledge:
      "La arquitectura, el alcance y la gobernanza operativa están definidos.",
    establishes: [
      "La capacidad acordada en producción",
      "Gobernanza operativa y transferencia",
      "Los controles requeridos por el alcance definido",
    ],
    nextStep:
      "El sistema puede transferirse al equipo responsable o continuar en Evolución continua.",
  },
  {
    index: "04",
    verb: "Evolucionar",
    name: "Evolución continua",
    description:
      "Mejoramos la confiabilidad, arquitectura y capacidad de sistemas críticos en producción.",
    timeline: "Colaboración mensual continua",
    problemSolved:
      "Un sistema en producción debe evolucionar cuando cambian la operación y los riesgos.",
    entryKnowledge:
      "Existe un sistema en producción y su equipo puede identificar la presión actual.",
    establishes: [
      "Un alcance claro de mejora continua",
      "Trabajo priorizado de confiabilidad y arquitectura",
      "Contexto operativo cercano al trabajo",
    ],
    nextStep:
      "La evolución continúa mientras el sistema sea crítico y el trabajo aporte valor.",
  },
] as const satisfies readonly ProcessStage[]

export const esWorkCases = [
  {
    slug: "multi-tenant-financial-integration-platform",
    homepageTitle:
      "Plataforma de integración financiera para múltiples entidades",
    title:
      "Integración financiera compartida para múltiples entidades operativas",
    summary:
      "Una plataforma reutilizable que centraliza el ciclo de OAuth, las operaciones contables, la resolución de referencias y los reportes recurrentes para múltiples entidades.",
    systemsClass: "Plataforma financiera para múltiples entidades",
    systemsTitle:
      "Acceso compartido a operaciones financieras para múltiples entidades",
    systemsSummary:
      "Conecta a varias entidades para que puedan consultar y actualizar información contable y generar reportes recurrentes mediante un mismo sistema reutilizable, en lugar de administrar una conexión distinta para cada una.",
    systemType: "Operaciones financieras",
    focus: ["Contabilidad multi-entidad", "Reportes financieros recurrentes"],
    capabilitySignals: [
      "Arquitectura de sistemas",
      "Automatización financiera",
      "Ingeniería de APIs e integraciones",
      "Confiabilidad",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "operational-finance-data-infrastructure",
    homepageTitle: "Infraestructura de datos para finanzas operativas",
    title:
      "Reportes financieros recurrentes convertidos en infraestructura compartida",
    summary:
      "Flujos automatizados de extracción y reporte conectan sistemas contables y operativos con un almacén de datos y las hojas de cálculo que usan los equipos, para dar acceso consistente a la información financiera.",
    systemsClass: "Sistema de reportes financieros",
    systemsTitle:
      "Reportes financieros actualizados desde una fuente compartida de información",
    systemsSummary:
      "Conecta información contable y operativa para preparar reportes recurrentes de forma consistente en las hojas de cálculo que ya usan los equipos, sin reconstruir los mismos datos en cada tarea de reporte.",
    systemType: "Reportes operativos",
    focus: ["Reportes financieros", "Acceso a datos del negocio"],
    capabilitySignals: [
      "Ingeniería de datos",
      "Inteligencia operativa",
      "Infraestructura de reportes",
      "Ingeniería de integraciones",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "document-intelligence-workflow",
    homepageTitle: "Flujo de inteligencia documental",
    title: "Procesamiento documental con IA y controles explícitos",
    summary:
      "Un sistema que combina clasificación, extracción estructurada, validación y revisión humana para procesar documentos sensibles sin perder control operativo.",
    systemsClass: "Sistema controlado de procesamiento documental",
    systemsTitle:
      "Procesamiento documental asistido por IA con revisión humana incorporada",
    systemsSummary:
      "Clasifica y extrae información de documentos sensibles para la operación, y exige validación y revisión humana antes de incorporarla al siguiente proceso operativo.",
    systemType: "Procesamiento documental",
    focus: [
      "Clasificación y extracción documental",
      "Validación y revisión humana",
      "Procesos posteriores",
    ],
    capabilitySignals: [
      "Ingeniería de flujos",
      "IA aplicada con control",
      "Revisión humana",
      "Confiabilidad",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
  {
    slug: "fragile-automation-modernization",
    homepageTitle: "Modernización de automatizaciones frágiles",
    title: "De automatizaciones dependientes de personas a sistemas operables",
    summary:
      "Modernización de conjuntos de automatizaciones mediante límites más claros, observabilidad, recuperación, idempotencia, disciplina de despliegue y documentación operativa, sin reescribir innecesariamente el comportamiento que funciona.",
    systemsClass: "Modernización de automatizaciones operativas",
    systemsTitle:
      "Automatizaciones críticas más fáciles de operar, recuperar y modificar",
    systemsSummary:
      "Conserva las automatizaciones que aún funcionan e incorpora una gobernanza más clara, controles de recuperación, disciplina de despliegue y documentación operativa.",
    systemType: "Operación de automatizaciones",
    focus: [
      "Automatizaciones existentes",
      "Recuperación y observabilidad",
      "Despliegues gestionados",
    ],
    capabilitySignals: [
      "Modernización",
      "Arquitectura de sistemas",
      "Confiabilidad",
      "Ingeniería operativa",
    ],
    publicationStatus: "approved-summary",
    detailStatus: "publication-review-required",
  },
] as const satisfies readonly WorkCase[]

export const esAboutNarrative = {
  observation:
    "Al crecer una empresa, sus operaciones críticas suelen repartirse entre hojas de cálculo, herramientas SaaS, scripts y automatizaciones antes de que alguien diseñe el sistema que debe sostenerlas.",
  boundary:
    "Brunova trabaja donde convergen procesos, datos, software y automatización para construir sistemas confiables, operables y capaces de evolucionar.",
} as const

export const esCompanyModel = [
  {
    title: "Arquitectura liderada por el fundador",
    description:
      "Las decisiones de arquitectura se mantienen cerca del problema operativo y de quienes responden por el resultado.",
  },
  {
    title: "Equipos según las necesidades del sistema",
    description:
      "Cada sistema reúne las disciplinas de ingeniería que realmente necesita.",
  },
  {
    title: "Vinculados a la operación",
    description:
      "El trabajo se mantiene cerca del proceso real, sus excepciones, traspasos y puntos de falla.",
  },
] as const

export const esOperationalLens = {
  title: "Inteligencia operativa",
  description:
    "La inteligencia operativa conecta procesos, datos, sistemas y automatización en todo el modelo.",
} as const

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
        "El formulario de contacto recopila su nombre, correo electrónico de trabajo, empresa, cargo, categoría del problema y la descripción que proporcione sobre un problema operativo.",
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
      "Varias entidades operativas necesitaban una misma forma de consultar información contable y reportes financieros recurrentes.",
    operationalProblem:
      "Las conexiones, las actualizaciones contables y los reportes se administraban sin un sistema compartido entre entidades.",
    systemApproach:
      "Brunova construyó un sistema reutilizable que permite a cada entidad consultar y actualizar información contable y generar reportes recurrentes mediante un mismo punto controlado.",
    systemBoundary: {
      summary:
        "Un mismo punto controla cómo se conectan las entidades con las operaciones contables y los reportes.",
      steps: [
        {
          label: "Entidades operativas",
          role: "Entidades que requieren un acceso contable consistente",
        },
        {
          label: "Ciclo de conexión",
          role: "Conexiones de cuenta (OAuth) y coincidencia de registros centralizadas",
        },
        {
          label: "Operaciones financieras",
          role: "Consulta y actualización de información contable, además de reportes recurrentes",
        },
        {
          label: "Acceso operativo",
          role: "Servicios compartidos disponibles para otros sistemas",
        },
      ],
    },
    engineeringDecisions: [
      "Centralizar las conexiones de cuenta y la coincidencia de registros en una capa de integración compartida.",
      "Permitir la consulta y actualización de información contable dentro del mismo límite controlado.",
      "Ofrecer reportes recurrentes y acceso operativo mediante servicios reutilizables de la plataforma.",
    ],
    outcome:
      "Varias entidades pueden trabajar con información financiera mediante un sistema consistente y reutilizable.",
    capabilities: [
      {
        label: "Arquitectura de sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
      {
        label: "Automatización financiera",
        capabilitySlug: "financial-operational-automation",
      },
      {
        label: "Ingeniería de APIs e integraciones",
        capabilitySlug: "data-integration-engineering",
      },
    ],
  },
  {
    slug: "operational-finance-data-infrastructure",
    context:
      "Los reportes financieros recurrentes dependían de información distribuida entre sistemas contables y operativos.",
    operationalProblem:
      "Cada tarea de reporte reunía la información por separado, lo que dificultaba un acceso consistente para los equipos del negocio.",
    systemApproach:
      "Brunova construyó un sistema compartido que recopila y prepara la información antes de entregarla en las hojas de cálculo que ya usan los equipos.",
    systemBoundary: {
      summary:
        "La información contable y operativa se prepara una sola vez en una base compartida antes de llegar a los reportes del negocio.",
      steps: [
        {
          label: "Sistemas de origen",
          role: "Información contable y operativa",
        },
        {
          label: "Flujo de extracción",
          role: "Recopilación y preparación automatizada de información de origen",
        },
        { label: "Almacén de datos", role: "Base compartida para reportes" },
        {
          label: "Acceso del negocio",
          role: "Información consistente en herramientas conocidas por los equipos",
        },
      ],
    },
    engineeringDecisions: [
      "Integrar las fuentes contables y operativas mediante un solo flujo de reportes.",
      "Usar el almacén como infraestructura compartida y no como interfaz final.",
      "Conservar el acceso mediante hojas de cálculo para equipos no técnicos.",
    ],
    outcome:
      "Los equipos del negocio acceden de forma consistente a información financiera recurrente desde hojas de cálculo conocidas.",
    capabilities: [
      {
        label: "Ingeniería de datos",
        capabilitySlug: "data-integration-engineering",
      },
      {
        label: "Automatización financiera",
        capabilitySlug: "financial-operational-automation",
      },
      {
        label: "Arquitectura de sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
  {
    slug: "document-intelligence-workflow",
    context:
      "Los documentos sensibles para la operación requerían un procesamiento consistente sin eliminar la supervisión humana.",
    operationalProblem:
      "La clasificación y extracción automatizadas no garantizaban por sí solas que la información estuviera lista para el siguiente proceso operativo.",
    systemApproach:
      "Brunova construyó un proceso asistido por IA que exige validación y revisión humana antes de permitir que la información avance.",
    systemBoundary: {
      summary:
        "La IA prepara información estructurada; la validación y la revisión humana determinan si puede avanzar.",
      steps: [
        {
          label: "Ingreso de documentos",
          role: "Documentos fuente sensibles para la operación",
        },
        {
          label: "Clasificación y extracción",
          role: "Procesamiento estructurado asistido por IA",
        },
        {
          label: "Validación y revisión",
          role: "Control explícito basado en criterio humano",
        },
        {
          label: "Proceso siguiente",
          role: "La información validada avanza al proceso operativo",
        },
      ],
    },
    engineeringDecisions: [
      "Separar la clasificación y la extracción estructurada de la validación.",
      "Incorporar la revisión humana al sistema como un control explícito, no como una excepción externa.",
      "Integrar la información validada con el siguiente proceso operativo.",
    ],
    safeguards: [
      "Validación estructurada antes de continuar",
      "Revisión humana para documentos sensibles",
      "Entrega controlada al siguiente proceso",
    ],
    outcome:
      "Los documentos pueden procesarse con asistencia de IA mientras el criterio humano permanece dentro de la operación.",
    capabilities: [
      {
        label: "Ingeniería de flujos",
        capabilitySlug: "workflow-process-engineering",
      },
      {
        label: "Arquitectura de sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
  {
    slug: "fragile-automation-modernization",
    context:
      "Las automatizaciones existentes seguían sosteniendo la operación, pero eran frágiles, difíciles de entender y dependientes de una persona.",
    operationalProblem:
      "Una gobernanza poco clara y controles operativos débiles hacían riesgosos los cambios y la recuperación.",
    scalingConstraint:
      "No se justificaba reescribir lo que aún funcionaba, pero el modelo operativo existente ya no soportaba nuevos cambios.",
    systemApproach:
      "Brunova conservó el comportamiento funcional e incorporó los controles necesarios para operar, recuperar y modificar la automatización con menos riesgo.",
    systemBoundary: {
      summary:
        "La automatización se conserva, con gobernanza y controles explícitos para fallas, recuperación y despliegue.",
      steps: [
        {
          label: "Comportamiento funcional",
          role: "Automatización existente que vale la pena conservar",
        },
        {
          label: "Límites claros",
          role: "Alcance y gobernanza definidos",
        },
        {
          label: "Controles de operabilidad",
          role: "Monitoreo, recuperación y prevención de procesamiento duplicado (idempotencia)",
        },
        {
          label: "Sistema gestionado",
          role: "Despliegues disciplinados y documentación operativa",
        },
      ],
    },
    engineeringDecisions: [
      "Conservar el comportamiento funcional en vez de reescribirlo sin causa.",
      "Aclarar los límites del sistema antes de ampliar sus capacidades.",
      "Incorporar la disciplina de despliegue y la documentación al propio sistema.",
    ],
    safeguards: [
      "Observabilidad",
      "Recuperación",
      "Prevención de procesamiento duplicado (idempotencia)",
      "Documentación operativa",
    ],
    outcome:
      "La operación conserva el valor de sus automatizaciones con una gobernanza más clara y un sistema más fácil de mantener.",
    capabilities: [
      {
        label: "Modernización",
        capabilitySlug: "modernization-fragile-automations",
      },
      {
        label: "Arquitectura de sistemas",
        capabilitySlug: "systems-architecture-internal-platforms",
      },
    ],
  },
] as const satisfies readonly WorkDetail[]
