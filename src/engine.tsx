import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Home, Volume2, ChevronLeft, ChevronRight, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playSound, speakText, stopSpeaking } from './audio';
import { ACTIVITIES, ENGLISH_VOCAB } from './data/db';

const triggerConfetti = () => {
  confetti({ particleCount: 150, spread: 80, origin: { y: 0.5 }, colors: ['#FFC700', '#FF0099', '#00FF99'] });
};

export const ActivityEngine = ({ activities, onFinish, onQuit, isKahoot = false }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [stars, setStars] = useState(0);

  useEffect(() => {
    return () => stopSpeaking();
  }, [currentIndex]);

  const act = activities[currentIndex];

  const handleSelect = (opt: string) => {
    if (status !== 'idle') return;
    setSelected(opt);
    if (opt === act.correct) {
      playSound('success');
      setStatus('correct');
      setStars(s => s + 1);
      if(isKahoot) triggerConfetti();
    } else {
      playSound('wrong');
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex + 1 < activities.length) {
      setCurrentIndex(c => c + 1);
      setSelected(null);
      setStatus('idle');
    } else {
      playSound('fanfare');
      triggerConfetti();
      setTimeout(triggerConfetti, 300);
      setTimeout(triggerConfetti, 600);
      onFinish(stars, activities.length);
    }
  };

  const handlePrev = () => {
    playSound('click');
    if (currentIndex > 0) {
      setCurrentIndex(c => c - 1);
      setSelected(null);
      setStatus('idle');
    }
  };

  const handleSpeakQuestion = () => {
    speakText(act.question, isKahoot ? 'en-US' : 'es-ES');
  };

  if (!act) return <div>Loading...</div>;

  // Colorful options
  const vividColors = [
    'bg-rose-100 text-rose-900 border-rose-300 hover:border-rose-400 hover:bg-rose-200',
    'bg-cyan-100 text-cyan-900 border-cyan-300 hover:border-cyan-400 hover:bg-cyan-200',
    'bg-lime-100 text-lime-900 border-lime-300 hover:border-lime-400 hover:bg-lime-200',
    'bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-400 hover:bg-amber-200'
  ];

  const kahootColors = ['bg-red-500 border-red-700', 'bg-blue-500 border-blue-700', 'bg-yellow-500 border-yellow-700', 'bg-green-500 border-green-700'];

  return (
    <div className={`min-h-screen flex flex-col font-sans relative overflow-hidden ${isKahoot ? 'bg-indigo-900' : 'bg-orange-50'}`}>
      
      {/* Background decorations */}
      <div className={`absolute top-0 left-0 w-full h-screen ${isKahoot ? 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAlMjAyMCwwJTIwMTAsMjAiIGZpbGw9IiM0ZjQ2ZTUiIGZpbGwtb3BhY2l0eT0iMC4xIi8+PC9zdmc+")]' : 'bg-[url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iNCIgZmlsbD0iI2ZmYmQ1ZSIgZmlsbC1vcGFjaXR5PSIwLjEiLz48L3N2Zz4=")]'}`}></div>
      <div className={`absolute top-0 left-0 w-full h-64 ${isKahoot ? 'bg-gradient-to-b from-indigo-800 to-transparent' : 'bg-gradient-to-b from-orange-200 to-transparent'}`}></div>
      <div className="absolute top-10 left-10 w-24 h-12 bg-white rounded-full opacity-30 blur-sm pointer-events-none"></div>

      {/* Header */}
      <div className={`relative z-10 p-6 flex justify-between items-center border-b-4 ${isKahoot ? 'bg-indigo-800 border-indigo-700 text-white shadow-lg' : 'bg-white/80 backdrop-blur-md border-white/50 shadow-md'}`}>
        <button onClick={() => { playSound('click'); onQuit(); }} className={`p-3 rounded-full flex items-center justify-center transform transition hover:scale-110 shadow-lg ${isKahoot ? 'bg-indigo-700 text-white border-2 border-indigo-600 hover:bg-indigo-600' : 'bg-white text-orange-500 border-2 border-orange-200 hover:bg-orange-50'}`}>
          <Home size={24} strokeWidth={3} />
        </button>
        <div className="flex gap-2 mx-2">
          <button 
             onClick={handlePrev} 
             disabled={currentIndex === 0}
             className={`p-3 rounded-full flex items-center justify-center transform transition-all shadow-lg border-2 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 hover:-translate-x-1 active:scale-95'} ${isKahoot ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white text-orange-500 border-orange-200 hover:bg-orange-50'}`}
          >
             <ChevronLeft size={24} strokeWidth={4} />
          </button>
          <button 
             onClick={handleNext} 
             className={`p-3 rounded-full flex items-center justify-center transform transition-all shadow-lg border-2 hover:scale-110 hover:translate-x-1 active:scale-95 ${isKahoot ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white text-orange-500 border-orange-200 hover:bg-orange-50'}`}
          >
             <ChevronRight size={24} strokeWidth={4} />
          </button>
        </div>
        <span className="font-black tracking-widest uppercase text-lg hidden md:block flex-1 text-center">
           Pregunta {currentIndex + 1} / {activities.length}
        </span>
        <span className="font-black tracking-widest uppercase text-sm md:hidden flex-1 text-center">
           {currentIndex + 1} / {activities.length}
        </span>
        <div className="flex items-center bg-yellow-400 text-yellow-900 px-4 md:px-5 py-2 rounded-full font-black shadow-lg border-4 border-white">
           {stars} <Star className="inline ml-1 fill-yellow-900" size={20}/>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 md:p-6 max-w-4xl mx-auto w-full">
        
        {/* Topic Tag */}
        {!isKahoot && (
           <div className="flex items-center justify-center gap-2 mb-6">
             <span className="bg-orange-400 text-white px-6 py-2 rounded-full text-sm font-black shadow-md uppercase tracking-widest border-2 border-white">
               {act.theme}
             </span>
             <button onClick={handleSpeakQuestion} className="bg-white text-orange-500 p-2 rounded-full shadow-md border-2 border-orange-100 active:scale-95 transition-transform hover:bg-orange-50">
               <Volume2 size={20} />
             </button>
           </div>
        )}
        {isKahoot && (
           <div className="flex items-center justify-center mb-6">
             <button onClick={handleSpeakQuestion} className="bg-indigo-600 text-white p-3 rounded-full shadow-lg border-2 border-indigo-400 active:scale-95 transition-transform hover:bg-indigo-500 outline-none">
               <Volume2 size={24} />
             </button>
           </div>
        )}

        {/* Question */}
        <div className={`w-full text-center mb-8 ${isKahoot ? 'bg-white p-6 md:p-8 rounded-[40px] shadow-2xl border-b-8 border-gray-300 transform -rotate-1 md:-rotate-2' : ''}`}>
          <h2 className={`text-2xl sm:text-3xl md:text-5xl font-black leading-tight tracking-wide ${isKahoot ? 'text-indigo-900' : 'text-gray-800 bg-white p-8 rounded-[40px] shadow-xl border-b-8 border-orange-200'}`}>
            {act.question}
          </h2>
        </div>

        {/* Options */}
        <div className={`w-full grid ${act.options.length > 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-6 mb-12`}>
          {act.options.map((opt: string, i: number) => {
             // In regular mode, cycle through vivid colors. In Kahoot mode, use Kahoot colors.
             let btnClass = isKahoot 
               ? `${kahootColors[i % 4]} text-white h-32 md:h-36 text-2xl md:text-4xl shadow-2xl overflow-hidden` 
               : `${vividColors[i % 4]} border-b-8 h-24 md:h-28 text-xl md:text-2xl shadow-xl`;

             if (status !== 'idle') {
               if (opt === act.correct) {
                 btnClass = 'bg-green-500 text-white border-green-700 h-32 md:h-36 text-2xl md:text-4xl scale-105 transition-all shadow-2xl border-b-8';
               } else if (opt === selected) {
                 btnClass = 'bg-red-500 text-white border-red-700 h-28 md:h-28 text-xl md:text-2xl opacity-80 border-b-8';
               } else {
                 btnClass += ' opacity-40 cursor-not-allowed scale-95'; // fade others
               }
             } else {
                 // Add bottom border and hover effects to interactive buttons
                 if(isKahoot) btnClass += " border-b-8 hover:-translate-y-1 active:translate-y-2 active:border-b-0";
                 else btnClass += " hover:-translate-y-1 active:translate-y-2 active:border-b-0";
             }

             return (
               <button 
                 key={i}
                 onClick={() => handleSelect(opt)}
                 className={`rounded-[32px] font-black uppercase tracking-wide flex items-center justify-center p-6 transform transition-all relative ${btnClass}`}
                 disabled={status !== 'idle'}
               >
                 <span className="drop-shadow-sm">{opt}</span>
               </button>
             );
          })}
        </div>
        
        {/* Feedback / Next button area */}
        <div className="h-28 w-full max-w-md flex flex-col justify-center items-center pb-8">
          {status === 'idle' && (
             <p className={`font-black uppercase tracking-widest text-lg ${isKahoot ? 'text-white/50' : 'text-orange-400'}`}>
               Selecciona tu respuesta
             </p>
          )}

          {status === 'correct' && (
             <button onClick={handleNext} className="w-full bg-green-500 hover:bg-green-400 border-b-8 border-green-700 active:border-b-0 active:translate-y-2 transition-all text-white font-black text-3xl py-6 rounded-[40px] shadow-2xl flex items-center justify-center uppercase tracking-wide animate-bounce">
               ¡Siguiente! <ArrowRight className="ml-4" size={32} />
             </button>
          )}

          {status === 'wrong' && (
             <div className="flex flex-col w-full gap-4">
                 <button onClick={handleNext} className={`w-full font-black text-2xl py-5 rounded-[40px] shadow-xl flex flex-col items-center justify-center border-b-8 active:border-b-0 active:translate-y-2 transition-all uppercase tracking-wide ${isKahoot ? 'bg-white text-indigo-900 border-gray-300 hover:bg-gray-100' : 'bg-white text-orange-600 border-orange-200 hover:bg-orange-50'}`}>
                   <span>Continuar <ArrowRight className="inline ml-2" /></span>
                 </button>
             </div>
          )}
        </div>

      </div>
    </div>
  );
};

export const KahootTimedEngine = ({ onFinish, onQuit }: any) => {
  const kahootActivities = ACTIVITIES.filter(a => a.type === 'kahoot-en');
  // We want to generate questions like: English word -> 4 Spanish translations
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [stars, setStars] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  
  // Kahoot signature colors
  const kColors = ['bg-red-600 border-red-800', 'bg-blue-600 border-blue-800', 'bg-yellow-500 border-yellow-700', 'bg-green-600 border-green-800'];
  // Shapes for the buttons
  const kShapes = ['▲', '◆', '●', '■'];

  useEffect(() => {
    // Generate 15 random vocab questions
    const shuffledVocab = [...ENGLISH_VOCAB].sort(() => 0.5 - Math.random()).slice(0, 15);
    const generatedQs = shuffledVocab.map(v => {
      // Pick 3 random wrong options
      const wrongOpts = ENGLISH_VOCAB.filter(w => w.en !== v.en).sort(() => 0.5 - Math.random()).slice(0, 3).map(w => w.es);
      const allOpts = [...wrongOpts, v.es].sort(() => 0.5 - Math.random());
      return { question: v.en, options: allOpts, correct: v.es };
    });
    setQuestions(generatedQs);
  }, []);

  useEffect(() => {
    if (status !== 'idle' || questions.length === 0 || currentIndex >= questions.length) return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          handleSelect('TIMEOUT');
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [currentIndex, status, questions]);

  const handleSelect = (opt: string) => {
    if (status !== 'idle') return;
    setSelected(opt);
    if (opt === questions[currentIndex].correct) {
      playSound('success');
      setStatus('correct');
      setStars(s => s + 1);
      triggerConfetti();
    } else {
      playSound('wrong');
      setStatus('wrong');
    }
  };

  const handleNext = () => {
    playSound('click');
    if (currentIndex + 1 < questions.length) {
      setCurrentIndex(c => c + 1);
      setSelected(null);
      setStatus('idle');
      setTimeLeft(20);
    } else {
      playSound('fanfare');
      triggerConfetti();
      setTimeout(triggerConfetti, 300);
      onFinish(stars, questions.length);
    }
  };

  if (questions.length === 0) return <div>Cargando...</div>;
  const act = questions[currentIndex];

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-gray-100">
      
      {/* Background */}
      <div className="absolute top-0 left-0 w-full h-full bg-cover opacity-5 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBvbHlnb24gcG9pbnRzPSIwLDAlMjAyMCwwJTIwMTAsMjAiIGZpbGw9IiM0ZjQ2ZTUiIGZpbGwtb3BhY2l0eT0iMSIvPjwvc3ZnPg==')]"></div>

      {/* Header */}
      <div className="relative z-10 p-4 flex justify-between items-center bg-white shadow-md border-b-4 border-gray-200">
        <button onClick={() => { playSound('click'); onQuit(); }} className="bg-gray-200 text-gray-700 p-3 rounded-full shadow-sm hover:bg-gray-300 transition-colors">
          <Home size={24} strokeWidth={3} />
        </button>
        <span className="font-black tracking-widest uppercase text-xl text-gray-800">
           {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center bg-gray-800 text-white px-4 py-2 rounded-full font-black shadow-inner">
           {stars} <Star className="inline ml-1 fill-yellow-400 text-yellow-400" size={20}/>
        </div>
      </div>

      {/* Timer Bar */}
      <div className="w-full h-4 bg-gray-300 relative z-10">
        <div className={`h-full transition-all duration-1000 linear ${timeLeft > 5 ? 'bg-indigo-500' : 'bg-red-500'}`} style={{ width: `${(timeLeft / 20) * 100}%` }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-start p-4 md:p-8 w-full">
        
        {/* Question Header (White Box) */}
        <div className="w-full max-w-4xl relative mb-8">
          {/* Timer Circle */}
          <div className={`absolute -top-6 -left-2 md:-left-10 md:-top-10 w-20 h-20 md:w-32 md:h-32 rounded-full flex items-center justify-center border-4 md:border-8 border-white text-4xl md:text-6xl font-black text-white z-20 transition-colors ${timeLeft <= 5 ? 'bg-red-600 shadow-[0_8px_0_rgba(153,27,27,1)] animate-pulse' : 'bg-purple-600 shadow-[0_8px_0_rgba(88,28,135,1)]'}`}>
            {timeLeft}
          </div>
          <div className="w-full bg-white shadow-2xl rounded-2xl border-b-8 border-gray-300 flex items-center justify-center p-8 md:p-12 min-h-[200px]">
            <h2 className="text-4xl md:text-7xl font-black text-center text-gray-900 tracking-tight uppercase break-words pl-12 md:pl-0">
              {act.question}
            </h2>
          </div>
        </div>

        {/* 2x2 Grid of Color Cards */}
        <div className="w-full max-w-4xl grid grid-cols-2 gap-4 md:gap-6 flex-1">
          {act.options.map((opt: string, i: number) => {
             let btnClass = `${kColors[i % 4]} text-white shadow-[0_8px_0_rgba(0,0,0,0.2)] hover:brightness-110 active:translate-y-2 active:shadow-none`;
             
             if (status !== 'idle') {
               if (opt === act.correct) {
                 btnClass = 'bg-green-500 border-green-700 text-white shadow-[0_8px_0_rgba(0,0,0,0.2)] scale-105 z-10';
               } else if (opt === selected) {
                 btnClass = 'bg-red-600 border-red-800 text-white opacity-90 shadow-none translate-y-2';
               } else {
                 btnClass += ' opacity-50 grayscale'; // fade others
               }
             }

             return (
               <button 
                 key={i}
                 onClick={() => handleSelect(opt)}
                 className={`rounded-[12px] flex items-center justify-start p-4 md:p-8 transform transition-all relative ${btnClass}`}
                 disabled={status !== 'idle'}
               >
                 <span className="text-4xl md:text-6xl mr-4 md:mr-6 drop-shadow-md opacity-80">{kShapes[i % 4]}</span>
                 <span className="text-2xl md:text-4xl font-black uppercase text-left break-words drop-shadow-sm">{opt}</span>
               </button>
             );
          })}
        </div>

        {/* Feedback Area */}
        <div className="h-24 mt-6 w-full max-w-4xl flex items-end">
          {status !== 'idle' && (
             <button onClick={handleNext} className="w-full md:w-auto md:ml-auto bg-blue-600 hover:bg-blue-500 border-b-8 border-blue-800 active:border-b-0 active:translate-y-2 transition-all text-white font-black text-2xl py-4 flex-1 md:px-12 rounded-xl shadow-xl flex items-center justify-center uppercase tracking-tight">
               Siguiente <ArrowRight className="inline ml-2" size={28} />
             </button>
          )}
        </div>

      </div>
    </div>
  );
};

export const ResultScreen = ({ score, total, onHome }: any) => {
  useEffect(() => {
    playSound('fanfare');
  }, []);

  return (
    <div className="min-h-screen bg-yellow-100 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-yellow-300 to-transparent"></div>
      
      <div className="bg-white p-10 rounded-[60px] shadow-2xl border-b-[16px] border-yellow-200 max-w-lg w-full relative z-10 transform transition hover:scale-105">
         <div className="text-yellow-400 mb-8 flex justify-center transform -translate-y-16">
            <div className="bg-white rounded-full p-6 shadow-xl border-4 border-yellow-100">
               <Trophy size={100} className="drop-shadow-lg" />
            </div>
         </div>
         <h1 className="text-5xl font-black text-gray-800 mb-4 uppercase tracking-normal">¡Conseguido!</h1>
         <div className="bg-yellow-50 rounded-3xl p-6 mb-8 border-4 border-yellow-100">
           <p className="text-xl text-gray-600 font-bold uppercase tracking-widest mb-2">Puntuación Final</p>
           <p className="text-4xl font-black text-yellow-600">
             {score} <span className="text-2xl text-yellow-400">/ {total}</span>
           </p>
         </div>
         <button onClick={() => { playSound('click'); onHome(); }} className="bg-blue-500 hover:bg-blue-400 border-b-8 border-blue-700 active:border-b-0 active:translate-y-2 text-white font-black text-2xl py-6 px-10 rounded-[40px] shadow-xl w-full flex justify-center items-center uppercase tracking-wide transition-all">
            <Home className="mr-4" size={32} /> Ir al Mapa
         </button>
      </div>
    </div>
  );
};
