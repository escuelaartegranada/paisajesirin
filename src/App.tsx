import React, { useState } from 'react';
import { HomeScreen, LessonsScreen, LessonInfoScreen, VocabScreen } from './screens';
import { ActivityEngine, ResultScreen, KahootTimedEngine } from './engine';
import { ACTIVITIES } from './data/db';
import { playSound } from './audio';

// Helper to get random subset of array
function getRandomElements(arr: any[], num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

export default function App() {
  const [screen, setScreen] = useState('home');
  const [params, setParams] = useState<any>({});
  
  // State for active game
  const [activeQueue, setActiveQueue] = useState<any[]>([]);
  const [isKahoot, setIsKahoot] = useState(false);
  const [scoreInfo, setScoreInfo] = useState({ score: 0, total: 0 });

  const setScreenWithSound = (id: string) => {
    playSound('click');
    setScreen(id);
  }

  const goHome = () => {
    playSound('click');
    setScreen('home');
    setParams({});
    setActiveQueue([]);
  };

  const startKahoot = () => {
    const kahootPool = ACTIVITIES.filter(a => a.type === 'kahoot-en');
    setActiveQueue(getRandomElements(kahootPool, 100)); // 100 questions for Kahoot
    setIsKahoot(true);
    setScreenWithSound('engine');
  };

  const startPractice = () => {
    const practicePool = ACTIVITIES.filter(a => a.type !== 'kahoot-en');
    setActiveQueue(getRandomElements(practicePool, 100)); // 100 random questions
    setIsKahoot(false);
    setScreenWithSound('engine');
  };

  const startExam = () => {
    // 100 mixed questions
    setActiveQueue(getRandomElements(ACTIVITIES, 100)); 
    setIsKahoot(false);
    setScreenWithSound('engine');
  };

  const handleFinish = (score: number, total: number) => {
    setScoreInfo({ score, total });
    setScreen('result');
  };

  let content;
  switch (screen) {
    case 'home':
      content = <HomeScreen setScreen={setScreenWithSound} />;
      break;
    case 'lessons':
      content = <LessonsScreen setScreen={setScreenWithSound} setParams={setParams} />;
      break;
    case 'lessonInfo':
      content = <LessonInfoScreen setScreen={setScreenWithSound} params={params} />;
      break;
    case 'vocab':
      content = <VocabScreen setScreen={setScreenWithSound} />;
      break;
    case 'kahoot':
      startKahoot();
      break;
    case 'kahootTimed':
      setIsKahoot(true);
      setScreenWithSound('kahootTimedEngine');
      break;
    case 'practice':
      startPractice();
      break;
    case 'exam':
      startExam();
      break;
    case 'engine':
      content = <ActivityEngine activities={activeQueue} isKahoot={isKahoot} onFinish={handleFinish} onQuit={goHome} />;
      break;
    case 'kahootTimedEngine':
      content = <KahootTimedEngine onFinish={handleFinish} onQuit={goHome} />;
      break;
    case 'result':
      content = <ResultScreen score={scoreInfo.score} total={scoreInfo.total} onHome={goHome} />;
      break;
    case 'progress':
      content = (
         <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center p-6 text-center font-sans">
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-teal-200 to-transparent"></div>
            <h1 className="text-5xl font-black text-teal-900 mb-12 uppercase tracking-wide relative z-10">Mis Estrellas</h1>
            
            <div className="bg-white p-12 rounded-[60px] shadow-2xl border-b-[16px] border-teal-200 mb-12 max-w-lg w-full relative z-10 transform transition hover:scale-105">
               <div className="text-7xl mb-6 bg-teal-100 w-32 h-32 mx-auto rounded-full flex justify-center items-center shadow-inner border-4 border-teal-50 transform -translate-y-20">🎖️</div>
               <h2 className="text-3xl font-black text-gray-800 uppercase tracking-normal mb-4 -mt-10">Guardiana de los paisajes</h2>
               <p className="text-teal-600 font-bold uppercase tracking-widest">¡Tema Superado!</p>
            </div>
            
            <button onClick={goHome} className="relative z-10 bg-teal-500 hover:bg-teal-400 border-b-8 border-teal-700 active:border-b-0 active:translate-y-2 text-white font-black py-6 px-12 rounded-[40px] shadow-xl text-2xl uppercase tracking-wide transition-all">
              Volver al mapa
            </button>
         </div>
      );
      break;
    default:
      content = <HomeScreen setScreen={setScreenWithSound} />;
  }

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      {content}
    </div>
  );
}
