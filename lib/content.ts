export type Question = {prompt:string;choices:string[];correct:number;explanation:string};
export type Lesson = {id:string;title:string;level:string;category:string;duration:number;description:string;questions:Question[]};
export const lessons:Lesson[] = [
 {id:'past-tenses',title:'Passé composé ou imparfait ?',level:'B1',category:'Grammaire',duration:8,description:'Raconter une histoire avec les temps du passé.',questions:[
  {prompt:'Quand je _____ petite, je jouais souvent dans ce jardin.',choices:['suis','étais','ai été','serai'],correct:1,explanation:'L’imparfait décrit une habitude ou une situation dans le passé.'},
  {prompt:'Hier, nous _____ un excellent film au cinéma.',choices:['regardions','avons regardé','regardons','regarder'],correct:1,explanation:'Le passé composé exprime une action terminée à un moment précis.'},
  {prompt:'Il _____ quand le téléphone a sonné.',choices:['pleuvait','a plu','pleut','pleuvra'],correct:0,explanation:'L’imparfait décrit une action en cours interrompue par une autre.'},
  {prompt:'L’année dernière, j’_____ à Lyon pendant deux semaines.',choices:['habitais','habite','ai habité','habiterai'],correct:2,explanation:'Une période délimitée et achevée appelle le passé composé.'}]},
 {id:'connectors',title:'Exprimer son opinion',level:'B1',category:'Vocabulaire',duration:7,description:'Organiser ses idées avec des connecteurs logiques.',questions:[
  {prompt:'Je voudrais venir. _____, je dois travailler ce soir.',choices:['Donc','Cependant','Parce que','D’abord'],correct:1,explanation:'Cependant introduit une opposition.'},
  {prompt:'Il étudie chaque soir, _____ il progresse rapidement.',choices:['pourtant','mais','donc','bien que'],correct:2,explanation:'Donc indique une conséquence.'},
  {prompt:'_____ le prix soit élevé, ce cours est intéressant.',choices:['Parce que','Bien que','Donc','Pour'],correct:1,explanation:'Bien que exprime une concession et est suivi du subjonctif.'},
  {prompt:'_____ commencer, je vais présenter les avantages.',choices:['Enfin','En revanche','Pour','Pourtant'],correct:2,explanation:'Pour commencer introduit le premier argument.'}]},
 {id:'conditionnel',title:'Le conditionnel présent',level:'B1',category:'Grammaire',duration:9,description:'Donner des conseils et exprimer des souhaits.',questions:[
  {prompt:'À ta place, je _____ plus tôt.',choices:['partirais','partirai','suis parti','pars'],correct:0,explanation:'Le conditionnel permet de donner un conseil.'},
  {prompt:'Nous _____ visiter Bordeaux cet été.',choices:['voudrons','voulons','voudrions','avons voulu'],correct:2,explanation:'Voudrions est une demande ou un souhait poli.'},
  {prompt:'Si j’avais plus de temps, je _____ davantage.',choices:['lis','lirai','ai lu','lirais'],correct:3,explanation:'Si + imparfait est suivi du conditionnel dans cette hypothèse.'},
  {prompt:'Vous _____ me donner un renseignement ?',choices:['pourriez','pouvez','pourrez','pouviez'],correct:0,explanation:'Pourriez est une formulation polie au conditionnel.'}]},
 {id:'relative-pronouns',title:'Qui, que, où et dont',level:'B1',category:'Grammaire',duration:8,description:'Relier les phrases avec des pronoms relatifs.',questions:[
  {prompt:'Voici le livre _____ je t’ai parlé.',choices:['qui','que','dont','où'],correct:2,explanation:'Parler de quelque chose → dont.'},
  {prompt:'La collègue _____ travaille ici est très sympathique.',choices:['que','qui','où','dont'],correct:1,explanation:'Qui remplace le sujet du verbe travaille.'},
  {prompt:'C’est une ville _____ j’aimerais habiter.',choices:['qui','que','dont','où'],correct:3,explanation:'Où remplace un complément de lieu.'},
  {prompt:'Le film _____ nous avons vu était passionnant.',choices:['que','qui','dont','où'],correct:0,explanation:'Que remplace le complément d’objet direct du verbe voir.'}]}
];
export const examTasks = [
 {id:'writing-opinion',kind:'Écriture',title:'Donner son opinion',time:'25 min',prompt:'Votre ville souhaite interdire les voitures dans le centre-ville le week-end. Écrivez un texte de 160 mots environ pour présenter votre opinion et justifier vos arguments avec des exemples.'},
 {id:'writing-email',kind:'Écriture',title:'Écrire un courriel',time:'25 min',prompt:'Vous avez participé à un cours de français. Écrivez un courriel de 160 mots environ au responsable pour expliquer ce qui vous a plu et proposer deux améliorations.'},
 {id:'oral-debate',kind:'Oral',title:'Défendre un point de vue',time:'10 min',prompt:'Préparez une réponse orale : le télétravail est-il une bonne solution pour tous ? Donnez votre avis, deux arguments et un exemple concret.'},
 {id:'oral-experience',kind:'Oral',title:'Raconter une expérience',time:'10 min',prompt:'Racontez une expérience où vous avez dû apprendre quelque chose de difficile. Expliquez la situation, les obstacles et ce que vous en avez retenu.'}
];
export const dailyPlan=[{day:'Lun',name:'Grammaire',desc:'Les temps du passé'},{day:'Mar',name:'Conversation',desc:'La vie quotidienne'},{day:'Mer',name:'Vocabulaire',desc:'Opinions & connecteurs'},{day:'Jeu',name:'Production écrite',desc:'Exprimer ses idées'},{day:'Ven',name:'Grammaire',desc:'Le conditionnel'},{day:'Sam',name:'DELF B1',desc:'Mise en situation'},{day:'Dim',name:'Révision',desc:'Revoir ses erreurs'}];
