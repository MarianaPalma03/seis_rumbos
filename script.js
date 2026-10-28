'use strict';
const $=id=>document.getElementById(id);
const dates=[{short:'Jue',day:29,month:'oct',full:'Jueves 29 de octubre',id:'2026-10-29'},{short:'Vie',day:30,month:'oct',full:'Viernes 30 de octubre',id:'2026-10-30'},{short:'Sáb',day:31,month:'oct',full:'Sábado 31 de octubre',id:'2026-10-31'},{short:'Dom',day:1,month:'nov',full:'Domingo 1 de noviembre',id:'2026-11-01'},{short:'Jue',day:5,month:'nov',full:'Jueves 5 de noviembre',id:'2026-11-05',unavailable:true},{short:'Vie',day:6,month:'nov',full:'Viernes 6 de noviembre',id:'2026-11-06'},{short:'Sáb',day:7,month:'nov',full:'Sábado 7 de noviembre',id:'2026-11-07'},{short:'Dom',day:8,month:'nov',full:'Domingo 8 de noviembre',id:'2026-11-08'}];
const times=['13:00','14:30','16:00','18:00','19:30','21:00'];
let selectedDay=1,selectedTime='18:00',people=2,completed=false;
function guestText(){return people+' '+(people===1?'persona':'personas')}
function renderChoices(){
 $('dates').replaceChildren();dates.forEach((date,index)=>{const button=document.createElement('button');button.type='button';button.className='choice date'+(selectedDay===index?' selected':'');button.disabled=!!date.unavailable;button.setAttribute('aria-label',date.full+(date.unavailable?', agotado':''));button.setAttribute('aria-pressed',String(selectedDay===index));button.innerHTML='<span>'+date.short+'</span><strong>'+date.day+'</strong><span>'+date.month+'</span>';button.onclick=()=>{if(!date.unavailable){selectedDay=index;renderChoices()}};$('dates').append(button)});
 $('times').replaceChildren();times.forEach(time=>{const button=document.createElement('button');button.type='button';button.className='choice time'+(selectedTime===time?' selected':'');button.disabled=time==='16:00';button.textContent=time;button.setAttribute('aria-pressed',String(selectedTime===time));button.setAttribute('aria-label',time+(button.disabled?', agotado':''));button.onclick=()=>{if(!button.disabled){selectedTime=time;renderChoices()}};$('times').append(button)});
 $('people-label').textContent=guestText();$('minus').disabled=people===1;$('plus').disabled=people===10;
}
function showScreen(id){['welcome','booking','contact','confirmed'].forEach(key=>{const section=$(key);section.hidden=key!==id;section.classList.remove('entering')});const section=$(id);void section.offsetWidth;section.classList.add('entering');window.scrollTo({top:0,behavior:'instant'});const heading=section.querySelector('h1');if(heading)heading.focus({preventScroll:true});}
function mexicanPhone(value){const digits=value.replace(/\D/g,'');return digits.length===10?digits:(digits.length===12&&digits.startsWith('52')?digits.slice(2):null)}
function firstName(value){return value.trim().split(/\s+/u)[0]||''}
function assignTable(){return String(Math.floor(Math.random()*20)+1).padStart(2,'0')}
function setError(id,message){const input=$(id);input.setAttribute('aria-invalid',message?'true':'false');const errorId=id==='full-name'?'name-error':id+'-error';$(errorId).textContent=message;input.setAttribute('aria-describedby',errorId)}
$('start').onclick=()=>showScreen('booking');
$('plus').onclick=()=>{people=Math.min(10,people+1);renderChoices()};$('minus').onclick=()=>{people=Math.max(1,people-1);renderChoices()};
$('continue').onclick=()=>{if(dates[selectedDay].unavailable||selectedTime==='16:00')return;$('summary').textContent=dates[selectedDay].short+' '+dates[selectedDay].day+' '+dates[selectedDay].month+'  •  '+selectedTime+' h  •  '+guestText();showScreen('contact')};
$('back').onclick=()=>showScreen('booking');
['full-name','email','phone'].forEach(id=>$(id).addEventListener('input',()=>setError(id,'')));
$('reservation-form').addEventListener('submit',event=>{
 event.preventDefault();if(completed)return;
 const fullName=$('full-name').value.trim().replace(/\s+/gu,' '),email=$('email').value.trim();$('email').value=email;
 const invalid=[];
 [['full-name',fullName?'':'Escribe tu nombre completo.'],['email',email&&$('email').validity.valid?'':'Escribe un correo electrónico válido.'],['phone',mexicanPhone($('phone').value)?'':'Escribe 10 dígitos de México o +52 seguido de 10 dígitos.']].forEach(([id,error])=>{setError(id,error);if(error)invalid.push(id)});
 if(invalid.length){$(invalid[0]).focus();return}
 completed=true;$('greeting').textContent=firstName(fullName)+', te esperamos.';$('final-name').textContent=fullName;$('final-date').textContent=dates[selectedDay].full;$('final-time').textContent=selectedTime+' h';$('final-people').textContent=guestText();$('final-table').textContent=assignTable();showScreen('confirmed');
});
$('home').onclick=()=>{selectedDay=1;selectedTime='18:00';people=2;completed=false;$('reservation-form').reset();['full-name','email','phone'].forEach(id=>setError(id,''));['greeting','final-name','final-date','final-time','final-people','final-table','summary'].forEach(id=>$(id).textContent='');renderChoices();showScreen('welcome')};
renderChoices();
