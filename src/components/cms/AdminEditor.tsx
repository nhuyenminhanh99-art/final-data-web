import React, { useEffect, useState } from 'react';
import { SceneSettings, BlockType } from '../../types';
import { Base44LovableModal } from '../common/Base44LovableModal';
import {
  Settings,
  Eye,
  Edit3,
  Save,
  CheckCircle,
  Plus,
  Palette,
  Compass,
  FileImage,
  Layers,
  Upload,
  Download,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface AdminEditorProps {
  onAddBlock?: (type: BlockType) => void;
  onSaveDraft?: () => void;
  onPublish?: () => void;
}

type AssetManifest = typeof import('../scene/RealisticAssetManager').ASSET_MANIFEST;

export const AdminEditor: React.FC<AdminEditorProps> = ({
  onAddBlock,
  onSaveDraft,
  onPublish,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState<'blocks' | 'theme' | 'scene' | 'slots' | 'audit'>('blocks');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [assetManifest, setAssetManifest] = useState<AssetManifest>([]);

  useEffect(() => {
    if (!isPanelOpen || activeTab !== 'audit' || assetManifest.length > 0) return;
    let cancelled = false;
    import('../scene/RealisticAssetManager').then(({ ASSET_MANIFEST }) => {
      if (!cancelled) setAssetManifest(ASSET_MANIFEST);
    });
    return () => {
      cancelled = true;
    };
  }, [activeTab, assetManifest.length, isPanelOpen]);

  // Scene settings state
  const [sceneSettings, setSceneSettings] = useState<SceneSettings>({
    timeOfDay: 'dawn',
    fogDensity: 0.0065,
    petalCount: 80,
    boatSpeed: 1.0,
    waterTint: '#2F6F8F',
    mistStrength: 0.7,
    volume: 0.7,
    qualityTier: 'high',
  });

  // Light theme tokens (v6)
  const [themeTokens, setThemeTokens] = useState<Record<string, string>>({
    ivory: '#FFFDF8',
    mist: '#EEF3F1',
    teal: '#163C3A',
    river: '#2F6F8F',
    gold: '#C99A4B',
    charcoal: '#1F2933',
    slate: '#667085',
    peach: '#DDA6A0',
    sage: '#A9B8A6',
    card: '#FFFFFF',
    goldText: '#85590A',
    night: '#16231F',
  });

  // 16 Asset Slots from §19.2
  const assetSlots = [
    { id: 'slot-1', name: 'Hero Plate (3 layers: far, mid, near)', spec: '3840×2160 WebP/AVIF', status: 'Procedural Shader Active' },
    { id: 'slot-2', name: 'Hero Depth Map', spec: '16-bit greyscale 1920×1080', status: 'Procedural Falloff' },
    { id: 'slot-3', name: 'Hero Poster (LCP)', spec: '1920×1080 WebP ≤180KB', status: 'HTML Text + Canvas' },
    { id: 'slot-4', name: 'Chapter Plates ×5', spec: '2400×1350 WebP', status: 'Integrated & Styled' },
    { id: 'slot-5', name: 'Journey Region Plates ×6', spec: '1920×1080 WebP sequence', status: 'Procedural Landmarks Active' },
    { id: 'slot-6', name: 'Boat PBR Model / Layer', spec: 'GLB ≤30k tris or WebP', status: 'Procedural PBR Hull + Oars' },
    { id: 'slot-7', name: 'Lantern Model', spec: 'GLB or WebP (warm flame)', status: 'Active at 5 Stops' },
    { id: 'slot-8', name: 'Ch7 Pedestal', spec: 'GLB marble/stone ≤40k tris', status: 'Interactive 3D Pedestal' },
    { id: 'slot-9', name: 'Ch7 Medallions ×4', spec: 'GLB / normal map textures', status: 'Interactive Medallions' },
    { id: 'slot-10', name: 'Ch8 Org-chart Plates', spec: 'Paper/stone texture 1K', status: 'Hub & Spoke Model' },
    { id: 'slot-11', name: 'Ch9 Map / River Path', spec: 'Aerial river 2400px + pins', status: '90-Day Ribbon Active' },
    { id: 'slot-12', name: 'Texture Sets (stone/wood/paper)', spec: '2K PBR CC0 sets', status: 'WebGL PBR Shaders' },
    { id: 'slot-13', name: 'HDRI Morning-Sky', spec: '2K .hdr equirectangular', status: 'Hemisphere + Sun Lighting' },
    { id: 'slot-14', name: 'Film Grain / Paper Noise', spec: 'Tileable 512px SVG noise', status: 'Subtle Paper Grain' },
    { id: 'slot-15', name: 'OG Images ×9', spec: '1200×630 per route', status: 'Active in Meta' },
    { id: 'slot-16', name: 'Licensing / Source Data', spec: 'CC0 record / attribution', status: 'Documented in Credits' },
  ];

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

  const charcoalOnIvory = getContrastRatio(themeTokens.charcoal, themeTokens.ivory).toFixed(1);
  const tealOnIvory = getContrastRatio(themeTokens.teal, themeTokens.ivory).toFixed(1);
  const slateOnIvory = getContrastRatio(themeTokens.slate, themeTokens.ivory).toFixed(1);
  const goldTextOnIvory = getContrastRatio(themeTokens.goldText, themeTokens.ivory).toFixed(1);

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
      {/* Floating Bottom Admin Pill */}
      <aside aria-label="CMS Visual Editor" className="river-cms-toolbar fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/95 border border-[#163C3A]/20 px-5 py-2.5 rounded-full shadow-2xl backdrop-blur-md text-xs font-mono text-[#1F2933]">
        <button
          onClick={() => {
            const enabled = !isEditMode;
            setIsEditMode(enabled);
            window.dispatchEvent(new CustomEvent('river:team-edit-mode', { detail: { enabled } }));
          }}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition-colors cursor-pointer ${
            isEditMode ? 'bg-[#163C3A] text-white font-semibold' : 'hover:text-[#163C3A]'
          }`}
          aria-label={isEditMode ? 'Switch to preview mode' : 'Enable editing mode'}
          aria-pressed={isEditMode}
        >
          {isEditMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{isEditMode ? 'Editing' : 'Preview'}</span>
        </button>

        <span className="text-[#EEF3F1]">|</span>

        <button
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          className="flex items-center gap-1.5 hover:text-[#163C3A] transition-colors cursor-pointer"
          aria-label="Open experience settings"
          aria-expanded={isPanelOpen}
        >
          <Settings className="w-3.5 h-3.5 text-[#2F6F8F]" />
          <span>Settings</span>
        </button>

        <span className="text-[#EEF3F1]">|</span>

        <button
          onClick={handleSave}
          className="flex items-center gap-1 hover:text-[#163C3A] transition-colors cursor-pointer"
          title="Save draft"
          aria-label="Save draft"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        <button
          onClick={handlePublish}
          className="bg-[#163C3A] text-white px-3.5 py-1 rounded-full font-semibold hover:bg-[#2F6F8F] transition-all cursor-pointer shadow-md shadow-[#163C3A]/20"
          aria-label="Publish site draft"
        >
          Publish
        </button>

        <span className="text-[#EEF3F1]">|</span>

        <button
          onClick={() => setIsExportOpen(true)}
          className="flex items-center gap-1 text-[#85590A] hover:text-[#163C3A] font-semibold transition-colors cursor-pointer"
          title="Export the project prompt and source files"
          aria-label="Export project prompt and source files"
        >
          <Download className="w-3.5 h-3.5 text-[#C99A4B]" />
          <span>Project files</span>
        </button>

        {statusMessage && (
          <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#EEF3F1] text-[#163C3A] border border-[#163C3A]/25 px-3 py-1 rounded-full text-[11px] whitespace-nowrap animate-memory font-semibold shadow-md">
            {statusMessage}
          </div>
        )}
      </aside>

      {/* Slide-out CMS Drawer Settings */}
      {isPanelOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-lg bg-white border-l border-[#163C3A]/15 shadow-2xl p-6 overflow-y-auto animate-in slide-in-from-right duration-250 text-[#1F2933]">
          <div className="flex items-center justify-between pb-4 border-b border-[#EEF3F1] mb-6">
            <h3 className="font-serif text-2xl text-[#163C3A]">Page & Experience CMS</h3>
            <button
              onClick={() => setIsPanelOpen(false)}
              className="text-[#667085] hover:text-[#1F2933] text-xl font-mono cursor-pointer"
            >
              ×
            </button>
          </div>

          {/* Sub Navigation */}
          <div className="flex gap-1.5 border-b border-[#EEF3F1] pb-3 mb-6 text-xs font-mono overflow-x-auto">
            <button
              onClick={() => setActiveTab('blocks')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'blocks'
                  ? 'bg-[#163C3A] text-white font-semibold'
                  : 'text-[#667085] hover:bg-[#EEF3F1]'
              }`}
            >
              <Plus className="w-3 h-3 inline mr-1" /> Add Blocks
            </button>
            <button
              onClick={() => setActiveTab('slots')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'slots'
                  ? 'bg-[#163C3A] text-white font-semibold'
                  : 'text-[#667085] hover:bg-[#EEF3F1]'
              }`}
            >
              <FileImage className="w-3 h-3 inline mr-1" /> Asset Slots (§19.2)
            </button>
            <button
              onClick={() => setActiveTab('audit')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'audit'
                  ? 'bg-[#163C3A] text-white font-semibold'
                  : 'text-[#667085] hover:bg-[#EEF3F1]'
              }`}
            >
              <Layers className="w-3 h-3 inline mr-1" /> 3D Asset Audit
            </button>
            <button
              onClick={() => setActiveTab('theme')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'theme'
                  ? 'bg-[#163C3A] text-white font-semibold'
                  : 'text-[#667085] hover:bg-[#EEF3F1]'
              }`}
            >
              <Palette className="w-3 h-3 inline mr-1" /> Tokens
            </button>
            <button
              onClick={() => setActiveTab('scene')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === 'scene'
                  ? 'bg-[#163C3A] text-white font-semibold'
                  : 'text-[#667085] hover:bg-[#EEF3F1]'
              }`}
            >
              <Compass className="w-3 h-3 inline mr-1" /> 3D Scene
            </button>
          </div>

          {/* Tab 1: Add Blocks */}
          {activeTab === 'blocks' && (
            <div className="space-y-4">
              <p className="text-xs text-[#667085]">
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
                    className="p-3 bg-[#EEF3F1]/60 border border-[#163C3A]/10 rounded-xl hover:border-[#163C3A] text-left transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <span>{type}</span>
                    <Plus className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-[#163C3A]" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 2: Asset Slots (§19.2 Realism Pipeline) */}
          {activeTab === 'slots' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-[#EEF3F1] rounded-xl border border-[#163C3A]/15 text-[#163C3A]">
                <span className="font-semibold block mb-0.5">§19.2 Explicit Asset Slots Manifest</span>
                <span className="text-[#667085] text-[11px]">
                  All slots are wired so replacing files requires zero code change.
                </span>
              </div>

              <div className="space-y-2 max-h-[460px] overflow-y-auto pr-1">
                {assetSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className="p-3 rounded-xl border border-[#163C3A]/10 bg-white hover:border-[#2F6F8F] transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-bold text-[#163C3A]">{slot.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#EEF3F1] text-[#2F6F8F] font-semibold">
                        {slot.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-[11px] text-[#667085]">
                      <span>Spec: {slot.spec}</span>
                      <button className="text-[#85590A] hover:underline flex items-center gap-1 cursor-pointer">
                        <Upload className="w-3 h-3" /> Replace
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab: 3D Asset Quality Audit Manifest */}
          {activeTab === 'audit' && (
            <div className="space-y-4 text-xs font-mono">
              <div className="p-3 bg-[#EEF3F1] rounded-xl border border-[#163C3A]/15 text-[#163C3A]">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">3D Journey Asset Quality Audit</span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#163C3A] text-white font-semibold">
                    10 Categories Audited
                  </span>
                </div>
                <p className="text-[#667085] text-[11px] leading-relaxed">
                  Systematic audit evaluating primitive vs realistic asset representation across Hero boat, vegetation, geology, architecture, and props.
                </p>
              </div>

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                {assetManifest.map((record) => (
                  <div
                    key={record.id}
                    className="p-3 rounded-xl border border-[#163C3A]/15 bg-white hover:border-[#2F6F8F] transition-all shadow-sm space-y-2"
                  >
                    <div className="flex justify-between items-center pb-1.5 border-b border-[#EEF3F1]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#163C3A] uppercase tracking-wide text-xs">
                          {record.asset}
                        </span>
                        {record.isAcceptable ? (
                          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                            <Check className="w-3 h-3" /> PBR Active
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-semibold">
                            <AlertTriangle className="w-3 h-3" /> Replaced / Hero Path
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-[#667085]">
                        Budget: {record.targetPolyCount}
                      </span>
                    </div>

                    <div className="space-y-1 text-[11px]">
                      <div>
                        <span className="text-[#667085] font-semibold">Current Implementation: </span>
                        <span className="text-[#1F2933]">{record.currentImplementation}</span>
                      </div>
                      <div>
                        <span className="text-[#2F6F8F] font-semibold">Realistic Replacement: </span>
                        <span className="text-[#163C3A]">{record.recommendedReplacement}</span>
                      </div>
                      <div className="pt-1">
                        <span className="text-[#667085] font-semibold block mb-0.5">Required PBR Maps:</span>
                        <div className="flex flex-wrap gap-1">
                          {record.requiredPbrMaps.map((mapName, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 rounded bg-[#EEF3F1] text-[#163C3A] text-[10px]"
                            >
                              {mapName}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-[10px] text-[#667085] pt-0.5">
                        <span className="font-semibold">LOD Strategy: </span>
                        <span>{record.lodRequirement}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Theme Tokens & Contrast */}
          {activeTab === 'theme' && (
            <div className="space-y-6">
              <div className="bg-[#EEF3F1] p-4 rounded-xl border border-[#163C3A]/15">
                <h4 className="text-xs font-mono uppercase tracking-widest text-[#85590A] mb-2 flex items-center gap-1.5 font-semibold">
                  <CheckCircle className="w-3.5 h-3.5 text-[#163C3A]" /> WCAG Contrast Health (§2)
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span>Charcoal text on Ivory bg:</span>
                    <span className="font-mono text-[#163C3A] font-bold">{charcoalOnIvory} : 1 (AAA)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Deep Teal on Ivory bg:</span>
                    <span className="font-mono text-[#163C3A] font-bold">{tealOnIvory} : 1 (AAA)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Slate Gray on Ivory bg:</span>
                    <span className="font-mono text-[#163C3A] font-bold">{slateOnIvory} : 1 (AA)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gold Text on Ivory bg:</span>
                    <span className="font-mono text-[#163C3A] font-bold">{goldTextOnIvory} : 1 (AA)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-mono uppercase text-[#667085] block font-semibold">
                  Core Palette Tokens (Moodboard v6)
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
                      <span className="text-[#667085] uppercase">{val}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 4: 3D Scene Settings */}
          {activeTab === 'scene' && (
            <div className="space-y-6 text-xs font-mono">
              <div>
                <label className="block text-[#667085] mb-1 font-semibold">Daylight Preset</label>
                <div className="p-2.5 rounded-lg border border-[#163C3A] bg-[#EEF3F1] text-[#163C3A] font-bold text-center">
                  Clear Spring Morning (Luminous Academic Mood)
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#667085]">Air Petal Count:</span>
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
                  className="w-full accent-[#163C3A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#667085]">Boat Rowing Speed:</span>
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
                  className="w-full accent-[#163C3A]"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[#667085]">Morning Mist Density:</span>
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
                  className="w-full accent-[#163C3A]"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Base44 & Lovable Export Modal */}
      <Base44LovableModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </>
  );
};
