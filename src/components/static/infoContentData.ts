export interface StaticInfoContent {
  lang: 'en' | 'ca' | 'es';
  locale: string;
  meta: {
    title: string;
    description: string;
    ogTitle: string;
    ogDescription: string;
    twitterTitle: string;
    twitterDescription: string;
  };
  schema: {
    webpageName: string;
    webpageDescription: string;
    conditionName: string;
    alternateNames: string[];
    howtoName: string;
    howtoDescription: string;
    supplyName: string;
  };
  header: {
    appName: string;
    appTagline: string;
    launchToolText: string;
  };
  hero: {
    badge: string;
    title: string;
    lead: string;
    keyPoints: Array<{ label: string; value: string }>;
  };
  toolCallout: {
    title: string;
    description: string;
    buttonText: string;
    featurePoints: string[];
  };
  warning: {
    disclaimerTitle: string;
    disclaimerText: string;
    title: string;
    intro: string;
    bullets: string[];
  };
  bppvSection: {
    title: string;
    p1: string;
    p2: string;
  };
  methodSection: {
    title: string;
    p1: string;
    p2: string;
    indicationTitle: string;
    indicationText: string;
  };
  stepsSection: {
    title: string;
    intro: string;
    steps: Array<{
      number: number;
      title: string;
      duration: string;
      text: string;
      note?: string;
    }>;
  };
  protocolSection: {
    title: string;
    recommendedLabel: string;
    recommendedText: string;
    managementLabel: string;
    managementText: string;
    tipsLabel: string;
    tips: string[];
  };
  footer: {
    appLink: string;
    llmsLink: string;
    githubLink: string;
  };
}

export const staticInfoContents: Record<'en' | 'ca' | 'es', StaticInfoContent> = {
  ca: {
    lang: 'ca',
    locale: 'ca_ES',
    meta: {
      title: 'Brandt-Daroff — Aplicació gratuïta per a exercicis de vertigen',
      description:
        'Aplicació web gratuïta per guiar els exercicis de Brandt-Daroff a casa. Temporitzador visual, avisos sonors i seguiment de sessions per al VPPB.',
      ogTitle: 'Brandt-Daroff — Aplicació gratuïta per a exercicis de vertigen',
      ogDescription:
        'Una aplicació senzilla i privada per fer els exercicis de Brandt-Daroff sense haver de mirar el rellotge mentre et mous.',
      twitterTitle: 'Brandt-Daroff — Aplicació per a exercicis de vertigen',
      twitterDescription:
        'Temporitzador gratuït per guiar els exercicis de Brandt-Daroff a casa.',
    },
    schema: {
      webpageName: 'Brandt-Daroff — Aplicació per a exercicis de vertigen',
      webpageDescription:
        'Aplicació gratuïta per guiar pas a pas els exercicis de Brandt-Daroff per al VPPB.',
      conditionName: 'Vertigen Posicional Paroxístic Benigne',
      alternateNames: ['VPPB', 'BPPV'],
      howtoName: 'Com utilitzar l’aplicació per fer els exercicis Brandt-Daroff',
      howtoDescription:
        'Seqüència de 5 posicions guiada per l’aplicació amb temporitzadors de 30 segons i descansos de 2 minuts.',
      supplyName: 'Llit o superfície plana ferma',
    },
    header: {
      appName: 'Brandt-Daroff',
      appTagline: 'Temporitzador per als teus exercicis',
      launchToolText: 'Obrir l’aplicació',
    },
    hero: {
      badge: 'App web d’ajuda · Gratuïta i privada',
      title: 'Una aplicació senzilla per guiar els teus exercicis de Brandt-Daroff',
      lead:
        'Quan tens vertigen, comptar segons o mirar el rellotge mentre et mous pel llit és incòmode i complicat. Aquesta eina gratuïta t’acompanya pas a pas amb senyals visuals, so i vibració perquè et concentris només a fer els exercicis.',
      keyPoints: [
        { label: 'Sense anuncis ni registre', value: '100% gratuïta i privada' },
        { label: 'Avisos sensorials', value: 'So i vibració amb els ulls tancats' },
        { label: 'Funciona offline', value: 'Instal·lable al mòbil (PWA)' },
      ],
    },
    toolCallout: {
      title: 'Comença la teva sessió directament des del navegador',
      description:
        'Sense descàrregues obligatòries a botigues d’apps ni registres: obre l’aplicació i comença el teu cicle en qualsevol moment.',
      buttonText: 'Obrir l’aplicació i començar →',
      featurePoints: [
        'Comptador visual gran i d’alt contrast, fàcil de veure des del llit',
        'Avisos de so i vibració per saber quan canviar de postura sense obrir els ulls',
        'Guarda el teu progrés diari al teu dispositiu, sense enviar dades a cap servidor',
      ],
    },
    warning: {
      disclaimerTitle: 'Avís: Aquesta aplicació és una eina d’ajuda, no un metge',
      disclaimerText:
        'Aquesta aplicació és un projecte independent pensat per ajudar-te a temporitzar les postures a casa. L’autor no és metge ni professional sanitari, i aquesta aplicació no és un dispositiu mèdic ni ofereix diagnòstics. Utilitza-la únicament si un professional de la salut t’ha diagnosticat prèviament VPPB i t’ha recomanat aquests exercicis. L’ús d’aquesta eina és sota la teva pròpia responsabilitat.',
      title: 'Senyals d’alerta: Atura l’aplicació i demana ajuda mèdica urgent si notes:',
      intro:
        'El mareig giratori passatger durant el moviment és habitual en el VPPB. Però si en algun moment apareix algun d’aquests símptomes diferents, atura els exercicis immediatament i vés a urgències:',
      bullets: [
        'Pèrdua sobtada de força a la cara, braç o cama.',
        'Adormiment o pèrdua de sensibilitat a una meitat del cos.',
        'Visió doble, pèrdua sobtada de visió o visió borrosa greu.',
        'Dificultat per parlar o per empassar.',
        'Pèrdua sobtada d’equilibri que t’impedeixi mantenir-te dret.',
      ],
    },
    bppvSection: {
      title: 'Què és el VPPB i per a què serveixen aquests exercicis?',
      p1:
        'El Vertigen Posicional Paroxístic Benigne (VPPB) és la causa més freqüent de vertigen. Es produeix quan petites partícules de carbonat càlcic (otòlits) es desprenen a l’orella interna i entren als canals semicirculars, provocant una sensació sobtada de gir en moure el cap.',
      p2:
        'Els exercicis de Brandt-Daroff consisteixen a alternar caigudes laterals del cos per ajudar a moure aquestes partícules cap a zones no reactives i afavorir que el cervell s’habitui al moviment.',
    },
    methodSection: {
      title: 'Com t’ajuda l’aplicació durant els exercicis?',
      p1:
        'En fer els exercicis de Brandt-Daroff és molt habitual notar mareig agut en canviar de costat. Mirar la pantalla d’un telèfon o comptar mentalment 30 segons mentre tot gira és desagradable i pot augmentar la sensació d’inestabilitat.',
      p2:
        'L’aplicació s’encarrega de mesurar el temps per tu: t’avisa automàticament amb un so suau i una vibració quan passen els 30 segons de cada posició i quan finalitzen els 2 minuts de descans entre cicles. Així pots tancar els ulls i esperar que passi el mareig amb calma.',
      indicationTitle: 'Quan utilitzar l’aplicació?',
      indicationText:
        'Utilitza l’aplicació quan el teu metge, otorinolaringòleg o fisioterapeuta t’hagi recomanat fer les sessions de Brandt-Daroff a casa com a part del teu procés de recuperació.',
    },
    stepsSection: {
      title: 'Les 5 posicions que guia l’aplicació',
      intro:
        'L’aplicació estructura cada sessió en cicles de 5 posicions, marcant amb precisió els 30 segons de cada postura i els 2 minuts de descans final:',
      steps: [
        {
          number: 1,
          title: 'Posició d’inici: Assegut a la vora del llit',
          duration: 'Posició inicial de transició',
          text: 'Seieu al mig de la vora del llit amb l’esquena recta i els peus penjant. Prem el botó gran per començar quan estiguis a punt.',
          note: 'L’aplicació t’esperarà fins que premis el botó per iniciar la primera caiguda lateral.',
        },
        {
          number: 2,
          title: 'Tombat al costat dret amb el cap girat 45° amunt',
          duration: '30 segons guiats',
          text: 'Deixa’t caure de costat sobre el flanc dret mentre gires el cap 45 graus cap amunt. L’aplicació començarà a comptar 30 segons i t’avisarà amb un xiulet i vibració en acabar.',
          note: 'Si el mareig passa abans, pots prémer "El mareig ja ha passat" a l’aplicació per avançar.',
        },
        {
          number: 3,
          title: 'Tornar a la posició asseguda (Descans intermedi)',
          duration: '30 segons de descans',
          text: 'Incorpora’t suaument i seu de nou a la vora del llit. L’aplicació comptabilitza 30 segons de repòs abans de passar a l’altre costat.',
          note: 'Aquest descans permet que el líquid de l’orella interna es calmi abans del següent moviment.',
        },
        {
          number: 4,
          title: 'Tombat al costat esquerre amb el cap girat 45° amunt',
          duration: '30 segons guiats',
          text: 'Deixa’t caure sobre el costat esquerre amb el cap orientat 45 graus cap amunt. L’aplicació compta els 30 segons i t’avisa quan s’acaba el temps.',
          note: 'Encara que el mareig es noti només en una orella, la rutina requereix alternar sempre els dos costats.',
        },
        {
          number: 5,
          title: 'Descans entre cicles',
          duration: '2 minuts de descans',
          text: 'Torna a la posició asseguda. L’aplicació començarà un compte enrere de 2 minuts complets de repòs abans d’iniciar el cicle següent.',
          note: 'No tinguis pressa: aquest descans de 2 minuts ajuda a evitar nàusees i fatiga.',
        },
      ],
    },
    protocolSection: {
      title: 'Consells per fer les sessions amb comoditat a casa',
      recommendedLabel: 'Pauta freqüent recomanada per especialistes:',
      recommendedText:
        'La pauta clàssica sol ser de 3 sessions al dia (5 cicles cadascuna) fins que passis 2 dies seguits sense notar mareig en cap de les posicions.',
      managementLabel: 'Si et mareges durant la sessió:',
      managementText:
        'El mareig durant les primeres sessions és normal: indica que les partícules estan reaccionant al moviment. Pots utilitzar el botó de pausa si necessites més temps.',
      tipsLabel: 'Consells pràctics d’ús de l’aplicació:',
      tips: [
        'Col·loca el mòbil a la tauleta de nit amb volum suficient per no haver de mirar la pantalla si estàs marejat.',
        'Fes els canvis de postura amb decisió però sense sacsejades brusques al coll.',
        'Si tens nàusees intenses, utilitza el botó de pausa de l’aplicació i allarga el descans assegut.',
        'Pots instal·lar l’aplicació al teu mòbil (afegir a la pantalla d’inici) per tenir-la sempre a mà sense necessitat de connexió.',
      ],
    },
    footer: {
      appLink: 'Temporitzador interactiu de sessions',
      llmsLink: 'Documentació tècnica per a models d’IA (llms.txt)',
      githubLink: 'Projecte de codi obert a GitHub',
    },
  },
  es: {
    lang: 'es',
    locale: 'es_ES',
    meta: {
      title: 'Brandt-Daroff — Aplicación gratuita para ejercicios de vértigo',
      description:
        'Aplicación web gratuita para guiar los ejercicios de Brandt-Daroff en casa. Temporizador visual, avisos sonoros y seguimiento de sesiones para el VPPB.',
      ogTitle: 'Brandt-Daroff — Aplicación gratuita para ejercicios de vértigo',
      ogDescription:
        'Una aplicación sencilla y privada para realizar los ejercicios de Brandt-Daroff sin tener que mirar el reloj mientras te mueves.',
      twitterTitle: 'Brandt-Daroff — Aplicación para ejercicios de vértigo',
      twitterDescription:
        'Temporizador gratuito para guiar los ejercicios de Brandt-Daroff en casa.',
    },
    schema: {
      webpageName: 'Brandt-Daroff — Aplicación para ejercicios de vértigo',
      webpageDescription:
        'Aplicación gratuita para guiar paso a paso los ejercicios de Brandt-Daroff para el VPPB.',
      conditionName: 'Vértigo Posicional Paroxístico Benigno',
      alternateNames: ['VPPB', 'BPPV'],
      howtoName: 'Cómo usar la aplicación para realizar los ejercicios de Brandt-Daroff',
      howtoDescription:
        'Secuencia de 5 posiciones guiada por la aplicación con temporizadores de 30 segundos y descansos de 2 minutos.',
      supplyName: 'Cama o superficie plana firme',
    },
    header: {
      appName: 'Brandt-Daroff',
      appTagline: 'Temporizador para tus ejercicios',
      launchToolText: 'Abrir la aplicación',
    },
    hero: {
      badge: 'App web de ayuda · Gratuita y privada',
      title: 'Una aplicación sencilla para guiar tus ejercicios de Brandt-Daroff',
      lead:
        'Cuando tienes vértigo, contar segundos o mirar el reloj mientras te mueves por la cama es incómodo y complicado. Esta herramienta gratuita te acompaña paso a paso con señales visuales, sonido y vibración para que puedas concentrarte solo en hacer los ejercicios.',
      keyPoints: [
        { label: 'Sin anuncios ni registro', value: '100% gratuita y privada' },
        { label: 'Avisos sensoriales', value: 'Sonido y vibración con ojos cerrados' },
        { label: 'Funciona sin conexión', value: 'Instalable en el móvil (PWA)' },
      ],
    },
    toolCallout: {
      title: 'Comienza tu sesión directamente desde el navegador',
      description:
        'Sin descargas obligatorias en tiendas de apps ni registros: abre la aplicación y empieza tu ciclo en cualquier momento.',
      buttonText: 'Abrir la aplicación y comenzar →',
      featurePoints: [
        'Contador visual grande y de alto contraste, fácil de ver desde la cama',
        'Avisos de sonido y vibración para saber cuándo cambiar de postura sin abrir los ojos',
        'Guarda tu progreso diario en tu dispositivo, sin enviar datos a ningún servidor',
      ],
    },
    warning: {
      disclaimerTitle: 'Aviso: Esta aplicación es una herramienta de ayuda, no un médico',
      disclaimerText:
        'Esta aplicación es un proyecto independiente pensado para ayudarte a temporizar las posturas en casa. El autor no es médico ni profesional sanitario, y esta aplicación no es un dispositivo médico ni ofrece diagnósticos. Utilízala únicamente si un profesional de la salud te ha diagnosticado previamente VPPB y te ha recomendado estos ejercicios. El uso de esta herramienta es bajo tu propia responsabilidad.',
      title: 'Señales de alarma: Detén la aplicación y busca ayuda médica urgente si notas:',
      intro:
        'El mareo giratorio pasajero durante el movimiento es habitual en el VPPB. Pero si en algún momento aparece alguno de estos síntomas diferentes, detén los ejercicios de inmediato y acude a urgencias:',
      bullets: [
        'Pérdida repentina de fuerza en la cara, brazo o pierna.',
        'Entumecimiento o pérdida de sensibilidad en una mitad del cuerpo.',
        'Visión doble, pérdida repentina de visión o visión borrosa grave.',
        'Dificultad para hablar o para tragar.',
        'Pérdida repentina de equilibrio que te impida mantenerte en pie.',
      ],
    },
    bppvSection: {
      title: '¿Qué es el VPPB y para qué sirven estos ejercicios?',
      p1:
        'El Vértigo Posicional Paroxístico Benigno (VPPB) es la causa más común de vértigo. Ocurre cuando pequeñas partículas de carbonato cálcico (otolitos) se desprenden en el oído interno y entran en los canales semicirculares, provocando una sensación brusca de giro al mover la cabeza.',
      p2:
        'Los ejercicios de Brandt-Daroff consisten en alternar caídas laterales del cuerpo para ayudar a mover esas partículas hacia zonas no reactivas y favorecer que el cerebro se habitúe al movimiento.',
    },
    methodSection: {
      title: '¿Cómo te ayuda la aplicación durante los ejercicios?',
      p1:
        'Al realizar los ejercicios de Brandt-Daroff es muy habitual notar mareo agudo al cambiar de lado. Mirar la pantalla de un teléfono o contar mentalmente 30 segundos mientras todo gira resulta desagradable y puede aumentar la inestabilidad.',
      p2:
        'La aplicación se encarga de medir el tiempo por ti: te avisa automáticamente con un sonido suave y una vibración al cumplirse los 30 segundos de cada posición y al finalizar los 2 minutos de descanso entre ciclos. Así puedes cerrar los ojos y esperar a que pase el mareo con calma.',
      indicationTitle: '¿Cuándo utilizar la aplicación?',
      indicationText:
        'Utiliza la aplicación cuando tu médico, otorrinolaringólogo o fisioterapeuta te haya recomendado hacer las sesiones de Brandt-Daroff en casa como parte de tu recuperación.',
    },
    stepsSection: {
      title: 'Las 5 posiciones que guía la aplicación',
      intro:
        'La aplicación estructura cada sesión en ciclos de 5 posiciones, marcando con precisión los 30 segundos de cada postura y los 2 minutos de descanso final:',
      steps: [
        {
          number: 1,
          title: 'Posición de inicio: Sentado al borde de la cama',
          duration: 'Posición inicial de transición',
          text: 'Siéntate en el centro del borde de la cama con la espalda recta y los pies colgando. Pulsa el botón grande para comenzar cuando estés listo.',
          note: 'La aplicación te esperará hasta que pulses el botón para iniciar la primera caída lateral.',
        },
        {
          number: 2,
          title: 'Tumbado sobre el lado derecho con cabeza girada 45° arriba',
          duration: '30 segundos guiados',
          text: 'Déjate caer de lado sobre el flanco derecho mientras giras la cabeza 45 grados hacia arriba. La aplicación empezará a contar 30 segundos y te avisará con un pitido y vibración al terminar.',
          note: 'Si el mareo pasa antes, puedes pulsar "El mareo ya ha pasado" en la aplicación para avanzar.',
        },
        {
          number: 3,
          title: 'Volver a la posición sentada (Descanso intermedio)',
          duration: '30 segundos de descanso',
          text: 'Incorpórate suavemente y siéntate de nuevo al borde de la cama. La aplicación contabiliza 30 segundos de reposo antes de pasar al otro lado.',
          note: 'Este descanso permite que el líquido del oído interno se estabilice antes del siguiente movimiento.',
        },
        {
          number: 4,
          title: 'Tumbado sobre el lado izquierdo con cabeza girada 45° arriba',
          duration: '30 segundos guiados',
          text: 'Déjate caer sobre el lado izquierdo con la cabeza orientada 45 grados hacia arriba. La aplicación cuenta los 30 segundos y te avisa al terminar el tiempo.',
          note: 'Aunque el mareo se note solo en un oído, la rutina requiere alternar siempre ambos lados.',
        },
        {
          number: 5,
          title: 'Descanso entre ciclos',
          duration: '2 minutos de descanso',
          text: 'Vuelve a la posición sentada. La aplicación iniciará una cuenta atrás de 2 minutos completos de reposo antes de empezar el siguiente ciclo.',
          note: 'No tengas prisa: este descanso de 2 minutos ayuda a evitar náuseas y fatiga.',
        },
      ],
    },
    protocolSection: {
      title: 'Consejos para hacer las sesiones cómodamente en casa',
      recommendedLabel: 'Pauta frecuente recomendada por especialistas:',
      recommendedText:
        'La pauta clásica suele ser de 3 sesiones al día (5 ciclos cada una) hasta pasar 2 días seguidos sin notar mareo en ninguna de las posiciones.',
      managementLabel: 'Si te mareas durante la sesión:',
      managementText:
        'El mareo durante las primeras sesiones es normal: indica que las partículas están reaccionando al movimiento. Puedes usar el botón de pausa si necesitas más tiempo.',
      tipsLabel: 'Consejos prácticos de uso de la aplicación:',
      tips: [
        'Coloca el móvil en la mesilla de noche con volumen suficiente para no tener que mirar la pantalla si estás mareado.',
        'Haz los cambios de postura con decisión pero sin sacudidas bruscas en el cuello.',
        'Si sientes náuseas intensas, pulsa el botón de pausa de la aplicación y prolonga el descanso sentado.',
        'Puedes instalar la aplicación en tu móvil (añadir a la pantalla de inicio) para tenerla siempre a mano sin conexión.',
      ],
    },
    footer: {
      appLink: 'Temporizador interactivo de sesiones',
      llmsLink: 'Documentación técnica para modelos de IA (llms.txt)',
      githubLink: 'Proyecto de código abierto en GitHub',
    },
  },
  en: {
    lang: 'en',
    locale: 'en',
    meta: {
      title: 'Brandt-Daroff — Free Helper App for Vertigo Exercises',
      description:
        'Free web app to guide Brandt-Daroff exercises at home. Visual timer, sound cues, and session tracking for BPPV relief.',
      ogTitle: 'Brandt-Daroff — Free Helper App for Vertigo Exercises',
      ogDescription:
        'A simple and private app to perform Brandt-Daroff exercises without watching the clock while moving in bed.',
      twitterTitle: 'Brandt-Daroff — Vertigo Exercise Helper App',
      twitterDescription:
        'Free timer and guide for Brandt-Daroff exercises at home.',
    },
    schema: {
      webpageName: 'Brandt-Daroff — Vertigo Exercise Helper App',
      webpageDescription:
        'Free app to guide Brandt-Daroff exercises step by step for BPPV.',
      conditionName: 'Benign Paroxysmal Positional Vertigo',
      alternateNames: ['BPPV', 'VPPB'],
      howtoName: 'How to use the app to perform Brandt-Daroff exercises',
      howtoDescription:
        'App-guided 5-position sequence with 30-second position timers and 2-minute rests.',
      supplyName: 'Bed or firm flat surface',
    },
    header: {
      appName: 'Brandt-Daroff',
      appTagline: 'Timer for your vertigo exercises',
      launchToolText: 'Open the app',
    },
    hero: {
      badge: 'Helper Web App · Free and Private',
      title: 'A simple helper app to guide your Brandt-Daroff exercises',
      lead:
        'When you have vertigo, counting seconds or staring at a clock while moving on your bed is difficult and disorienting. This free helper app guides you step by step with clear visuals, gentle sounds, and vibrations so you can focus solely on your exercises with your eyes closed.',
      keyPoints: [
        { label: 'No ads or signup', value: '100% free and private' },
        { label: 'Sensory cues', value: 'Sound and vibration with eyes closed' },
        { label: 'Works offline', value: 'Installable on mobile (PWA)' },
      ],
    },
    toolCallout: {
      title: 'Start your session right from your browser',
      description:
        'No required app store downloads or registrations: open the app and start your exercise cycle anytime.',
      buttonText: 'Open the app and start →',
      featurePoints: [
        'Large high-contrast visual timer, easy to read from your bed',
        'Audio and vibration cues so you know when to change position without opening your eyes',
        'Saves daily progress on your device without sending any data to a server',
      ],
    },
    warning: {
      disclaimerTitle: 'Disclaimer: This app is a helper tool, not a doctor',
      disclaimerText:
        'This app is an independent helper tool designed to time positions at home. The author is not a doctor or medical professional, and this app is not a medical device and provides no medical diagnosis. Only use this app if a qualified healthcare professional has already diagnosed you with BPPV and recommended these exercises. Use of this tool is entirely at your own risk.',
      title: 'Red Flag Symptoms: Stop the app and seek emergency medical care if you notice:',
      intro:
        'Brief spinning sensations during movement are common in BPPV. However, if any of the following different symptoms appear at any time, stop exercising immediately and seek emergency medical attention:',
      bullets: [
        'Sudden weakness or drooping in the face, arm, or leg.',
        'Numbness or loss of sensation on one side of the body.',
        'Double vision, sudden loss of vision, or severe blurring.',
        'Difficulty speaking or slurred speech, or trouble swallowing.',
        'Sudden, severe loss of balance making it impossible to stand upright.',
      ],
    },
    bppvSection: {
      title: 'What is BPPV and what are these exercises for?',
      p1:
        'Benign Paroxysmal Positional Vertigo (BPPV) is the most common cause of vertigo. It occurs when microscopic calcium carbonate crystals (otoliths) become dislodged in the inner ear and drift into the semicircular canals, triggering a sudden sensation of spinning when moving your head.',
      p2:
        'Brandt-Daroff exercises involve alternating lateral body drops to help disperse these particles toward non-reactive areas and help the brain habituate to the movement.',
    },
    methodSection: {
      title: 'How does the app help you during the exercises?',
      p1:
        'When doing Brandt-Daroff exercises, it is very common to experience acute dizziness when changing sides. Staring at a phone screen or mentally counting 30 seconds while everything is spinning is unpleasant and can worsen disorientation.',
      p2:
        'The app takes care of timing for you: it alerts you automatically with gentle sounds and vibrations when the 30 seconds for each position end, and when the 2-minute rest between cycles is complete. You can comfortably close your eyes and wait for dizziness to subside.',
      indicationTitle: 'When should you use the app?',
      indicationText:
        'Use the app when your doctor, ENT specialist, or physical therapist has recommended performing Brandt-Daroff sessions at home as part of your recovery.',
    },
    stepsSection: {
      title: 'The 5 positions guided by the app',
      intro:
        'The app structures every session into cycles of 5 positions, accurately timing each 30-second posture and the final 2-minute rest:',
      steps: [
        {
          number: 1,
          title: 'Starting Position: Sitting on the bed edge',
          duration: 'Initial transition position',
          text: 'Sit upright in the middle of the bed edge with your feet hanging down. Tap the big start button when you are ready.',
          note: 'The app waits for you to tap start before beginning the first lateral drop.',
        },
        {
          number: 2,
          title: 'Lie on right side with head turned 45° upward',
          duration: '30 seconds guided',
          text: 'Drop onto your right side while turning your head 45 degrees upward. The app counts down 30 seconds and alerts you with a beep and vibration when done.',
          note: 'If dizziness stops earlier, you can tap "Dizziness has passed" in the app to proceed.',
        },
        {
          number: 3,
          title: 'Return to seated position (Mid-cycle rest)',
          duration: '30 seconds rest',
          text: 'Gently sit back up on the edge of the bed. The app counts 30 seconds of rest before moving to the opposite side.',
          note: 'This pause allows the fluid in your inner ear to settle before the next movement.',
        },
        {
          number: 4,
          title: 'Lie on left side with head turned 45° upward',
          duration: '30 seconds guided',
          text: 'Drop onto your left side with your head turned 45 degrees upward. The app counts 30 seconds and signals when time is up.',
          note: 'Even if vertigo is only felt on one side, the routine always requires alternating both sides.',
        },
        {
          number: 5,
          title: 'Rest between cycles',
          duration: '2 minutes rest',
          text: 'Return to the upright seated position. The app starts a full 2-minute countdown before starting the next cycle.',
          note: 'Take your time: this 2-minute rest helps prevent nausea and fatigue.',
        },
      ],
    },
    protocolSection: {
      title: 'Tips for comfortable home sessions',
      recommendedLabel: 'Common schedule recommended by specialists:',
      recommendedText:
        'The typical schedule is 3 sessions per day (5 cycles each) until you go 2 consecutive days without dizziness in any of the positions.',
      managementLabel: 'If you feel dizzy during the session:',
      managementText:
        'Dizziness during initial sessions is expected: it means particles are responding to movement. You can use the pause button anytime if you need more time.',
      tipsLabel: 'Practical app usage tips:',
      tips: [
        'Place your phone on your bedside table with volume up so you do not need to look at the screen while dizzy.',
        'Move into positions decisively but without jerking or straining your neck.',
        'If you experience intense nausea, tap pause in the app and extend your seated rest.',
        'You can install the app on your phone (add to home screen) to use it offline anytime.',
      ],
    },
    footer: {
      appLink: 'Interactive Session Timer',
      llmsLink: 'Technical AI Documentation (llms.txt)',
      githubLink: 'Open Source Project on GitHub',
    },
  },
};
