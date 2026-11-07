import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';

export const runtime='nodejs';
const SYSTEM=`Tu es Camille, professeure de français chaleureuse et rigoureuse spécialisée dans le DELF B1. Ton élève est A2-B1. Parle principalement en français clair et accessible. Pose UNE question à la fois et attends la réponse. Aide avec la grammaire, le vocabulaire, la prononciation et l'expression orale. Pour chaque réponse de l'élève, donne une correction brève sous ces rubriques lorsque pertinent : Ma phrase, Correction, Pourquoi, Expression naturelle. Ne sois pas excessivement critique. Ne prétends jamais avoir entendu un son si tu n'as reçu que du texte. En mode DELF, évalue la pertinence, la cohérence, la grammaire et la richesse lexicale. Ne prétends pas attribuer une note officielle DELF. Réponses courtes, interactives, bien structurées. N'introduis aucune donnée personnelle privée dans tes réponses.`;

export async function POST(req:NextRequest){
 try {
  const key=process.env.OPENAI_API_KEY, url=process.env.NEXT_PUBLIC_SUPABASE_URL, anon=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!key||!url||!anon) return NextResponse.json({error:'Server setup incomplete. Configure API keys.'},{status:503});
  const bearer=req.headers.get('authorization')||'';
  if(!bearer.startsWith('Bearer '))return NextResponse.json({error:'Sign in required.'},{status:401});
  const sb=createClient(url,anon,{global:{headers:{Authorization:bearer}},auth:{persistSession:false,autoRefreshToken:false}});
  const token=bearer.slice(7);
  const {data:{user},error:authError}=await sb.auth.getUser(token);
  if(authError||!user)return NextResponse.json({error:'Session expired. Please sign in again.'},{status:401});
  const body=await req.json();
  const message=body.message;
  const mode=['conversation','writing','exam'].includes(body.mode)?body.mode:'conversation';
  if(typeof message!=='string'||!message.trim()||message.length>5000)return NextResponse.json({error:'Message must be 1–5000 characters.'},{status:400});
  // Basic authenticated usage ceiling for the starter. Add atomic distributed limits in production.
  const dayAgo=new Date(Date.now()-24*60*60*1000).toISOString();
  const {count:dailyCount,error:quotaError}=await sb.from('chat_messages').select('id',{count:'exact',head:true}).eq('mode',mode).eq('role','user').gte('created_at',dayAgo);
  if(quotaError)return NextResponse.json({error:'Unable to check daily AI usage.'},{status:500});
  if((dailyCount||0)>=50)return NextResponse.json({error:'You have reached 50 messages in this mode today. Please return tomorrow.'},{status:429});
  const {data:recent,error:dbError}=await sb.from('chat_messages').select('role,content').eq('mode',mode).order('created_at',{ascending:false}).limit(12);
  if(dbError)return NextResponse.json({error:'Could not load your learning history. Check database setup.'},{status:500});
  const context=recent?.reverse().map(m=>({role:m.role==='assistant'?'assistant' as const:'user' as const,content:m.content}))||[];
  const ai=new OpenAI({apiKey:key});
  const response=await ai.responses.create({model:process.env.OPENAI_MODEL||'gpt-4.1-mini',instructions:SYSTEM+(mode==='exam'?' Mode simulation DELF B1, donne une rétroaction structurée et des conseils concrets.':'') ,input:[...context,{role:'user',content:message}],max_output_tokens:650});
  const answer=response.output_text?.trim();
  if(!answer)return NextResponse.json({error:'AI did not return a reply.'},{status:502});
  const {error:saveError}=await sb.from('chat_messages').insert([{user_id:user.id,mode,role:'user',content:message},{user_id:user.id,mode,role:'assistant',content:answer}]);
  if(saveError)return NextResponse.json({error:'Could not save conversation. Please retry.'},{status:500});
  return NextResponse.json({reply:answer});
 }catch(e){console.error('Tutor request failed',e);return NextResponse.json({error:'Tutor unavailable. Please try again.'},{status:500});}
}
