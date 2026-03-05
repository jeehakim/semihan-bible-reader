export type Locale = 'ko' | 'en' | 'es' | 'ja' | 'fa' | 'zh'

export const LOCALE_LABELS: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  es: 'Español',
  ja: '日本語',
  fa: 'فارسی',
  zh: '中文'
}

export const DAY_NAMES: Record<Locale, string[]> = {
  ko: ['일', '월', '화', '수', '목', '금', '토'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
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
    alertSelectTeam: string
    alertAddMembers: string
    alertError: string
  }
  team: {
    title: string
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
    days: string
    hint: string
    generate: string
    generating: string
  }
  scheduleDisplay: {
    empty: string
    schedule: string
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
}

function makeTranslations(t: TranslationKeys): TranslationKeys {
  return t
}

export const translations: Record<Locale, TranslationKeys> = {
  ko: makeTranslations({
    nav: {
      productName: '성경 읽기 스케줄',
      themeToLight: '라이트 모드로 전환',
      themeToDark: '다크 모드로 전환',
      themeLight: '라이트 모드',
      themeDark: '다크 모드',
      home: 'Shofar AI 홈',
      language: '언어'
    },
    app: {
      title: '성경 읽기 스케줄',
      tagline: '팀별 읽기 순서를 만들고 메시지용 텍스트를 복사하세요',
      alertSelectTeam: '스케줄을 생성할 팀을 선택해주세요.',
      alertAddMembers: '해당 팀에 멤버를 먼저 추가해주세요.',
      alertError: '스케줄 생성 중 오류가 발생했습니다.'
    },
    team: {
      title: '팀 관리',
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
      days: '생성할 일수',
      hint: '선택 팀: {n}명 기준으로 생성됩니다',
      generate: '스케줄 생성',
      generating: '생성 중...'
    },
    scheduleDisplay: {
      empty: '생성된 스케줄이 없습니다. 먼저 멤버를 추가하고 스케줄을 생성해주세요.',
      schedule: '{name} 스케줄',
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
    }
  }),
  en: makeTranslations({
    nav: {
      productName: 'Bible Reading Schedule',
      themeToLight: 'Switch to light mode',
      themeToDark: 'Switch to dark mode',
      themeLight: 'Light mode',
      themeDark: 'Dark mode',
      home: 'Shofar AI Home',
      language: 'Language'
    },
    app: {
      title: 'Bible Reading Schedule',
      tagline: 'Create team reading order and copy message-ready text.',
      alertSelectTeam: 'Please select a team to generate the schedule.',
      alertAddMembers: 'Please add members to the team first.',
      alertError: 'An error occurred while generating the schedule.'
    },
    team: {
      title: 'Team Management',
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
      days: 'Number of days',
      hint: 'Generating for selected team: {n} members',
      generate: 'Generate Schedule',
      generating: 'Generating...'
    },
    scheduleDisplay: {
      empty: 'No schedule yet. Add members and generate a schedule.',
      schedule: '{name} Schedule',
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
      alertSelectTeam: 'Selecciona un equipo para generar el calendario.',
      alertAddMembers: 'Añade miembros al equipo primero.',
      alertError: 'Error al generar el calendario.'
    },
    team: {
      title: 'Equipos',
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
      days: 'Días a generar',
      hint: 'Equipo seleccionado: {n} miembros',
      generate: 'Generar calendario',
      generating: 'Generando...'
    },
    scheduleDisplay: {
      empty: 'Aún no hay calendario. Añade miembros y genera uno.',
      schedule: 'Calendario de {name}',
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
      alertSelectTeam: 'スケジュールを生成するチームを選択してください。',
      alertAddMembers: 'まずチームにメンバーを追加してください。',
      alertError: 'スケジュールの生成中にエラーが発生しました。'
    },
    team: {
      title: 'チーム管理',
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
      days: '生成する日数',
      hint: '選択チーム: {n}名で生成',
      generate: 'スケジュール生成',
      generating: '生成中...'
    },
    scheduleDisplay: {
      empty: 'スケジュールがありません。メンバーを追加して生成してください。',
      schedule: '{name} スケジュール',
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
      alertSelectTeam: 'یک تیم برای ساخت برنامه انتخاب کنید.',
      alertAddMembers: 'ابتدا اعضای تیم را اضافه کنید.',
      alertError: 'خطا در ساخت برنامه.'
    },
    team: {
      title: 'مدیریت تیم',
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
      days: 'تعداد روزها',
      hint: 'تیم انتخاب\u200cشده: {n} نفر',
      generate: 'ساخت برنامه',
      generating: 'در حال ساخت...'
    },
    scheduleDisplay: {
      empty: 'برنامه\u200cای وجود ندارد. اعضا را اضافه و برنامه بسازید.',
      schedule: 'برنامه {name}',
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
      alertSelectTeam: '请选择要生成日程的团队。',
      alertAddMembers: '请先为该团队添加成员。',
      alertError: '生成日程时出错。'
    },
    team: {
      title: '团队管理',
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
      days: '生成天数',
      hint: '已选团队：{n} 人',
      generate: '生成日程',
      generating: '生成中...'
    },
    scheduleDisplay: {
      empty: '暂无日程。请先添加成员并生成日程。',
      schedule: '{name} 日程',
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
    }
  })
}
