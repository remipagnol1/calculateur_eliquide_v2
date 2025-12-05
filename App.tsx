
import React, { useState, useEffect } from 'react';
import { FlaskConical, Save, Trash2, RotateCcw, Info, Menu, X, Plus, Minus, AlertCircle } from 'lucide-react';
import { UserSettings, CalculationResult, SavedRecipe, BaseDefinition } from './types';
import { calculateRecipe } from './utils/calculations';
import { InputSlider } from './components/InputSlider';
import { RatioSelector } from './components/RatioSelector';
import { ResultsTable } from './components/ResultsTable';
import { RecipeChart } from './components/RecipeChart';

const DEFAULT_SETTINGS: UserSettings = {
  targetVolume: 50,
  targetNicotine: 3,
  targetAromaPct: 15,
  targetRatio: { pg: 50, vg: 50 },
  boosterStrength: 20,
  boosterRatio: { pg: 50, vg: 50 },
  bases: [{ id: '1', name: 'Base 1', ratio: { pg: 50, vg: 50 } }],
  aromaRatio: { pg: 100, vg: 0 },
};

function App() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [recipes, setRecipes] = useState<SavedRecipe[]>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [result, setResult] = useState<CalculationResult | null>(null);

  // Modal States
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [newRecipeName, setNewRecipeName] = useState('');

  // Load recipes
  useEffect(() => {
    const saved = localStorage.getItem('vapelab_recipes');
    if (saved) {
      try {
        setRecipes(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recipes", e);
      }
    }
  }, []);

  // Calculate
  useEffect(() => {
    const res = calculateRecipe(settings);
    setResult(res);
  }, [settings]);

  // Handlers
  const initiateSave = () => {
    setNewRecipeName(`Mélange ${settings.targetNicotine}mg - ${settings.targetAromaPct}%`);
    setIsSaveModalOpen(true);
  };

  const confirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRecipeName.trim()) {
      const newRecipe: SavedRecipe = {
        id: crypto.randomUUID(),
        name: newRecipeName,
        date: new Date().toISOString(),
        settings: JSON.parse(JSON.stringify(settings)) // Deep copy
      };
      const updated = [newRecipe, ...recipes];
      setRecipes(updated);
      localStorage.setItem('vapelab_recipes', JSON.stringify(updated));
      setIsSaveModalOpen(false);
      setShowMenu(true); // Show the menu to confirm save
    }
  };

  const loadRecipe = (r: SavedRecipe) => {
    setSettings(JSON.parse(JSON.stringify(r.settings)));
    setShowMenu(false);
  };

  const deleteRecipe = (id: string) => {
    const updated = recipes.filter(r => r.id !== id);
    setRecipes(updated);
    localStorage.setItem('vapelab_recipes', JSON.stringify(updated));
  };

  const confirmReset = () => {
    setSettings(JSON.parse(JSON.stringify(DEFAULT_SETTINGS)));
    setIsResetModalOpen(false);
  };

  const addBase = () => {
    if (settings.bases.length < 2) {
      const newBase: BaseDefinition = {
        id: crypto.randomUUID(),
        name: 'Base 2',
        ratio: { pg: 100, vg: 0 }
      };
      setSettings({ ...settings, bases: [...settings.bases, newBase] });
    }
  };

  const removeBase = () => {
    if (settings.bases.length > 1) {
      setSettings({ ...settings, bases: [settings.bases[0]] });
    }
  };

  const updateBaseRatio = (index: number, ratio: { pg: number, vg: number }) => {
    const newBases = [...settings.bases];
    newBases[index] = { ...newBases[index], ratio };
    setSettings({ ...settings, bases: newBases });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-12 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-indigo-600">
            <FlaskConical size={28} strokeWidth={2.5} />
            <h1 className="text-xl font-bold tracking-tight text-slate-900">VapeLab</h1>
          </div>
          <button 
            onClick={() => setShowMenu(true)}
            className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors relative"
          >
            <Menu size={24} />
            {recipes.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            )}
          </button>
        </div>
      </header>

      {/* Menu Overlay (Recipes) */}
      <div className={`fixed inset-0 z-40 transform transition-transform duration-300 ${showMenu ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowMenu(false)} />
        <div className="absolute top-0 right-0 bottom-0 w-full max-w-sm bg-white shadow-2xl flex flex-col z-50">
          <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-lg text-slate-800">Mes Recettes</h2>
            <button onClick={() => setShowMenu(false)} className="p-1 hover:bg-slate-200 rounded-full"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
             {recipes.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <Save className="mx-auto mb-3 opacity-50" size={32} />
                  <p>Aucune recette sauvegardée.</p>
                </div>
              ) : (
                recipes.map(recipe => (
                  <div key={recipe.id} className="group bg-white border border-slate-200 hover:border-indigo-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-bold text-slate-800">{recipe.name}</h3>
                        <p className="text-xs text-slate-500">{new Date(recipe.date).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => deleteRecipe(recipe.id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <div className="flex gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mb-3">
                      <span className="font-mono">{recipe.settings.targetVolume}ml</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-mono text-indigo-600">{recipe.settings.targetNicotine}mg</span>
                      <span className="text-slate-300">|</span>
                      <span className="font-mono">{recipe.settings.targetRatio.pg}/{recipe.settings.targetRatio.vg}</span>
                    </div>
                    <button 
                      onClick={() => loadRecipe(recipe)}
                      className="w-full py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                    >
                      Charger cette recette
                    </button>
                  </div>
                ))
              )}
          </div>
        </div>
      </div>

      {/* Save Recipe Modal */}
      {isSaveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsSaveModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden">
            <div className="p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-2">Enregistrer la recette</h3>
              <p className="text-slate-500 text-sm mb-4">Donnez un nom à votre recette pour la retrouver facilement plus tard.</p>
              <form onSubmit={confirmSave}>
                <input 
                  type="text" 
                  autoFocus
                  value={newRecipeName}
                  onChange={(e) => setNewRecipeName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none mb-6"
                  placeholder="Nom de la recette"
                />
                <div className="flex gap-3 justify-end">
                  <button 
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Enregistrer
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {isResetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsResetModalOpen(false)} />
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm relative z-10 overflow-hidden">
            <div className="p-6">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mb-4 text-rose-600">
                <RotateCcw size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Réinitialiser ?</h3>
              <p className="text-slate-500 text-sm mb-6">Voulez-vous vraiment remettre tous les paramètres à zéro ? Vos modifications non enregistrées seront perdues.</p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setIsResetModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
                >
                  Annuler
                </button>
                <button 
                  onClick={confirmReset}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors"
                >
                  Réinitialiser
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Controls Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
          <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">1. Paramètres Cibles</h2>
            <button 
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <RotateCcw size={14} /> Réinitialiser
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
            <div className="space-y-2">
              <InputSlider 
                label="Volume Total" 
                value={settings.targetVolume} 
                onChange={(v) => setSettings({...settings, targetVolume: v})}
                min={10} max={1000} step={5} unit="ml"
              />
              <InputSlider 
                label="Taux de Nicotine" 
                value={settings.targetNicotine} 
                onChange={(v) => setSettings({...settings, targetNicotine: v})}
                min={0} max={20} step={0.5} unit="mg/ml"
              />
            </div>
            <div className="space-y-2">
               <InputSlider 
                label="Dosage Arôme" 
                value={settings.targetAromaPct} 
                onChange={(v) => setSettings({...settings, targetAromaPct: v})}
                min={0} max={30} step={0.5} unit="%"
              />
              <RatioSelector 
                label="Ratio Cible (PG/VG)" 
                ratio={settings.targetRatio}
                onChange={(r) => setSettings({...settings, targetRatio: r})}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
           <h2 className="text-lg font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">2. Mes Ingrédients</h2>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Bases Section */}
              <div className="space-y-6">
                 <div className="flex justify-between items-end">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Bases Disponibles</h3>
                    {settings.bases.length < 2 && (
                       <button onClick={addBase} className="text-xs flex items-center gap-1 text-indigo-600 hover:underline">
                         <Plus size={14}/> Ajouter une base
                       </button>
                    )}
                 </div>

                 {settings.bases.map((base, index) => (
                   <div key={base.id} className="relative bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {index > 0 && (
                        <button onClick={removeBase} className="absolute top-2 right-2 text-slate-400 hover:text-rose-500">
                          <Minus size={16} />
                        </button>
                      )}
                      <h4 className="font-medium text-slate-700 mb-3 text-sm">{base.name}</h4>
                      <RatioSelector 
                        label="Composition" 
                        ratio={base.ratio}
                        onChange={(r) => updateBaseRatio(index, r)}
                      />
                   </div>
                 ))}
              </div>

              {/* Booster & Aroma Section */}
              <div className="space-y-6">
                 <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">Nicotine & Arôme</h3>
                 
                 <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100">
                    <h4 className="font-medium text-indigo-900 mb-3 text-sm">Booster de Nicotine</h4>
                    <InputSlider 
                      label="Force" 
                      value={settings.boosterStrength} 
                      onChange={(v) => setSettings({...settings, boosterStrength: v})}
                      min={0} max={100} step={1} unit="mg"
                    />
                    <RatioSelector 
                      label="Composition" 
                      ratio={settings.boosterRatio}
                      onChange={(r) => setSettings({...settings, boosterRatio: r})}
                    />
                 </div>

                 <div className="px-4">
                    <RatioSelector 
                      label="Base de l'Arôme" 
                      ratio={settings.aromaRatio}
                      onChange={(r) => setSettings({...settings, aromaRatio: r})}
                      isFixed={false} 
                    />
                 </div>
              </div>
           </div>
        </div>

        {/* Results Area */}
        {result && (
          <div className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden mb-12">
              <div className="bg-indigo-600 p-4 text-white flex justify-between items-center">
                <h2 className="font-bold flex items-center gap-2">
                  <FlaskConical size={20} className="text-indigo-200" />
                  Résultats à mélanger
                </h2>
                <div className="flex items-center gap-2">
                  {!result.possible && (
                    <div className="hidden sm:flex items-center gap-1 text-xs text-indigo-200 bg-indigo-800/50 px-2 py-1 rounded">
                      <AlertCircle size={12} />
                      Calcul impossible
                    </div>
                  )}
                  <button 
                  onClick={initiateSave}
                  disabled={!result.possible}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={!result.possible ? "Impossible d'enregistrer un mélange invalide" : "Enregistrer la recette"}
                  >
                    <Save size={16} />
                    Enregistrer
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-8">
                {/* Summary Badges */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase mb-1">Volume Final</div>
                    <div className="text-lg font-bold text-slate-800">{settings.targetVolume} ml</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase mb-1">Taux Nicotine</div>
                    <div className="text-lg font-bold text-indigo-600">{result.possible ? settings.targetNicotine : 0} mg</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase mb-1">Arôme</div>
                    <div className="text-lg font-bold text-slate-800">{settings.targetAromaPct} %</div>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="text-xs text-slate-500 uppercase mb-1">Ratio Cible</div>
                    <div className="text-lg font-bold text-slate-800">{settings.targetRatio.pg}/{settings.targetRatio.vg}</div>
                  </div>
                </div>

                <ResultsTable result={result} settings={settings} />
                <RecipeChart result={result} bases={settings.bases} />
              </div>
          </div>
        )}

      </main>
      
      {/* Footer */}
      <footer className="max-w-4xl mx-auto px-4 py-8 text-center text-slate-400 text-xs border-t border-slate-100">
        <div className="flex justify-center items-center gap-2 mb-2">
          <Info size={14} />
          <span>Note</span>
        </div>
        <p>Les calculs sont théoriques. Manipulez la nicotine avec des gants et des lunettes de protection.</p>
        <p className="mt-2">&copy; {new Date().getFullYear()} VapeLab</p>
      </footer>
    </div>
  );
}

export default App;
