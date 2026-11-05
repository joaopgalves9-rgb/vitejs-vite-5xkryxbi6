import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('study_categories');
      return saved ? JSON.parse(saved) : [
        { id: '1', name: 'Estudo para Concurso', targetHours: 8, color: '#3B82F6' },
        { id: '2', name: 'Faculdade', targetHours: 8, color: '#10B981' }
      ];
    } catch (e) {
      return [
        { id: '1', name: 'Estudo para Concurso', targetHours: 8, color: '#3B82F6' },
        { id: '2', name: 'Faculdade', targetHours: 8, color: '#10B981' }
      ];
    }
  });

  const [history, setHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('study_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [simulatedHistory, setSimulatedHistory] = useState(() => {
    try {
      const saved = localStorage.getItem('study_simulated');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [unlockedAchievements, setUnlockedAchievements] = useState(() => {
    try {
      const saved = localStorage.getItem('study_achievements');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [userAvatar, setUserAvatar] = useState(() => {
    return localStorage.getItem('study_user_avatar') || '🎓';
  });
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const [activeTab, setActiveTab] = useState('timer');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]?.id || '1');
  
  const [timerSeconds, setTimerSeconds] = useState(() => {
    const savedAcc = localStorage.getItem('study_timer_acc');
    const startTime = localStorage.getItem('study_timer_start');
    
    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
      return (parseInt(savedAcc || '0', 10)) + elapsed;
    }
    return parseInt(savedAcc || '0', 10);
  });

  const [isRunning, setIsRunning] = useState(() => {
    return !!localStorage.getItem('study_timer_start');
  });

  const [manualHours, setManualHours] = useState('');
  const [manualMinutes, setManualMinutes] = useState('');

  const [simName, setSimName] = useState('');
  const [simCategory, setSimCategory] = useState('GERAL');
  const [simTotal, setSimTotal] = useState('');
  const [simCorrect, setSimCorrect] = useState('');

  const [newCatName, setNewCatName] = useState('');
  const [newCatTarget, setNewCatTarget] = useState('8');
  const [newCatColor, setNewCatColor] = useState('#6366F1');

  const [editingCategory, setEditingCategory] = useState(null);
  const [editName, setEditName] = useState('');
  const [editTarget, setEditTarget] = useState('8');
  const [editColor, setEditColor] = useState('#3B82F6');

  const [analyticsCategory, setAnalyticsCategory] = useState('ALL');
  const [recentUnlocked, setRecentUnlocked] = useState(null);
  const fileInputRef = useRef(null);

  const AVAILABLE_AVATARS = [
    { icon: '🎓', name: 'Estudante', req: 0 },
    { icon: '🧙‍♂️', name: 'Sabedoria', req: 0 },
    { icon: '⚡', name: 'Elétrico', req: 5 },
    { icon: '🏃', name: 'Maratonista', req: 15 },
    { icon: '🛡️', name: 'Guarda de Elite', req: 30 },
    { icon: '🚀', name: 'Foguete', req: 50 },
    { icon: '👑', name: 'Mestre Supremo', req: 100 }
  ];

  const totalSecondsAll = Array.isArray(history) ? history.reduce((acc, item) => acc + (item.seconds || 0), 0) : 0;
  const totalHoursAll = totalSecondsAll / 3600;
  const totalSimulados = simulatedHistory.length;
  const avgSimulatedPercentage = totalSimulados > 0 
    ? (simulatedHistory.reduce((acc, s) => acc + s.percentage, 0) / totalSimulados).toFixed(1) 
    : '0.0';

  // 🏆 25 CONQUISTAS COM TÍTULO EM DESTAQUE E FUNDO PERSONALIZADO
  const ALL_ACHIEVEMENTS = [
    { id: 'first_session', title: 'Despertar do Guerreiro', desc: 'Salva a tua primeira sessão de estudos.', icon: '🥉', bgSymbol: '⚔️' },
    { id: 'first_1h', title: 'Foco de Aço', desc: 'Registra uma sessão de estudo com pelo menos 1 hora.', icon: '⚡', bgSymbol: '🔥' },
    { id: 'marathon_2h', title: 'Mente Brilhante', desc: 'Registra uma sessão de 2 horas ou mais.', icon: '🧠', bgSymbol: '💡' },
    { id: 'marathon_4h', title: 'Titã dos Estudos', desc: 'Registra uma sessão épica de 4 horas ou mais.', icon: '🏛️', bgSymbol: '⚡' },
    { id: 'target_met_1', title: 'Meta Conquistada', desc: 'Bate a meta semanal de horas de uma matéria.', icon: '🎯', bgSymbol: '🎯' },
    { id: 'month_10h', title: 'Cavaleiro do Edital', desc: 'Acumula 10 horas de estudo no mês atual.', icon: '🌱', bgSymbol: '🛡️' },
    { id: 'month_50h', title: 'Guardião da Matéria', desc: 'Acumula 50 horas de estudo no total geral.', icon: '📚', bgSymbol: '📖' },
    { id: 'total_100h', title: 'Mestre do Conhecimento', desc: 'Alcança a marca de 100 horas totais no histórico.', icon: '🏆', bgSymbol: '👑' },
    { id: 'total_200h', title: 'Lenda dos Concursos', desc: 'Alcança 200 horas totais de dedicação extrema.', icon: '🐉', bgSymbol: '🔥' },
    { id: 'total_500h', title: 'Titã Supremo', desc: 'Alcança a marca lendária de 500 horas de estudo.', icon: '⚡', bgSymbol: '✨' },
    { id: 'sim_1', title: 'Primeiro Simulado', desc: 'Cadastra o seu primeiro simulado no aplicativo.', icon: '📝', bgSymbol: '📋' },
    { id: 'sim_5', title: 'Estrategista de Provas', desc: 'Cadastra um total de 5 simulados realizados.', icon: '📋', bgSymbol: '📊' },
    { id: 'sim_10', title: 'Veterano de Banca', desc: 'Cadastra 10 simulados no seu histórico de treinos.', icon: '💼', bgSymbol: '🏛️' },
    { id: 'sim_high_80', title: 'Gabaritador Nato', desc: 'Mantém média geral superior a 80% nos simulados.', icon: '🎯', bgSymbol: '⭐' },
    { id: 'cat_3', title: 'Polímata dos Concursos', desc: 'Cria e organiza 3 ou mais matérias diferentes.', icon: '🗂️', bgSymbol: '📂' },
    { id: 'sessions_10', title: 'Ritmo Implacável', desc: 'Registra 10 sessões de estudo ao todo.', icon: '📈', bgSymbol: '🚀' },
    { id: 'sessions_25', title: 'Águia Focada', desc: 'Registra 25 sessões de estudo.', icon: '🦅', bgSymbol: '🎯' },
    { id: 'sessions_50', title: 'Imperador do Foco', desc: 'Registra 50 sessões de estudo concluídas.', icon: '👑', bgSymbol: '🌟' },
    { id: 'avatar_unlocked', title: 'Mago dos Avatares', desc: 'Acumula 5h para desbloquear novos visuais de perfil.', icon: '🧙‍♂️', bgSymbol: '✨' },
    { id: 'dedication_pro', title: 'Carga Pesada', desc: 'Acumula mais de 10 simulados cadastrados com 40+ questões cada.', icon: '⚖️', bgSymbol: '🏋️' },
    { id: 'avatar_electric', title: 'Faísca Elétrica', desc: 'Desbloqueia o avatar especial do Raio (5h de estudos).', icon: '⚡', bgSymbol: '⚡' },
    { id: 'avatar_marathon', title: 'Passos de Fogo', desc: 'Desbloqueia o avatar do Maratonista (15h de estudos).', icon: '🏃', bgSymbol: '🔥' },
    { id: 'avatar_guard', title: 'Defensor da Fortaleza', desc: 'Desbloqueia o avatar do Guarda de Elite (30h de estudos).', icon: '🛡️', bgSymbol: '🛡️' },
    { id: 'avatar_rocket', title: 'Propulsão Ativada', desc: 'Desbloqueia o avatar do Foguete (50h de estudos).', icon: '🚀', bgSymbol: '🚀' },
    { id: 'avatar_king', title: 'Reino Conquistado', desc: 'Desbloqueia o avatar supremo da Coroa (100h de estudos).', icon: '👑', bgSymbol: '👑' }
  ];

  const getUserLevel = () => {
    if (totalHoursAll >= 150) return { title: 'Mestre Supremo', color: '#EAB308', icon: '👑' };
    if (totalHoursAll >= 100) return { title: 'Lenda dos Concursos', color: '#EC4899', icon: '🏆' };
    if (totalHoursAll >= 50) return { title: 'Especialista Avançado', color: '#8B5CF6', icon: '⚡' };
    if (totalHoursAll >= 40) return { title: 'Guerreiro Focado', color: '#3B82F6', icon: '🧠' };
    if (totalHoursAll >= 10) return { title: 'Estudante Dedicado', color: '#10B981', icon: '🌟' };
    return { title: 'Iniciante Determinante', color: '#64748B', icon: '🌱' };
  };

  const userLevel = getUserLevel();

  const playVictorySound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.3);
      });
    } catch (e) {}
  };

  useEffect(() => { localStorage.setItem('study_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('study_history', JSON.stringify(history)); checkAchievements(); }, [history, categories, simulatedHistory, totalHoursAll]);
  useEffect(() => { localStorage.setItem('study_simulated', JSON.stringify(simulatedHistory)); checkAchievements(); }, [simulatedHistory]);
  useEffect(() => { localStorage.setItem('study_achievements', JSON.stringify(unlockedAchievements)); }, [unlockedAchievements]);
  useEffect(() => { localStorage.setItem('study_user_avatar', userAvatar); }, [userAvatar]);

  const checkAchievements = () => {
    if (!Array.isArray(history)) return;
    const newlyUnlocked = [...unlockedAchievements];
    const totalSec = history.reduce((acc, item) => acc + (item.seconds || 0), 0);
    const totalHrs = totalSec / 3600;
    const sessionCount = history.length;
    const currentMonth = new Date().toISOString().substring(0, 7);
    const monthSec = history.filter((h) => h.month === currentMonth).reduce((acc, item) => acc + (item.seconds || 0), 0);
    const monthHrs = monthSec / 3600;
    const simCount = simulatedHistory.length;

    let targetsMetCount = 0;
    categories.forEach((cat) => {
      const catSec = history.filter((h) => h.categoryId === cat.id).reduce((acc, item) => acc + (item.seconds || 0), 0);
      if ((catSec / 3600) >= cat.targetHours) targetsMetCount += 1;
    });

    const addIf = (id, condition) => {
      if (condition && !newlyUnlocked.includes(id)) {
        newlyUnlocked.push(id);
      }
    };

    addIf('first_session', sessionCount >= 1);
    addIf('first_1h', history.some(h => h.seconds >= 3600));
    addIf('marathon_2h', history.some(h => h.seconds >= 7200));
    addIf('marathon_4h', history.some(h => h.seconds >= 14400));
    addIf('target_met_1', targetsMetCount >= 1);
    addIf('month_10h', monthHrs >= 10);
    addIf('month_50h', totalHrs >= 50);
    addIf('total_100h', totalHrs >= 100);
    addIf('total_200h', totalHrs >= 200);
    addIf('total_500h', totalHrs >= 500);
    addIf('sim_1', simCount >= 1);
    addIf('sim_5', simCount >= 5);
    addIf('sim_10', simCount >= 10);
    addIf('sim_high_80', simCount > 0 && parseFloat(avgSimulatedPercentage) >= 80);
    addIf('cat_3', categories.length >= 3);
    addIf('sessions_10', sessionCount >= 10);
    addIf('sessions_25', sessionCount >= 25);
    addIf('sessions_50', sessionCount >= 50);
    addIf('avatar_unlocked', totalHoursAll >= 5);
    addIf('dedication_pro', simulatedHistory.filter(s => s.total >= 40).length >= 5);
    
    addIf('avatar_electric', totalHoursAll >= 5);
    addIf('avatar_marathon', totalHoursAll >= 15);
    addIf('avatar_guard', totalHoursAll >= 30);
    addIf('avatar_rocket', totalHoursAll >= 50);
    addIf('avatar_king', totalHoursAll >= 100);

    if (newlyUnlocked.length > unlockedAchievements.length) {
      setUnlockedAchievements(newlyUnlocked);
      const lastId = newlyUnlocked[newlyUnlocked.length - 1];
      const lastAch = ALL_ACHIEVEMENTS.find((a) => a.id === lastId);
      if (lastAch) {
        setRecentUnlocked(lastAch);
        playVictorySound();
        setTimeout(() => setRecentUnlocked(null), 5000);
      }
    }
  };

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        const startTime = localStorage.getItem('study_timer_start');
        const savedAcc = parseInt(localStorage.getItem('study_timer_acc') || '0', 10);
        if (startTime) {
          const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
          setTimerSeconds(savedAcc + elapsed);
        }
      }, 1000);
    } else { clearInterval(interval); }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => { localStorage.setItem('study_timer_start', Date.now().toString()); setIsRunning(true); };
  const handlePause = () => {
    const startTime = localStorage.getItem('study_timer_start');
    const savedAcc = parseInt(localStorage.getItem('study_timer_acc') || '0', 10);
    if (startTime) {
      const elapsed = Math.floor((Date.now() - parseInt(startTime, 10)) / 1000);
      const totalAcc = savedAcc + elapsed;
      localStorage.setItem('study_timer_acc', totalAcc.toString());
      localStorage.removeItem('study_timer_start');
      setTimerSeconds(totalAcc);
    }
    setIsRunning(false);
  };
  const handleReset = () => { localStorage.removeItem('study_timer_start'); localStorage.removeItem('study_timer_acc'); setIsRunning(false); setTimerSeconds(0); };
  const handleSaveSession = () => {
    const currentTotal = isRunning ? timerSeconds : parseInt(localStorage.getItem('study_timer_acc') || '0', 10);
    if (currentTotal < 60) { alert('Registre pelo menos 1 minuto.'); return; }
    addStudySession(selectedCategory, currentTotal); handleReset();
  };
  const handleManualAdd = (e) => {
    e.preventDefault();
    const h = parseInt(manualHours || '0', 10); const m = parseInt(manualMinutes || '0', 10);
    const totalSec = h * 3600 + m * 60;
    if (totalSec <= 0) return alert('Tempo inválido.');
    addStudySession(selectedCategory, totalSec);
    setManualHours(''); setManualMinutes('');
  };
  const addStudySession = (catId, seconds) => {
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const monthStr = dateStr.substring(0, 7);
    setHistory((prev) => [{
      id: 'h-' + Date.now(), categoryId: catId, date: dateStr, seconds, year: now.getFullYear(), month: monthStr, weekStr: 'Semana'
    }, ...prev]);
  };

  const handleAddSimulated = (e) => {
    e.preventDefault();
    const totalQ = parseInt(simTotal || '0', 10);
    const correctQ = parseInt(simCorrect || '0', 10);
    if (totalQ <= 0 || correctQ < 0 || correctQ > totalQ) {
      return alert('Verifique os valores de questões e acertos.');
    }
    const pct = parseFloat(((correctQ / totalQ) * 100).toFixed(1));
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];

    let catNameLabel = 'Simulado Geral / Várias Matérias';
    if (simCategory !== 'GERAL') {
      const foundCat = categories.find((c) => c.id === simCategory);
      if (foundCat) catNameLabel = foundCat.name;
    }

    setSimulatedHistory((prev) => [
      {
        id: 'sim-' + Date.now(),
        name: simName.trim() || 'Simulado Concurso',
        categoryId: simCategory,
        categoryName: catNameLabel,
        total: totalQ,
        correct: correctQ,
        percentage: pct,
        date: dateStr
      },
      ...prev
    ]);

    setSimName('');
    setSimTotal('');
    setSimCorrect('');
  };

  const handleDeleteSimulated = (id) => {
    if (confirm('Deseja excluir este simulado?')) {
      setSimulatedHistory((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories((prev) => [...prev, { id: 'cat-' + Date.now(), name: newCatName.trim(), targetHours: parseFloat(newCatTarget) || 5, color: newCatColor }]);
    setNewCatName(''); setNewCatTarget('8');
  };
  const handleDeleteCategory = (id) => {
    if (categories.length <= 1) return alert('Mínimo de uma categoria.');
    if (confirm('Excluir categoria?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
      setHistory((prev) => prev.filter((h) => h.categoryId !== id));
    }
  };
  const moveCategory = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;
    const updated = [...categories];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setCategories(updated);
  };
  const startEditing = (cat) => {
    setEditingCategory(cat); setEditName(cat.name); setEditTarget(cat.targetHours.toString()); setEditColor(cat.color);
  };
  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editName.trim() || !editingCategory) return;
    setCategories((prev) => prev.map((c) => c.id === editingCategory.id ? { ...c, name: editName.trim(), targetHours: parseFloat(editTarget) || 5, color: editColor } : c));
    setEditingCategory(null);
  };
  const formatTimer = (s) => {
    const hrs = Math.floor(s / 3600); const mins = Math.floor((s % 3600) / 60); const secs = s % 60;
    return (hrs < 10 ? '0' + hrs : hrs) + ':' + (mins < 10 ? '0' + mins : mins) + ':' + (secs < 10 ? '0' + secs : secs);
  };
  const formatHours = (seconds) => (seconds / 3600).toFixed(1);
  const getCategoryCurrentWeekSeconds = (catId) => history.filter((h) => h.categoryId === catId).reduce((a, b) => a + (b.seconds || 0), 0);
  const getTotalSeconds = (catFilter = 'ALL') => history.filter((h) => catFilter === 'ALL' || h.categoryId === catFilter).reduce((a, b) => a + (b.seconds || 0), 0);
  const getMonthSeconds = (catFilter = 'ALL') => {
    const m = new Date().toISOString().substring(0, 7);
    return history.filter((h) => (catFilter === 'ALL' || h.categoryId === catFilter) && h.month === m).reduce((a, b) => a + (b.seconds || 0), 0);
  };
  const getYearSeconds = (catFilter = 'ALL') => {
    const y = new Date().getFullYear();
    return history.filter((h) => (catFilter === 'ALL' || h.categoryId === catFilter) && h.year === y).reduce((a, b) => a + (b.seconds || 0), 0);
  };

  const handleExportJSON = () => {
    const data = { categories, history, simulatedHistory, unlockedAchievements, userAvatar };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'backup_estudos.json'; a.click();
  };
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.categories) setCategories(imported.categories);
        if (imported.history) setHistory(imported.history);
        if (imported.simulatedHistory) setSimulatedHistory(imported.simulatedHistory);
        if (imported.unlockedAchievements) setUnlockedAchievements(imported.unlockedAchievements);
        if (imported.userAvatar) setUserAvatar(imported.userAvatar);
        alert('Backup importado com sucesso!');
      } catch (err) { alert('Erro ao ler arquivo.'); }
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ backgroundColor: '#030712', color: '#f1f5f9', minHeight: '100vh', padding: '16px' }} className="font-sans">
      <input type="file" ref={fileInputRef} onChange={handleImportJSON} accept=".json" style={{ display: 'none' }} />

      {/* Pop-up de Conquista */}
      {recentUnlocked && (
        <div style={{ backgroundColor: '#0f172a', borderColor: '#f59e0b' }} className="fixed top-6 left-1/2 -translate-x-1/2 text-white p-5 rounded-3xl shadow-2xl border-2 flex items-center gap-5 z-50 animate-bounce max-w-md w-11/12">
          <div style={{ backgroundColor: 'rgba(245, 158, 11, 0.2)', borderColor: 'rgba(245, 158, 11, 0.4)' }} className="text-5xl p-3 rounded-2xl border">
            {recentUnlocked.icon}
          </div>
          <div>
            <span style={{ backgroundColor: '#f59e0b', color: '#070a12' }} className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
              NOVA CONQUISTA DESBLOQUEADA!
            </span>
            <p style={{ color: '#fde047' }} className="font-extrabold text-xl mt-1">{recentUnlocked.title}</p>
            <p className="text-xs text-slate-300 mt-0.5">{recentUnlocked.desc}</p>
          </div>
        </div>
      )}

      {/* Modal Avatar */}
      {showAvatarModal && (
        <div style={{ backgroundColor: 'rgba(2, 6, 23, 0.85)' }} className="fixed inset-0 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="border p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-white">🖼️ Escolha seu Avatar</h3>
            <div className="grid grid-cols-3 gap-3">
              {AVAILABLE_AVATARS.map((av, idx) => (
                <button
                  key={idx}
                  disabled={totalHoursAll < av.req}
                  onClick={() => { setUserAvatar(av.icon); setShowAvatarModal(false); }}
                  style={{ backgroundColor: userAvatar === av.icon ? '#2563eb' : '#020617', opacity: totalHoursAll >= av.req ? 1 : 0.4 }}
                  className="p-3 rounded-2xl border border-slate-700 flex flex-col items-center"
                >
                  <span className="text-3xl">{av.icon}</span>
                  <span className="text-[10px] font-bold text-slate-300 mt-1">{av.name}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setShowAvatarModal(false)} style={{ backgroundColor: '#1e293b' }} className="w-full py-2.5 rounded-2xl font-bold text-xs text-slate-300">Fechar</button>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Perfil & Lápis Embaixo da Foto */}
        <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="border p-5 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            
            <div className="flex flex-col items-center gap-1.5">
              <div style={{ backgroundColor: '#2563eb', borderColor: 'rgba(99, 102, 241, 0.5)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg border">
                {userAvatar}
              </div>
              <button 
                onClick={() => setShowAvatarModal(true)}
                style={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#94a3b8' }}
                className="text-[9px] font-bold px-2 py-0.5 rounded-full border hover:text-white transition-all flex items-center gap-1 shadow-sm"
              >
                ✏️ Editar
              </button>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-lg text-white">Meu Perfil de Estudos</h2>
                <span style={{ backgroundColor: userLevel.color, color: '#070a12' }} className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-md">
                  {userLevel.icon} {userLevel.title}
                </span>
              </div>
              <p style={{ color: '#94a3b8' }} className="text-xs mt-0.5">{totalHoursAll.toFixed(1)}h acumuladas • {history.length} sessões</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#020617' }} className="flex gap-1 p-1.5 rounded-2xl border border-slate-800 flex-wrap justify-center">
            <button onClick={() => setActiveTab('timer')} style={{ backgroundColor: activeTab === 'timer' ? '#2563eb' : 'transparent', color: activeTab === 'timer' ? '#fff' : '#94a3b8' }} className="px-3 py-1.5 rounded-xl text-xs font-bold">⏱️ Cronômetro</button>
            <button onClick={() => setActiveTab('simulados')} style={{ backgroundColor: activeTab === 'simulados' ? '#8b5cf6' : 'transparent', color: activeTab === 'simulados' ? '#fff' : '#94a3b8' }} className="px-3 py-1.5 rounded-xl text-xs font-bold">📝 Simulados</button>
            <button onClick={() => setActiveTab('achievements')} style={{ backgroundColor: activeTab === 'achievements' ? '#d97706' : 'transparent', color: activeTab === 'achievements' ? '#fff' : '#94a3b8' }} className="px-3 py-1.5 rounded-xl text-xs font-bold">🏆 Troféus</button>
            <button onClick={() => setActiveTab('analytics')} style={{ backgroundColor: activeTab === 'analytics' ? '#059669' : 'transparent', color: activeTab === 'analytics' ? '#fff' : '#94a3b8' }} className="px-3 py-1.5 rounded-xl text-xs font-bold">📊 Relatórios</button>
          </div>
        </div>

        {/* Cronômetro */}
        {activeTab === 'timer' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-5 rounded-3xl border">
                <label className="block text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Matéria Atual:</label>
                <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-full border rounded-2xl p-3 text-white font-semibold focus:outline-none">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name} — Meta: {cat.targetHours}h/semana</option>
                  ))}
                </select>
              </div>

              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-8 rounded-3xl border-2 text-center space-y-6 shadow-2xl relative overflow-hidden">
                <div style={{ backgroundColor: '#020617', borderColor: '#334155', color: '#34d399' }} className="text-6xl font-mono font-black py-10 rounded-3xl border-2 shadow-inner">
                  {formatTimer(timerSeconds)}
                </div>

                <div className="flex justify-center gap-3">
                  {!isRunning ? (
                    <button onClick={handleStart} style={{ backgroundColor: '#10b981', color: '#070a12' }} className="flex-1 py-4 rounded-2xl font-black text-lg shadow-xl">▶ INICIAR</button>
                  ) : (
                    <button onClick={handlePause} style={{ backgroundColor: '#f59e0b', color: '#070a12' }} className="flex-1 py-4 rounded-2xl font-black text-lg shadow-xl">⏸ PAUSAR</button>
                  )}
                  <button onClick={handleSaveSession} disabled={timerSeconds === 0} style={{ backgroundColor: '#2563eb' }} className="px-6 disabled:opacity-30 rounded-2xl font-bold text-white shadow-xl">SALVAR</button>
                  <button onClick={handleReset} style={{ backgroundColor: '#1e293b', borderColor: '#334155' }} className="p-4 rounded-2xl text-slate-300 border">🔄</button>
                </div>
              </div>

              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-5 rounded-3xl border">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Registro Manual de Horas:</h3>
                <form onSubmit={handleManualAdd} className="flex gap-3">
                  <input type="number" placeholder="Horas" value={manualHours} onChange={(e) => setManualHours(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-1/3 border rounded-2xl p-3 text-sm text-white" />
                  <input type="number" placeholder="Minutos" value={manualMinutes} onChange={(e) => setManualMinutes(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-1/3 border rounded-2xl p-3 text-sm text-white" />
                  <button type="submit" style={{ backgroundColor: '#1e293b', borderColor: '#334155' }} className="w-1/3 font-bold py-3 rounded-2xl border text-white">Adicionar</button>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-5 rounded-3xl border space-y-4">
                <h2 className="text-base font-bold text-white">Progresso Semanal</h2>
                {categories.map((cat, idx) => {
                  const currentSec = getCategoryCurrentWeekSeconds(cat.id);
                  const currentHrs = currentSec / 3600;
                  const pct = Math.min(100, Math.round((currentHrs / cat.targetHours) * 100));
                  return (
                    <div key={cat.id} style={{ backgroundColor: '#020617', borderColor: '#1e293b' }} className="space-y-2 p-3.5 rounded-2xl border">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-200">{cat.name}</span>
                        <span className="font-mono text-slate-400">{currentHrs.toFixed(1)}h / {cat.targetHours}h</span>
                      </div>
                      <div style={{ backgroundColor: '#1e293b', borderColor: '#334155' }} className="w-full h-3 rounded-full overflow-hidden p-0.5 border">
                        <div className="h-full rounded-full" style={{ width: pct + '%', backgroundColor: cat.color }}></div>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 pt-1">
                        <span>{pct}% concluído</span>
                        <div className="flex gap-1">
                          <button onClick={() => moveCategory(idx, -1)} disabled={idx === 0}>▲</button>
                          <button onClick={() => moveCategory(idx, 1)} disabled={idx === categories.length - 1}>▼</button>
                          <button onClick={() => startEditing(cat)}>✏️</button>
                          <button onClick={() => handleDeleteCategory(cat.id)}>🗑</button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {editingCategory ? (
                <div style={{ backgroundColor: '#0f172a', borderColor: '#6366f1' }} className="p-5 rounded-3xl border space-y-3">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase">Editar Matéria</h3>
                  <form onSubmit={handleSaveEdit} className="space-y-2">
                    <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-full border rounded-xl p-2 text-xs text-white" />
                    <div className="flex gap-2">
                      <input type="number" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-2/3 border rounded-xl p-2 text-xs text-white" />
                      <input type="color" value={editColor} onChange={(e) => setEditColor(e.target.value)} style={{ backgroundColor: '#020617' }} className="w-1/3 h-8 rounded-xl cursor-pointer" />
                    </div>
                    <div className="flex gap-2">
                      <button type="submit" style={{ backgroundColor: '#059669', color: '#fff' }} className="flex-1 py-1.5 rounded-xl text-xs font-bold">Salvar</button>
                      <button type="button" onClick={() => setEditingCategory(null)} style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }} className="px-3 rounded-xl text-xs">Cancelar</button>
                    </div>
                  </form>
                </div>
              ) : (
                <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-5 rounded-3xl border space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">➕ Nova Matéria</h3>
                  <form onSubmit={handleAddCategory} className="space-y-3">
                    <input type="text" placeholder="Nome da Matéria" value={newCatName} onChange={(e) => setNewCatName(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-full border rounded-2xl p-2.5 text-xs text-white" />
                    <div className="flex gap-2">
                      <input type="number" placeholder="Meta Horas" value={newCatTarget} onChange={(e) => setNewCatTarget(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-2/3 border rounded-2xl p-2.5 text-xs text-white" />
                      <input type="color" value={newCatColor} onChange={(e) => setNewCatColor(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155' }} className="w-1/3 border rounded-2xl h-9 p-1 cursor-pointer" />
                    </div>
                    <button type="submit" style={{ backgroundColor: '#4f46e5', color: '#fff' }} className="w-full font-bold py-2.5 rounded-2xl text-xs">Criar Matéria</button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 📝 SIMULADOS */}
        {activeTab === 'simulados' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total de Simulados</p>
                <p className="text-4xl font-black font-mono text-purple-400 mt-2">{totalSimulados}</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Média Geral de Acertos</p>
                <p className="text-4xl font-black font-mono text-emerald-400 mt-2">{avgSimulatedPercentage}%</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">➕ Registrar Novo Simulado / Prova</h3>
              <form onSubmit={handleAddSimulated} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <input 
                  type="text" 
                  placeholder="Nome do Simulado / Banca (Ex: Vunesp - 2025)" 
                  value={simName} 
                  onChange={(e) => setSimName(e.target.value)} 
                  style={{ backgroundColor: '#020617', borderColor: '#334155' }} 
                  className="sm:col-span-2 border rounded-2xl p-3 text-xs text-white" 
                />
                
                <select 
                  value={simCategory} 
                  onChange={(e) => setSimCategory(e.target.value)} 
                  style={{ backgroundColor: '#020617', borderColor: '#334155' }} 
                  className="border rounded-2xl p-3 text-xs text-white font-semibold"
                >
                  <option value="GERAL">Simulado Geral (Todas)</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>

                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Questões" 
                    value={simTotal} 
                    onChange={(e) => setSimTotal(e.target.value)} 
                    style={{ backgroundColor: '#020617', borderColor: '#334155' }} 
                    className="w-1/2 border rounded-2xl p-3 text-xs text-white" 
                  />
                  <input 
                    type="number" 
                    placeholder="Acertos" 
                    value={simCorrect} 
                    onChange={(e) => setSimCorrect(e.target.value)} 
                    style={{ backgroundColor: '#020617', borderColor: '#334155' }} 
                    className="w-1/2 border rounded-2xl p-3 text-xs text-white" 
                  />
                </div>

                <button type="submit" style={{ backgroundColor: '#7c3aed', color: '#fff' }} className="sm:col-span-2 lg:col-span-4 font-bold py-3 rounded-2xl text-xs shadow-lg">Salvar Simulado no Histórico</button>
              </form>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border space-y-4">
              <h3 className="text-sm font-bold text-white">Histórico de Simulados Realizados ({simulatedHistory.length})</h3>
              {simulatedHistory.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Nenhum simulado registrado ainda.</p>
              ) : (
                <div className="divide-y divide-slate-800 max-h-96 overflow-y-auto pr-1">
                  {simulatedHistory.map((sim) => (
                    <div key={sim.id} className="py-4 flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span style={{ backgroundColor: '#3b0764', borderColor: '#6b21a8', color: '#d8b4fe' }} className="font-bold px-2 py-0.5 rounded-md border text-[10px]">
                            {sim.categoryName}
                          </span>
                          <span className="text-slate-400 text-[10px]">{sim.date}</span>
                        </div>
                        <p className="font-bold text-slate-200 text-sm">{sim.name}</p>
                        <p className="text-[11px] text-slate-400">Total: <strong className="text-white">{sim.total}</strong> | Acertos: <strong className="text-emerald-400">{sim.correct}</strong></p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span style={{ backgroundColor: sim.percentage >= 70 ? 'rgba(6, 78, 59, 0.8)' : 'rgba(120, 53, 15, 0.8)', borderColor: sim.percentage >= 70 ? '#059669' : '#d97706', color: sim.percentage >= 70 ? '#34d399' : '#fbbf24' }} className="font-mono font-black text-sm px-3 py-1.5 rounded-xl border">
                          {sim.percentage}%
                        </span>
                        <button onClick={() => handleDeleteSimulated(sim.id)} className="text-slate-500 hover:text-red-400 p-1">🗑</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🏆 TROFÉUS (TÍTULO PRINCIPAL ÉPICO + FUNDO ESTILIZADO) */}
        {activeTab === 'achievements' && (
          <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border space-y-6">
            <h2 className="text-2xl font-black text-amber-500">🏆 Galeria de Conquistas ({unlockedAchievements.length}/{ALL_ACHIEVEMENTS.length})</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const unlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div key={ach.id} style={{ backgroundColor: '#020617', borderColor: unlocked ? '#f59e0b' : '#1e293b', opacity: unlocked ? 1 : 0.85 }} className="p-4 rounded-2xl border flex items-start gap-3 relative overflow-hidden">
                    
                    {/* Emoji / Símbolo de Fundo Estilizado */}
                    <div className="absolute right-2 bottom-0 text-6xl opacity-10 select-none pointer-events-none font-black">
                      {ach.bgSymbol}
                    </div>

                    <div className="text-3xl p-3 bg-slate-900 rounded-2xl border border-slate-800 z-10">{unlocked ? ach.icon : '🔒'}</div>
                    <div className="z-15">
                      <h3 style={{ color: unlocked ? '#fde047' : '#fff' }} className="font-extrabold text-sm mt-0.5">{ach.title}</h3>
                      <p className="text-[11px] text-slate-400 mt-1 leading-snug">{ach.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 📊 RELATÓRIOS & BACKUP */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border flex flex-col md:flex-row justify-between items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white">Estatísticas & Sincronização</h2>
                <p className="text-xs text-slate-400">Baixe ou importe o backup para usar no celular e tablet.</p>
              </div>
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                <select value={analyticsCategory} onChange={(e) => setAnalyticsCategory(e.target.value)} style={{ backgroundColor: '#020617', borderColor: '#334155', color: '#fff' }} className="border rounded-2xl px-3 py-2 text-xs">
                  <option value="ALL">Todas as Matérias</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <button onClick={handleExportJSON} style={{ backgroundColor: '#1e293b', borderColor: '#334155' }} className="px-4 py-2.5 rounded-2xl text-xs font-bold text-white border">📥 Baixar Backup</button>
                <button onClick={() => fileInputRef.current?.click()} style={{ backgroundColor: '#059669', color: '#fff' }} className="px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg">📤 Restaurar Backup</button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Acumulado</p>
                <p className="text-3xl font-black font-mono text-blue-400 mt-2">{formatHours(getTotalSeconds(analyticsCategory))}h</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Mês Atual</p>
                <p className="text-3xl font-black font-mono text-emerald-400 mt-2">{formatHours(getMonthSeconds(analyticsCategory))}h</p>
              </div>
              <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border text-center">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Ano Atual</p>
                <p className="text-3xl font-black font-mono text-amber-400 mt-2">{formatHours(getYearSeconds(analyticsCategory))}h</p>
              </div>
            </div>

            <div style={{ backgroundColor: '#0f172a', borderColor: '#1e293b' }} className="p-6 rounded-3xl border space-y-4">
              <h3 className="text-sm font-bold text-white">Sessões de Estudo Registradas ({history.length} totais)</h3>
              {history.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">Nenhuma sessão registrada.</p>
              ) : (
                <div className="divide-y divide-slate-800 max-h-80 overflow-y-auto pr-1">
                  {history
                    .filter((h) => analyticsCategory === 'ALL' || h.categoryId === analyticsCategory)
                    .map((item) => {
                      const cat = categories.find((c) => c.id === item.categoryId);
                      return (
                        <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: cat?.color || '#9CA3AF' }}></span>
                            <div>
                              <p className="font-bold text-slate-200">{cat?.name || 'Matéria Removida'}</p>
                              <p className="text-[10px] text-slate-500">{item.date}</p>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-indigo-400">+{formatHours(item.seconds)}h</span>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
