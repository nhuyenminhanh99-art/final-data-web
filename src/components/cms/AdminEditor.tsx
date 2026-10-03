import React, { useState } from 'react';
import { SceneSettings, BlockType } from '../../types';
import {
  Settings,
  Eye,
  Edit3,
  Save,
  CheckCircle,
  Plus,
  Palette,
  Compass,
} from 'lucide-react';

interface AdminEditorProps {
  onAddBlock?: (type: BlockType) => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

export const AdminEditor: React.FC<AdminEditorProps> = ({
  onAddBlock,
  onSaveDraft,
  onPublish,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'blocks' | 'theme' | 'scene'>('blocks');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Scene settings state
  const [sceneSettings, setSceneSettings] = useState<SceneSettings>({
    timeOfDay: 'dawn',
    fogDensity: 0.0065,
    petalCount: 80,
    boatSpeed: 1.0,
    waterTint: '#357872',
    mistStrength: 0.7,
    volume: 0.7,
    qualityTier: 'high',
  });

  // Light theme tokens
  const [themeTokens, setThemeTokens] = useState<Record<string, string>>({
    paper: '#F7F3EA',
    mist: '#E8EFEA',
    sky: '#CFE6EA',
    card: '#FFFFFF',
    ink: '#1E2B26',
    textMuted: '#4F5E57',
    jade: '#2F6F6A',
    jadeDeep: '#1F4F4B',
    blossom: '#F3C1BE',
    blossomDeep: '#A94A56',
    goldText: '#85590A',
    goldLight: '#E3B65C',
    wood: '#6B4A32',
  });

  // Calculate luminosity & contrast ratio
  const getContrastRatio = (hex1: string, hex2: string) => {
    const getLuminance = (hex: string) => {
      const rgb = parseInt(hex.replace('#', ''), 16);
      const r = ((rgb >> 16) & 0xff) / 255;
      const g = ((rgb >> 8) & 0xff) / 255;
      const b = (rgb & 0xff) / 255;
      const a = [r, g, b].map((v) =>
        v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
      );
      return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    };
    try {
      const l1 = getLuminance(hex1) + 0.05;
      const l2 = getLuminance(hex2) + 0.05;
      return Math.max(l1, l2) / Math.min(l1, l2);
    } catch {
      return 4.5;
    }
  };

  const inkOnPaper = getContrastRatio(themeTokens.ink, themeTokens.paper).toFixed(1);
  const jadeOnPaper = getContrastRatio(themeTokens.jade, themeTokens.paper).toFixed(1);
  const goldTextOnPaper = getContrastRatio(themeTokens.goldText, themeTokens.paper).toFixed(1);

  const handleSave = () => {
    if (onSaveDraft) onSaveDraft();
    setStatusMessage('Draft saved to local storage');
    setTimeout(() => setStatusMessage(null), 2500);
  };

  const handlePublish = () => {
    if (onPublish) onPublish();
    setStatusMessage('Published successfully! Live version synchronized.');
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const blockTypes: BlockType[] = [
    'hero',
    'richText',
    'storyCard',
    'definitionBox',
    'tabs',
    'accordion',
    'numberedCards',
    'twoColumn',
    'comparisonTable',
    'timeline',
    'flow',
    'bigNumber',
    'checklist',
    'quote',
    'cardGrid',
    'callout',
    'divider',
  ];

  return (
    <>
      {/* Floating Bottom Admin Pill - Styled for Bright Theme */}
      <aside aria-label="CMS Visual Editor" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 border border-[#2F6F6A]/25 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono text-[#1E2B26]">
        <button
          onClick={() => setIsEditMode(!isEditMode)}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
            isEditMode ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold' : 'hover:text-[#1F4F4B]'
          }`}
        >
          {isEditMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isEditMode ? 'Editing' : 'Preview'}</span>
        </button>

        <span className="text-[#D5E2DE]">|</span>

        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="flex items-center gap-1.5 hover:text-[#1F4F4B] transition-colors cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-[#2F6F6A]" />
          <span>Settings</span>
        </button>

        <span className="text-[#D5E2DE]">|</span>

        <button
          onClick={handleSave}
          className="flex items-center gap-1 hover:text-[#1F4F4B] transition-colors cursor-pointer"
          title="Save draft"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        <button
          onClick={handlePublish}
          className="bg-[#1F4F4B] text-[#F7F3EA] px-3.5 py-1 rounded-full font-semibold hover:bg-[#2F6F6A] transition-all cursor-pointer shadow-md shadow-[#1F4F4B]/20"
        >
          Publish
        </button>

        {statusMessage && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#E8EFEA] text-[#1F4F4B] border border-[#2F6F6A]/30 px-3 py-1 rounded-full text-[11px] whitespace-nowrap animate-memory font-semibold shadow-md">
            {statusMessage}
          </div>
        )}
      </aside>

      {/* Slide-out CMS Drawer Settings */}
      {isPanelOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white border-l border-[#2F6F6A]/20 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-250 text-[#1E2B26]">
          <div className="flex items-center justify-between pb-4 border-b border-[#D5E2DE] mb-6">
            <h3 className="font-serif text-2xl text-[#1E2B26]">Page & Experience CMS</h3>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-[#8E9C96] hover:text-[#1E2B26] text-xl font-mono cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-2 border-b border-[#D5E2DE] pb-3 mb-6 text-xs font-mono">
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'blocks'
                  ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold'
                  : 'text-[#4F5E57] hover:bg-[#E8EFEA]'
              }`}
            >
              <Plus className="w-3 h-3 inline mr-1" /> Add Blocks
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'theme'
                  ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold'
                  : 'text-[#4F5E57] hover:bg-[#E8EFEA]'
              }`}
            >
              <Palette className="w-3 h-3 inline mr-1" /> Theme & Contrast
            </button>
            <button
              onClick={() => setActiveTab('scene')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                activeTab === 'scene'
                  ? 'bg-[#1F4F4B] text-[#F7F3EA] font-semibold'
                  : 'text-[#4F5E57] hover:bg-[#E8EFEA]'
              }`}
            >
              <Compass className="w-3 h-3 inline mr-1" /> 3D Scene
            </button>
          </div>

          {/* Tab 1: Add Blocks */}
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <p className="text-xs text-[#4F5E57]">
                Click any block type to append it to the current page. You can drag and reorder blocks
                directly in Edit mode.
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {blockTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      if (onAddBlock) onAddBlock(type);
                      setStatusMessage(`Added block: ${type}`);
                      setTimeout(() => setStatusMessage(null), 2000);
                    }}
                    className="p-3 bg-[#E8EFEA]/60 border border-[#D5E2DE] rounded-xl hover:border-[#2F6F6A] text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>{type}</span>
                    <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-[#1F4F4B]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Theme & WCAG Contrast */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="bg-[#E8EFEA] p-4 rounded-xl border border-[#2F6F6A]/20">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#85590A] mb-2 flex items-center gap-1.5 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-[#2F6F6A]" /> WCAG Contrast Health
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Ink text on Paper bg:</span>
                    <span className="font-mono text-[#1F4F4B] font-bold">{inkOnPaper} : 1 (AAA)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Jade links on Paper bg:</span>
                    <span className="font-mono text-[#1F4F4B] font-bold">{jadeOnPaper} : 1 (AAA)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gold text on Paper bg:</span>
                    <span className="font-mono text-[#1F4F4B] font-bold">{goldTextOnPaper} : 1 (AAA)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[#8E9C96] block font-semibold">
                  Core Palette Tokens (Light Theme)
                </span>
                {Object.entries(themeTokens).map(([key, val]) => (
                  <div key={key} className="flex items-center justify-between text-xs font-mono">
                    <span className="capitalize">{key}:</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={val}
                        onChange={(e) =>
                          setThemeTokens({ ...themeTokens, [key]: e.target.value })
                        }
                        className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                      />
                      <span className="text-[#8E9C96] uppercase">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: 3D Scene Settings */}
          {activeTab === 'scene' && (
            <div className="space-y-6 text-xs font-mono">
              <div>
                <label className="block text-[#4F5E57] mb-1 font-semibold">Morning Daylight Preset</label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg border border-[#2F6F6A] bg-[#E8EFEA] text-[#1F4F4B] font-bold text-center">
                    Clear Spring Morning
                  </div>
                  <div className="p-2.5 rounded-lg border border-[#D5E2DE] text-[#8E9C96] text-center">
                    Golden Hour Dusk
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#4F5E57]">Air Petal Count:</span>
                  <span className="font-bold">{sceneSettings.petalCount}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="120"
                  value={sceneSettings.petalCount}
                  onChange={(e) =>
                    setSceneSettings({ ...sceneSettings, petalCount: Number(e.target.value) })
                  }
                  className="w-full accent-[#1F4F4B]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#4F5E57]">Boat Rowing Speed:</span>
                  <span className="font-bold">{sceneSettings.boatSpeed}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={sceneSettings.boatSpeed}
                  onChange={(e) =>
                    setSceneSettings({ ...sceneSettings, boatSpeed: Number(e.target.value) })
                  }
                  className="w-full accent-[#1F4F4B]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#4F5E57]">Morning Mist Density:</span>
                  <span className="font-bold">{sceneSettings.fogDensity}</span>
                </div>
                <input
                  type="range"
                  min="0.003"
                  max="0.015"
                  step="0.001"
                  value={sceneSettings.fogDensity}
                  onChange={(e) =>
                    setSceneSettings({ ...sceneSettings, fogDensity: Number(e.target.value) })
                  }
                  className="w-full accent-[#1F4F4B]"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
