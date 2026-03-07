export type Locale = 'ko' | 'en' | 'he' | 'es' | 'ja' | 'fa' | 'zh'

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  he: 'Israel',
  es: 'Español',
  ja: '日本語',
  fa: 'فارسی',
  zh: '中文'
}

/** Flag emoji per locale (e.g. English = USA). */
export const LOCALE_FLAGS: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  he: '🇮🇱',
  es: '🇪🇸',
  ja: '🇯🇵',
  fa: '🇮🇷',
  zh: '🇨🇳'
}

export const DAY_NAMES: Record<Locale, string[]> = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  he: ['א\'', 'ב\'', 'ג\'', 'ד\'', 'ה\'', 'ו\'', 'ש'],
  es: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  ja: ['日', '月', '火', '水', '木', '金', '土'],
  fa: ['یکشنبه', 'دوشنبه', 'سه\u200cشنبه', 'چهارشنبه', 'پنج\u200cشنبه', 'جمعه', 'شنبه'],
  zh: ['日', '一', '二', '三', '四', '五', '六']
}

export type TranslationKeys = {
  nav: {
    productName: string
    themeToLight: string
    themeToDark: string
    themeLight: string
    themeDark: string
    home: string
    language: string
  }
  app: {
    title: string
    tagline: string
    multiUserHint: string
    alertSelectTeam: string
    alertAddMembers: string
    alertError: string
    alertScheduleConflict: string
    visits: string
  }
  org: {
    title: string
    using: string
    searchPlaceholder: string
    searching: string
    matchingOrgs: string
    clickToJoin: string
    noSearchResults: string
    namePlaceholder: string
    createWithName: string
    createHint: string
    addOrg: string
    emptyHint: string
    save: string
    cancel: string
    delete: string
    confirmDelete: string
    selectOrg: string
  }
  team: {
    title: string
    searchPlaceholder: string
    noSearchResults: string
    teamNamePlaceholder: string
    addTeam: string
    emptyHint: string
    save: string
    cancel: string
    delete: string
    editName: string
    deleteTeam: string
    confirmDelete: string
    select: string
    selected: string
    selectForSchedule: string
    membersCount: string
    dragToReorder: string
  }
  member: {
    namePlaceholder: string
    add: string
    delete: string
    moveUp: string
    moveDown: string
    emptyHint: string
    dragToReorder: string
  }
  schedule: {
    title: string
    startDate: string
    startBook: string
    startChapter: string
    chaptersPerPerson: string
    daysPerSet: string
    sets: string
    hint: string
    generate: string
    generating: string
  }
  scheduleDisplay: {
    empty: string
    schedule: string
    scheduleTitle: string
    generatedSchedule: string
    copy: string
    copied: string
    copyAll: string
    chapter: string
  }
  dashboard: {
    title: string
    completion: string
    empty: string
  }
  tutorial: {
    title: string
    step1Title: string
    step1Body: string
    step2Title: string
    step2Body: string
    step3Title: string
    fieldStartDate: string
    fieldStartBook: string
    fieldStartChapter: string
    fieldChaptersPerPerson: string
    fieldDaysPerSet: string
    fieldSets: string
    next: string
    back: string
    finish: string
    doNotShowAgain: string
    close: string
  }
}

function makeTranslations(t: TranslationKeys): TranslationKeys {
  return t
}

export const translations: Record<Locale, TranslationKeys> = {
  ko: makeTranslations({
    nav: {
      productName: '성경 읽기 스케줄러',
      themeToLight: '라이트 모드로 전환',
      themeToDark: '다크 모드로 전환',
      themeLight: '라이트 모드',
      themeDark: '다크 모드',
      home: 'Shofar AI 홈',
      language: '언어'
    },
    app: {
      title: '성경 읽기 스케줄러',
      tagline: '팀별 읽기 순서를 만들고 메시지용 텍스트를 복사하세요',
      multiUserHint: '여러 사람이 동시에 사용할 수 있습니다. 같은 팀을 동시에 수정하면 마지막 저장이 적용됩니다.',
      alertSelectTeam: '스케줄을 생성할 팀을 선택해주세요.',
      alertAddMembers: '해당 팀에 멤버를 먼저 추가해주세요.',
      alertError: '스케줄 생성 중 오류가 발생했습니다.',
      alertScheduleConflict: '다른 사용자가 이 팀 스케줄을 수정한 것 같습니다. 새로고침 후 다시 시도해 주세요.',
      visits: '방문 수'
    },
    org: {
      title: '교회/단체',
      using: '사용 중:',
      searchPlaceholder: '교회/단체 이름 검색',
      searching: '검색 중…',
      matchingOrgs: '검색 결과',
      clickToJoin: '클릭하여 참여',
      noSearchResults: '검색 결과가 없습니다.',
      namePlaceholder: '교회/단체 이름',
      createWithName: '새 교회/단체 이름',
      createHint: '검색 결과에 없으면 새 교회/단체를 만드세요.',
      addOrg: '교회/단체 추가',
      emptyHint: '교회/단체를 추가한 뒤 팀을 만드세요.',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      confirmDelete: '이 교회/단체를 삭제할까요? (팀이 없을 때만 삭제 가능)',
      selectOrg: '교회/단체 선택'
    },
    team: {
      title: '팀 관리',
      searchPlaceholder: '팀 이름 검색',
      noSearchResults: '검색 결과가 없습니다.',
      teamNamePlaceholder: '팀 이름',
      addTeam: '팀 추가',
      emptyHint: '팀을 추가한 뒤 팀원을 등록하세요.',
      save: '저장',
      cancel: '취소',
      delete: '삭제',
      editName: '이름 수정',
      deleteTeam: '팀 삭제',
      confirmDelete: '이 팀을 삭제할까요? 팀원 목록도 함께 삭제됩니다.',
      select: '선택',
      selected: '✓ 선택됨',
      selectForSchedule: '스케줄 생성 대상 팀으로 선택',
      membersCount: '{n}명',
      dragToReorder: '드래그하여 순서 변경'
    },
    member: {
      namePlaceholder: '이름 입력',
      add: '추가',
      delete: '삭제',
      moveUp: '위로',
      moveDown: '아래로',
      emptyHint: '팀원을 추가하세요.',
      dragToReorder: '드래그하여 순서 변경'
    },
    schedule: {
      title: '스케줄 설정',
      startDate: '시작 날짜',
      startBook: '시작 성경책',
      startChapter: '시작 장',
      chaptersPerPerson: '1인당 장 수',
      daysPerSet: '세트당 일수',
      sets: '세트 수',
      hint: '선택 팀: {n}명 · 총 {days}일',
      generate: '스케줄 생성',
      generating: '생성 중...'
    },
    scheduleDisplay: {
      empty: '생성된 스케줄이 없습니다. 먼저 멤버를 추가하고 스케줄을 생성해주세요.',
      schedule: '{name} 스케줄',
      scheduleTitle: '{orgName}: {teamName} 성경읽기 스케줄',
      generatedSchedule: '생성된 스케줄',
      copy: '복사',
      copied: '복사됨!',
      copyAll: '전체 복사',
      chapter: '장'
    },
    dashboard: {
      title: '팀 대시보드',
      completion: '통독',
      empty: '팀이 없습니다.'
    },
    tutorial: {
      title: '간단 사용법',
      step1Title: '교회/단체 선택',
      step1Body: '교회 또는 단체 이름을 검색해 선택하거나, 없으면 새로 만드세요.',
      step2Title: '팀 관리',
      step2Body: '팀을 검색해 선택하거나 새 팀을 추가한 뒤, 팀원 이름을 입력하고 순서를 정하세요.',
      step3Title: '스케줄 설정',
      fieldStartDate: '시작할 날짜를 선택하세요.',
      fieldStartBook: '성경의 시작 책을 선택하세요.',
      fieldStartChapter: '해당 책의 시작 장을 선택하세요.',
      fieldChaptersPerPerson: '한 사람이 읽을 장 수입니다.',
      fieldDaysPerSet: '한 세트에 채울 날 수입니다. (예: 20명, 4일이면 하루 5명씩 4일이 한 세트)',
      fieldSets: '그런 세트를 몇 번 반복할지입니다.',
      next: '다음',
      back: '이전',
      finish: '완료',
      doNotShowAgain: '다시 보지 않기',
      close: '닫기'
    }
  }),
  en: makeTranslations({
    nav: {
      productName: 'Bible Reading Scheduler',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      themeLight: 'Light mode',
      themeDark: 'Dark mode',
      home: 'Shofar AI Home',
      language: 'Language'
    },
    app: {
      title: 'Bible Reading Scheduler',
      tagline: 'Create team reading order and copy message-ready text.',
      multiUserHint: 'Multiple people can use this at once. Editing the same team at the same time uses the last save.',
      alertSelectTeam: 'Please select a team to generate the schedule.',
      alertAddMembers: 'Please add members to the team first.',
      alertError: 'An error occurred while generating the schedule.',
      alertScheduleConflict: 'Someone else may have updated this team\'s schedule. Please refresh and try again.',
      visits: 'Visits'
    },
    org: {
      title: 'Organizations',
      using: 'Using:',
      searchPlaceholder: 'Search organization name',
      searching: 'Searching…',
      matchingOrgs: 'Matching organizations',
      clickToJoin: 'Click to join',
      noSearchResults: 'No organizations match your search.',
      namePlaceholder: 'Organization name',
      createWithName: 'New organization name',
      createHint: 'Create a new organization if none match.',
      addOrg: 'Add Organization',
      emptyHint: 'Add an organization, then add teams.',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      confirmDelete: 'Delete this organization? (Only when it has no teams.)',
      selectOrg: 'Select organization'
    },
    team: {
      title: 'Team Management',
      searchPlaceholder: 'Search team name',
      noSearchResults: 'No teams match your search.',
      teamNamePlaceholder: 'Team name',
      addTeam: 'Add Team',
      emptyHint: 'Add a team, then add members.',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      editName: 'Edit name',
      deleteTeam: 'Delete team',
      confirmDelete: 'Delete this team? All members will be removed.',
      select: 'Select',
      selected: '✓ Selected',
      selectForSchedule: 'Select team for schedule',
      membersCount: '{n}',
      dragToReorder: 'Drag to reorder'
    },
    member: {
      namePlaceholder: 'Enter name',
      add: 'Add',
      delete: 'Delete',
      moveUp: 'Up',
      moveDown: 'Down',
      emptyHint: 'Add members.',
      dragToReorder: 'Drag to reorder'
    },
    schedule: {
      title: 'Schedule Settings',
      startDate: 'Start date',
      startBook: 'Start book',
      startChapter: 'Start chapter',
      chaptersPerPerson: 'Chapters per person',
      daysPerSet: 'Days per set',
      sets: 'Number of sets',
      hint: 'Selected team: {n} members · {days} days total',
      generate: 'Generate Schedule',
      generating: 'Generating...'
    },
    scheduleDisplay: {
      empty: 'No schedule yet. Add members and generate a schedule.',
      schedule: '{name} Schedule',
      scheduleTitle: '{orgName}: {teamName} Bible Reading Schedule',
      generatedSchedule: 'Generated Schedule',
      copy: 'Copy',
      copied: 'Copied!',
      copyAll: 'Copy All',
      chapter: ' Ch.'
    },
    dashboard: {
      title: 'Team Dashboard',
      completion: 'Completion',
      empty: 'No teams yet.'
    },
    tutorial: {
      title: 'Quick guide',
      step1Title: 'Org search & selection',
      step1Body: 'Search for your church or organization and select it, or create a new one.',
      step2Title: 'Team management',
      step2Body: 'Search or create a team, then add member names and reorder as needed.',
      step3Title: 'Schedule settings',
      fieldStartDate: 'Select the starting date.',
      fieldStartBook: 'Starting book of the Bible.',
      fieldStartChapter: 'Starting chapter of that book.',
      fieldChaptersPerPerson: 'Number of chapters each person reads.',
      fieldDaysPerSet: 'How many days to fill per set (e.g. 20 members, 4 days → 5 members per day for 4 days in a set).',
      fieldSets: 'How many sets of those days to generate.',
      next: 'Next',
      back: 'Back',
      finish: 'Finish',
      doNotShowAgain: 'Do not show again',
      close: 'Close'
    }
  }),
  he: makeTranslations({
    nav: {
      productName: 'לוח קריאת התנ"ך',
      themeToLight: 'מעבר למצב בהיר',
      themeToDark: 'מעבר למצב כהה',
      themeLight: 'מצב בהיר',
      themeDark: 'מצב כהה',
      home: 'Shofar AI בית',
      language: 'שפה'
    },
    app: {
      title: 'לוח קריאת התנ"ך',
      tagline: 'צור סדר קריאה לצוות והעתק טקסט מוכן להודעה.',
      multiUserHint: 'משתמשים רבים יכולים להשתמש במקביל. עריכת אותו צוות במקביל תשתמש בשמירה האחרונה.',
      alertSelectTeam: 'נא לבחור צוות ליצירת הלוח.',
      alertAddMembers: 'נא להוסיף חברים לצוות תחילה.',
      alertError: 'אירעה שגיאה ביצירת הלוח.',
      alertScheduleConflict: 'ייתכן שמישהו אחר עדכן את לוח הצוות. נא לרענן ולנסות שוב.',
      visits: 'ביקורים'
    },
    org: {
      title: 'ארגונים',
      using: 'בשימוש:',
      searchPlaceholder: 'חיפוש שם ארגון',
      searching: 'מחפש…',
      matchingOrgs: 'ארגונים תואמים',
      clickToJoin: 'לחץ להצטרפות',
      noSearchResults: 'לא נמצאו ארגונים תואמים.',
      namePlaceholder: 'שם ארגון',
      createWithName: 'שם ארגון חדש',
      createHint: 'צור ארגון חדש אם אין התאמה.',
      addOrg: 'הוסף ארגון',
      emptyHint: 'הוסף ארגון, ואז הוסף צוותים.',
      save: 'שמור',
      cancel: 'ביטול',
      delete: 'מחק',
      confirmDelete: 'למחוק ארגון זה? (רק כאשר אין צוותים.)',
      selectOrg: 'בחר ארגון'
    },
    team: {
      title: 'ניהול צוות',
      searchPlaceholder: 'חיפוש שם צוות',
      noSearchResults: 'לא נמצאו צוותים תואמים.',
      teamNamePlaceholder: 'שם צוות',
      addTeam: 'הוסף צוות',
      emptyHint: 'הוסף צוות, ואז הוסף חברים.',
      save: 'שמור',
      cancel: 'ביטול',
      delete: 'מחק',
      editName: 'ערוך שם',
      deleteTeam: 'מחק צוות',
      confirmDelete: 'למחוק צוות זה? כל החברים יוסרו.',
      select: 'בחר',
      selected: '✓ נבחר',
      selectForSchedule: 'בחר צוות ללוח',
      membersCount: '{n}',
      dragToReorder: 'גרור לסידור מחדש'
    },
    member: {
      namePlaceholder: 'הזן שם',
      add: 'הוסף',
      delete: 'מחק',
      moveUp: 'למעלה',
      moveDown: 'למטה',
      emptyHint: 'הוסף חברים.',
      dragToReorder: 'גרור לסידור מחדש'
    },
    schedule: {
      title: 'הגדרות לוח',
      startDate: 'תאריך התחלה',
      startBook: 'ספר התחלה',
      startChapter: 'פרק התחלה',
      chaptersPerPerson: 'פרקים לאדם',
      daysPerSet: 'ימים לכל סט',
      sets: 'מספר סטים',
      hint: 'צוות נבחר: {n} חברים · {days} ימים סה"כ',
      generate: 'צור לוח',
      generating: 'יוצר...'
    },
    scheduleDisplay: {
      empty: 'אין עדיין לוח. הוסף חברים וצור לוח.',
      schedule: 'לוח {name}',
      scheduleTitle: '{orgName}: {teamName} לוח קריאת התנ"ך',
      generatedSchedule: 'לוח שנוצר',
      copy: 'העתק',
      copied: 'הועתק!',
      copyAll: 'העתק הכל',
      chapter: ' פרק'
    },
    dashboard: {
      title: 'לוח צוות',
      completion: 'השלמה',
      empty: 'אין עדיין צוותים.'
    },
    tutorial: {
      title: 'מדריך קצר',
      step1Title: 'בחירת ארגון',
      step1Body: 'חפש כנסייה או ארגון ובחר, או צור חדש.',
      step2Title: 'ניהול צוות',
      step2Body: 'חפש או צור צוות, הוסף שמות חברים וסדר.',
      step3Title: 'הגדרות לוח זמנים',
      fieldStartDate: 'בחר את תאריך ההתחלה.',
      fieldStartBook: 'ספר התנ"ך להתחלה.',
      fieldStartChapter: 'פרק ההתחלה באותו ספר.',
      fieldChaptersPerPerson: 'כמות הפרקים שאדם קורא.',
      fieldDaysPerSet: 'כמה ימים למלא בסט (למשל 20 חברים, 4 ימים → 5 ליום ב-4 ימים).',
      fieldSets: 'כמה סטים של ימים ליצור.',
      next: 'הבא',
      back: 'הקודם',
      finish: 'סיום',
      doNotShowAgain: 'לא להציג שוב',
      close: 'סגור'
    }
  }),
  es: makeTranslations({
    nav: {
      productName: 'Calendario de lectura bíblica',
      themeToLight: 'Cambiar a modo claro',
      themeToDark: 'Cambiar a modo oscuro',
      themeLight: 'Modo claro',
      themeDark: 'Modo oscuro',
      home: 'Shofar AI Inicio',
      language: 'Idioma'
    },
    app: {
      title: 'Calendario de lectura bíblica',
      tagline: 'Crea el orden de lectura por equipo y copia el texto para mensajes.',
      multiUserHint: 'Varias personas pueden usarlo a la vez. Si editan el mismo equipo, se guarda el último.',
      alertSelectTeam: 'Selecciona un equipo para generar el calendario.',
      alertAddMembers: 'Añade miembros al equipo primero.',
      alertError: 'Error al generar el calendario.',
      alertScheduleConflict: 'Parece que alguien más actualizó este calendario. Actualiza la página e inténtalo de nuevo.',
      visits: 'Visitas'
    },
    org: {
      title: 'Organizaciones',
      using: 'Usando:',
      searchPlaceholder: 'Buscar por nombre de organización',
      searching: 'Buscando…',
      matchingOrgs: 'Organizaciones encontradas',
      clickToJoin: 'Clic para unirse',
      noSearchResults: 'Ninguna organización coincide con la búsqueda.',
      namePlaceholder: 'Nombre de la organización',
      createWithName: 'Nombre de la nueva organización',
      createHint: 'Crea una organización nueva si no hay coincidencias.',
      addOrg: 'Añadir organización',
      emptyHint: 'Añade una organización y luego equipos.',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      confirmDelete: '¿Eliminar esta organización? (Solo cuando no tenga equipos.)',
      selectOrg: 'Seleccionar organización'
    },
    team: {
      title: 'Equipos',
      searchPlaceholder: 'Buscar por nombre de equipo',
      noSearchResults: 'Ningún equipo coincide con la búsqueda.',
      teamNamePlaceholder: 'Nombre del equipo',
      addTeam: 'Añadir equipo',
      emptyHint: 'Añade un equipo y luego los miembros.',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      editName: 'Editar nombre',
      deleteTeam: 'Eliminar equipo',
      confirmDelete: '¿Eliminar este equipo? Se eliminarán todos los miembros.',
      select: 'Seleccionar',
      selected: '✓ Seleccionado',
      selectForSchedule: 'Equipo para el calendario',
      membersCount: '{n}',
      dragToReorder: 'Arrastrar para reordenar'
    },
    member: {
      namePlaceholder: 'Nombre',
      add: 'Añadir',
      delete: 'Eliminar',
      moveUp: 'Arriba',
      moveDown: 'Abajo',
      emptyHint: 'Añade miembros.',
      dragToReorder: 'Arrastrar para reordenar'
    },
    schedule: {
      title: 'Configuración',
      startDate: 'Fecha de inicio',
      startBook: 'Libro inicial',
      startChapter: 'Capítulo inicial',
      chaptersPerPerson: 'Capítulos por persona',
      daysPerSet: 'Días por set',
      sets: 'Número de sets',
      hint: 'Equipo seleccionado: {n} miembros · {days} días total',
      generate: 'Generar calendario',
      generating: 'Generando...'
    },
    scheduleDisplay: {
      empty: 'Aún no hay calendario. Añade miembros y genera uno.',
      schedule: 'Calendario de {name}',
      scheduleTitle: '{orgName}: {teamName} Calendario de lectura bíblica',
      generatedSchedule: 'Calendario generado',
      copy: 'Copiar',
      copied: '¡Copiado!',
      copyAll: 'Copiar todo',
      chapter: ' Cap.'
    },
    dashboard: {
      title: 'Panel de equipos',
      completion: 'Completado',
      empty: 'Aún no hay equipos.'
    },
    tutorial: {
      title: 'Guía rápida',
      step1Title: 'Buscar y elegir organización',
      step1Body: 'Busca tu iglesia u organización y selecciónala, o crea una nueva.',
      step2Title: 'Gestión de equipos',
      step2Body: 'Busca o crea un equipo, añade nombres de miembros y ordena.',
      step3Title: 'Configuración del calendario',
      fieldStartDate: 'Selecciona la fecha de inicio.',
      fieldStartBook: 'Libro de la Biblia por el que empezar.',
      fieldStartChapter: 'Capítulo inicial de ese libro.',
      fieldChaptersPerPerson: 'Número de capítulos que lee cada persona.',
      fieldDaysPerSet: 'Cuántos días rellenar por set (ej. 20 miembros, 4 días → 5 por día durante 4 días en un set).',
      fieldSets: 'Cuántos sets de días generar.',
      next: 'Siguiente',
      back: 'Atrás',
      finish: 'Terminar',
      doNotShowAgain: 'No mostrar de nuevo',
      close: 'Cerrar'
    }
  }),
  ja: makeTranslations({
    nav: {
      productName: '聖書読みスケジュール',
      themeToLight: 'ライトモードに切り替え',
      themeToDark: 'ダークモードに切り替え',
      themeLight: 'ライトモード',
      themeDark: 'ダークモード',
      home: 'Shofar AI ホーム',
      language: '言語'
    },
    app: {
      title: '聖書読みスケジュール',
      tagline: 'チームの読み順を作成し、メッセージ用テキストをコピーできます。',
      multiUserHint: '複数人が同時に利用できます。同じチームを同時に編集すると、最後に保存した内容が反映されます。',
      alertSelectTeam: 'スケジュールを生成するチームを選択してください。',
      alertAddMembers: 'まずチームにメンバーを追加してください。',
      alertError: 'スケジュールの生成中にエラーが発生しました。',
      alertScheduleConflict: '他の方がこのチームのスケジュールを更新した可能性があります。更新してから再度お試しください。',
      visits: '訪問数'
    },
    org: {
      title: '組織',
      using: '使用中:',
      searchPlaceholder: '組織名で検索',
      searching: '検索中…',
      matchingOrgs: '一致する組織',
      clickToJoin: 'クリックして参加',
      noSearchResults: '検索に一致する組織がありません。',
      namePlaceholder: '組織名',
      createWithName: '新規組織名',
      createHint: '一致しない場合は新規組織を作成してください。',
      addOrg: '組織を追加',
      emptyHint: '組織を追加してからチームを作成してください。',
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      confirmDelete: 'この組織を削除しますか？（チームがない場合のみ削除可能）',
      selectOrg: '組織を選択'
    },
    team: {
      title: 'チーム管理',
      searchPlaceholder: 'チーム名で検索',
      noSearchResults: '検索に一致するチームがありません。',
      teamNamePlaceholder: 'チーム名',
      addTeam: 'チームを追加',
      emptyHint: 'チームを追加してからメンバーを登録してください。',
      save: '保存',
      cancel: 'キャンセル',
      delete: '削除',
      editName: '名前を編集',
      deleteTeam: 'チームを削除',
      confirmDelete: 'このチームを削除しますか？メンバーも削除されます。',
      select: '選択',
      selected: '✓ 選択中',
      selectForSchedule: 'スケジュール対象チーム',
      membersCount: '{n}名',
      dragToReorder: 'ドラッグで順序変更'
    },
    member: {
      namePlaceholder: '名前を入力',
      add: '追加',
      delete: '削除',
      moveUp: '上へ',
      moveDown: '下へ',
      emptyHint: 'メンバーを追加してください。',
      dragToReorder: 'ドラッグで順序変更'
    },
    schedule: {
      title: 'スケジュール設定',
      startDate: '開始日',
      startBook: '開始書',
      startChapter: '開始章',
      chaptersPerPerson: '1人あたりの章数',
      daysPerSet: 'セットあたりの日数',
      sets: 'セット数',
      hint: '選択チーム: {n}名 · 合計 {days} 日',
      generate: 'スケジュール生成',
      generating: '生成中...'
    },
    scheduleDisplay: {
      empty: 'スケジュールがありません。メンバーを追加して生成してください。',
      schedule: '{name} スケジュール',
      scheduleTitle: '{orgName}: {teamName} 聖書通読スケジュール',
      generatedSchedule: '生成されたスケジュール',
      copy: 'コピー',
      copied: 'コピーしました！',
      copyAll: 'すべてコピー',
      chapter: '章'
    },
    dashboard: {
      title: 'チームダッシュボード',
      completion: '通読',
      empty: 'チームがありません。'
    },
    tutorial: {
      title: '簡単ガイド',
      step1Title: '教会・団体の検索・選択',
      step1Body: '教会または団体を検索して選択するか、新規作成します。',
      step2Title: 'チーム管理',
      step2Body: 'チームを検索または作成し、メンバー名を追加して並べ替えます。',
      step3Title: 'スケジュール設定',
      fieldStartDate: '開始日を選択します。',
      fieldStartBook: '開始する聖書の書を選びます。',
      fieldStartChapter: 'その書の開始章を選びます。',
      fieldChaptersPerPerson: '1人が読む章の数です。',
      fieldDaysPerSet: '1セットで何日分埋めるか（例：20人・4日→1日5人×4日が1セット）。',
      fieldSets: 'そのセットを何回分つくるか。',
      next: '次へ',
      back: '戻る',
      finish: '完了',
      doNotShowAgain: '今後表示しない',
      close: '閉じる'
    }
  }),
  fa: makeTranslations({
    nav: {
      productName: 'برنامه مطالعه کتاب مقدس',
      themeToLight: 'حالت روشن',
      themeToDark: 'حالت تاریک',
      themeLight: 'حالت روشن',
      themeDark: 'حالت تاریک',
      home: 'خانه Shofar AI',
      language: 'زبان'
    },
    app: {
      title: 'برنامه مطالعه کتاب مقدس',
      tagline: 'ترتیب مطالعه تیم را بسازید و متن را کپی کنید.',
      multiUserHint: 'چند نفر می\u200cتوانند هم\u200cزمان استفاده کنند. ویرایش همان تیم هم\u200cزمان، آخرین ذخیره اعمال می\u200cشود.',
      alertSelectTeam: 'یک تیم برای ساخت برنامه انتخاب کنید.',
      alertAddMembers: 'ابتدا اعضای تیم را اضافه کنید.',
      alertError: 'خطا در ساخت برنامه.',
      alertScheduleConflict: 'احتمالاً شخص دیگری برنامه این تیم را به\u200cروز کرده. لطفاً صفحه را 새 کنید و دوباره تلاش کنید.',
      visits: 'بازدیدها'
    },
    org: {
      title: 'سازمان‌ها',
      using: 'در حال استفاده:',
      searchPlaceholder: 'جستجوی نام سازمان',
      searching: 'در حال جستجو…',
      matchingOrgs: 'سازمان‌های مطابق',
      clickToJoin: 'کلیک برای پیوستن',
      noSearchResults: 'سازمانی با این جستجو یافت نشد.',
      namePlaceholder: 'نام سازمان',
      createWithName: 'نام سازمان جدید',
      createHint: 'در صورت عدم تطابق، سازمان جدید بسازید.',
      addOrg: 'افزودن سازمان',
      emptyHint: 'یک سازمان اضافه کنید، سپس تیم‌ها را اضافه کنید.',
      save: 'ذخیره',
      cancel: 'لغو',
      delete: 'حذف',
      confirmDelete: 'این سازمان حذف شود؟ (فقط وقتی تیمی نداشته باشد.)',
      selectOrg: 'انتخاب سازمان'
    },
    team: {
      title: 'مدیریت تیم',
      searchPlaceholder: 'جستجوی نام تیم',
      noSearchResults: 'تیمی با این جستجو یافت نشد.',
      teamNamePlaceholder: 'نام تیم',
      addTeam: 'افزودن تیم',
      emptyHint: 'تیم اضافه کنید، سپس اعضا را ثبت کنید.',
      save: 'ذخیره',
      cancel: 'انصراف',
      delete: 'حذف',
      editName: 'ویرایش نام',
      deleteTeam: 'حذف تیم',
      confirmDelete: 'این تیم حذف شود؟ همه اعضا حذف می\u200cشوند.',
      select: 'انتخاب',
      selected: '✓ انتخاب شده',
      selectForSchedule: 'تیم برای برنامه',
      membersCount: '{n}',
      dragToReorder: 'برای تغییر ترتیب بکشید'
    },
    member: {
      namePlaceholder: 'نام',
      add: 'افزودن',
      delete: 'حذف',
      moveUp: 'بالا',
      moveDown: 'پایین',
      emptyHint: 'اعضا را اضافه کنید.',
      dragToReorder: 'برای تغییر ترتیب بکشید'
    },
    schedule: {
      title: 'تنظیمات برنامه',
      startDate: 'تاریخ شروع',
      startBook: 'کتاب شروع',
      startChapter: 'فصل شروع',
      chaptersPerPerson: 'فصل به ازای هر نفر',
      daysPerSet: 'روز در هر ست',
      sets: 'تعداد ست\u200cها',
      hint: 'تیم انتخاب\u200cشده: {n} نفر · جمع {days} روز',
      generate: 'ساخت برنامه',
      generating: 'در حال ساخت...'
    },
    scheduleDisplay: {
      empty: 'برنامه\u200cای وجود ندارد. اعضا را اضافه و برنامه بسازید.',
      schedule: 'برنامه {name}',
      scheduleTitle: '{orgName}: {teamName} برنامه خواندن کتاب مقدس',
      generatedSchedule: 'برنامه ساخته\u200cشده',
      copy: 'کپی',
      copied: 'کپی شد!',
      copyAll: 'کپی همه',
      chapter: ' فصل'
    },
    dashboard: {
      title: 'داشبورد تیم',
      completion: 'تکمیل',
      empty: 'هنوز تیمی نیست.'
    },
    tutorial: {
      title: 'راهنمای کوتاه',
      step1Title: 'جستجو و انتخاب سازمان',
      step1Body: 'کلیسا یا سازمان را جستجو و انتخاب کنید یا جدید بسازید.',
      step2Title: 'مدیریت تیم',
      step2Body: 'تیم را جستجو یا بسازید، نام اعضا را اضافه و مرتب کنید.',
      step3Title: 'تنظیمات برنامه',
      fieldStartDate: 'تاریخ شروع را انتخاب کنید.',
      fieldStartBook: 'کتاب شروع کتاب مقدس.',
      fieldStartChapter: 'فصل شروع آن کتاب.',
      fieldChaptersPerPerson: 'تعداد فصل‌هایی که هر نفر می‌خواند.',
      fieldDaysPerSet: 'چند روز در هر ست پر شود (مثلاً ۲۰ نفر، ۴ روز → ۵ نفر در روز برای ۴ روز در یک ست).',
      fieldSets: 'چند ست از آن روزها ساخته شود.',
      next: 'بعدی',
      back: 'قبلی',
      finish: 'پایان',
      doNotShowAgain: 'دیگر نشان نده',
      close: 'بستن'
    }
  }),
  zh: makeTranslations({
    nav: {
      productName: '圣经阅读日程',
      themeToLight: '切换到浅色模式',
      themeToDark: '切换到深色模式',
      themeLight: '浅色模式',
      themeDark: '深色模式',
      home: 'Shofar AI 首页',
      language: '语言'
    },
    app: {
      title: '圣经阅读日程',
      tagline: '创建团队阅读顺序，复制可用于消息的文本。',
      multiUserHint: '可多人同时使用。同时编辑同一团队时，以最后保存为准。',
      alertSelectTeam: '请选择要生成日程的团队。',
      alertAddMembers: '请先为该团队添加成员。',
      alertError: '生成日程时出错。',
      alertScheduleConflict: '可能有人已更新该团队的日程，请刷新后重试。',
      visits: '访问量'
    },
    org: {
      title: '组织',
      using: '使用中：',
      searchPlaceholder: '搜索组织名称',
      searching: '搜索中…',
      matchingOrgs: '匹配的组织',
      clickToJoin: '点击加入',
      noSearchResults: '没有匹配的组织。',
      namePlaceholder: '组织名称',
      createWithName: '新组织名称',
      createHint: '若无匹配结果可创建新组织。',
      addOrg: '添加组织',
      emptyHint: '先添加组织，再添加团队。',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      confirmDelete: '确定删除此组织？（仅当没有团队时可删除）',
      selectOrg: '选择组织'
    },
    team: {
      title: '团队管理',
      searchPlaceholder: '搜索团队名称',
      noSearchResults: '没有匹配的团队。',
      teamNamePlaceholder: '团队名称',
      addTeam: '添加团队',
      emptyHint: '先添加团队，再添加成员。',
      save: '保存',
      cancel: '取消',
      delete: '删除',
      editName: '编辑名称',
      deleteTeam: '删除团队',
      confirmDelete: '确定删除此团队？成员将一并删除。',
      select: '选择',
      selected: '✓ 已选',
      selectForSchedule: '用于生成日程的团队',
      membersCount: '{n}人',
      dragToReorder: '拖拽以调整顺序'
    },
    member: {
      namePlaceholder: '输入姓名',
      add: '添加',
      delete: '删除',
      moveUp: '上移',
      moveDown: '下移',
      emptyHint: '请添加成员。',
      dragToReorder: '拖拽以调整顺序'
    },
    schedule: {
      title: '日程设置',
      startDate: '开始日期',
      startBook: '起始书卷',
      startChapter: '起始章',
      chaptersPerPerson: '每人章数',
      daysPerSet: '每组天数',
      sets: '组数',
      hint: '已选团队：{n} 人 · 共 {days} 天',
      generate: '生成日程',
      generating: '生成中...'
    },
    scheduleDisplay: {
      empty: '暂无日程。请先添加成员并生成日程。',
      schedule: '{name} 日程',
      scheduleTitle: '{orgName}: {teamName} 圣经阅读日程',
      generatedSchedule: '已生成日程',
      copy: '复制',
      copied: '已复制！',
      copyAll: '全部复制',
      chapter: '章'
    },
    dashboard: {
      title: '团队仪表板',
      completion: '通读',
      empty: '暂无团队。'
    },
    tutorial: {
      title: '简要指南',
      step1Title: '教会/机构搜索与选择',
      step1Body: '搜索教会或机构并选择，或新建。',
      step2Title: '团队管理',
      step2Body: '搜索或创建团队，添加成员名称并排序。',
      step3Title: '日程设置',
      fieldStartDate: '选择开始日期。',
      fieldStartBook: '开始的圣经书卷。',
      fieldStartChapter: '该书卷的起始章。',
      fieldChaptersPerPerson: '每人阅读的章数。',
      fieldDaysPerSet: '每套填充几天（如 20 人、4 天 → 每天 5 人，共 4 天为一套）。',
      fieldSets: '生成多少套这样的天数。',
      next: '下一步',
      back: '上一步',
      finish: '完成',
      doNotShowAgain: '不再显示',
      close: '关闭'
    }
  })
}
