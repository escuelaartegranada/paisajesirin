import React, { useState, useEffect } from 'react';
import { LESSONS, ACTIVITIES, ENGLISH_VOCAB } from './data/db';
import { Star, ArrowLeft, CheckCircle2, Play, Trophy, ShieldCheck, Home, Volume2, Waves } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound, speakText, stopSpeaking } from './audio';

// Utilities
const triggerConfetti = () => {
  confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
};

// UI Components
const Button = ({ children, onClick, color = 'bg-blue-500', className = '' }: any) => (
  <button 
    onClick={() => {
      playSound('click');
      onClick();
    }} 
    className={`${color} text-white font-bold py-4 px-6 rounded-3xl shadow-lg transform transition active:scale-95 hover:brightness-110 ${className}`}
  >
    {children}
  </button>
);

const Card = ({ title, icon, color, onClick }: any) => (
  <div 
    onClick={() => {
      playSound('click');
      onClick();
    }} 
    className={`cursor-pointer ${color} text-white rounded-[40px] p-6 shadow-2xl border-b-8 border-black/20 transform transition hover:scale-105 flex flex-col items-center justify-center text-center`}
  >
    <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
      <span className="text-5xl">{icon}</span>
    </div>
    <h3 className="text-2xl font-black uppercase tracking-wide">{title}</h3>
  </div>
);

const TopBar = ({ onBack, title, stars }: any) => {
  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  return (
    <div className="flex justify-between items-center p-6 bg-blue-100/80 backdrop-blur-md sticky top-0 z-50 border-b-4 border-white/50 shadow-md">
      {onBack ? (
         <button onClick={() => { playSound('click'); onBack(); }} className="p-3 bg-white text-blue-600 rounded-full shadow-lg border-2 border-blue-200 hover:scale-110 transition-transform flex-shrink-0"><ArrowLeft size={24} strokeWidth={3} /></button>
      ) : <div className="w-12"></div>}
      <h1 className="text-xl md:text-3xl font-black text-blue-900 flex-1 text-center uppercase tracking-wide px-4">{title}</h1>
      <div className="flex items-center bg-yellow-400 text-yellow-900 px-5 py-2 rounded-full font-black shadow-lg border-4 border-white flex-shrink-0">
        {stars} <Star className="inline ml-1 fill-yellow-900" size={20}/>
      </div>
    </div>
  );
};

// --- SCREENS ---

export const HomeScreen = ({ setScreen }: any) => (
  <div className="bg-blue-50 font-sans overflow-hidden flex flex-col relative min-h-screen">
    {/* Sky & Background Decorations */}
    <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-200 to-transparent"></div>
    <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full opacity-80 blur-sm shadow-inner"></div>
    <div className="absolute top-20 right-20 w-32 h-16 bg-white rounded-full opacity-60 blur-md"></div>

    {/* Main Header */}
    <header className="relative z-10 p-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-lg border-4 border-white">
          <span className="text-4xl">⭐</span>
        </div>
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-blue-900 leading-tight uppercase tracking-wide">Guardianes de los Paisajes</h1>
          <p className="text-xl font-bold text-blue-600 flex items-center gap-2">¡Repasa el Tema 7 jugando!</p>
        </div>
      </div>

      <div onClick={() => setScreen('progress')} className="bg-white rounded-3xl px-6 py-3 flex items-center gap-4 shadow-xl border-4 border-yellow-200 cursor-pointer hover:scale-105 transition-transform">
        <div className="text-right">
          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Mi Progreso</p>
          <p className="text-2xl font-black text-green-500">Estrellas</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-2xl">🏆</span>
        </div>
      </div>
    </header>

    {/* Navigation Grid (The Core Dashboard) */}
    <main className="relative z-10 flex-1 px-8 py-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 max-w-7xl mx-auto w-full mb-12">
      {/* Lessons */}
      <div onClick={() => setScreen('lessons')} className="cursor-pointer bg-green-400 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-green-600 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">📖</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Lecciones</h2>
        <p className="text-green-100 font-bold mt-2">Aprende el tema</p>
      </div>

      {/* English Vocabulary */}
      <div onClick={() => setScreen('vocab')} className="cursor-pointer bg-pink-400 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-pink-600 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">🇬🇧</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Vocabulary</h2>
        <p className="text-pink-100 font-bold mt-2 text-center">Picture Dictionary<br/>20 Palabras</p>
      </div>

      {/* Kahoot Style Quiz */}
      <div onClick={() => setScreen('kahoot')} className="cursor-pointer bg-purple-500 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-purple-700 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">🎯</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Kahoot Info</h2>
        <p className="text-purple-100 font-bold mt-2">Práctica Tranquila</p>
      </div>

      {/* Kahoot Timed */}
      <div onClick={() => setScreen('kahootTimed')} className="cursor-pointer bg-red-500 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-red-700 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">⏳</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Quiz Timer</h2>
        <p className="text-red-100 font-bold mt-2">¡Compite contra el reloj!</p>
      </div>

       {/* Practice */}
       <div onClick={() => setScreen('practice')} className="cursor-pointer bg-orange-400 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-orange-600 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">🎮</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Juegos</h2>
        <p className="text-orange-100 font-bold mt-2">Práctica Libre</p>
      </div>

      {/* Mini Exam */}
      <div onClick={() => setScreen('exam')} className="cursor-pointer bg-blue-500 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-blue-700 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">📝</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Mini Examen</h2>
        <p className="text-blue-100 font-bold mt-2 text-center">Prepárate para<br/>el martes día 12</p>
      </div>

      {/* Progress / Parent Zone */}
      <div onClick={() => setScreen('progress')} className="cursor-pointer bg-teal-400 rounded-[40px] p-6 shadow-2xl flex flex-col items-center justify-center border-b-8 border-teal-600 hover:transform hover:scale-105 transition-all">
        <div className="w-24 h-24 bg-white/30 rounded-full flex items-center justify-center mb-4">
          <span className="text-5xl">⭐</span>
        </div>
        <h2 className="text-3xl font-black text-white uppercase tracking-wide">Estrellas</h2>
        <p className="text-teal-100 font-bold mt-2">Mi Progreso</p>
      </div>
    </main>

    {/* Mascot & Footer Instruction */}
    <footer className="relative z-20 p-8 flex items-end justify-between hidden md:flex pb-16">
      <div className="bg-white p-6 rounded-[32px] rounded-bl-none shadow-2xl border-4 border-blue-400 relative max-w-lg mb-8">
        <p className="text-2xl font-black text-blue-900">
          ¡Hola Guardiana! ¿Quieres empezar el repaso? ¡Toca un botón!
        </p>
        <div className="absolute -left-12 -bottom-2">
          <div className="w-32 h-32 bg-contain bg-no-repeat" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2240%22 fill=%22%23FFD700%22/><circle cx=%2235%22 cy=%2240%22 r=%225%22/><circle cx=%2265%22 cy=%2240%22 r=%225%22/><path d=%22M 30 65 Q 50 80 70 65%22 stroke=%22black%22 stroke-width=%223%22 fill=%22none%22/></svg>')" }}></div>
        </div>
      </div>
    </footer>

    {/* Bottom Grass Texture */}
    <div className="fixed bottom-0 left-0 w-full h-8 bg-green-600 z-10"></div>
    <div className="fixed bottom-8 left-0 w-full h-4 bg-green-500 z-10"></div>
  </div>
);

export const LessonsScreen = ({ setScreen, setParams }: any) => (
  <div className="min-h-screen bg-blue-50 pb-10 flex flex-col">
    <TopBar title="Lecciones" onBack={() => setScreen('home')} stars={0} />
    <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto flex-1">
      {LESSONS.map(lesson => (
        <Card 
          key={lesson.id} 
          {...lesson} 
          onClick={() => {
            setParams({ lessonId: lesson.id });
            setScreen('lessonInfo');
          }} 
        />
      ))}
    </div>
  </div>
);

export const LessonInfoScreen = ({ setScreen, params }: any) => {
  const lesson = LESSONS.find(l => l.id === params.lessonId);
  if(!lesson) return null;

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <TopBar title={lesson.title} onBack={() => setScreen('lessons')} stars={0} />
      <div className="flex-1 max-w-4xl mx-auto p-8 flex flex-col items-center justify-center pb-20">
        <div className={`w-32 h-32 ${lesson.color} rounded-[40px] flex items-center justify-center text-7xl shadow-2xl border-b-8 border-black/20 mb-10 transform transition hover:-translate-y-2`}>
          {lesson.icon}
        </div>
        
        <div className="bg-white rounded-[40px] p-8 md:p-12 w-full mb-8 shadow-2xl border-b-8 border-gray-200 text-center relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 font-black px-6 py-2 rounded-full border-4 border-white shadow-md uppercase tracking-widest text-sm">Lee atentamente</div>
          {lesson.content.map((ph, i) => (
            <p key={i} className="text-xl md:text-2xl text-gray-800 mb-6 font-bold leading-relaxed">{ph}</p>
          ))}
        </div>
        
        <div className="w-full flex flex-col md:flex-row gap-6 mb-12">
          {lesson.vocabEs.length > 0 && (
            <div className="flex-1 bg-white p-6 rounded-[32px] shadow-xl border-b-8 border-blue-200">
              <span className="font-black text-blue-900 uppercase tracking-widest block mb-4 text-center">Palabras clave</span>
              <div className="flex flex-wrap gap-2 justify-center">
                {lesson.vocabEs.map(w => (
                  <button 
                    key={w} 
                    onClick={() => speakText(w, 'es-ES')}
                    className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-4 py-2 rounded-full text-sm font-black shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
                  >
                    <Volume2 size={14} /> {w}
                  </button>
                ))}
              </div>
            </div>
          )}
          {lesson.vocabEn.length > 0 && (
             <div className="flex-1 bg-white p-6 rounded-[32px] shadow-xl border-b-8 border-pink-200">
               <span className="font-black text-pink-900 uppercase tracking-widest block mb-4 text-center">English vocabulary</span>
               <div className="flex flex-wrap gap-2 justify-center">
                 {lesson.vocabEn.map(w => (
                    <button 
                      key={w} 
                      onClick={() => speakText(w, 'en-US')}
                      className="bg-pink-100 text-pink-800 hover:bg-pink-200 px-4 py-2 rounded-full text-sm font-black shadow-sm flex items-center gap-1 active:scale-95 transition-transform"
                    >
                      <Volume2 size={14} /> {w}
                    </button>
                 ))}
               </div>
             </div>
          )}
        </div>

        <div className="flex gap-4 w-full max-w-md">
          <button onClick={() => speakText(lesson.content.join('. '), 'es-ES')} className="bg-yellow-400 hover:bg-yellow-300 border-b-8 border-yellow-600 active:border-b-0 active:translate-y-2 transition-all flex-1 text-yellow-900 font-black text-xl md:text-2xl py-6 rounded-[40px] shadow-2xl flex items-center justify-center uppercase tracking-wide">
             <Volume2 className="mr-2" size={28} /> Escuchar
          </button>
          
          <button onClick={() => { playSound('click'); setScreen('practice'); }} className="bg-green-500 hover:bg-green-400 border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all flex-[2] text-white font-black text-xl md:text-2xl py-6 rounded-[40px] shadow-2xl flex items-center justify-center uppercase tracking-wide">
             ¡A Practicar! <Play className="inline ml-2 fill-white" size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export const VocabScreen = ({ setScreen }: any) => {
  return (
    <div className="min-h-screen bg-pink-50 flex flex-col">
      <TopBar title="Vocabulary 🇬🇧" onBack={() => setScreen('home')} stars={0} />
      <div className="flex-1 p-8 grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-7xl mx-auto pb-16">
        {ENGLISH_VOCAB.map(v => (
          <button 
            key={v.en} 
            onClick={() => {
              playSound('click');
              speakText(v.en, 'en-US');
            }}
            className="bg-white rounded-[32px] p-6 flex flex-col items-center justify-center text-center shadow-xl border-b-8 border-pink-200 transform transition hover:-translate-y-2 hover:border-pink-400 active:translate-y-0 active:border-b-0 w-full"
          >
             <h2 className="text-xl md:text-2xl font-black text-pink-600 mb-2 flex items-center gap-1">
               <Volume2 size={20} className="opacity-50" /> {v.en}
             </h2>
             <div className="h-2 w-12 bg-pink-100 rounded-full mb-3"></div>
             <p className="text-sm md:text-base font-black text-gray-500 tracking-widest uppercase">{v.es}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
