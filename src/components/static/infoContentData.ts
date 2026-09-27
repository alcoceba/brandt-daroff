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
      title: 'Exercicis de Brandt-Daroff per al VPPB',
      description:
        'Informació sobre els exercicis de Brandt-Daroff per al vertigen posicional paroxístic benigne (VPPB). Descripció del mètode, posicions pas a pas i advertiments d’ús.',
      ogTitle: 'Exercicis de Brandt-Daroff per al VPPB',
      ogDescription:
        'Informació sobre la pauta d’exercicis Brandt-Daroff per a l’habituació i dispersió otolítica en el VPPB. Posicions detallades i advertiments.',
      twitterTitle: 'Exercicis de Brandt-Daroff per al VPPB',
      twitterDescription:
        'Informació sobre els exercicis Brandt-Daroff per al vertigen posicional paroxístic benigne.',
    },
    schema: {
      webpageName: 'Exercicis de Brandt-Daroff per al VPPB',
      webpageDescription:
        'Informació descriptiva sobre el procediment dels exercicis Brandt-Daroff per a persones amb vertigen posicional paroxístic benigne.',
      conditionName: 'Vertigen Posicional Paroxístic Benigne',
      alternateNames: ['VPPB', 'BPPV'],
      howtoName: 'Com fer els exercicis Brandt-Daroff',
      howtoDescription:
        'Seqüència postural de 5 passos per afavorir la dispersió dels otòlits i l’habituació vestibular.',
      supplyName: 'Llit o superfície plana ferma',
    },
    header: {
      appName: 'Brandt-Daroff',
      appTagline: 'Eina de suport per a exercicis de vertigen',
      launchToolText: 'Obrir assistent de sessió',
    },
    hero: {
      badge: 'Informació sobre els exercicis',
      title: 'Exercicis de Brandt-Daroff en el Vertigen Posicional Paroxístic Benigne (VPPB)',
      lead:
        'Aquesta pàgina descriu el mètode dels exercicis de Brandt-Daroff utilitzats habitualment per a l’habituació en el VPPB, la seqüència de posicions i els advertiments essencials de seguretat.',
      keyPoints: [
        { label: 'Abordatge descrit', value: 'Habituació i dispersió otolítica' },
        { label: 'Durada habitual', value: '10 a 14 dies (segons evolució)' },
        { label: 'Pauta habitual', value: '3 sessions al dia de 5 cicles' },
      ],
    },
    toolCallout: {
      title: 'Assistent interactiu per al compliment dels temps',
      description:
        'Per evitar la necessitat de mirar el rellotge durant les maniobres posturals, podeu utilitzar l’assistent integrat de l’aplicació, que guia cada canvi postural i comptabilitza automàticament els 30 segons de posició i els 2 minuts de repòs entre cicles mitjançant senyals visuals i acústiques.',
      buttonText: 'Accedir a l’assistent interactiu de sessió →',
      featurePoints: [
        'Temporitzador visual adaptat per a persones amb mareig o inestabilitat',
        'Senyals sonores suaus i vibració per no haver d’obrir els ulls si hi ha mareig',
        '100% autònom i privat: funciona fora de línia sense recollir cap dada personal',
      ],
    },
    warning: {
      disclaimerTitle: 'Avís mèdic i exempció de responsabilitat',
      disclaimerText:
        'Aquest lloc web i l’eina associada tenen una finalitat exclusivament informativa i pràctica. L’autor no és metge ni professional sanitari, i aquest contingut no constitueix ni substitueix el diagnòstic, criteri o tractament mèdic professional. Aquests exercicis només s’han de realitzar si un professional mèdic ha diagnosticat prèviament VPPB. L’ús d’aquesta eina i d’aquesta informació és responsabilitat exclusiva de l’usuari, declinant l’autor qualsevol responsabilitat per un ús inadequat, conseqüències o incidències.',
      title: 'Símptomes d’alarma — Quan aturar-se i demanar atenció mèdica urgent',
      intro:
        'El mareig giratori passatger durant els canvis de postura és habitual en el VPPB. No obstant això, si en qualsevol moment apareix algun dels següents símptomes d’alarma, interrompeu immediatament els exercicis i sol·liciteu atenció mèdica urgent:',
      bullets: [
        'Pèrdua de força sobtada o asimetria a la cara, al braç o a la cama.',
        'Pèrdua de sensibilitat, entumiment o formigueig a una meitat del cos.',
        'Trastorns visuals aguts: visió doble (diplòpia), visió borrosa sobtada o pèrdua visual parcial.',
        'Dificultat per articular les paraules (disàrtria) o per empassar (disfàgia).',
        'Pèrdua brusca i greu de la coordinació motora o incapacitat sobtada per mantenir-se dret.',
      ],
    },
    bppvSection: {
      title: 'Què succeeix en el VPPB?',
      p1:
        'El Vertigen Posicional Paroxístic Benigne és la causa més freqüent de vertigen perifèric. Es produeix a conseqüència del despreniment de petits cristalls de carbonat càlcic (otocònies o otòlits) habitualment situats a la màcula de l’utricle de l’orella interna.',
      p2:
        'Quan aquestes partícules migren cap a un dels canals semicirculars (més freqüentment el canal posterior) i queden lliures en el líquid endolimfàtic (canalolitiasi), qualsevol canvi de posició del cap genera un desplaçament anòmal de la cúpula sensorial, desencadenant una il·lusió intensa de moviment giratori acompanyada de nistagme ocular.',
    },
    methodSection: {
      title: 'Mecanisme descrit dels exercicis Brandt-Daroff',
      p1:
        'Descrit originalment pel Dr. Thomas Brandt i el Dr. Robert Daroff l’any 1980, aquest mètode consisteix en una seqüència repetida d’inclinacions laterals del tors i el cap. L’objectiu és doble: afavorir que la gravetat dispersi els agregats otolítics cap a zones no reactives de l’orella interna i estimular l’habituació davant dels senyals asimètrics.',
      p2:
        'A diferència de les maniobres de reposicionament que realitza un metge a la consulta (com les maniobres d’Epley o Semont), els exercicis de Brandt-Daroff estan pensats per a la seva repetició a casa quan han estat recomanats per un professional.',
      indicationTitle: 'Quan s’acostuma a recomanar aquest mètode?',
      indicationText:
        'Els exercicis se solen recomanar quan s’ha confirmat prèviament el diagnòstic mèdic de VPPB, especialment en casos amb resposta parcial a maniobres prèvies a consulta, en episodis residuals o segons indicació del metge o fisioterapeuta.',
    },
    stepsSection: {
      title: 'Seqüència postural (Un cicle = 5 posicions)',
      intro:
        'Cada sessió es compon de 5 cicles idèntics consecutius. Seguiu cada posició respectant els temps indicats:',
      steps: [
        {
          number: 1,
          title: 'Posició d’inici: Assegut a la vora del llit',
          duration: 'Posició neutra de transició',
          text: 'Seieu al mig de la vora del llit amb l’esquena recta i els peus relaxats penjant. Fixeu la mirada al davant i comproveu que l’espai al vostre voltant estigui lliure d’obstacles.',
          note: 'Manteniu una respiració tranquil·la abans d’iniciar la seqüència.',
        },
        {
          number: 2,
          title: 'Inclinació lateral dreta amb cap girat 45° amunt',
          duration: '30 segons (o fins que cessi el mareig)',
          text: 'Deixeu-vos caure suaument de costat sobre el costat dret del cos. Al mateix temps, gireu el cap aproximadament 45 graus cap amunt (mirant cap al sostre). Manteniu la postura durant 30 segons, o fins que el mareig desaparegui més 30 segons addicionals.',
          note: 'És habitual que durant els primers dies aparegui una sensació intensa de mareig en adoptar aquesta postura.',
        },
        {
          number: 3,
          title: 'Retorn a la posició asseguda (Repòs intermedi)',
          duration: '30 segons de repòs',
          text: 'Torneu a incorporar-vos suaument a la posició asseguda vertical a la vora del llit. Romangueu assegut en repòs durant 30 segons abans de passar al costat oposat.',
          note: 'Aquest descans permet que les partícules i el líquid intern es reposin.',
        },
        {
          number: 4,
          title: 'Inclinació lateral esquerra amb cap girat 45° amunt',
          duration: '30 segons (o fins que cessi el mareig)',
          text: 'Deixeu-vos caure sobre el costat esquerre del cos mantenint el cap orientat 45 graus cap amunt. Manteniu la posició durant 30 segons complets o fins que hagi cessat el mareig.',
          note: 'Encara que el mareig es noti principalment en un sol costat, el mètode requereix alternar ambdós costats.',
        },
        {
          number: 5,
          title: 'Retorn a la posició asseguda i descans entre cicles',
          duration: '2 minuts complets de repòs',
          text: 'Torneu a la posició inicial asseguda i descanseu 2 minuts sencers abans d’iniciar el cicle següent. Aquest descans és fonamental per evitar la fatiga i prevenir nàusees.',
          note: 'No escurceu aquest període de repòs.',
        },
      ],
    },
    protocolSection: {
      title: 'Pauta habitual, maneig del mareig i recomanacions',
      recommendedLabel: 'Pauta habitual:',
      recommendedText:
        'Habitualment es descriuen 3 sessions al dia (matí, migdia i vespre), compostes per 5 cicles cadascuna. S’acostuma a mantenir fins a completar 2 dies consecutius sense mareig durant la realització dels exercicis.',
      managementLabel: 'Maneig del mareig durant la maniobra:',
      managementText:
        'L’aparició de mareig durant els exercicis és habitual: indica que les partícules responen al moviment. Romangueu immòbil en la posició fins que la sensació disminueixi.',
      tipsLabel: 'Recomanacions pràctiques de seguretat:',
      tips: [
        'Realitzeu sempre els exercicis en un entorn segur, preferentment sobre el llit o una superfície ferma.',
        'Els canvis posturals han de ser fluids i decidits, però sense estirades brusques del coll.',
        'Si noteu nàusea intensa, descanseu assegut i allargueu el descans abans de reiniciar.',
        'No interrompeu la pauta prematurament encara que noteu una millora inicial.',
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
      title: 'Ejercicios de Brandt-Daroff para el VPPB',
      description:
        'Información sobre los ejercicios de Brandt-Daroff para el vértigo posicional paroxístico benigno (VPPB). Descripción del método, posiciones paso a paso y advertencias de uso.',
      ogTitle: 'Ejercicios de Brandt-Daroff para el VPPB',
      ogDescription:
        'Información sobre la pauta de ejercicios Brandt-Daroff para la habituación y dispersión otolítica en el VPPB. Posiciones detalladas y advertencias.',
      twitterTitle: 'Ejercicios de Brandt-Daroff para el VPPB',
      twitterDescription:
        'Información sobre los ejercicios Brandt-Daroff para el vértigo posicional paroxístico benigno.',
    },
    schema: {
      webpageName: 'Ejercicios de Brandt-Daroff para el VPPB',
      webpageDescription:
        'Información descriptiva sobre el procedimiento de los ejercicios Brandt-Daroff para personas con vértigo posicional paroxístico benigno.',
      conditionName: 'Vértigo Posicional Paroxístico Benigno',
      alternateNames: ['VPPB', 'BPPV'],
      howtoName: 'Cómo realizar los ejercicios Brandt-Daroff',
      howtoDescription:
        'Secuencia postural de 5 pasos para favorecer la dispersión de los otolitos y la habituación vestibular.',
      supplyName: 'Cama o superficie plana firme',
    },
    header: {
      appName: 'Brandt-Daroff',
      appTagline: 'Herramienta de apoyo para ejercicios de vértigo',
      launchToolText: 'Abrir asistente de sesión',
    },
    hero: {
      badge: 'Información sobre los ejercicios',
      title: 'Ejercicios de Brandt-Daroff en el Vértigo Posicional Paroxístico Benigno (VPPB)',
      lead:
        'Esta página describe el método de los ejercicios de Brandt-Daroff utilizados habitualmente para la habituación en el VPPB, la secuencia de posiciones y las advertencias esenciales de seguridad.',
      keyPoints: [
        { label: 'Abordaje descrito', value: 'Habituación y dispersión otolítica' },
        { label: 'Duración habitual', value: '10 a 14 días (según evolución)' },
        { label: 'Pauta habitual', value: '3 sesiones al día de 5 ciclos' },
      ],
    },
    toolCallout: {
      title: 'Asistente interactivo para el cumplimiento de los tiempos',
      description:
        'Para evitar la necesidad de mirar el reloj durante las maniobras posturales, puede utilizar el asistente integrado de la aplicación, que guía cada cambio postural y contabiliza automáticamente los 30 segundos de posición y los 2 minutos de reposo entre ciclos mediante señales visuales y acústicas.',
      buttonText: 'Acceder al asistente interactivo de sesión →',
      featurePoints: [
        'Temporizador visual adaptado para personas con mareo o inestabilidad',
        'Señales sonoras suaves y vibración para no requerir abrir los ojos ante mareo agudo',
        '100% autónomo y privado: funciona sin conexión a internet y no recopila ningún dato personal',
      ],
    },
    warning: {
      disclaimerTitle: 'Aviso médico y exención de responsabilidad',
      disclaimerText:
        'Este sitio web y la herramienta asociada tienen una finalidad exclusivamente informativa y práctica. El autor no es médico ni profesional sanitario, y este contenido no constituye ni sustituye el diagnóstico, criterio o tratamiento de un médico. Estos ejercicios solo deben realizarse si un profesional médico ha diagnosticado previamente VPPB. El uso de esta herramienta y de esta información es responsabilidad exclusiva del usuario, declinando el autor cualquier responsabilidad derivada de su uso o posibles incidencias.',
      title: 'Síntomas de alarma — Cuándo detenerse y solicitar atención médica urgente',
      intro:
        'El mareo rotatorio pasajero durante los cambios de postura es habitual en el VPPB. Sin embargo, si en cualquier momento aparece alguno de los siguientes síntomas de alarma, interrumpa de inmediato los ejercicios y solicite atención médica de urgencia:',
      bullets: [
        'Pérdida de fuerza repentina o asimetría en la cara, en el brazo o en la pierna.',
        'Pérdida de sensibilidad, entumecimiento o hormigueo en una mitad del cuerpo.',
        'Trastornos visuales agudos: visión doble (diplopía), visión borrosa súbita o pérdida visual parcial.',
        'Dificultad para articular palabras (disartria) o para tragar (disfagia).',
        'Pérdida brusca y grave de la coordinación motora o incapacidad repentina para mantenerse en pie.',
      ],
    },
    bppvSection: {
      title: '¿Qué sucede en el VPPB?',
      p1:
        'El Vértigo Posicional Paroxístico Benigno es la causa más frecuente de vértigo periférico. Se produce como consecuencia del desprendimiento de pequeños cristales de carbonato cálcico (otoconias u otolitos) habitualmente situados en la mácula del utrículo del oído interno.',
      p2:
        'Cuando estas partículas migran hacia uno de los canales semicirculares (más frecuentemente el canal posterior) y quedan libres en el líquido endolinfático (canalolitiasis), cualquier cambio de posición de la cabeza genera un desplazamiento anómalo de la cúpula sensorial, desencadenando una intensa ilusión de movimiento rotatorio acompañada de nistagmo ocular.',
    },
    methodSection: {
      title: 'Mecanismo descrito de los ejercicios Brandt-Daroff',
      p1:
        'Descrito originalmente por el Dr. Thomas Brandt y el Dr. Robert Daroff en 1980, este método consiste en una secuencia repetida de inclinaciones laterales del torso y de la cabeza. El objetivo es doble: favorecer que la gravedad disperse los agregados otolíticos hacia zonas no reactivas del oído interno y estimular la habituación ante señales asimétricas.',
      p2:
        'A diferencia de las maniobras de reposicionamiento realizadas por un médico en consulta (como las maniobras de Epley o Semont), los ejercicios de Brandt-Daroff están pensados para su repetición en el hogar cuando han sido recomendados por un profesional.',
      indicationTitle: '¿Cuándo se suele recomendar este método?',
      indicationText:
        'Los ejercicios suelen recomendarse cuando se ha confirmado previamente el diagnóstico médico de VPPB, especialmente en casos con respuesta parcial a maniobras previas en consulta, en presentaciones residuales o según indicación del profesional sanitario.',
    },
    stepsSection: {
      title: 'Secuencia postural (Un ciclo = 5 posiciones)',
      intro:
        'Cada sesión se compone de 5 ciclos idénticos consecutivos. Siga cada posición respetando los tiempos indicados:',
      steps: [
        {
          number: 1,
          title: 'Posición de inicio: Sentado al borde de la cama',
          duration: 'Posición neutra de transición',
          text: 'Siéntese en el centro del borde de la cama con la espalda erguida y los pies relajados colgando. Fije la mirada al frente y compruebe que el entorno a su alrededor esté libre de obstáculos.',
          note: 'Mantenga una respiración tranquila antes de iniciar la secuencia.',
        },
        {
          number: 2,
          title: 'Inclinación lateral derecha con cabeza girada 45° arriba',
          duration: '30 segundos (o hasta cese del mareo)',
          text: 'Déjese caer suavemente de costado sobre el flanco derecho del cuerpo. Al mismo tiempo, gire la cabeza aproximadamente 45 grados hacia arriba (mirando hacia el techo). Mantenga la postura durante 30 segundos, o hasta que el mareo desaparezca más 30 segundos adicionales.',
          note: 'Es habitual que durante los primeros días aparezca un mareo intenso al adoptar esta postura.',
        },
        {
          number: 3,
          title: 'Retorno a la posición sentada (Reposo intermedio)',
          duration: '30 segundos de reposo',
          text: 'Vuelva a incorporarse suavemente a la posición sentada vertical al borde de la cama. Permanezca sentado en reposo durante 30 segundos antes de pasar al lado opuesto.',
          note: 'Este descanso permite que las partículas y el líquido interno se estabilicen.',
        },
        {
          number: 4,
          title: 'Inclinación lateral izquierda con cabeza girada 45° arriba',
          duration: '30 segundos (o hasta cese del mareo)',
          text: 'Déjese caer sobre el flanco izquierdo del cuerpo manteniendo la cabeza orientada 45 grados hacia arriba. Mantenga la posición durante 30 segundos completos o hasta que haya cesado el mareo.',
          note: 'Aunque el mareo se perciba principalmente en un solo lado, el método requiere alternar ambos lados.',
        },
        {
          number: 5,
          title: 'Retorno a la posición sentada y descanso entre ciclos',
          duration: '2 minutos completos de reposo',
          text: 'Vuelva a la posición inicial sentada y descanse 2 minutos completos antes de iniciar el siguiente ciclo. Este intervalo es fundamental para evitar la fatiga y prevenir náuseas.',
          note: 'No acorte este periodo de reposo.',
        },
      ],
    },
    protocolSection: {
      title: 'Pauta habitual, manejo del mareo y recomendaciones',
      recommendedLabel: 'Pauta habitual:',
      recommendedText:
        'Habitualmente se describen 3 sesiones al día (mañana, mediodía y noche), compuestas por 5 ciclos cada una. Se suele mantener hasta completar 2 días consecutivos sin mareo durante la realización de los ejercicios.',
      managementLabel: 'Manejo del mareo durante la maniobra:',
      managementText:
        'La aparición de mareo durante los ejercicios es habitual: indica que las partículas responden al movimiento. Permanezca inmóvil en la posición indicada hasta que la sensación remita.',
      tipsLabel: 'Recomendaciones prácticas de seguridad:',
      tips: [
        'Realice siempre los ejercicios en un entorno seguro, preferiblemente sobre la cama o una superficie firme.',
        'Los cambios posturales deben ser fluidos y decididos, pero sin sacudidas ni tirones bruscos del cuello.',
        'Si experimenta náuseas intensas, descanse en posición sentada y prolongue el reposo entre ciclos antes de reanudar.',
        'No interrumpa el plan prematuramente aunque perciba mejoría inicial.',
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
      title: 'Brandt-Daroff Exercises for BPPV',
      description:
        'Information on Brandt-Daroff exercises for Benign Paroxysmal Positional Vertigo (BPPV). Method overview, step-by-step positions, and safety warnings.',
      ogTitle: 'Brandt-Daroff Exercises for BPPV',
      ogDescription:
        'Information on the Brandt-Daroff exercise protocol for otolithic habituation in BPPV. Step-by-step positions and safety warnings.',
      twitterTitle: 'Brandt-Daroff Exercises for BPPV',
      twitterDescription:
        'Information on Brandt-Daroff exercises for benign paroxysmal positional vertigo.',
    },
    schema: {
      webpageName: 'Brandt-Daroff Exercises for BPPV',
      webpageDescription:
        'Educational information on the Brandt-Daroff exercise routine for benign paroxysmal positional vertigo.',
      conditionName: 'Benign Paroxysmal Positional Vertigo',
      alternateNames: ['BPPV', 'VPPB'],
      howtoName: 'How to Perform Brandt-Daroff Exercises',
      howtoDescription:
        'A 5-step postural sequence promoting otoconial particle dispersal and vestibular habituation.',
      supplyName: 'Bed or firm flat surface',
    },
    header: {
      appName: 'Brandt-Daroff',
      appTagline: 'Exercise timer & reference tool',
      launchToolText: 'Open Session Assistant',
    },
    hero: {
      badge: 'Exercise Information & Reference',
      title: 'Brandt-Daroff Exercises in Benign Paroxysmal Positional Vertigo (BPPV)',
      lead:
        'This page provides an informational overview of the Brandt-Daroff exercise method commonly used for vestibular habituation in BPPV, detailing the postural sequence and essential safety warnings.',
      keyPoints: [
        { label: 'Reported mechanism', value: 'Otolithic dispersal & habituation' },
        { label: 'Typical duration', value: '10 to 14 days (based on symptoms)' },
        { label: 'Common regimen', value: '3 daily sessions of 5 cycles' },
      ],
    },
    toolCallout: {
      title: 'Interactive Assistant for Protocol Timing',
      description:
        'To prevent having to track clocks or stopwatches during positional shifts, you can use the integrated session assistant. It guides each postural change and automatically tracks the 30-second position intervals and 2-minute inter-cycle rests through audio and visual cues.',
      buttonText: 'Access the Interactive Session Assistant →',
      featurePoints: [
        'High-contrast visual countdown designed for individuals experiencing dizziness',
        'Gentle audio cues and vibration feedback to avoid keeping eyes open during vertigo episodes',
        '100% offline-first and private: operates without network connectivity and collects zero personal data',
      ],
    },
    warning: {
      disclaimerTitle: 'Medical Disclaimer & Limitation of Liability',
      disclaimerText:
        'This website and application are provided strictly for informational and practical reference. The creator is not a doctor or healthcare professional, and this content does not constitute or replace medical diagnosis, advice, or treatment. These exercises should only be undertaken if a qualified medical professional has diagnosed BPPV. Use of this application and information is entirely at your own risk, and the author disclaims any and all liability for consequences, misuse, or issues arising from use.',
      title: 'Warning Signs — When to Stop and Seek Immediate Medical Care',
      intro:
        'Brief spinning sensations during posture changes are common in BPPV. However, if you experience any of the following warning signs at any point, stop the exercises immediately and seek emergency medical evaluation:',
      bullets: [
        'Sudden onset weakness or drooping in the face, arm, or leg.',
        'Numbness, loss of sensation, or paresthesias affecting one side of the body.',
        'Acute visual disturbances: double vision (diplopia), sudden blurring, or visual field loss.',
        'Difficulty speaking or slurred speech (dysarthria) or difficulty swallowing (dysphagia).',
        'Acute, severe loss of motor coordination or sudden inability to stand or walk unassisted.',
      ],
    },
    bppvSection: {
      title: 'What Happens in BPPV?',
      p1:
        'Benign Paroxysmal Positional Vertigo is the single most common cause of peripheral vertigo. It results from the detachment of microscopic calcium carbonate crystals (otoconia) normally located within the macula of the utricle in the inner ear.',
      p2:
        'When these free-floating particles migrate into one of the fluid-filled semicircular canals (most commonly the posterior semicircular canal) as canalithiasis, any head movement in the plane of the canal produces abnormal deflection of the sensory cupula, generating an acute false sensation of rapid rotation accompanied by characteristic nystagmus.',
    },
    methodSection: {
      title: 'Reported Mechanism of Brandt-Daroff Exercises',
      p1:
        'First described by Dr. Thomas Brandt and Dr. Robert Daroff in 1980, this protocol involves a systematic sequence of lateral torso and head movements. The goal is twofold: gravitational forces help disperse otoconial aggregates away from the cupular region into the vestibule, and repetitive movements foster vestibular habituation to asymmetrical vestibular inputs.',
      p2:
        'Unlike single in-clinic canalith repositioning procedures performed by a doctor (such as the Epley or Semont maneuvers), Brandt-Daroff exercises are structured for home practice when recommended by a healthcare professional.',
      indicationTitle: 'When is this protocol commonly recommended?',
      indicationText:
        'The protocol is typically recommended following a confirmed medical diagnosis of BPPV, particularly in individuals with partial response to canalith repositioning maneuvers, mild or residual canalithiasis, or as advised by an ENT specialist.',
    },
    stepsSection: {
      title: 'Step-by-Step Postural Sequence (One Cycle = 5 Positions)',
      intro:
        'Each session consists of 5 identical consecutive cycles. Follow each position carefully, observing all prescribed rest intervals:',
      steps: [
        {
          number: 1,
          title: 'Starting Position: Upright sitting on bed edge',
          duration: 'Neutral transition position',
          text: 'Sit upright on the edge of your bed with feet resting comfortably. Look straight ahead and ensure the immediate perimeter around the bed is clear of hazards.',
          note: 'Take a calm, steady breath before beginning the movements.',
        },
        {
          number: 2,
          title: 'Lateral lie on right side with head turned 45° upward',
          duration: '30 seconds (or until vertigo ceases)',
          text: 'Move smoothly down onto your right side. Simultaneously rotate your head 45 degrees upward toward the ceiling. Maintain this position for 30 seconds, or until spinning ceases plus an additional 30 seconds.',
          note: 'It is common for dizziness to be triggered during initial days in this position.',
        },
        {
          number: 3,
          title: 'Return to upright sitting (Intermediary rest)',
          duration: '30 seconds rest',
          text: 'Smoothly return to the upright seated position on the edge of the bed. Remain seated in rest for 30 seconds before proceeding to the opposite side.',
          note: 'This pause allows inner ear fluids and particles to settle.',
        },
        {
          number: 4,
          title: 'Lateral lie on left side with head turned 45° upward',
          duration: '30 seconds (or until vertigo ceases)',
          text: 'Move smoothly down onto your left side with your head rotated 45 degrees upward toward the ceiling. Hold this position for 30 seconds or until spinning has completely subsided.',
          note: 'Even if dizziness is felt primarily on one side, the routine requires alternating both sides.',
        },
        {
          number: 5,
          title: 'Return to upright sitting & inter-cycle rest',
          duration: '2 full minutes rest',
          text: 'Return to the upright seated starting position and rest for 2 full minutes before starting the subsequent cycle. This rest period is essential to prevent nausea and avoid fatigue.',
          note: 'Do not shorten this 2-minute rest interval.',
        },
      ],
    },
    protocolSection: {
      title: 'Common Regimen, Managing Dizziness & Practical Tips',
      recommendedLabel: 'Common Regimen:',
      recommendedText:
        'Typically described as 3 sessions per day (morning, midday, evening), each consisting of 5 cycles. The routine is usually continued daily until achieving 2 consecutive days completely free of dizziness during exercise performance.',
      managementLabel: 'Managing Dizziness During Maneuvers:',
      managementText:
        'Transient dizziness during these movements is expected and indicates that particles are responding to motion. Remain stationary in the designated position until the episode remits.',
      tipsLabel: 'Practical Safety Recommendations:',
      tips: [
        'Always perform the exercises in a secure environment, ideally on a firm bed or couch.',
        'Move smoothly and purposefully; avoid abrupt jerking or rapid twisting of the neck.',
        'If significant nausea arises, remain upright and extend the rest period between cycles before continuing.',
        'Do not discontinue the protocol prematurely even if noticeable initial improvement occurs.',
      ],
    },
    footer: {
      appLink: 'Interactive Session Assistant',
      llmsLink: 'Technical AI Documentation (llms.txt)',
      githubLink: 'Open Source Project on GitHub',
    },
  },
};
