export type Locale = 'en' | 'es';
export const locales: Locale[] = ['en', 'es'];

/** Interface strings. Both locales are typed against the same shape, so a missing key fails `astro check`. */
export interface UI {
  skip: string; curriculum: string; figIll: string; ill: { identity: string; workloads: string; edge: string }; figTime: string; navDocs: string; navPrimary: string;
  docs: [string, string, string]; nav: [string, string, string, string];
  sections: Record<'profile' | 'experience' | 'expertise' | 'work' | 'education' | 'contact', string>;
  intros: Record<'profile' | 'experience' | 'expertise' | 'work' | 'contact', string>;
  contactHeadline: string; contactRows: [string, string, string][];
  labels: Record<'context' | 'approach' | 'stack' | 'status' | 'tools' | 'results', string>;
  footer: [string, string, string]; present: string;
  switchLabel: string; switchLang: Locale;
}

export const ui: Record<Locale, UI> = {
  "en": {
    "skip": "Skip to content",
    "curriculum": "Curriculum, 2026",
    "figIll": "Fig. 00 — Directory, workloads and edge, exploded",
    "ill": { "identity": "identity", "workloads": "workloads", "edge": "edge" },
    "figTime": "Fig. 01 — Roles over time. The red mark is today; two roles have run in parallel since August 2026.",
    "navDocs": "Documents and profiles",
    "navPrimary": "Primary",
    "docs": [
      "Curriculum vitae, PDF",
      "LinkedIn",
      "Email"
    ],
    "nav": [
      "Profile",
      "Experience",
      "Work",
      "Contact"
    ],
    "sections": {
      "profile": "Profile",
      "experience": "Experience",
      "expertise": "Expertise",
      "work": "Selected work",
      "education": "Education & certification",
      "contact": "Contact"
    },
    "intros": {
      "profile": "I work where people meet systems: deciding who gets access to what, under which conditions, and being able to prove it later in an audit. Most of that work has lived inside Microsoft Entra ID, Active Directory and Microsoft 365, for organizations of up to 2,500 users.",
      "experience": "Eight roles since 2020, from a first trainee post to running identity and infrastructure for two organizations at once.",
      "expertise": "Six areas of practice. Each closes with the organizations where it was applied.",
      "work": "Four pieces of current work, described as they stand today — including what is still in progress.",
      "contact": "Write about identity, access, or the infrastructure underneath."
    },
    "contactHeadline": "Write about identity, access, or the infrastructure <em>underneath.</em>",
    "contactRows": [
      [
        "Email",
        "(email)",
        "Direct message"
      ],
      [
        "LinkedIn",
        "juan-felipe-castillo-collazos",
        "Professional profile"
      ],
      [
        "Curriculum vitae",
        "PDF, English",
        "Download"
      ]
    ],
    "labels": {
      "context": "Context",
      "approach": "Approach",
      "stack": "Stack",
      "status": "Status",
      "tools": "Tools",
      "results": "Results"
    },
    "footer": [
      "© 2026 Juan Felipe Castillo Collazos",
      "Set in EB Garamond and Inter",
      "Bogotá, Colombia"
    ],
    "present": "Present",
    "switchLabel": "Español",
    "switchLang": "es"
  },
  "es": {
    "skip": "Saltar al contenido",
    "curriculum": "Hoja de vida, 2026",
    "figIll": "Fig. 00 — Directorio, cargas de trabajo y perímetro, en vista explosionada",
    "ill": { "identity": "identidad", "workloads": "cargas", "edge": "perímetro" },
    "figTime": "Fig. 01 — Roles en el tiempo. La marca roja es hoy; hay dos roles en paralelo desde agosto de 2026.",
    "navDocs": "Documentos y perfiles",
    "navPrimary": "Principal",
    "docs": [
      "Hoja de vida, PDF (inglés)",
      "LinkedIn",
      "Correo"
    ],
    "nav": [
      "Perfil",
      "Experiencia",
      "Trabajo",
      "Contacto"
    ],
    "sections": {
      "profile": "Perfil",
      "experience": "Experiencia",
      "expertise": "Especialidades",
      "work": "Trabajo seleccionado",
      "education": "Formación y certificación",
      "contact": "Contacto"
    },
    "intros": {
      "profile": "Trabajo donde las personas se encuentran con los sistemas: decidir quién accede a qué, bajo qué condiciones, y poder demostrarlo después en una auditoría. Casi todo ese trabajo ha ocurrido dentro de Microsoft Entra ID, Active Directory y Microsoft 365, en organizaciones de hasta 2.500 usuarios.",
      "experience": "Ocho roles desde 2020, desde un primer puesto de aprendiz hasta operar la identidad y la infraestructura de dos organizaciones a la vez.",
      "expertise": "Seis áreas de práctica. Cada una cierra con las organizaciones donde se aplicó.",
      "work": "Cuatro piezas de trabajo actual, descritas tal como están hoy, incluido lo que sigue en curso.",
      "contact": "Escríbeme sobre identidad, acceso o la infraestructura que hay debajo."
    },
    "contactHeadline": "Escríbeme sobre identidad, acceso o la infraestructura <em>que hay debajo.</em>",
    "contactRows": [
      [
        "Correo",
        "(email)",
        "Mensaje directo"
      ],
      [
        "LinkedIn",
        "juan-felipe-castillo-collazos",
        "Perfil profesional"
      ],
      [
        "Hoja de vida",
        "PDF, inglés",
        "Descargar"
      ]
    ],
    "labels": {
      "context": "Contexto",
      "approach": "Enfoque",
      "stack": "Stack",
      "status": "Estado",
      "tools": "Herramientas",
      "results": "Resultados"
    },
    "footer": [
      "© 2026 Juan Felipe Castillo Collazos",
      "Tipografía: EB Garamond e Inter",
      "Bogotá, Colombia"
    ],
    "present": "Presente",
    "switchLabel": "English",
    "switchLang": "en"
  }
};

export const monthNames: Record<Locale, string[]> = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  es: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
};
