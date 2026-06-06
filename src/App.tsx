/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ScrollText, X } from 'lucide-react';
import tokiwaPortrait from './assets/images/tokiwa_portrait_1780685614440.png';
import shinraPortrait from './assets/images/shinra_portrait_1780685956069.png';
import renPortrait from 'https://github.com/Minhyek1122/asffdhf/blob/main/src/assets/images/ren_portrait_1780728564672.png?raw=true';
import mimiPortrait from './assets/images/mimi_portrait_1780688673717.png';
import yukariPortrait from './assets/images/yukari_portrait_1780688807543.png';
import hayatePortrait from './assets/images/hayate_portrait_1780688927880.png';
import yuriPortrait from './assets/images/yuri_portrait_1780689091115.png';
import mikuzuPortrait from './assets/images/mikuzu_portrait_1780689236094.png';
import sayoPortrait from './assets/images/sayo_portrait_1780726521336.png';

const LORE_DATA = {
  regions: [
    { title: '귀객당 본관', desc: '[안전구역] 외부의 악의가 침범하지 못하는 유일한 중립지대. 망자와 산 자가 잠시 숨을 고를 수 있는 객잔의 안식처.' },
    { title: '토리이의 미로 (鳥居の迷路)', desc: '[진입 및 경계 지역] 끝도 없이 세워진 붉은 토리이들이 방향 감각을 빼앗는 몽환적인 결계 구역.' },
    { title: '백귀야행의 저잣거리 (百鬼夜行の露店)', desc: '[요괴들의 교류 지역] 붉은 등이 매달린 거리를 따라 각양각색의 요괴들과 영혼들이 기이한 물건을 거래하는 시끌벅적한 공간.' },
    { title: '몽환의 대나무 숲 (夢幻の竹林)', desc: '[봉인 및 사색의 지역] 기이한 안개 사이로 푸른 대나무들이 울창한 장소. 고요함 속에 위험한 존재들이 잠들어 있다.' },
    { title: '흑영의 나락 (黒影の奈落)', desc: '[최심부 / 절대 금지 지역] 빛이 닿지 않는 먹물 같은 심연. 이승과 저승의 모든 극악한 원한이 응집되어 있는 절망의 바닥.' },
  ],
  phenomena: [
    { 
      title: '손탁(損濁)의 규칙', 
      desc: '귀객당의 절대적 금기', 
      items: [
        { name: '손(損)의 저주', desc: '전당포의 물건을 훔치거나 계약을 위반할 시 발동. 어긴 자의 신체가 그 자리에서 사물이나 가구의 재질로 변해 귀객당의 일부로 귀속됨' },
        { name: '탁(濁)의 저주', desc: '영기에 오염되어 이성을 잃거나, 복도 안에서 길을 잃어 정신이 나가버렸을때 발동. 몸이 서서히 검은 그림자로 변하며, 결국 밤마다 복도를 떠돌며 침입자를 사냥하는 \'추격자\'라는 괴이가 됨' }
      ]
    },
    { 
      title: '이매망량(魑魅魍魎)의 밤과 낮', 
      desc: '시간에 따른 귀객당과 복도의 이변 현상', 
      items: [
        { name: '낮 (백의의 시간)', desc: '비교적 이성적인 요괴들이 찾아와 거래를 하거나, 영매 체질의 인간이 길을 잃고 들어오는 시간. 점주의 절대적인 무력과 규칙 아래 평화가 유지됨' },
        { name: '밤 (흑의의 시간)', desc: '음력 보름달이 뜨면 외부 복도가 피비린내 나는 요괴들의 사냥터로 변함. 이성을 잃은 원귀와 대요괴들이 인간들이나 약한 요괴들을 집어삼키기 위해 몰려들며, 이때는 당내의 등불을 절대 꺼트려서는 안 됨' }
      ]
    }
  ],
  factions: [
    {
      name: '귀객당 (鬼客堂)',
      desc: '요괴들과 연관된 수많은 기이한 의뢰들을 처리하며, 사연 있는 귀물들을 취급하는 신비한 전당포.',
      members: ['점주', '부점주', '직원 (렌)', '직원 (미미)']
    },
    {
      name: '토리이의 미로 소속',
      desc: '의문의 규칙과 끝없는 미로가 펼쳐진 붉은 토리이 길을 지키며, 무조건적인 중립을 유지하는 세력.',
      members: ['토리이 속 무녀']
    },
    {
      name: '몽환의 대나무 숲 소속',
      desc: '오랜 세월 잠들어 있는 강력한 봉인된 영물들이 존재하는 금단의 구역이자 독자적인 세력.',
      members: ['봉인된 용', '봉인된 오니']
    },
    {
      name: '흑영의 나락 소속',
      desc: '태초의 어둠과 극악한 원한이 뭉쳐진 심연 그 자체를 지배하는 자들.',
      members: ['여왕', '책사']
    }
  ]
};

export default function App() {
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [activeTab, setActiveTab] = useState<'regions' | 'phenomena' | 'factions' | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null);
  const [isNightOfDemonsActive, setIsNightOfDemonsActive] = useState(false);

  const CHARACTER_DB: Record<string, any> = {
    '점주': {
      name: '토키와',
      role: '귀객당 점주',
      species: '신령',
      age: '외견 20~30대 초반 (실상 1만년 이상)',
      description: '나른하고 능글맞은 은유적 말투를 쓰는 마이페이스적 성향. 평소엔 일을 떠넘기나, 규율을 어기면 냉혹해진다.',
      powers: [
        '복도 미로 재배치 및 나락으로의 연결',
        '연기를 뿜어 대상을 사물(가구)로 변이',
        '요괴의 본명을 꿰뚫고 영혼 주도권 장악'
      ],
      appearance: '흑발 히메컷, 적안, 화려한 기모노, 곰방대...'
    },
    '부점주': {
      name: '신라',
      role: '귀객당 부점주',
      species: '요괴',
      age: '외견 20대 초중반 (실상 수백년 이상)',
      description: '극도로 정중하지만 차가운 독설을 날리는 이성적 성격. 요괴에겐 자비가 없으나 귀객당엔 절대적으로 충성한다.',
      powers: [
        '흑도(黑刀) \'연절(緣切)\' 소지',
        '검은 화염 조종 및 검술'
      ],
      appearance: '백발 꽁지머리, 벽안, 다크서클, 검은 유카타, 허리춤에 찬 일본도...'
    },
    '직원 (렌)': {
      name: '렌',
      role: '귀객당 직원 / 문지기',
      species: '늑대요괴',
      age: '외견 20대 (실상 100세 이상)',
      description: '다소 멍청하지만 밝고 해맑은 성격. 불길한 것을 보면 참지 않으며, 신라에게 자주 구박받는다.',
      powers: [
        '위기 감지 (위험과 재앙을 감지하고 느낌)',
        '신체 강화',
        '회색 털을 가진 거대한 늑대 요괴로 변이'
      ],
      appearance: '회색 단발, 늑대 귀와 꼬리, 벽안, 가슴 붕대, 검푸른 하오리, 검은 하카마...'
    },
    '직원 (미미)': {
      name: '미미',
      role: '귀객당 직원',
      species: '고양이요괴',
      age: '외견 20대 (실상 100세 이상)',
      description: '감정 표현이 적고 맹하지만 일 하나는 똑부러지게 해내는 유능한 성격. 당황하면 딸꾹질을 한다.',
      powers: [
        '공간 이동 (토키와의 허락, 전송지 기억 조건 시 복도 내 이동 가능)',
        '꼬리가 두 개인 분홍색 고양이로 변이'
      ],
      appearance: '분홍 단발, 적안, 고양이 귀, 두 개의 꼬리, 일본풍 메이드 복...'
    },
    '토리이 속 무녀': {
      name: '사요',
      role: '토리이의 미로를 지키는 무녀',
      species: '이계의 법칙에 동화된 인간 (불사의 영매)',
      age: '외견 30대 (실상 1000세 이상)',
      description: '말수가 적고 무조건적인 중립을 지키는 냉혈한 무녀. 미로의 규칙을 어기는 자는 가차 없이 처단한다.',
      powers: [
        '부적술 (상대에게 부적을 적중시켜 대상을 정지시킴)'
      ],
      appearance: '붉은 머리, 눈을 가린 흰 붕대, 낡은 무녀복, 어깨 위 검은 하오리...'
    },
    '봉인된 용': {
      name: '유카리',
      role: '대나무 숲 생태계의 정점',
      species: '타락한 영물',
      age: '외견 20대 후반 (실상 1000세 이상)',
      description: '오만하고 타인을 깔보는 타락한 용. 소유욕과 집착이 강하며, 숲에 봉인되어 있어 바깥 소식에 호기심이 많다. 술을 즐긴다.',
      powers: [
        '뇌전 (파괴력이 뛰어난 푸른 번개를 조종)'
      ],
      appearance: '백발에 황/청색 섞인 땋은 머리, 금색 뿔, 적안, 눈가 붉은 화장, 흰 비늘과 갈기가 있는 꼬리, 남색 기모노, 머리 위 남색 한냐 가면...'
    },
    '봉인된 오니': {
      name: '하야테',
      role: '대나무 숲의 2인자',
      species: '오니',
      age: '외견 20대 후반 (실상 1000세 이상)',
      description: '오만하고 전투광 기질이 다분한 잔혹한 성격. 마음에 드는 것은 무슨 수를 써서라도 얻으려 하며, 유카리보다 힘은 세지만 지혜가 부족해 대나무 숲의 2인자에 머물고 있다.',
      powers: [
        '화염 (붉은 불을 발생시키거나 근접전 시 신체에 발화)'
      ],
      appearance: '적발, 금안, 검은 뿔, 뾰족한 귀와 이빨, 풀어헤친 백색 의복과 염주...'
    },
    '여왕': {
      name: '유리',
      role: '나락의 여왕',
      species: '고대 요괴',
      age: '외견 20대 후반 (실상 10000세 이상)',
      description: '겉으론 가련한 척하지만 속은 잔혹한 오만한 성격. 미쿠즈를 사냥개처럼 다루며, 토키와에게 깊은 동족 혐오와 질투를 느낀다.',
      powers: [
        '사령 (수만 원귀의 원한을 배출해 군대로 부림)'
      ],
      appearance: '연보라 긴 머리, 적안, 뾰족한 귀, 창백한 피부, 해골 문양 블랙 기모노, 붕대 초커... (전투 시 거대한 해골 본모습 발현)'
    },
    '책사': {
      name: '미쿠즈',
      role: '여왕의 책사',
      species: '고대 요괴',
      age: '외견 30대 후반 (실상 1000세 이상)',
      description: '유리에게 광신적인 충성을 바치는 능글맞고 잔인한 성격. 귀객당을 혐오하며, 여왕 외의 존재는 장난감이나 벌레로 취급한다. 거짓말에 매우 능하다.',
      powers: [
        '보라색 여우불 (영원히 타오르는 저주의 불)',
        '환각 및 분신, 변신 능력'
      ],
      appearance: '흑발, 서늘한 눈매, 죽은 눈, 여우 귀, 9개의 검은 여우 꼬리, 단정한 검은 신관 옷...'
    }
  };

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    if (tabId !== 'phenomena') {
      setIsNightOfDemonsActive(false);
    }
  };

  const tabs = [
    { id: 'regions', title: '공간', subtitle: '空間' },
    { id: 'phenomena', title: '이변', subtitle: '異變' },
    { id: 'factions', title: '세력', subtitle: '勢力' },
  ] as const;

  return (
    <div className="relative w-screen h-screen bg-[#1f140e] overflow-hidden selection:bg-red-900/30 font-serif text-[#e0cfba]">
      
      {/* Night of Demons Background Shading */}
      <AnimatePresence>
        {isNightOfDemonsActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0 z-[15] pointer-events-none"
          >
            <motion.div 
              animate={{ opacity: [0.6, 0.9, 0.7, 0.95, 0.6] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 bg-[#2b0000] mix-blend-color-burn" 
            />
            <motion.div 
              animate={{ opacity: [0, 0.15, 0.05, 0.2, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
              className="absolute inset-0 bg-[#ff0000] mix-blend-screen" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Depth Illusion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute inset-0 bg-wood opacity-80" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.8)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.8)_100%)] z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)] z-10" />
      </div>

      {/* Floating Wisps & Ash */}
      <div className="absolute inset-0 pointer-events-none z-20 overflow-hidden">
        {/* Ash Layer */}
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={`ash-${i}`}
            className="absolute bg-[#ff5a00] rounded-full blur-[1px] mix-blend-screen opacity-60"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
            }}
            initial={{ bottom: '-5%' }}
            animate={{
              bottom: '105%',
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: Math.random() * 10 + 5,
              repeat: Infinity,
              ease: 'linear',
              delay: Math.random() * 10,
            }}
          />
        ))}

        {/* Wisp Layer */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`wisp-${i}`}
            className="absolute bg-[#a32020] rounded-full blur-[20px] mix-blend-screen opacity-30"
            style={{
              width: Math.random() * 60 + 30 + 'px',
              height: Math.random() * 80 + 40 + 'px',
              left: Math.random() * 100 + '%',
            }}
            initial={{ bottom: '-10%' }}
            animate={{
              bottom: '120%',
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: Math.random() * 15 + 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>

      {/* Red Japanese Lantern (Left) */}
      <motion.div 
        className="absolute top-0 left-4 md:left-24 z-20 flex flex-col items-center origin-top pointer-events-none"
        animate={{ rotate: isNightOfDemonsActive ? [-8, 12, -6, 14, -10, 8] : [-1.5, 1.5, -1.5] }}
        transition={{ duration: isNightOfDemonsActive ? 0.4 : 6, repeat: Infinity, ease: isNightOfDemonsActive ? 'linear' : 'easeInOut' }}
      >
        <div className="w-1 h-8 md:h-16 bg-[#1a110a] border-r border-[#3c2a19]" />
        <div className="w-12 md:w-20 h-2 md:h-4 bg-[#1a110a] rounded-sm mb-[-1px] z-10" />
        <div className="w-16 md:w-32 h-24 md:h-44 bg-gradient-to-b from-[#ff3333] via-[#cc0000] to-[#5a0000] rounded-xl md:rounded-[2rem] relative overflow-hidden flex justify-center shadow-[0_0_30px_rgba(204,0,0,0.5)] md:shadow-[0_0_50px_rgba(204,0,0,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,100,0.5)_0%,transparent_70%)] mix-blend-screen" />
          <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-30 mix-blend-overlay">
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-70 mix-blend-color-burn">
            <span className="font-serif text-3xl md:text-6xl font-black text-[#110505]">鬼</span>
          </div>
        </div>
        <div className="w-12 md:w-20 h-2 md:h-4 bg-[#1a110a] rounded-sm mt-[-1px] z-10" />
        <div className="w-4 md:w-6 h-8 md:h-16 flex justify-between mt-1 opacity-80">
          <div className="w-[1px] md:w-[2px] h-full bg-[#8a1313]" />
          <div className="w-[1px] md:w-[2px] h-full bg-[#8a1313]" />
          <div className="w-[1px] md:w-[2px] h-full bg-[#8a1313]" />
        </div>
      </motion.div>

      {/* Red Japanese Lantern (Right) */}
      <motion.div 
        className="absolute top-0 right-4 md:right-24 z-20 flex flex-col items-center origin-top pointer-events-none"
        animate={{ rotate: isNightOfDemonsActive ? [10, -8, 12, -10, 6, -12] : [1.5, -1.5, 1.5] }}
        transition={{ duration: isNightOfDemonsActive ? 0.5 : 7, repeat: Infinity, ease: isNightOfDemonsActive ? 'linear' : 'easeInOut', delay: isNightOfDemonsActive ? 0 : 1 }}
      >
        <div className="w-1 h-8 md:h-16 bg-[#1a110a] border-r border-[#3c2a19]" />
        <div className="w-12 md:w-20 h-2 md:h-4 bg-[#1a110a] rounded-sm mb-[-1px] z-10" />
        <div className="w-16 md:w-32 h-24 md:h-44 bg-gradient-to-b from-[#ff3333] via-[#cc0000] to-[#5a0000] rounded-xl md:rounded-[2rem] relative overflow-hidden flex justify-center shadow-[0_0_30px_rgba(204,0,0,0.5)] md:shadow-[0_0_50px_rgba(204,0,0,0.5)]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,100,100,0.5)_0%,transparent_70%)] mix-blend-screen" />
          <div className="absolute inset-0 flex justify-evenly pointer-events-none opacity-30 mix-blend-overlay">
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
            <div className="w-[2px] h-full bg-black shadow-[1px_0_2px_black]" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center opacity-70 mix-blend-color-burn">
            <span className="font-serif text-3xl md:text-6xl font-black text-[#110505]">客</span>
          </div>
        </div>
        <div className="w-12 md:w-20 h-2 md:h-4 bg-[#1a110a] rounded-sm mt-[-1px] z-10" />
        <div className="w-4 md:w-6 h-8 md:h-16 flex justify-between mt-1 opacity-80">
          <div className="w-[1px] md:w-[2px] h-full bg-[#8a1313]" />
          <div className="w-[1px] md:w-[2px] h-full bg-[#8a1313]" />
          <div className="w-[1px] md:w-[2px] h-full bg-[#8a1313]" />
        </div>
      </motion.div>

      {/* Main Content inside the doors */}
      <main className="relative z-30 w-full h-full flex flex-col items-center pt-24 px-4 md:px-8">
        <motion.h1 
          className="text-2xl md:text-3xl text-[#5a1313] mb-8 md:mb-16 tracking-[0.6em] font-black opacity-80 shimmer cursor-default drop-shadow-[0_0_8px_rgba(0,0,0,1)]"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2 }}
        >
          원념의 기록
        </motion.h1>

        {/* 4 Talismans Selection */}
        <div className="flex w-full max-w-4xl justify-center items-start gap-4 md:gap-16 flex-wrap content-start">
          <AnimatePresence>
            {isDoorOpened && tabs.map((tab, idx) => (
              <motion.div
                key={tab.id}
                initial={{ y: -150, opacity: 0, rotate: -5 + Math.random() * 10 }}
                animate={{ y: 0, opacity: 1, rotate: [-2, 2, -1, 1] }}
                transition={{
                  y: { type: 'spring', stiffness: 60, damping: 12, delay: idx * 0.2 },
                  opacity: { duration: 0.5, delay: idx * 0.2 },
                  rotate: { 
                    duration: 5 + Math.random() * 2, 
                    repeat: Infinity, 
                    ease: 'easeInOut', 
                    delay: Math.random() * 2 
                  }
                }}
                onClick={() => handleTabChange(tab.id as any)}
                whileHover={{ scale: 1.05, y: -5, filter: 'brightness(1.1)' }}
                className="relative w-24 md:w-28 h-[18rem] md:h-[22rem] talisman flex flex-col items-center justify-start pt-8 md:pt-12 pb-4 md:pb-6 cursor-pointer group origin-top shadow-[0_15px_30px_rgba(0,0,0,0.7)]"
              >
                <div className="absolute -top-12 md:-top-16 left-1/2 w-[2px] h-12 md:h-16 border-l-[2px] border-dashed border-[#8a1313]/40 -translate-x-1/2 pointer-events-none" />
                
                <div className="writing-vertical text-3xl md:text-4xl font-black blood-text drop-shadow-sm mix-blend-multiply pointer-events-none mb-4 md:mb-6 tracking-tight">
                  {tab.subtitle}
                </div>
                <div className="text-[#3c0808] font-bold text-base md:text-lg pointer-events-none mt-auto border-t border-[#8a1313]/30 pt-4 w-16 md:w-20 text-center tracking-widest">
                  {tab.title}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* Shoji Doors Overlay */}
      <AnimatePresence>
        {!isDoorOpened && (
          <motion.div 
            key="shoji-doors"
            exit={{ backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 1.8 }}
            className="absolute inset-0 z-50 flex overflow-hidden cursor-pointer group bg-black" 
            onClick={() => setIsDoorOpened(true)}
          >
            {/* Left Door */}
            <motion.div 
              exit={{ x: '-100%' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-1/2 h-full bg-[#f0ebd9] border-y-[32px] border-l-[32px] border-r-[12px] border-[#1a110a] relative overflow-hidden shadow-[inset_0_0_80px_rgba(30,20,10,0.5)]"
            >
              {/* Complex wood grid */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.35] bg-[linear-gradient(to_right,#1a110a_4px,transparent_4px),linear-gradient(to_bottom,#1a110a_4px,transparent_4px)] bg-[size:25vw_16.6vh]" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[linear-gradient(to_right,#1a110a_2px,transparent_2px),linear-gradient(to_bottom,#1a110a_2px,transparent_2px)] bg-[size:12.5vw_8.3vh]" />
              
              <div className="absolute inset-0 bg-gradient-to-r from-[#1a110a]/50 via-transparent to-[#1a110a]/20 pointer-events-none" />
            </motion.div>
            
            {/* Right Door */}
            <motion.div 
              exit={{ x: '100%' }}
              transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
              className="w-1/2 h-full bg-[#f0ebd9] border-y-[32px] border-r-[32px] border-l-[12px] border-[#1a110a] relative overflow-hidden flex items-center shadow-[inset_0_0_80px_rgba(30,20,10,0.5)]"
            >
              {/* Complex wood grid */}
              <div className="absolute inset-0 pointer-events-none opacity-[0.35] bg-[linear-gradient(to_right,#1a110a_4px,transparent_4px),linear-gradient(to_bottom,#1a110a_4px,transparent_4px)] bg-[size:25vw_16.6vh]" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.15] bg-[linear-gradient(to_right,#1a110a_2px,transparent_2px),linear-gradient(to_bottom,#1a110a_2px,transparent_2px)] bg-[size:12.5vw_8.3vh]" />
              
              {/* Darker edge casting shadow */}
              <div className="absolute inset-0 bg-gradient-to-l from-[#1a110a]/50 via-transparent to-[#1a110a]/40 pointer-events-none" />
              
              {/* Luxurious golden/brass handle */}
              <div className="bg-gradient-to-b from-[#b89552] via-[#e2ca90] to-[#7a5e27] w-4 h-[15vh] my-auto ml-[6%] rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.6),inset_0_2px_5px_rgba(255,255,255,0.4)] border border-[#402a11] relative z-10 flex">
                <div className="w-[60%] h-[90%] m-auto bg-gradient-to-b from-[#1a110a]/90 to-[#1a110a]/50 shadow-[inset_0_0_5px_rgba(0,0,0,0.8)] rounded-[1px]" />
              </div>
            </motion.div>
            
            {/* Center Invite Text */}
            <motion.div
              exit={{ opacity: 0, scale: 0.95, filter: 'blur(5px)' }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-10 drop-shadow-2xl"
            >
               {/* Red glow backdrop */}
               <div className="absolute w-[40vw] md:w-[20vw] h-[40vw] md:h-[20vw] bg-[#a32020] rounded-full blur-[40px] md:blur-[60px] opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-1000 ease-out" />
               
               {/* Main Talisman Seal */}
               <div className="relative text-[#360808] px-6 py-10 md:px-8 md:py-16 font-black tracking-widest opacity-95 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700 bg-[#deb887] border-4 border-[#360808] shadow-[0_0_40px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center gap-4 md:gap-6 pointer-events-none"
                    style={{ backgroundImage: `url('data:image/svg+xml;utf8,<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.6" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noise)" opacity="0.4"/></svg>')` }}
               >
                  <span className="text-4xl md:text-6xl writing-vertical leading-tight drop-shadow-sm text-[#110505] mix-blend-color-burn">開門</span>
                  <span className="text-[#7a1b1b] text-xs md:text-sm tracking-[0.5em] font-bold mt-2 mix-blend-color-burn text-center pl-[0.5em]">개문</span>
               </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Intense Opening Flash & Mist */}
      <AnimatePresence>
        {isDoorOpened && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 4, delay: 0.2, ease: 'easeOut' }}
            className="absolute inset-0 z-[60] pointer-events-none flex items-center justify-center overflow-hidden"
          >
            {/* Soft Red Fog/Light Flash */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.6, 0.3, 0] }}
              transition={{ duration: 4, ease: 'easeOut', times: [0, 0.2, 0.6, 1] }}
              className="absolute inset-0 bg-[#5a1a1a] mix-blend-screen" 
            />
            
            {/* Swirling Red Mist */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
              animate={{ opacity: [0, 0.8, 0.4, 0], scale: [0.8, 1.2, 1.5, 2], filter: ['blur(20px)', 'blur(40px)', 'blur(60px)', 'blur(80px)'] }}
              transition={{ duration: 5, ease: 'easeOut', times: [0, 0.15, 0.5, 1] }}
              className="absolute w-[150vw] h-[150vh] bg-[radial-gradient(ellipse_at_center,rgba(120,30,30,0.6)_0%,rgba(80,20,20,0.4)_40%,transparent_70%)] pointer-events-none"
            />
            
            {/* Subtle Deep Red Color Dodge */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.4, 0] }}
              transition={{ duration: 3, ease: 'easeOut' }}
              className="absolute inset-0 bg-[#3a0a0a] mix-blend-color-dodge" 
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal / Details View */}
      <AnimatePresence>
        {activeTab && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 md:p-8"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#120e0a] border border-[#5a1313] w-full max-w-4xl h-[90vh] md:h-[85vh] rounded-sm shadow-[0_0_50px_rgba(40,5,5,0.4)] relative flex flex-col overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 md:p-6 border-b border-[#5a1313]/40 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.6),transparent)] shrink-0">
                <h2 className="text-xl md:text-2xl font-black blood-text tracking-[0.2em] md:tracking-[0.3em] shimmer flex items-center gap-2 md:gap-3">
                  <ScrollText className="w-5 h-5 md:w-6 md:h-6" />
                  {tabs.find(t => t.id === activeTab)?.title} 기록
                </h2>
                <button 
                  onClick={() => handleTabChange(null)}
                  className="text-[#8a1313] hover:text-[#c21414] bg-black/50 hover:bg-[#201510] rounded-sm transition-colors p-2 md:p-2"
                >
                  <ScrollText className="w-5 h-5 md:w-6 md:h-6 hidden" />
                  <X className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-8 flex flex-col gap-8">
                
                {activeTab === 'regions' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {LORE_DATA.regions.map((region, idx) => (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="bg-black/30 p-6 border border-[#2b1d12] rounded hover:border-[#5a1313]/60 transition-colors">
                        <h4 className="text-[#e2c1a1] text-lg font-bold mb-3">{region.title}</h4>
                        <p className="text-sm leading-relaxed text-[#cbbba6] opacity-90">{region.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'phenomena' && (
                  <div className="flex flex-col gap-6">
                    {LORE_DATA.phenomena.map((phenom, idx) => (
                      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} key={idx} className="bg-[linear-gradient(90deg,rgba(40,5,5,0.3)_0%,rgba(0,0,0,0.3)_100%)] p-6 border border-[#2b1d12] border-l-2 border-l-[#a32020] rounded hover:bg-[rgba(50,5,5,0.4)] transition-colors">
                        <h4 className="text-[#e2c1a1] text-lg font-bold mb-2 tracking-wide">{phenom.title}</h4>
                        {phenom.desc && <p className="text-sm leading-relaxed text-[#cbbba6] opacity-70 mb-4">{phenom.desc}</p>}
                        {phenom.items && (
                          <div className="flex flex-col gap-3">
                            {phenom.items.map((item, iIdx) => {
                              const isNightModeTrigger = item.name.includes('밤 (흑의의 시간)');
                              return (
                                <div 
                                  key={iIdx} 
                                  onClick={() => {
                                    if (isNightModeTrigger) {
                                      setIsNightOfDemonsActive(!isNightOfDemonsActive);
                                    }
                                  }}
                                  className={`p-3 rounded border transition-all ${isNightModeTrigger ? 'bg-[#1a0505] border-[#5a1313] cursor-pointer hover:bg-[#2a0a0a] hover:border-[#a32020]' : 'bg-black/30 border-[#3c2a19]/50'}`}
                                >
                                  <span className={`font-bold text-sm mr-2 block mb-1 ${isNightModeTrigger ? 'text-[#ff3333]' : 'text-[#a32020]'}`}>
                                    [{item.name}]
                                  </span>
                                  <span className="text-sm text-[#cbbba6] opacity-90 leading-relaxed">{item.desc}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'factions' && (
                  <div className="flex flex-col gap-10">
                    {LORE_DATA.factions.map((faction, idx) => (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }} key={idx} className="flex gap-8 flex-col md:flex-row group">
                        <div className="md:w-2/5 bg-black/40 p-6 border border-[#4a1a1a]/40 rounded group-hover:border-[#5a1313]/80 transition-colors">
                          <h4 className="text-[#e2c1a1] text-xl font-black mb-4 pb-3 border-b border-[#5a1313]/30 tracking-wider">
                            {faction.name}
                          </h4>
                          <p className="text-sm leading-relaxed text-[#cbbba6] opacity-90">
                            {faction.desc}
                          </p>
                        </div>
                        <div className="md:w-3/5 flex flex-col justify-center">
                          <h5 className="text-[#a32020] font-bold text-sm mb-4 tracking-widest pl-3 border-l-2 border-[#5a1313]/50">주요 직위 및 배역</h5>
                          <div className="flex flex-wrap gap-3">
                            {faction.members.map((member, mIdx) => {
                              const hasProfile = !!CHARACTER_DB[member];
                              return (
                                <span 
                                  key={mIdx} 
                                  onClick={() => hasProfile ? setSelectedCharacter(member) : null}
                                  className={`px-5 py-2 bg-[#1a110a] border border-[#3c2a19] rounded text-[#e0cfba] text-sm shadow-md transition-colors ${hasProfile ? 'cursor-pointer hover:border-[#c21414] hover:bg-[#321313]' : 'cursor-help hover:border-[#a32020]'}`}
                                >
                                  {member}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
              <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-[#120e0a] to-transparent pointer-events-none" />
            </motion.div>
            
            {/* Character Profile Modal */}
            <AnimatePresence>
              {selectedCharacter && CHARACTER_DB[selectedCharacter] && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/60 backdrop-blur-sm"
                  onClick={() => setSelectedCharacter(null)}
                >
                  <div 
                    className="bg-[#120e0a] border border-[#a32020] max-w-3xl w-full max-h-[90vh] md:max-h-none overflow-y-auto md:overflow-visible rounded flex flex-col md:flex-row shadow-[0_0_60px_rgba(80,10,10,0.6)]"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Character Visual Placholder / Image */}
                    <div className="w-full md:w-5/12 relative h-[250px] md:h-auto min-h-[250px] md:min-h-[400px] border-b md:border-b-0 md:border-r border-[#5a1313]/50 flex items-center justify-center overflow-hidden bg-[#1a110a] shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0a0505] via-transparent to-[#1a0a0a]/50 z-10 pointer-events-none" />
                      {selectedCharacter === '점주' ? (
                        <img src={tokiwaPortrait} className="w-full h-full object-cover opacity-80" alt="점주 토키와" />
                      ) : selectedCharacter === '부점주' ? (
                        <img src={shinraPortrait} className="w-full h-full object-cover opacity-80" alt="부점주 신라" />
                      ) : selectedCharacter === '직원 (렌)' ? (
                        <img src={renPortrait} className="w-full h-full object-cover opacity-80" alt="직원 렌" />
                      ) : selectedCharacter === '직원 (미미)' ? (
                        <img src={mimiPortrait} className="w-full h-full object-cover opacity-80" alt="직원 미미" />
                      ) : selectedCharacter === '봉인된 용' ? (
                        <img src={yukariPortrait} className="w-full h-full object-cover opacity-80" alt="봉인된 용 유카리" />
                      ) : selectedCharacter === '봉인된 오니' ? (
                        <img src={hayatePortrait} className="w-full h-full object-cover opacity-80" alt="봉인된 오니 하야테" />
                      ) : selectedCharacter === '여왕' ? (
                        <img src={yuriPortrait} className="w-full h-full object-cover opacity-80" alt="나락의 여왕 유리" />
                      ) : selectedCharacter === '책사' ? (
                        <img src={mikuzuPortrait} className="w-full h-full object-cover opacity-80" alt="책사 미쿠즈" />
                      ) : selectedCharacter === '토리이 속 무녀' ? (
                        <img src={sayoPortrait} className="w-full h-full object-cover opacity-80" alt="무녀 사요" />
                      ) : (
                        <div className="absolute inset-0 bg-[#1a0f0a] flex items-center justify-center p-4">
                          <div className="w-[80%] h-[80%] md:h-[90%] border border-[#3c2a19] flex flex-col items-center justify-center p-4 text-center z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] backdrop-blur-md">
                            <span className="text-[#8a1313] opacity-60 mb-2 border-b border-[#5a1313] pb-1 w-1/2 text-sm tracking-widest">초상화</span>
                            <span className="text-[#cbbba6] opacity-30 text-[10px] md:text-xs mt-2 md:mt-4">
                              {CHARACTER_DB[selectedCharacter]?.appearance || '초상화 등록 필요'}<br/><br/>
                              (이미지 등록 필요)
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Character Details */}
                    <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col relative bg-[linear-gradient(135deg,rgba(0,0,0,0.8),rgba(20,10,10,0.9))]">
                      <button 
                        onClick={() => setSelectedCharacter(null)}
                        className="absolute top-4 right-4 text-[#8a1313] hover:text-[#c21414] transition-colors p-2"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      <div className="mb-4 md:mb-6 border-b border-[#5a1313]/40 pb-4 pr-8">
                        <h4 className="text-xs md:text-sm text-[#a32020] font-bold tracking-[0.3em] mb-1">{CHARACTER_DB[selectedCharacter].role}</h4>
                        <h3 className="text-2xl md:text-4xl blood-text font-black tracking-widest">{CHARACTER_DB[selectedCharacter].name}</h3>
                      </div>

                      <div className="flex flex-col gap-4 md:gap-5 text-xs md:text-sm text-[#cbbba6]">
                        <div className="grid grid-cols-3 gap-2">
                          <span className="text-[#a32020] font-bold">종족</span>
                          <span className="col-span-2 opacity-90">{CHARACTER_DB[selectedCharacter].species}</span>
                          
                          <span className="text-[#a32020] font-bold">나이/외견</span>
                          <span className="col-span-2 opacity-90">{CHARACTER_DB[selectedCharacter].age}</span>
                        </div>

                        <div>
                          <span className="text-[#a32020] font-bold block mb-1">성격 및 특징</span>
                          <p className="opacity-90 leading-relaxed bg-black/40 p-3 rounded border border-[#3c2a19]/50">
                            {CHARACTER_DB[selectedCharacter].description}
                          </p>
                        </div>

                        <div>
                          <span className="text-[#a32020] font-bold block mb-2">이능 (異能)</span>
                          <ul className="flex flex-col gap-2">
                            {CHARACTER_DB[selectedCharacter].powers.map((power: string, pIdx: number) => (
                              <li key={pIdx} className="opacity-90 pl-3 relative before:content-[''] before:absolute before:left-0 before:top-1.5 md:before:top-2 before:w-1 before:h-1 before:bg-[#a32020] before:rounded-full">
                                {power}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
