export type Company = {slug:string;name:string;category:string;status:'active'|'development'|'exploration'|'concept';tagline:string;description:string;accent:string;directions:string[];websiteUrl?:string};
export const statusLabels = {active:'Активный проект',development:'В разработке',exploration:'Исследование',concept:'Концепция'};
export const companies:Company[] = [
{slug:'chainso',name:'Chainso',category:'Технологии / Программное обеспечение',status:'active',tagline:'Технологический проект группы.',description:'Chainso — активный технологический проект в экосистеме ZERQON. Подробная информация о продукте готовится к публикации.',accent:'#2563ff',directions:['Развитие проекта','Продуктовый подход','Связь с экосистемой']},
{slug:'hospitality',name:'Ресторанные технологии',category:'Ресторанные технологии',status:'development',tagline:'Устройства и ПО для ресторанов.',description:'Исследуем технологические решения для ресторанов и индустрии гостеприимства: от подключённых устройств до новых сценариев взаимодействия с гостями и персоналом.',accent:'#c7a079',directions:['Подключённые устройства','Опыт гостей','Автоматизация процессов','Умная инфраструктура']},
{slug:'atlas',name:'Project Atlas',category:'Искусственный интеллект',status:'exploration',tagline:'Исследования искусственного интеллекта.',description:'Исследуем возможности искусственного интеллекта для создания новых продуктов и автоматизации сложных процессов.',accent:'#8065ff',directions:['Исследование гипотез','Интеллектуальные системы','Автоматизация']},
{slug:'nexus',name:'Project Nexus',category:'Инфраструктура / Инструменты разработки',status:'concept',tagline:'Инфраструктура и инструменты разработки.',description:'Изучаем новые подходы к инфраструктуре, инструментам разработки и управлению сложными системами.',accent:'#70a5b7',directions:['Инфраструктура','Инструменты разработки','Сложные системы']},
{slug:'orbit',name:'Project Orbit',category:'Технологии будущего',status:'exploration',tagline:'Эксперименты с новыми технологиями.',description:'Пространство для экспериментов с новыми технологическими направлениями.',accent:'#aab1c6',directions:['Новые направления','Эксперименты','Поиск возможностей']}
];
export type Division = {
 slug:'labs'|'ventures'|'technologies';
 name:'ZERQON Labs'|'ZERQON Ventures'|'ZERQON Technologies';
 title:string;purpose:string;text:string;items:string[];
};
export const directions:Division[] = [
 {slug:'labs',name:'ZERQON Labs',title:'От идеи до самостоятельного бизнеса.',purpose:'Исследование идей, разработка MVP, запуск собственных компаний.',text:'ZERQON Labs — направление, в котором новые идеи проходят путь от первоначальной гипотезы до работающего технологического продукта и самостоятельного бизнеса.',items:['Идея','Исследование','Прототип','Продукт','Компания']},
 {slug:'ventures',name:'ZERQON Ventures',title:'Капитал и участие в развитии.',purpose:'Венчурные инвестиции, финансирование стартапов, приобретение долей.',text:'ZERQON Ventures — инвестиционное направление группы, ориентированное на поиск перспективных проектов, участие в их развитии и создание долгосрочной стоимости.',items:['Венчурные инвестиции','Финансирование стартапов','Приобретение долей']},
 {slug:'technologies',name:'ZERQON Technologies',title:'Инженерия собственных продуктов.',purpose:'Разработка и развитие технологических продуктов группы.',text:'ZERQON Technologies — инженерное и технологическое направление, объединяющее разработку, техническую экспертизу и развитие собственных продуктов.',items:['Программное обеспечение','Инфраструктура','Искусственный интеллект','Автоматизация','Подключённые системы','Разработка продуктов']}
];
