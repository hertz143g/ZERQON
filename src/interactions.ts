/** Keep interface behavior separate from scroll choreography and presentation. */
export function initContactForm(){
 const form=document.querySelector<HTMLFormElement>('#contact-form');if(!form)return;
 const state=document.querySelector<HTMLElement>('#form-state')!;
 const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 const endpoint=import.meta.env.VITE_CONTACT_ENDPOINT as string|undefined;
 if(endpoint){button.textContent='Отправить обращение ↗';form.querySelector('.form-note')!.textContent='Данные будут переданы для ответа на ваше обращение.';}
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  let first:HTMLInputElement|HTMLTextAreaElement|undefined;
  form.querySelectorAll<HTMLInputElement|HTMLTextAreaElement>('input,textarea').forEach(input=>{
   if(input.type!=='checkbox')input.value=input.value.trim();
   const valid=input.checkValidity();input.setAttribute('aria-invalid',String(!valid));
   if(!valid&&!first)first=input;
  });
  if(first){state.textContent='Проверьте имя, адрес почты и сообщение (не менее 10 символов), затем подтвердите согласие.';first.focus();return;}
  const data=new FormData(form);
  if(endpoint){
   button.disabled=true;state.textContent='Отправляем обращение…';
   try{
    const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(data)),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw new Error('delivery');
    state.textContent='Обращение отправлено. Спасибо за интерес к ZERQON.';form.reset();
   }catch{state.textContent='Не удалось отправить обращение. Попробуйте ещё раз позже. Введённые данные сохранены в форме.';}
   finally{button.disabled=false;}
   return;
  }
  const text=`Имя: ${data.get('name')}\nПочта: ${data.get('email')}\nТема: ${data.get('topic')}\n\n${data.get('message')}`;
  const url=URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
  const download=document.createElement('a');download.href=url;download.download='zerqon-обращение.txt';download.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
  state.textContent='Файл обращения подготовлен. Оно не отправлено: канал связи ещё не настроен.';
 });
}
export function initLabTabs(){
 const process=document.querySelector<HTMLElement>('.lab-process');if(!process)return;
 const caption=document.querySelector<HTMLElement>('#stage-description')!;
 const stages=['Формулируем идею и определяем, какую задачу она может решить.','Изучаем контекст, ограничения и возможные подходы.','Проверяем ключевую гипотезу на прототипе.','Продумываем продуктовый сценарий и условия развития.','Ищем основу для самостоятельного технологического бизнеса.'];
 const tabs=Array.from(process.querySelectorAll<HTMLButtonElement>('[role=tab]'));
 const activate=(index:number)=>{
  tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===index));tab.tabIndex=i===index?0:-1;});
  caption.textContent=stages[index];caption.setAttribute('aria-labelledby',`stage-${index}`);
 };
 tabs.forEach((tab,index)=>{
  tab.onclick=()=>activate(index);
  tab.onkeydown=event=>{
   let next=index;
   if(event.key==='ArrowRight')next=(index+1)%tabs.length;
   else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=tabs.length-1;
   else return;
   event.preventDefault();activate(next);tabs[next].focus();
  };
 });
}
