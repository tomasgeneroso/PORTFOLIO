import { Locale } from "./locales";

export interface ProjectTranslation {
  projectName: string;
  description: string;
  technologies: string[];
}

export interface CertificateTranslation {
  title: string;
  issuer?: string;
}

export const projectsTranslations: Record<number, Record<Locale, ProjectTranslation>> = {
  0: {
    // ZAIFO
    en: {
      projectName: "ZAIFO",
      description:
        "It's basically an appweb for hire professionals for construction. It was my first entrepreneurship, an appweb where you can hire some constructor or plumber for example, to fix something or start some new project at home. The professionals could create their own profile and the users could search for them by location, price, etc.",
      technologies: ["HTML", "CSS", "Javascript", "Project Owner"],
    },
    es: {
      projectName: "ZAIFO",
      description:
        "Básicamente es una aplicación web para contratar profesionales de la construcción. Fue mi primer emprendimiento, una aplicación web donde puedes contratar un constructor o plomero, por ejemplo, para arreglar algo o iniciar algún proyecto nuevo en casa. Los profesionales podían crear su propio perfil y los usuarios podían buscarlos por ubicación, precio, etc.",
      technologies: ["HTML", "CSS", "Javascript", "Dueño del Proyecto"],
    },
    it: {
      projectName: "ZAIFO",
      description:
        "È fondamentalmente un'app web per assumere professionisti per l'edilizia. È stato il mio primo imprenditorato, un'app web dove puoi assumere un costruttore o un idraulico, ad esempio, per riparare qualcosa o avviare un nuovo progetto a casa. I professionisti potevano creare il proprio profilo e gli utenti potevano cercarli per posizione, prezzo, ecc.",
      technologies: ["HTML", "CSS", "Javascript", "Proprietario del Progetto"],
    },
    fr: {
      projectName: "ZAIFO",
      description:
        "C'est essentiellement une application web pour embaucher des professionnels de la construction. C'était ma première entreprise, une application web où vous pouvez embaucher un constructeur ou un plombier, par exemple, pour réparer quelque chose ou démarrer un nouveau projet à la maison. Les professionnels pouvaient créer leur propre profil et les utilisateurs pouvaient les rechercher par emplacement, prix, etc.",
      technologies: ["HTML", "CSS", "Javascript", "Propriétaire du Projet"],
    },
    de: {
      projectName: "ZAIFO",
      description:
        "Es ist im Grunde eine Web-App, um Bauprofis einzustellen. Es war mein erstes Unternehmen, eine Web-App, mit der Sie zum Beispiel einen Bauarbeiter oder Klempner einstellen können, um etwas zu reparieren oder ein neues Projekt zu Hause zu beginnen. Die Fachleute konnten ihr eigenes Profil erstellen und die Benutzer konnten sie nach Standort, Preis usw. suchen.",
      technologies: ["HTML", "CSS", "Javascript", "Projektinhaber"],
    },
  },
  1: {
    // DO
    en: {
      projectName: "DO",
      description:
        "It was my second entrepreneurship, we were a 3 people team. It was an app where you could find someone to solve any kind of task or service or you could search for tasks and/or services to do. It would be running in Argentina. We created the product, we developed the application with another development team, but then the company went down because of a team mistake",
      technologies: ["Figma", "React Native", "Firebase", "Scrum", "Project Owner"],
    },
    es: {
      projectName: "DO",
      description:
        "Fue mi segundo emprendimiento, éramos un equipo de 3 personas. Era una aplicación donde podías encontrar a alguien para resolver cualquier tipo de tarea o servicio o podías buscar tareas y/o servicios para hacer. Funcionaría en Argentina. Creamos el producto, desarrollamos la aplicación con otro equipo de desarrollo, pero luego la empresa cayó debido a un error del equipo",
      technologies: ["Figma", "React Native", "Firebase", "Scrum", "Dueño del Proyecto"],
    },
    it: {
      projectName: "DO",
      description:
        "È stata la mia seconda impresa, eravamo un team di 3 persone. Era un'app dove potevi trovare qualcuno per risolvere qualsiasi tipo di compito o servizio o potevi cercare compiti e/o servizi da fare. Sarebbe stata attiva in Argentina. Abbiamo creato il prodotto, abbiamo sviluppato l'applicazione con un altro team di sviluppo, ma poi l'azienda è fallita a causa di un errore del team",
      technologies: ["Figma", "React Native", "Firebase", "Scrum", "Proprietario del Progetto"],
    },
    fr: {
      projectName: "DO",
      description:
        "C'était ma deuxième entreprise, nous étions une équipe de 3 personnes. C'était une application où vous pouviez trouver quelqu'un pour résoudre n'importe quel type de tâche ou de service ou vous pouviez rechercher des tâches et/ou des services à faire. Elle fonctionnerait en Argentine. Nous avons créé le produit, nous avons développé l'application avec une autre équipe de développement, mais ensuite l'entreprise a fermé à cause d'une erreur d'équipe",
      technologies: ["Figma", "React Native", "Firebase", "Scrum", "Propriétaire du Projet"],
    },
    de: {
      projectName: "DO",
      description:
        "Es war mein zweites Unternehmen, wir waren ein 3-Personen-Team. Es war eine App, in der man jemanden finden konnte, um jede Art von Aufgabe oder Dienstleistung zu lösen, oder man konnte nach Aufgaben und/oder Dienstleistungen suchen. Es würde in Argentinien laufen. Wir haben das Produkt erstellt, wir haben die Anwendung mit einem anderen Entwicklungsteam entwickelt, aber dann ging das Unternehmen wegen eines Teamfehlers unter",
      technologies: ["Figma", "React Native", "Firebase", "Scrum", "Projektinhaber"],
    },
  },
  2: {
    // System Analyst
    en: {
      projectName: "System Analyst / Functional Consultant",
      description:
        "I was responsible for analyzing and coordinating the flow of information between departments and implementing the club's ERP system, ensuring its integration with various sectors by studying the needs of the organizational system.",
      technologies: ["ERP Systems", "Functional Consulting", "Process Management", "User Training", "Negotiation"],
    },
    es: {
      projectName: "Analista de Sistemas / Consultor Funcional",
      description:
        "Fui responsable de analizar y coordinar el flujo de información entre departamentos e implementar el sistema ERP del club, asegurando su integración con varios sectores mediante el estudio de las necesidades del sistema organizacional.",
      technologies: ["Sistemas ERP", "Consultoría Funcional", "Gestión de Procesos", "Capacitación de Usuarios", "Negociación"],
    },
    it: {
      projectName: "Analista di Sistema / Consulente Funzionale",
      description:
        "Ero responsabile dell'analisi e del coordinamento del flusso di informazioni tra i dipartimenti e dell'implementazione del sistema ERP del club, garantendo la sua integrazione con vari settori studiando le esigenze del sistema organizzativo.",
      technologies: ["Sistemi ERP", "Consulenza Funzionale", "Gestione dei Processi", "Formazione Utenti", "Negoziazione"],
    },
    fr: {
      projectName: "Analyste Système / Consultant Fonctionnel",
      description:
        "J'étais responsable de l'analyse et de la coordination du flux d'informations entre les départements et de la mise en œuvre du système ERP du club, en assurant son intégration avec divers secteurs en étudiant les besoins du système organisationnel.",
      technologies: ["Systèmes ERP", "Conseil Fonctionnel", "Gestion des Processus", "Formation des Utilisateurs", "Négociation"],
    },
    de: {
      projectName: "Systemanalyst / Funktionsberater",
      description:
        "Ich war verantwortlich für die Analyse und Koordination des Informationsflusses zwischen den Abteilungen und die Implementierung des ERP-Systems des Clubs, wobei ich dessen Integration mit verschiedenen Bereichen durch das Studium der Bedürfnisse des Organisationssystems sicherstellte.",
      technologies: ["ERP-Systeme", "Funktionale Beratung", "Prozessmanagement", "Benutzerschulung", "Verhandlung"],
    },
  },
  3: {
    // Front-End Developer
    en: {
      projectName: "Front-End Developer",
      description:
        "I developed different modules like cart, dashboard, prepayment and Context in Next.js, Typescript, using Prisma and PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    es: {
      projectName: "Desarrollador Front-End",
      description:
        "Desarrollé diferentes módulos como carrito, dashboard, prepago y Context en Next.js, Typescript, usando Prisma y PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    it: {
      projectName: "Sviluppatore Front-End",
      description:
        "Ho sviluppato diversi moduli come carrello, dashboard, prepagamento e Context in Next.js, Typescript, utilizzando Prisma e PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    fr: {
      projectName: "Développeur Front-End",
      description:
        "J'ai développé différents modules comme le panier, le tableau de bord, le prépaiement et le Context en Next.js, Typescript, en utilisant Prisma et PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    de: {
      projectName: "Front-End-Entwickler",
      description:
        "Ich habe verschiedene Module wie Warenkorb, Dashboard, Vorauszahlung und Context in Next.js, Typescript entwickelt, wobei ich Prisma und PostgreSQL verwendet habe",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
  },
};

export const experienceTranslations: Record<number, Record<Locale, ProjectTranslation>> = {
  0: {
    // Ceconni's
    en: {
      projectName: "Ceconni's, Berlin, Germany",
      description:
        "I'm working for now as a waiter in a restaurant in Soho House, Berlin, Germany, supporting waitstaff by ensuring fast and efficient table service, keeping service areas stocked and clean, and maintaining a smooth flow between the kitchen and dining areas.",
      technologies: ["Teamwork", "Diverse Languages", "Customer Service", "Adaptability"],
    },
    es: {
      projectName: "Ceconni's, Berlín, Alemania",
      description:
        "Actualmente trabajo como camarero en un restaurante en Soho House, Berlín, Alemania, apoyando al personal de servicio asegurando un servicio de mesa rápido y eficiente, manteniendo las áreas de servicio abastecidas y limpias, y manteniendo un flujo fluido entre la cocina y las áreas de comedor.",
      technologies: ["Trabajo en Equipo", "Idiomas Diversos", "Servicio al Cliente", "Adaptabilidad"],
    },
    it: {
      projectName: "Ceconni's, Berlino, Germania",
      description:
        "Attualmente lavoro come cameriere in un ristorante nella Soho House, Berlino, Germania, supportando il personale di servizio garantendo un servizio al tavolo rapido ed efficiente, mantenendo le aree di servizio rifornite e pulite e mantenendo un flusso regolare tra la cucina e le sale da pranzo.",
      technologies: ["Lavoro di Squadra", "Lingue Diverse", "Servizio Clienti", "Adattabilità"],
    },
    fr: {
      projectName: "Ceconni's, Berlin, Allemagne",
      description:
        "Je travaille actuellement comme serveur dans un restaurant à Soho House, Berlin, Allemagne, en soutenant le personnel de service en assurant un service de table rapide et efficace, en maintenant les zones de service approvisionnées et propres, et en maintenant un flux fluide entre la cuisine et les zones de restauration.",
      technologies: ["Travail d'Équipe", "Langues Diverses", "Service Client", "Adaptabilité"],
    },
    de: {
      projectName: "Ceconni's, Berlin, Deutschland",
      description:
        "Ich arbeite derzeit als Kellner in einem Restaurant im Soho House, Berlin, Deutschland, und unterstütze das Servicepersonal, indem ich einen schnellen und effizienten Tischservice gewährleiste, die Servicebereiche bestückt und sauber halte und einen reibungslosen Ablauf zwischen Küche und Essbereich aufrechterhalte.",
      technologies: ["Teamarbeit", "Verschiedene Sprachen", "Kundenservice", "Anpassungsfähigkeit"],
    },
  },
  1: {
    // Frontend Developer
    en: {
      projectName: "Frontend Developer",
      description:
        "I have experience in full-stack development, where I contributed to the creation of shopping cart, dashboard, prepayment, and context modules for a catering service application with Angel Servers, using Typescript, Next.js, and TailwindCSS for the front-end. For the backend I used Prisma and PostgreSQL. We used CI/CD pipelines with Github Actions for source control workflows and code review processes, which facilitates efficient teamwork in dynamic environments.",
      technologies: ["Teamwork", "CD/CI pipelines", "Typescript", "Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "GitHub Actions", "Problem Solving", "Communication", "Time Management", "Adaptability"],
    },
    es: {
      projectName: "Desarrollador Frontend",
      description:
        "Tengo experiencia en desarrollo full-stack, donde contribuí a la creación de módulos de carrito de compras, dashboard, prepago y contexto para una aplicación de servicio de catering con Angel Servers, usando Typescript, Next.js y TailwindCSS para el front-end. Para el backend utilicé Prisma y PostgreSQL. Usamos pipelines CI/CD con Github Actions para flujos de trabajo de control de fuente y procesos de revisión de código, lo que facilita el trabajo en equipo eficiente en entornos dinámicos.",
      technologies: ["Trabajo en Equipo", "Pipelines CD/CI", "Typescript", "Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "GitHub Actions", "Resolución de Problemas", "Comunicación", "Gestión del Tiempo", "Adaptabilidad"],
    },
    it: {
      projectName: "Sviluppatore Frontend",
      description:
        "Ho esperienza nello sviluppo full-stack, dove ho contribuito alla creazione di moduli carrello, dashboard, prepagamento e contesto per un'applicazione di servizio di catering con Angel Servers, utilizzando Typescript, Next.js e TailwindCSS per il front-end. Per il backend ho usato Prisma e PostgreSQL. Abbiamo utilizzato pipeline CI/CD con Github Actions per flussi di lavoro di controllo del codice sorgente e processi di revisione del codice, che facilitano il lavoro di squadra efficiente in ambienti dinamici.",
      technologies: ["Lavoro di Squadra", "Pipeline CD/CI", "Typescript", "Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "GitHub Actions", "Risoluzione dei Problemi", "Comunicazione", "Gestione del Tempo", "Adattabilità"],
    },
    fr: {
      projectName: "Développeur Frontend",
      description:
        "J'ai de l'expérience en développement full-stack, où j'ai contribué à la création de modules de panier d'achat, de tableau de bord, de prépaiement et de contexte pour une application de service de restauration avec Angel Servers, en utilisant Typescript, Next.js et TailwindCSS pour le front-end. Pour le backend, j'ai utilisé Prisma et PostgreSQL. Nous avons utilisé des pipelines CI/CD avec Github Actions pour les flux de travail de contrôle de source et les processus de révision de code, ce qui facilite le travail d'équipe efficace dans des environnements dynamiques.",
      technologies: ["Travail d'Équipe", "Pipelines CD/CI", "Typescript", "Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "GitHub Actions", "Résolution de Problèmes", "Communication", "Gestion du Temps", "Adaptabilité"],
    },
    de: {
      projectName: "Frontend-Entwickler",
      description:
        "Ich habe Erfahrung in der Full-Stack-Entwicklung, wo ich zur Erstellung von Einkaufswagen-, Dashboard-, Vorauszahlungs- und Kontextmodulen für eine Catering-Service-Anwendung mit Angel Servers beigetragen habe, wobei ich Typescript, Next.js und TailwindCSS für das Front-End verwendete. Für das Backend habe ich Prisma und PostgreSQL verwendet. Wir haben CI/CD-Pipelines mit Github Actions für Quellcodeverwaltungsworkflows und Code-Review-Prozesse verwendet, was eine effiziente Teamarbeit in dynamischen Umgebungen erleichtert.",
      technologies: ["Teamarbeit", "CD/CI-Pipelines", "Typescript", "Next.js", "Prisma", "PostgreSQL", "TailwindCSS", "GitHub Actions", "Problemlösung", "Kommunikation", "Zeitmanagement", "Anpassungsfähigkeit"],
    },
  },
  2: {
    // System Analyst (duplicate from projects)
    en: {
      projectName: "System Analyst / Functional Consultant",
      description:
        "I was responsible for analyzing and coordinating the flow of information between departments and implementing the club's ERP system, ensuring its integration with various sectors by studying the needs of the organizational system.",
      technologies: ["ERP Systems", "Functional Consulting", "Process Management", "User Training", "Negotiation"],
    },
    es: {
      projectName: "Analista de Sistemas / Consultor Funcional",
      description:
        "Fui responsable de analizar y coordinar el flujo de información entre departamentos e implementar el sistema ERP del club, asegurando su integración con varios sectores mediante el estudio de las necesidades del sistema organizacional.",
      technologies: ["Sistemas ERP", "Consultoría Funcional", "Gestión de Procesos", "Capacitación de Usuarios", "Negociación"],
    },
    it: {
      projectName: "Analista di Sistema / Consulente Funzionale",
      description:
        "Ero responsabile dell'analisi e del coordinamento del flusso di informazioni tra i dipartimenti e dell'implementazione del sistema ERP del club, garantendo la sua integrazione con vari settori studiando le esigenze del sistema organizzativo.",
      technologies: ["Sistemi ERP", "Consulenza Funzionale", "Gestione dei Processi", "Formazione Utenti", "Negoziazione"],
    },
    fr: {
      projectName: "Analyste Système / Consultant Fonctionnel",
      description:
        "J'étais responsable de l'analyse et de la coordination du flux d'informations entre les départements et de la mise en œuvre du système ERP du club, en assurant son intégration avec divers secteurs en étudiant les besoins du système organisationnel.",
      technologies: ["Systèmes ERP", "Conseil Fonctionnel", "Gestion des Processus", "Formation des Utilisateurs", "Négociation"],
    },
    de: {
      projectName: "Systemanalyst / Funktionsberater",
      description:
        "Ich war verantwortlich für die Analyse und Koordination des Informationsflusses zwischen den Abteilungen und die Implementierung des ERP-Systems des Clubs, wobei ich dessen Integration mit verschiedenen Bereichen durch das Studium der Bedürfnisse des Organisationssystems sicherstellte.",
      technologies: ["ERP-Systeme", "Funktionale Beratung", "Prozessmanagement", "Benutzerschulung", "Verhandlung"],
    },
  },
  3: {
    // DO (duplicate)
    en: {
      projectName: "DO",
      description:
        "I founded and led a digital startup from scratch, together with two friends who were also passionate about entrepreneurship. We developed an app to connect users with tasks and services in Argentina. I was responsible for ideation, product validation, team formation, and development supervision. Although the project didn't launch due to a negative experience with the developer who built the app, the experience taught me the importance of risk management, code ownership, legal contracts, and milestone-based payments. Today, I apply all of these lessons in my new projects.",
      technologies: ["Product Management", "React Native", "Firebase", "Scrum", "Project Owner"],
    },
    es: {
      projectName: "DO",
      description:
        "Fundé y lideré una startup digital desde cero, junto con dos amigos que también eran apasionados por el emprendimiento. Desarrollamos una aplicación para conectar usuarios con tareas y servicios en Argentina. Fui responsable de la ideación, validación del producto, formación del equipo y supervisión del desarrollo. Aunque el proyecto no se lanzó debido a una experiencia negativa con el desarrollador que construyó la aplicación, la experiencia me enseñó la importancia de la gestión de riesgos, la propiedad del código, los contratos legales y los pagos basados en hitos. Hoy, aplico todas estas lecciones en mis nuevos proyectos.",
      technologies: ["Gestión de Productos", "React Native", "Firebase", "Scrum", "Dueño del Proyecto"],
    },
    it: {
      projectName: "DO",
      description:
        "Ho fondato e guidato una startup digitale da zero, insieme a due amici che erano anche appassionati di imprenditorialità. Abbiamo sviluppato un'app per connettere gli utenti con compiti e servizi in Argentina. Ero responsabile dell'ideazione, della validazione del prodotto, della formazione del team e della supervisione dello sviluppo. Sebbene il progetto non sia stato lanciato a causa di un'esperienza negativa con lo sviluppatore che ha costruito l'app, l'esperienza mi ha insegnato l'importanza della gestione del rischio, della proprietà del codice, dei contratti legali e dei pagamenti basati su milestone. Oggi applico tutte queste lezioni nei miei nuovi progetti.",
      technologies: ["Gestione del Prodotto", "React Native", "Firebase", "Scrum", "Proprietario del Progetto"],
    },
    fr: {
      projectName: "DO",
      description:
        "J'ai fondé et dirigé une startup numérique à partir de zéro, avec deux amis également passionnés par l'entrepreneuriat. Nous avons développé une application pour connecter les utilisateurs avec des tâches et des services en Argentine. J'étais responsable de l'idéation, de la validation du produit, de la formation de l'équipe et de la supervision du développement. Bien que le projet n'ait pas été lancé en raison d'une expérience négative avec le développeur qui a construit l'application, l'expérience m'a appris l'importance de la gestion des risques, de la propriété du code, des contrats juridiques et des paiements basés sur les jalons. Aujourd'hui, j'applique toutes ces leçons dans mes nouveaux projets.",
      technologies: ["Gestion de Produit", "React Native", "Firebase", "Scrum", "Propriétaire du Projet"],
    },
    de: {
      projectName: "DO",
      description:
        "Ich habe ein digitales Startup von Grund auf gegründet und geleitet, zusammen mit zwei Freunden, die ebenfalls leidenschaftlich an Unternehmertum interessiert waren. Wir haben eine App entwickelt, um Benutzer mit Aufgaben und Dienstleistungen in Argentinien zu verbinden. Ich war verantwortlich für Ideenfindung, Produktvalidierung, Teambildung und Entwicklungsüberwachung. Obwohl das Projekt aufgrund einer negativen Erfahrung mit dem Entwickler, der die App gebaut hat, nicht gestartet wurde, hat mir die Erfahrung die Bedeutung von Risikomanagement, Code-Eigentum, rechtlichen Verträgen und meilensteinbasierten Zahlungen beigebracht. Heute wende ich all diese Lektionen in meinen neuen Projekten an.",
      technologies: ["Produktmanagement", "React Native", "Firebase", "Scrum", "Projektinhaber"],
    },
  },
  4: {
    // Front-End developer project (duplicate)
    en: {
      projectName: "Front-End developer project",
      description:
        "I developed different modules like cart, dashboard, prepayment and Context in Next.js, Typescript, using Prisma and PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    es: {
      projectName: "Proyecto de desarrollador Front-End",
      description:
        "Desarrollé diferentes módulos como carrito, dashboard, prepago y Context en Next.js, Typescript, usando Prisma y PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    it: {
      projectName: "Progetto sviluppatore Front-End",
      description:
        "Ho sviluppato diversi moduli come carrello, dashboard, prepagamento e Context in Next.js, Typescript, utilizzando Prisma e PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    fr: {
      projectName: "Projet de développeur Front-End",
      description:
        "J'ai développé différents modules comme le panier, le tableau de bord, le prépaiement et le Context en Next.js, Typescript, en utilisant Prisma et PostgreSQL",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
    de: {
      projectName: "Front-End-Entwicklerprojekt",
      description:
        "Ich habe verschiedene Module wie Warenkorb, Dashboard, Vorauszahlung und Context in Next.js, Typescript entwickelt, wobei ich Prisma und PostgreSQL verwendet habe",
      technologies: ["Next.js", "TypeScript", "TailwindCSS", "PostgreSQL", "Prisma", "Sendgrid", "GitHub Actions"],
    },
  },
};

export const certificatesTranslations: Record<number, Record<Locale, CertificateTranslation>> = {
  1: {
    en: {
      title: "Coderhouse Certificate",
      issuer: "Coderhouse",
    },
    es: {
      title: "Certificado Coderhouse",
      issuer: "Coderhouse",
    },
    it: {
      title: "Certificato Coderhouse",
      issuer: "Coderhouse",
    },
    fr: {
      title: "Certificat Coderhouse",
      issuer: "Coderhouse",
    },
    de: {
      title: "Coderhouse-Zertifikat",
      issuer: "Coderhouse",
    },
  },
  2: {
    en: {
      title: "AI for Data Analysis",
      issuer: "Udemy",
    },
    es: {
      title: "IA para análisis de datos",
      issuer: "Udemy",
    },
    it: {
      title: "IA per l'analisi dei dati",
      issuer: "Udemy",
    },
    fr: {
      title: "IA pour l'analyse de données",
      issuer: "Udemy",
    },
    de: {
      title: "KI für Datenanalyse",
      issuer: "Udemy",
    },
  },
  3: {
    en: {
      title: "JavaScript",
      issuer: "Argentina Programa",
    },
    es: {
      title: "JavaScript",
      issuer: "Argentina Programa",
    },
    it: {
      title: "JavaScript",
      issuer: "Argentina Programa",
    },
    fr: {
      title: "JavaScript",
      issuer: "Argentina Programa",
    },
    de: {
      title: "JavaScript",
      issuer: "Argentina Programa",
    },
  },
  4: {
    en: {
      title: "EF SET English Certificate C1 Advanced",
      issuer: "EF Standard English Test",
    },
    es: {
      title: "Certificado de Inglés EF SET C1 Avanzado",
      issuer: "EF Standard English Test",
    },
    it: {
      title: "Certificato di Inglese EF SET C1 Avanzato",
      issuer: "EF Standard English Test",
    },
    fr: {
      title: "Certificat d'Anglais EF SET C1 Avancé",
      issuer: "EF Standard English Test",
    },
    de: {
      title: "EF SET Englisch-Zertifikat C1 Fortgeschritten",
      issuer: "EF Standard English Test",
    },
  },
};
