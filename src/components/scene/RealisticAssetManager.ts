import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { riverWorld } from './RiverWorld';

/**
 * ============================================================================
 * ASSET QUALITY AUDIT & REALISTIC ASSET ARCHITECTURE
 * ============================================================================
 * 
 * Internal Asset Manifest capturing:
 * 1. Current implementation analysis
 * 2. Visual quality rating
 * 3. Procedural status
 * 4. Acceptability status
 * 5. Replacement priority & specification
 * 6. Required PBR maps
 * 7. Target polygon budgets & LOD tiers
 */
export interface AssetManifestRecord {
  id: string;
  asset: string;
  currentImplementation: string;
  currentQuality: 'LOW' | 'MEDIUM' | 'ACCEPTABLE' | 'NEEDS_REALISTIC_ASSET';
  isProcedural: boolean;
  isAcceptable: boolean;
  replacementRequired: boolean;
  recommendedReplacement: string;
  requiredPbrMaps: string[];
  targetPolyCount: string;
  lodRequirement: string;
}

export const ASSET_MANIFEST: AssetManifestRecord[] = [
  {
    id: 'asset-boat',
    asset: 'boat',
    currentImplementation: 'Procedural extruded 2D shape hull, primitive box stem/transom/thwarts, cylinder canopy, cylinder oars, cone rower',
    currentQuality: 'NEEDS_REALISTIC_ASSET',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'High-fidelity traditional wooden Asian sampan / river craft GLB model slot with sculpted clinker planking, authentic sheer curvature, carved stem post, and realistic weathered teak PBR materials',
    requiredPbrMaps: ['Albedo (2K)', 'Normal (2K)', 'Roughness (2K)', 'Metallic (1K)', 'Ambient Occlusion (2K)', 'Height/Displacement (1K)'],
    targetPolyCount: '15,000–30,000 triangles',
    lodRequirement: 'LOD0 (Hero near camera <35m: 25k tris), LOD1 (Midground 35–80m: 8k tris), LOD2 (Distant >80m: 2k tris)',
  },
  {
    id: 'asset-trees',
    asset: 'trees',
    currentImplementation: 'Primitive cylinder trunks with inverted cones (willow), dodecahedrons (peach), and tiered cylinder pads (pine)',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Photorealistic multi-branching botanical tree species (River Willow, Flowering Peach, Highland Pine, Bamboo) with natural limb bifurcation, bark normal fissures, and organic leafy canopy cards with dual-sided PBR scattering',
    requiredPbrMaps: ['Bark Albedo (2K)', 'Bark Normal (2K)', 'Bark Roughness (1K)', 'Foliage Albedo/Alpha (2K)', 'Foliage Normal (1K)', 'Foliage Translucency/Subsurface (1K)'],
    targetPolyCount: '3,500–6,000 triangles per tree',
    lodRequirement: 'LOD0 (0–35m: 5k tris), LOD1 (35–90m: 1.8k tris), LOD2 (>90m: 400 tris / billboard cross-quad)',
  },
  {
    id: 'asset-rocks',
    asset: 'rocks',
    currentImplementation: 'Perturbed DodecahedronGeometry (boulders) and extruded CylinderGeometry with noise (karst cliffs)',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Geological rock formations with Voronoi fracture facets, horizontal sedimentation strata, river-smoothed waterline beveling, and dual-zone wet/dry PBR materials',
    requiredPbrMaps: ['Rock Albedo (2K)', 'Rock Normal (2K)', 'Roughness Map with wet waterline specularity (2K)', 'Ambient Occlusion (2K)'],
    targetPolyCount: '800–2,500 triangles (boulders), 4,000–8,000 triangles (karst towers)',
    lodRequirement: 'LOD0 (<40m: full detail), LOD1 (40–120m: decimated mesh), LOD2 (>120m: simplified convex hull)',
  },
  {
    id: 'asset-riverbank',
    asset: 'riverbank',
    currentImplementation: 'Direct planar terrain mesh edge, basic tubes for roots, small dodecahedrons for pebbles, single box blades for reeds',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Layered natural embankment with wet river silt waterline margin, sand/gravel pebble beds, gnarled root flares dipping into water, and multi-stemmed sedge tufts',
    requiredPbrMaps: ['Silt Mud Albedo (2K)', 'Riverbed Gravel Normal (2K)', 'Root Bark PBR set (1K)', 'Pebble Normal/Roughness (1K)'],
    targetPolyCount: '2,500–5,000 triangles per bank segment',
    lodRequirement: 'LOD0 (<30m), LOD1 (30–80m), LOD2 (blended into terrain corridor)',
  },
  {
    id: 'asset-terrain',
    asset: 'terrain',
    currentImplementation: 'Swept 3D ribbon with analytical height function, vertex color tinting (silt/loam/meadow), and cylinder backdrop',
    currentQuality: 'MEDIUM',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Multi-layer PBR blended terrain corridor with continuous river gorge gradients, micro-undulation normal displacement, wet shoreline silt, grassy terrace loam, and rocky mountain bluffs',
    requiredPbrMaps: ['Terrain Splat Blend Map (2K)', 'Wet Mud PBR (2K)', 'Loam Soil PBR (2K)', 'Highland Moss PBR (2K)', 'Cliff Granite PBR (2K)'],
    targetPolyCount: '20,000–35,000 triangles total across corridor',
    lodRequirement: 'LOD0 (shoreline banks 0–35m: high density), LOD1 (valley slopes 35–100m: medium), LOD2 (distant ridges >100m: low)',
  },
  {
    id: 'asset-bridge',
    asset: 'bridge',
    currentImplementation: 'Primitive BoxGeometry piers, flat torus geometry segment arch barrel, and box deck',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Authentic stone masonry moon arch bridge with curved voussoirs, prominent central keystone, rusticated ashlar block piers with cutwater starlings, carved parapet balusters, and cobblestone roadway',
    requiredPbrMaps: ['Ancient Stone Albedo (2K)', 'Mortar Joint Normal (2K)', 'Stone Roughness (1K)', 'Ambient Occlusion (2K)'],
    targetPolyCount: '6,000–12,000 triangles per bridge',
    lodRequirement: 'LOD0 (<50m: full carvings), LOD1 (50–140m: simplified arch & balustrade), LOD2 (>140m: solid silhouette)',
  },
  {
    id: 'asset-vegetation',
    asset: 'vegetation',
    currentImplementation: 'Extruded thin box geometry for reeds',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Multi-stemmed feathered river cattails, tapered sedge blades with wind curvature, plus floating waxy water lily pads with lotus blossoms near sheltered shorelines',
    requiredPbrMaps: ['Reed Albedo/Alpha (1K)', 'Lily Pad Albedo/Normal/Roughness (1K waxy sheen)', 'Lotus Blossom Subsurface (1K)'],
    targetPolyCount: '600–1,500 triangles per clump',
    lodRequirement: 'LOD0 (<25m), LOD1 (25–60m), LOD2 (culled >60m)',
  },
  {
    id: 'asset-dock',
    asset: 'dock',
    currentImplementation: 'Missing / implied: boat stops beside floating lantern without structural landing',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Traditional weathered timber village stilt pier at canonical stops with timber piles driven into the riverbed, cross-ties, uneven wooden deck planks, rope-wound mooring bollards, stone approach steps, and welcome lantern',
    requiredPbrMaps: ['Weathered Timber Albedo (2K)', 'Timber Grain Normal (2K)', 'Roughness Map (1K)', 'Iron Fastener Metallic (1K)'],
    targetPolyCount: '2,500–4,500 triangles per dock',
    lodRequirement: 'LOD0 (<40m), LOD1 (40–100m), LOD2 (>100m: simplified deck)',
  },
  {
    id: 'asset-lanterns',
    asset: 'lanterns',
    currentImplementation: 'Basic 6-sided yellow cylinder meshes floating in water; stretched sphere for boat lantern',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Authentic octagonal Asian water lanterns with carved wooden pavilion roof, translucent painted silk panels with internal warm candle glow, carved lotus wooden float base, and silk tassel',
    requiredPbrMaps: ['Lacquered Wood Albedo/Roughness (1K)', 'Silk Paper Emissive & Transmission (1K)', 'Brass Fittings Normal (1K)'],
    targetPolyCount: '1,800–3,500 triangles per lantern',
    lodRequirement: 'LOD0 (<35m), LOD1 (35–85m), LOD2 (>85m: glowing emissive hull)',
  },
  {
    id: 'asset-props',
    asset: 'props',
    currentImplementation: 'Simple cylinder jar, torus rope, box sack, cylinder/box oars, cone/cylinder rower figure',
    currentQuality: 'LOW',
    isProcedural: true,
    isAcceptable: false,
    replacementRequired: true,
    recommendedReplacement: 'Lived-in river voyage artifact collection: glazed stoneware water jug with cork stopper, coiled natural hemp rope bundle with fiber relief, wrinkled burlap grain sack with realistic fabric seams, shaped wooden sweep oars with curved hydrofoil blades, and passenger/rower figure with linen fabric drape',
    requiredPbrMaps: ['Ceramic Glaze PBR (1K)', 'Coarse Hemp Rope PBR (1K)', 'Burlap Fabric PBR (1K)', 'Carved Wood Oar PBR (1K)'],
    targetPolyCount: '4,000–8,000 triangles total props package',
    lodRequirement: 'LOD0 (always high quality on hero craft)',
  },
];

// ============================================================================
// PHOTOREALISTIC PBR TEXTURE SYNTHESIS (Correct Color Spaces: sRGB vs Linear)
// ============================================================================

export interface PbrTextureSet {
  map: THREE.CanvasTexture;
  normal: THREE.CanvasTexture;
  roughness: THREE.CanvasTexture;
  ao?: THREE.CanvasTexture;
}

/**
 * Creates authentic multi-octave weathered teak wood PBR textures
 * Albedo = sRGB, Normal/Roughness = Linear (NoColorSpace)
 */
function createAuthenticTeakWoodPbr(): PbrTextureSet {
  const size = 512;
  const canvasMap = document.createElement('canvas');
  canvasMap.width = size;
  canvasMap.height = size;
  const ctxMap = canvasMap.getContext('2d')!;

  const canvasNorm = document.createElement('canvas');
  canvasNorm.width = size;
  canvasNorm.height = size;
  const ctxNorm = canvasNorm.getContext('2d')!;

  const canvasRough = document.createElement('canvas');
  canvasRough.width = size;
  canvasRough.height = size;
  const ctxRough = canvasRough.getContext('2d')!;

  // 1. Base aged honey-teak timber
  ctxMap.fillStyle = '#423021';
  ctxMap.fillRect(0, 0, size, size);

  ctxNorm.fillStyle = '#8080ff'; // Tangent space neutral
  ctxNorm.fillRect(0, 0, size, size);

  ctxRough.fillStyle = '#b8b8b8'; // Mean roughness ~0.72
  ctxRough.fillRect(0, 0, size, size);

  // 2. Multi-frequency growth rings and annual grain waves
  for (let y = 0; y < size; y++) {
    const wave = Math.sin(y * 0.08) * 0.5 + Math.sin(y * 0.02 + Math.cos(y * 0.005) * 6.0) * 0.5;
    const toneVariation = Math.floor(wave * 26 + 18);
    const r = Math.max(28, Math.min(88, 62 + toneVariation));
    const g = Math.max(18, Math.min(68, 44 + toneVariation));
    const b = Math.max(10, Math.min(48, 28 + toneVariation));

    ctxMap.fillStyle = `rgb(${r}, ${g}, ${b})`;
    ctxMap.fillRect(0, y, size, 1);

    // Subtle normal map perturbation corresponding to grain relief
    const normDy = Math.floor(Math.cos(y * 0.08) * 25 + 128);
    ctxNorm.fillStyle = `rgb(128, ${normDy}, 255)`;
    ctxNorm.fillRect(0, y, size, 1);
  }

  // 3. Longitudinal wood vessels & fine fibrous striations
  for (let i = 0; i < 480; i++) {
    const x = Math.random() * size;
    const w = Math.random() * 3.5 + 1.0;
    const darkness = Math.floor(Math.random() * 32 + 18);
    ctxMap.fillStyle = `rgba(${darkness}, ${darkness - 6}, ${darkness - 12}, 0.65)`;
    ctxMap.fillRect(x, 0, w, size);

    const normVal = Math.floor(Math.random() * 50 + 105);
    ctxNorm.fillStyle = `rgba(${normVal}, 128, 255, 0.7)`;
    ctxNorm.fillRect(x, 0, w, size);

    // Pores have slightly higher roughness (less reflective)
    const roughVal = Math.floor(Math.random() * 45 + 190);
    ctxRough.fillStyle = `rgba(${roughVal}, ${roughVal}, ${roughVal}, 0.55)`;
    ctxRough.fillRect(x, 0, w, size);
  }

  const mapTex = new THREE.CanvasTexture(canvasMap);
  mapTex.wrapS = THREE.RepeatWrapping;
  mapTex.wrapT = THREE.RepeatWrapping;
  mapTex.colorSpace = THREE.SRGBColorSpace;

  const normTex = new THREE.CanvasTexture(canvasNorm);
  normTex.wrapS = THREE.RepeatWrapping;
  normTex.wrapT = THREE.RepeatWrapping;
  normTex.colorSpace = THREE.NoColorSpace;

  const roughTex = new THREE.CanvasTexture(canvasRough);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.colorSpace = THREE.NoColorSpace;

  return { map: mapTex, normal: normTex, roughness: roughTex };
}

/**
 * Creates authentic ancient carved river stone PBR textures
 */
function createAuthenticStonePbr(): PbrTextureSet {
  const size = 512;
  const canvasMap = document.createElement('canvas');
  canvasMap.width = size;
  canvasMap.height = size;
  const ctxMap = canvasMap.getContext('2d')!;

  const canvasNorm = document.createElement('canvas');
  canvasNorm.width = size;
  canvasNorm.height = size;
  const ctxNorm = canvasNorm.getContext('2d')!;

  const canvasRough = document.createElement('canvas');
  canvasRough.width = size;
  canvasRough.height = size;
  const ctxRough = canvasRough.getContext('2d')!;

  ctxMap.fillStyle = '#5a625e';
  ctxMap.fillRect(0, 0, size, size);

  ctxNorm.fillStyle = '#8080ff';
  ctxNorm.fillRect(0, 0, size, size);

  ctxRough.fillStyle = '#e2e2e2'; // High roughness ~0.88 for dry weathered limestone
  ctxRough.fillRect(0, 0, size, size);

  // Horizontal geological sedimentation strata & mineral flecks
  for (let i = 0; i < 420; i++) {
    const y = Math.random() * size;
    const h = Math.random() * 4.5 + 1.2;
    const tone = Math.floor(Math.random() * 45 + 75);
    ctxMap.fillStyle = `rgb(${tone}, ${tone + 4}, ${tone + 2})`;
    ctxMap.fillRect(0, y, size, h);

    const normR = Math.floor(Math.random() * 50 + 105);
    const normG = Math.floor(Math.random() * 60 + 100);
    ctxNorm.fillStyle = `rgb(${normR}, ${normG}, 255)`;
    ctxNorm.fillRect(0, y, size, h);
  }

  // Chisel marks & mineral flecks
  for (let j = 0; j < 300; j++) {
    const px = Math.random() * size;
    const py = Math.random() * size;
    const s = Math.random() * 5 + 2;
    const fleck = Math.floor(Math.random() * 40 + 50);
    ctxMap.fillStyle = `rgb(${fleck}, ${fleck}, ${fleck})`;
    ctxMap.fillRect(px, py, s, s);
  }

  const mapTex = new THREE.CanvasTexture(canvasMap);
  mapTex.wrapS = THREE.RepeatWrapping;
  mapTex.wrapT = THREE.RepeatWrapping;
  mapTex.colorSpace = THREE.SRGBColorSpace;

  const normTex = new THREE.CanvasTexture(canvasNorm);
  normTex.wrapS = THREE.RepeatWrapping;
  normTex.wrapT = THREE.RepeatWrapping;
  normTex.colorSpace = THREE.NoColorSpace;

  const roughTex = new THREE.CanvasTexture(canvasRough);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.colorSpace = THREE.NoColorSpace;

  return { map: mapTex, normal: normTex, roughness: roughTex };
}

/**
 * Creates woven bamboo awning PBR texture
 */
function createWovenBambooPbr(): PbrTextureSet {
  const size = 512;
  const canvasMap = document.createElement('canvas');
  canvasMap.width = size;
  canvasMap.height = size;
  const ctxMap = canvasMap.getContext('2d')!;

  const canvasNorm = document.createElement('canvas');
  canvasNorm.width = size;
  canvasNorm.height = size;
  const ctxNorm = canvasNorm.getContext('2d')!;

  const canvasRough = document.createElement('canvas');
  canvasRough.width = size;
  canvasRough.height = size;
  const ctxRough = canvasRough.getContext('2d')!;

  ctxMap.fillStyle = '#6e7a56'; // Natural dried golden bamboo
  ctxMap.fillRect(0, 0, size, size);

  ctxNorm.fillStyle = '#8080ff';
  ctxNorm.fillRect(0, 0, size, size);

  ctxRough.fillStyle = '#b0b0b0';
  ctxRough.fillRect(0, 0, size, size);

  // Woven bamboo strips (herringbone / twill pattern)
  const stripWidth = 16;
  for (let x = 0; x < size; x += stripWidth) {
    for (let y = 0; y < size; y += stripWidth) {
      const isAlt = ((x / stripWidth) + (y / stripWidth)) % 2 === 0;
      const shade = isAlt ? 20 : -15;
      const r = Math.min(255, 115 + shade);
      const g = Math.min(255, 126 + shade);
      const b = Math.min(255, 88 + shade);

      ctxMap.fillStyle = `rgb(${r}, ${g}, ${b})`;
      ctxMap.fillRect(x, y, stripWidth - 1, stripWidth - 1);

      // Bevel strip edge in normal map
      ctxNorm.fillStyle = isAlt ? '#9080ff' : '#7080ff';
      ctxNorm.fillRect(x, y, stripWidth - 1, stripWidth - 1);
    }
  }

  const mapTex = new THREE.CanvasTexture(canvasMap);
  mapTex.wrapS = THREE.RepeatWrapping;
  mapTex.wrapT = THREE.RepeatWrapping;
  mapTex.colorSpace = THREE.SRGBColorSpace;

  const normTex = new THREE.CanvasTexture(canvasNorm);
  normTex.wrapS = THREE.RepeatWrapping;
  normTex.wrapT = THREE.RepeatWrapping;
  normTex.colorSpace = THREE.NoColorSpace;

  const roughTex = new THREE.CanvasTexture(canvasRough);
  roughTex.wrapS = THREE.RepeatWrapping;
  roughTex.wrapT = THREE.RepeatWrapping;
  roughTex.colorSpace = THREE.NoColorSpace;

  return { map: mapTex, normal: normTex, roughness: roughTex };
}

function enableShadows<T extends THREE.Object3D>(obj: T): T {
  obj.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return obj;
}

/**
 * ============================================================================
 * REALISTIC ASSET MANAGER & LOD ARCHITECTURE
 * ============================================================================
 */
export class RealisticAssetManager {
  private static instance: RealisticAssetManager;
  private gltfLoader: GLTFLoader;

  // Shared Authentic PBR Texture Sets
  public teakWoodPbr: PbrTextureSet;
  public ancientStonePbr: PbrTextureSet;
  public wovenBambooPbr: PbrTextureSet;

  // High-Quality PBR Materials
  public timberMaterial: THREE.MeshStandardMaterial;
  public darkTrimMaterial: THREE.MeshStandardMaterial;
  public teakFloorMaterial: THREE.MeshStandardMaterial;
  public bambooMaterial: THREE.MeshStandardMaterial;
  public ancientStoneMaterial: THREE.MeshStandardMaterial;
  public wetWaterlineStoneMaterial: THREE.MeshStandardMaterial;
  public silkLanternMaterial: THREE.MeshStandardMaterial;
  public brassHardwareMaterial: THREE.MeshStandardMaterial;
  public glazedCeramicMaterial: THREE.MeshStandardMaterial;
  public hempRopeMaterial: THREE.MeshStandardMaterial;
  public burlapSackMaterial: THREE.MeshStandardMaterial;

  constructor() {
    this.gltfLoader = new GLTFLoader();
    this.teakWoodPbr = createAuthenticTeakWoodPbr();
    this.ancientStonePbr = createAuthenticStonePbr();
    this.wovenBambooPbr = createWovenBambooPbr();

    // 1. Aged Teak Timber (Hull, Thwarts, Oars)
    this.timberMaterial = new THREE.MeshStandardMaterial({
      map: this.teakWoodPbr.map,
      normalMap: this.teakWoodPbr.normal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughnessMap: this.teakWoodPbr.roughness,
      roughness: 0.74,
      metalness: 0.02,
    });

    // 2. Dark Teak / Ironwood Trim (Gunwales, Stem, Transom, Ribs)
    this.darkTrimMaterial = new THREE.MeshStandardMaterial({
      color: 0x24180e,
      normalMap: this.teakWoodPbr.normal,
      normalScale: new THREE.Vector2(1.0, 1.0),
      roughnessMap: this.teakWoodPbr.roughness,
      roughness: 0.68,
      metalness: 0.04,
    });

    // 3. Interior Deck Planking (Weathered Teak Slats)
    this.teakFloorMaterial = new THREE.MeshStandardMaterial({
      color: 0x8a6b4d,
      map: this.teakWoodPbr.map,
      normalMap: this.teakWoodPbr.normal,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.82,
    });

    // 4. Woven Bamboo Matting (Canopy Awning & Culms)
    this.bambooMaterial = new THREE.MeshStandardMaterial({
      map: this.wovenBambooPbr.map,
      normalMap: this.wovenBambooPbr.normal,
      normalScale: new THREE.Vector2(0.95, 0.95),
      roughnessMap: this.wovenBambooPbr.roughness,
      roughness: 0.72,
      side: THREE.DoubleSide,
    });

    // 5. Ancient Masonry Stone (Bridges, Karst Cliffs & Boulders)
    this.ancientStoneMaterial = new THREE.MeshStandardMaterial({
      map: this.ancientStonePbr.map,
      normalMap: this.ancientStonePbr.normal,
      normalScale: new THREE.Vector2(1.05, 1.05),
      roughnessMap: this.ancientStonePbr.roughness,
      roughness: 0.88,
      metalness: 0.02,
    });

    // 6. Wet Waterline Stone (Tide Mark & Submerged Rocks)
    this.wetWaterlineStoneMaterial = new THREE.MeshStandardMaterial({
      color: 0x242a27,
      map: this.ancientStonePbr.map,
      normalMap: this.ancientStonePbr.normal,
      normalScale: new THREE.Vector2(1.2, 1.2),
      roughness: 0.38, // High specular sheen at water surface
      metalness: 0.08,
    });

    // 7. Translucent Painted Silk (Water Lanterns)
    this.silkLanternMaterial = new THREE.MeshStandardMaterial({
      color: 0xffdca2,
      emissive: 0xff9520,
      emissiveIntensity: 2.2,
      roughness: 0.55,
    });

    // 8. Cast Brass & Bronze Fittings
    this.brassHardwareMaterial = new THREE.MeshStandardMaterial({
      color: 0x9a7b45,
      metalness: 0.78,
      roughness: 0.34,
    });

    // 9. Glazed Ceramic Stoneware (Tea/Water Jar)
    this.glazedCeramicMaterial = new THREE.MeshStandardMaterial({
      color: 0x3d3025,
      roughness: 0.45,
      metalness: 0.12,
    });

    // 10. Coarse Twisted Hemp (Mooring Lines)
    this.hempRopeMaterial = new THREE.MeshStandardMaterial({
      color: 0xbaab8d,
      roughness: 0.96,
    });

    // 11. Burlap Cargo Sack
    this.burlapSackMaterial = new THREE.MeshStandardMaterial({
      color: 0x826c50,
      roughness: 0.94,
    });
  }

  public static getInstance(): RealisticAssetManager {
    if (!RealisticAssetManager.instance) {
      RealisticAssetManager.instance = new RealisticAssetManager();
    }
    return RealisticAssetManager.instance;
  }

  /**
   * =========================================================================
   * 1. BOAT HERO ASSET SLOT ARCHITECTURE
   * =========================================================================
   * Supports:
   * A. Ingesting external photorealistic GLB/GLTF model from URL/asset registry
   * B. Fallback to photorealistic sculpted wooden sampan craft with lapstrake clinker
   * Preserves exact kinematic anchors: waterline (y=0.00), rower, oars, lantern, cargo.
   */
  public loadBoatModelSlot(
    modelUrl: string | null,
    onLoaded: (group: THREE.Group) => void,
    onFallback: () => THREE.Group
  ): THREE.Group {
    const slotRoot = new THREE.Group();
    slotRoot.name = 'HeroBoatAssetSlot';

    if (modelUrl) {
      this.gltfLoader.load(
        modelUrl,
        (gltf) => {
          const model = gltf.scene;
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const targetLength = 5.8;
          const scale = targetLength / Math.max(size.x, size.z, 0.001);
          model.scale.set(scale, scale, scale);

          box.setFromObject(model);
          model.position.y -= box.min.y;

          enableShadows(model);
          slotRoot.clear();
          slotRoot.add(model);
          onLoaded(slotRoot);
        },
        undefined,
        (err) => {
          console.warn('Boat GLB loader failed, deploying realistic sculpted PBR fallback:', err);
          const fallbackModel = onFallback();
          slotRoot.clear();
          slotRoot.add(fallbackModel);
        }
      );
    } else {
      const fallbackModel = onFallback();
      slotRoot.add(fallbackModel);
    }

    return slotRoot;
  }

  /**
   * Builds the Realistic Sculpted Traditional Wooden Sampan Hull & Structure
   * Compound clinker lapstrake hull, sheer clamps, stem post, floorboards, thwarts, canopy
   */
  public createRealisticSculptedBoat(): THREE.Group {
    const boat = new THREE.Group();
    boat.name = 'RealisticSculptedWoodenSampan';

    // A. Compound Lapstrake Clinker Hull
    const hullShape = new THREE.Shape();
    hullShape.moveTo(-1.18, -3.05); // Stern port corner
    hullShape.quadraticCurveTo(-1.42, 0.0, -0.92, 2.5); // Midship flare to bow taper
    hullShape.quadraticCurveTo(0.0, 3.42, 0.92, 2.5); // Sharp prow tip
    hullShape.quadraticCurveTo(1.42, 0.0, 1.18, -3.05); // Starboard flare
    hullShape.lineTo(-1.18, -3.05); // Transom baseline

    const hullGeo = new THREE.ExtrudeGeometry(hullShape, {
      depth: 0.98,
      bevelEnabled: true,
      bevelSegments: 6,
      steps: 3,
      bevelSize: 0.20,
      bevelThickness: 0.22,
    });
    hullGeo.rotateX(Math.PI / 2);
    const hullMesh = new THREE.Mesh(hullGeo, this.timberMaterial);
    hullMesh.position.y = 0.78;
    boat.add(hullMesh);

    // B. Bevelled Gunwale Sheer Clamps (Hardwood protective cap rim)
    const gunwaleShape = new THREE.Shape();
    gunwaleShape.moveTo(-1.22, -3.08);
    gunwaleShape.quadraticCurveTo(-1.46, 0.0, -0.96, 2.55);
    gunwaleShape.quadraticCurveTo(0.0, 3.48, 0.96, 2.55);
    gunwaleShape.quadraticCurveTo(1.46, 0.0, 1.22, -3.08);
    gunwaleShape.lineTo(-1.22, -3.08);

    const gunwaleGeo = new THREE.ExtrudeGeometry(gunwaleShape, {
      depth: 0.14,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    });
    gunwaleGeo.rotateX(Math.PI / 2);
    const gunwaleMesh = new THREE.Mesh(gunwaleGeo, this.darkTrimMaterial);
    gunwaleMesh.position.y = 0.88;
    boat.add(gunwaleMesh);

    // C. Traditional Carved Bow Stem Post
    const stemPostGeo = new THREE.BoxGeometry(0.24, 0.98, 0.58);
    const stemPost = new THREE.Mesh(stemPostGeo, this.darkTrimMaterial);
    stemPost.position.set(0, 0.72, 3.12);
    stemPost.rotation.x = -Math.PI / 7.2;
    boat.add(stemPost);

    // D. Angled Stern Transom Board
    const transomGeo = new THREE.BoxGeometry(2.35, 0.78, 0.16);
    const transomMesh = new THREE.Mesh(transomGeo, this.darkTrimMaterial);
    transomMesh.position.set(0, 0.42, -3.02);
    transomMesh.rotation.x = Math.PI / 18;
    boat.add(transomMesh);

    // E. Slotted Interior Teak Floorboards (Above waterline y=0.00 at dry y=+0.12)
    const floorGeo = new THREE.BoxGeometry(1.68, 0.08, 4.8);
    const floorMesh = new THREE.Mesh(floorGeo, this.teakFloorMaterial);
    floorMesh.position.set(0, 0.12, 0.05);
    boat.add(floorMesh);

    // F. Curved Futtock Rib Frames lining inner hull
    for (let f = 0; f < 5; f++) {
      const zPos = -2.1 + f * 1.05;
      const ribGeo = new THREE.BoxGeometry(2.1 - Math.abs(zPos) * 0.22, 0.09, 0.10);
      const ribMesh = new THREE.Mesh(ribGeo, this.darkTrimMaterial);
      ribMesh.position.set(0, 0.16, zPos);
      boat.add(ribMesh);
    }

    // G. Heavy Timber Thwarts (Carved Seating Benches)
    const thwartGeo = new THREE.BoxGeometry(1.92, 0.10, 0.48);
    const thwartRower = new THREE.Mesh(thwartGeo, this.timberMaterial);
    thwartRower.position.set(0, 0.44, -0.42);
    const thwartFwd = new THREE.Mesh(new THREE.BoxGeometry(1.65, 0.10, 0.46), this.timberMaterial);
    thwartFwd.position.set(0, 0.48, 1.35);
    const thwartAft = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.10, 0.46), this.timberMaterial);
    thwartAft.position.set(0, 0.44, -1.65);
    boat.add(thwartRower, thwartFwd, thwartAft);

    // H. Woven Bamboo Matting Canopy (Arched Passenger Shelter)
    const canopyGeo = new THREE.CylinderGeometry(1.22, 1.22, 2.45, 24, 2, true, 0, Math.PI);
    const canopyMesh = new THREE.Mesh(canopyGeo, this.bambooMaterial);
    canopyMesh.rotation.z = Math.PI / 2;
    canopyMesh.rotation.y = Math.PI / 2;
    canopyMesh.position.set(0, 1.18, -0.55);
    boat.add(canopyMesh);

    // Canopy structural arch hoops
    for (let r = 0; r < 4; r++) {
      const archRibGeo = new THREE.TorusGeometry(1.23, 0.045, 6, 24, Math.PI);
      const archRibMesh = new THREE.Mesh(archRibGeo, this.darkTrimMaterial);
      archRibMesh.rotation.y = Math.PI / 2;
      archRibMesh.position.set(0, 1.18, -1.65 + r * 0.72);
      boat.add(archRibMesh);
    }

    return enableShadows(boat);
  }

  /**
   * =========================================================================
   * 2. REALISTIC BOTANICAL ARCHITECTURE WITH MULTI-TIER LOD (0–35m, 35–90m, >90m)
   * =========================================================================
   */

  /**
   * Weeping River Willow (Salix babylonica) with 3-tier LOD
   */
  public createRealisticWillow(x: number, z: number, scale = 1.0, seed = 0): THREE.LOD {
    const lod = new THREE.LOD();
    const groundY = riverWorld.getTerrainHeight(x, z);
    lod.position.set(x, groundY, z);
    lod.scale.set(scale, scale, scale);

    const trunkHeight = 5.4;

    // --- LOD 0: Near / Hero (< 35m) ---
    const lod0Group = new THREE.Group();
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0.25, trunkHeight * 0.35, 0.15),
      new THREE.Vector3(0.65, trunkHeight * 0.70, 0.35),
      new THREE.Vector3(0.95, trunkHeight, 0.45),
    ]);
    const trunkGeo0 = new THREE.TubeGeometry(trunkCurve, 16, 0.42, 10, false);
    const trunkMesh0 = new THREE.Mesh(trunkGeo0, this.timberMaterial);
    lod0Group.add(trunkMesh0);

    for (let b = 0; b < 4; b++) {
      const angle = (b * Math.PI) / 2 + seed * 0.4;
      const boughCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0.95, trunkHeight, 0.45),
        new THREE.Vector3(
          0.95 + Math.cos(angle) * 1.8,
          trunkHeight + 0.9,
          0.45 + Math.sin(angle) * 1.8
        ),
        new THREE.Vector3(
          0.95 + Math.cos(angle) * 3.2,
          trunkHeight + 0.3,
          0.45 + Math.sin(angle) * 3.2
        )
      );
      const boughGeo0 = new THREE.TubeGeometry(boughCurve, 10, 0.18, 8, false);
      const boughMesh0 = new THREE.Mesh(boughGeo0, this.timberMaterial);
      lod0Group.add(boughMesh0);

      // Cascading weeping foliage clusters
      for (let f = 0; f < 3; f++) {
        const leafClusterGeo = new THREE.ConeGeometry(1.35 + (f % 2) * 0.3, 3.4, 8, 2, true);
        leafClusterGeo.rotateX(Math.PI);
        const leafMat = new THREE.MeshStandardMaterial({
          color: (b + f) % 2 === 0 ? 0x546e4c : 0x627d58,
          roughness: 0.82,
          side: THREE.DoubleSide,
        });
        const leafCluster = new THREE.Mesh(leafClusterGeo, leafMat);
        leafCluster.position.set(
          0.95 + Math.cos(angle) * (1.6 + f * 0.7),
          trunkHeight + 0.4 - f * 0.5,
          0.45 + Math.sin(angle) * (1.6 + f * 0.7)
        );
        lod0Group.add(leafCluster);
      }
    }
    enableShadows(lod0Group);
    lod.addLevel(lod0Group, 0);

    // --- LOD 1: Midground (35m – 90m) ---
    const lod1Group = new THREE.Group();
    const trunkGeo1 = new THREE.CylinderGeometry(0.35, 0.52, trunkHeight, 6);
    const trunkMesh1 = new THREE.Mesh(trunkGeo1, this.timberMaterial);
    trunkMesh1.position.y = trunkHeight * 0.5;
    trunkMesh1.rotation.z = 0.14;
    lod1Group.add(trunkMesh1);

    const foliageGeo1 = new THREE.ConeGeometry(3.6, 5.2, 7);
    foliageGeo1.rotateX(Math.PI);
    const foliageMesh1 = new THREE.Mesh(foliageGeo1, new THREE.MeshStandardMaterial({ color: 0x56704e, roughness: 0.84 }));
    foliageMesh1.position.set(0.6, trunkHeight * 0.75, 0.2);
    lod1Group.add(foliageMesh1);
    enableShadows(lod1Group);
    lod.addLevel(lod1Group, 35);

    // --- LOD 2: Distant Background (> 90m) ---
    const lod2Group = new THREE.Group();
    const silhouetteGeo = new THREE.ConeGeometry(3.4, 5.0, 5);
    silhouetteGeo.rotateX(Math.PI);
    const silhouetteMesh = new THREE.Mesh(silhouetteGeo, new THREE.MeshStandardMaterial({ color: 0x4f6648, roughness: 0.90 }));
    silhouetteMesh.position.y = trunkHeight * 0.8;
    lod2Group.add(silhouetteMesh);
    lod.addLevel(lod2Group, 90);

    return lod;
  }

  /**
   * Blooming Peach Tree (Prunus persica) with 3-tier LOD
   */
  public createRealisticPeachTree(x: number, z: number, scale = 1.0, seed = 0): THREE.LOD {
    const lod = new THREE.LOD();
    const groundY = riverWorld.getTerrainHeight(x, z);
    lod.position.set(x, groundY, z);
    lod.scale.set(scale, scale, scale);

    const trunkHeight = 4.6;

    // --- LOD 0: Near / Hero (< 35m) ---
    const lod0Group = new THREE.Group();
    const trunkCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(-0.2, trunkHeight * 0.4, 0.1),
      new THREE.Vector3(0.15, trunkHeight * 0.75, -0.1),
      new THREE.Vector3(0.3, trunkHeight, 0.0),
    ]);
    const trunkGeo = new THREE.TubeGeometry(trunkCurve, 12, 0.32, 8, false);
    const trunk = new THREE.Mesh(trunkGeo, this.darkTrimMaterial);
    lod0Group.add(trunk);

    for (let c = 0; c < 6; c++) {
      const angle = (c / 6) * Math.PI * 2 + seed * 0.5;
      const dist = 1.6 + (c % 3) * 0.45;
      const blossomGeo = new THREE.DodecahedronGeometry(1.2 + (c % 2) * 0.3, 2);
      const blossomMat = new THREE.MeshStandardMaterial({
        color: c % 3 === 0 ? 0xf0ab9e : c % 3 === 1 ? 0xe59a93 : 0x5b7548,
        roughness: 0.78,
      });
      const blossom = new THREE.Mesh(blossomGeo, blossomMat);
      blossom.position.set(
        0.3 + Math.cos(angle) * dist,
        trunkHeight * 0.85 + (c % 3) * 0.6,
        Math.sin(angle) * dist
      );
      blossom.scale.set(1.2, 0.75, 1.1);
      lod0Group.add(blossom);
    }
    enableShadows(lod0Group);
    lod.addLevel(lod0Group, 0);

    // --- LOD 1: Midground (35m – 90m) ---
    const lod1Group = new THREE.Group();
    const trunkGeo1 = new THREE.CylinderGeometry(0.24, 0.38, trunkHeight, 6);
    const trunkMesh1 = new THREE.Mesh(trunkGeo1, this.darkTrimMaterial);
    trunkMesh1.position.y = trunkHeight * 0.5;
    lod1Group.add(trunkMesh1);

    const canopyGeo1 = new THREE.IcosahedronGeometry(2.4, 1);
    const canopyMesh1 = new THREE.Mesh(canopyGeo1, new THREE.MeshStandardMaterial({ color: 0xeb9f96, roughness: 0.82 }));
    canopyMesh1.position.set(0.2, trunkHeight * 0.9, 0.0);
    lod1Group.add(canopyMesh1);
    enableShadows(lod1Group);
    lod.addLevel(lod1Group, 35);

    // --- LOD 2: Distant (> 90m) ---
    const lod2Group = new THREE.Group();
    const distGeo = new THREE.IcosahedronGeometry(2.2, 0);
    const distMesh = new THREE.Mesh(distGeo, new THREE.MeshStandardMaterial({ color: 0xdf958c, roughness: 0.88 }));
    distMesh.position.y = trunkHeight * 0.9;
    lod2Group.add(distMesh);
    lod.addLevel(lod2Group, 90);

    return lod;
  }

  /**
   * Highland Mountain Pine (Pinus) with 3-tier LOD
   */
  public createRealisticPine(x: number, z: number, scale = 1.0, seed = 0): THREE.LOD {
    const lod = new THREE.LOD();
    const groundY = riverWorld.getTerrainHeight(x, z);
    lod.position.set(x, groundY, z);
    lod.scale.set(scale, scale, scale);

    const trunkHeight = 9.2;

    // --- LOD 0: Near / Hero (< 35m) ---
    const lod0Group = new THREE.Group();
    const trunkGeo0 = new THREE.CylinderGeometry(0.24, 0.55, trunkHeight, 10);
    const trunkMesh0 = new THREE.Mesh(trunkGeo0, this.timberMaterial);
    trunkMesh0.position.y = trunkHeight * 0.5;
    lod0Group.add(trunkMesh0);

    const tiers = 5;
    for (let t = 0; t < tiers; t++) {
      const tierY = trunkHeight * 0.45 + t * 1.25;
      const tierRadius = 2.8 - t * 0.45;
      const padGeo = new THREE.CylinderGeometry(tierRadius * 0.3, tierRadius, 0.65, 8);
      const needleMat = new THREE.MeshStandardMaterial({
        color: t % 2 === 0 ? 0x243929 : 0x2f4634,
        roughness: 0.86,
      });
      const pad = new THREE.Mesh(padGeo, needleMat);
      pad.position.set(Math.sin(t * 1.4) * 0.35, tierY, Math.cos(t * 1.4) * 0.35);
      lod0Group.add(pad);
    }
    enableShadows(lod0Group);
    lod.addLevel(lod0Group, 0);

    // --- LOD 1: Midground (35m – 90m) ---
    const lod1Group = new THREE.Group();
    const trunkGeo1 = new THREE.CylinderGeometry(0.24, 0.50, trunkHeight, 6);
    const trunkMesh1 = new THREE.Mesh(trunkGeo1, this.timberMaterial);
    trunkMesh1.position.y = trunkHeight * 0.5;
    lod1Group.add(trunkMesh1);

    const coneGeo1 = new THREE.ConeGeometry(2.8, 6.0, 6);
    const coneMesh1 = new THREE.Mesh(coneGeo1, new THREE.MeshStandardMaterial({ color: 0x283e2e, roughness: 0.88 }));
    coneMesh1.position.y = trunkHeight * 0.72;
    lod1Group.add(coneMesh1);
    enableShadows(lod1Group);
    lod.addLevel(lod1Group, 35);

    // --- LOD 2: Distant (> 90m) ---
    const lod2Group = new THREE.Group();
    const coneGeo2 = new THREE.ConeGeometry(2.6, 5.8, 4);
    const coneMesh2 = new THREE.Mesh(coneGeo2, new THREE.MeshStandardMaterial({ color: 0x233728, roughness: 0.92 }));
    coneMesh2.position.y = trunkHeight * 0.72;
    lod2Group.add(coneMesh2);
    lod.addLevel(lod2Group, 90);

    return lod;
  }

  /**
   * Clustered Organic Bamboo Stalks
   */
  public createRealisticBambooGrove(x: number, z: number, stalkCount = 7, seed = 0): THREE.Group {
    const group = new THREE.Group();
    const groundY = riverWorld.getTerrainHeight(x, z);
    group.position.set(x, groundY, z);

    for (let s = 0; s < stalkCount; s++) {
      const height = 9.5 + (s % 4) * 1.6;
      const stalkGeo = new THREE.CylinderGeometry(0.065, 0.085, height, 8);
      const stalk = new THREE.Mesh(stalkGeo, this.bambooMaterial);

      const offsetAngle = s * 2.399;
      const offsetDist = Math.sqrt(s + 1) * 0.55;
      const sx = Math.cos(offsetAngle) * offsetDist;
      const sz = Math.sin(offsetAngle) * offsetDist;
      const localGroundY = riverWorld.getTerrainHeight(x + sx, z + sz) - groundY;

      stalk.position.set(sx, localGroundY + height * 0.5, sz);
      stalk.rotation.z = Math.sin(s * 1.3 + seed) * 0.04;
      stalk.rotation.x = Math.cos(s * 1.3 + seed) * 0.04;
      group.add(stalk);

      const crownGeo = new THREE.ConeGeometry(1.2, 2.4, 6);
      const crownMat = new THREE.MeshStandardMaterial({ color: 0x58784d, roughness: 0.80 });
      const crown = new THREE.Mesh(crownGeo, crownMat);
      crown.position.set(sx, stalk.position.y + height * 0.45, sz);
      group.add(crown);
    }

    return enableShadows(group);
  }

  /**
   * =========================================================================
   * 3. GEOLOGICAL ASSET ARCHITECTURE (Rocks, Karst & Boulders)
   * =========================================================================
   */
  public createRealisticShorelineBoulder(x: number, z: number, radius = 1.4, seed = 0): THREE.Group {
    const group = new THREE.Group();
    const groundY = riverWorld.getTerrainHeight(x, z);
    group.position.set(x, groundY + radius * 0.28, z);

    // Deformed geological polyhedral boulder with Voronoi-like facets
    const geo = new THREE.IcosahedronGeometry(radius, 2);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vx = pos.getX(i);
      const vy = pos.getY(i);
      const vz = pos.getZ(i);
      const stratification = Math.sin(vy * 4.0) * 0.12;
      const noise = (Math.sin(vx * 2.5 + seed) * Math.cos(vz * 2.5) + 1.0) * 0.16;
      pos.setXYZ(i, vx * (1.0 + noise), vy * (0.85 + stratification), vz * (1.05 + noise));
    }
    geo.computeVertexNormals();

    const isWaterline = groundY < 0.45;
    const mesh = new THREE.Mesh(geo, isWaterline ? this.wetWaterlineStoneMaterial : this.ancientStoneMaterial);
    mesh.rotation.set((seed * 1.2) % Math.PI, (seed * 2.4) % Math.PI, (seed * 0.8) % Math.PI);
    group.add(mesh);

    return enableShadows(group);
  }

  public createRealisticKarstTower(x: number, z: number, radius = 8.0, height = 28.0, seed = 0): THREE.Group {
    const group = new THREE.Group();
    const groundY = riverWorld.getTerrainHeight(x, z);
    group.position.set(x, groundY + height * 0.48, z);

    const geo = new THREE.CylinderGeometry(radius * 0.6, radius * 1.15, height, 12, 6);
    const pos = geo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const vy = pos.getY(i);
      const crag = Math.sin(vy * 0.35 + seed) * 1.6 + Math.cos(vy * 0.7) * 0.8;
      pos.setX(i, pos.getX(i) + crag);
      pos.setZ(i, pos.getZ(i) + crag * 0.65);
    }
    geo.computeVertexNormals();

    const tower = new THREE.Mesh(geo, this.ancientStoneMaterial);
    tower.rotation.y = (seed * 1.3) % (Math.PI * 2);
    group.add(tower);

    return enableShadows(group);
  }

  /**
   * =========================================================================
   * 4. REALISTIC STONE ARCH BRIDGE ARCHITECTURE
   * =========================================================================
   */
  public createRealisticMoonArchBridge(uProgress: number): THREE.Group {
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = `RealisticStoneArchBridge_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const tangent = riverWorld.getTangent(uProgress);
    const width = riverWorld.getWidth(uProgress);
    const spanLength = width + 6.5;

    // A. Left & Right Masonry Abutments
    const leftBankPos = riverWorld.getLeftBank(uProgress);
    const leftElev = riverWorld.getTerrainHeight(leftBankPos.x, leftBankPos.z);
    const leftPier = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, leftElev + 4.8, 4.2),
      this.ancientStoneMaterial
    );
    leftPier.position.set(leftBankPos.x, (leftElev + 4.8) / 2 - 0.5, leftBankPos.z);
    bridgeGroup.add(leftPier);

    const rightBankPos = riverWorld.getRightBank(uProgress);
    const rightElev = riverWorld.getTerrainHeight(rightBankPos.x, rightBankPos.z);
    const rightPier = new THREE.Mesh(
      new THREE.BoxGeometry(3.8, rightElev + 4.8, 4.2),
      this.ancientStoneMaterial
    );
    rightPier.position.set(rightBankPos.x, (rightElev + 4.8) / 2 - 0.5, rightBankPos.z);
    bridgeGroup.add(rightPier);

    // B. Moon Arch Vault (Spanning barrel)
    const archRadius = spanLength * 0.52;
    const archGeo = new THREE.TorusGeometry(archRadius, 1.45, 10, 32, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, this.ancientStoneMaterial);
    archMesh.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
    archMesh.rotation.z = Math.PI;
    archMesh.position.set(center.x, 1.35, center.z);
    bridgeGroup.add(archMesh);

    // C. Stone Keystone at apex
    const keystoneGeo = new THREE.BoxGeometry(1.2, 0.75, 4.4);
    const keystone = new THREE.Mesh(keystoneGeo, this.ancientStoneMaterial);
    keystone.position.set(center.x, archRadius + 1.25, center.z);
    keystone.rotation.y = Math.atan2(normal.x, normal.z);
    bridgeGroup.add(keystone);

    // D. Cobblestone Roadway Deck
    const deckGeo = new THREE.BoxGeometry(4.4, 0.65, spanLength);
    const deckMesh = new THREE.Mesh(deckGeo, this.ancientStoneMaterial);
    deckMesh.rotation.y = Math.atan2(normal.x, normal.z);
    deckMesh.position.set(center.x, 4.65, center.z);
    bridgeGroup.add(deckMesh);

    // E. Carved Stone Parapet Balustrades with lotus caps
    const balustradeGeo = new THREE.BoxGeometry(0.35, 0.95, spanLength);
    const leftBalustrade = new THREE.Mesh(balustradeGeo, this.ancientStoneMaterial);
    leftBalustrade.rotation.y = Math.atan2(normal.x, normal.z);
    leftBalustrade.position.set(
      center.x - tangent.x * 2.05,
      5.25,
      center.z - tangent.z * 2.05
    );
    const rightBalustrade = new THREE.Mesh(balustradeGeo, this.ancientStoneMaterial);
    rightBalustrade.rotation.y = Math.atan2(normal.x, normal.z);
    rightBalustrade.position.set(
      center.x + tangent.x * 2.05,
      5.25,
      center.z + tangent.z * 2.05
    );
    bridgeGroup.add(leftBalustrade, rightBalustrade);

    return enableShadows(bridgeGroup);
  }

  /**
   * =========================================================================
   * 5. TRADITIONAL RIVER VILLAGE DOCK ARCHITECTURE
   * =========================================================================
   */
  public createTraditionalVillageDock(uProgress: number, side: 'left' | 'right' = 'right'): THREE.Group {
    const dockGroup = new THREE.Group();
    dockGroup.name = `TraditionalVillageDock_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const tangent = riverWorld.getTangent(uProgress);
    const halfWidth = riverWorld.getWidth(uProgress) * 0.5;
    const sideSign = side === 'right' ? 1 : -1;

    const bankEdge = center.clone().add(normal.clone().multiplyScalar(sideSign * halfWidth));
    const dockDirection = normal.clone().multiplyScalar(-sideSign);

    const dockLength = 4.8;
    const dockWidth = 2.6;

    // Timber Deck
    const deckGeo = new THREE.BoxGeometry(dockWidth, 0.16, dockLength);
    const deckMesh = new THREE.Mesh(deckGeo, this.timberMaterial);
    const deckCenter = bankEdge.clone().add(dockDirection.clone().multiplyScalar(dockLength * 0.5));
    deckMesh.position.set(deckCenter.x, 0.42, deckCenter.z);
    deckMesh.rotation.y = Math.atan2(dockDirection.x, dockDirection.z);
    dockGroup.add(deckMesh);

    // Weathered Pilings
    for (let p = 0; p < 6; p++) {
      const pileGeo = new THREE.CylinderGeometry(0.12, 0.14, 3.2, 8);
      const pile = new THREE.Mesh(pileGeo, this.darkTrimMaterial);
      const px = (p % 2 === 0 ? -1 : 1) * (dockWidth * 0.45);
      const pz = (Math.floor(p / 2) - 1) * (dockLength * 0.38);

      const localPile = new THREE.Vector3(px, -1.0, pz);
      localPile.applyAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(dockDirection.x, dockDirection.z));
      pile.position.copy(deckMesh.position).add(localPile);
      dockGroup.add(pile);
    }

    // Mooring Bollard Posts
    const bollardGeo = new THREE.CylinderGeometry(0.14, 0.16, 0.85, 8);
    const bollard = new THREE.Mesh(bollardGeo, this.darkTrimMaterial);
    const bollardPos = deckMesh.position.clone().add(
      new THREE.Vector3(tangent.x * 0.9, 0.48, tangent.z * 0.9)
    );
    bollard.position.copy(bollardPos);
    dockGroup.add(bollard);

    return enableShadows(dockGroup);
  }

  /**
   * =========================================================================
   * 6. AUTHENTIC PAGODA WATER LANTERNS
   * =========================================================================
   */
  public createAuthenticWaterLantern(): THREE.Group {
    const lanternGroup = new THREE.Group();
    lanternGroup.name = 'AuthenticPagodaWaterLantern';

    // A. Carved Floating Lotus Wooden Base
    const floatBaseGeo = new THREE.CylinderGeometry(0.48, 0.56, 0.16, 8);
    const floatBase = new THREE.Mesh(floatBaseGeo, this.darkTrimMaterial);
    floatBase.position.y = 0.08;
    lanternGroup.add(floatBase);

    // B. Translucent Silk Paper Core with Warm Emissive Glow
    const silkCoreGeo = new THREE.CylinderGeometry(0.32, 0.36, 0.65, 8);
    const silkCore = new THREE.Mesh(silkCoreGeo, this.silkLanternMaterial);
    silkCore.position.y = 0.45;
    lanternGroup.add(silkCore);

    // C. Pagoda Eaves Roof Cap
    const roofGeo = new THREE.ConeGeometry(0.55, 0.32, 8);
    const roof = new THREE.Mesh(roofGeo, this.darkTrimMaterial);
    roof.position.y = 0.92;
    lanternGroup.add(roof);

    // D. Brass Finial Ring at Peak
    const finialGeo = new THREE.TorusGeometry(0.08, 0.02, 6, 12);
    const finial = new THREE.Mesh(finialGeo, this.brassHardwareMaterial);
    finial.position.y = 1.12;
    lanternGroup.add(finial);

    // E. Omnidirectional Warm Glow Light
    const lanternLight = new THREE.PointLight(0xffa834, 2.2, 14);
    lanternLight.position.y = 0.48;
    lanternGroup.add(lanternLight);

    return enableShadows(lanternGroup);
  }

  /**
   * =========================================================================
   * 7. VEGETATION: REEDS & WATER LILIES
   * =========================================================================
   */
  public createRealisticReeds(x: number, z: number, count = 12): THREE.Group {
    const group = new THREE.Group();
    const groundY = riverWorld.getTerrainHeight(x, z);
    group.position.set(x, groundY, z);

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const r = Math.sqrt((i + 1) / count) * 0.75;
      const h = 1.5 + (i % 3) * 0.3;

      // Curved tapered blade
      const stemCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(Math.cos(angle) * 0.15, h * 0.6, Math.sin(angle) * 0.15),
        new THREE.Vector3(Math.cos(angle) * 0.35, h, Math.sin(angle) * 0.35)
      );
      const bladeGeo = new THREE.TubeGeometry(stemCurve, 6, 0.025, 4, false);
      const bladeMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? 0x5a6e45 : 0x6e804f,
        roughness: 0.82,
      });
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      group.add(blade);

      // Brown cattail head on taller stems
      if (i % 3 === 0) {
        const spikeGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.28, 6);
        const spikeMat = new THREE.MeshStandardMaterial({ color: 0x3d2719, roughness: 0.95 });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(
          blade.position.x + Math.cos(angle) * 0.28,
          h * 0.85,
          blade.position.z + Math.sin(angle) * 0.28
        );
        group.add(spike);
      }
    }

    return enableShadows(group);
  }

  public createRealisticWaterLilies(x: number, z: number, padCount = 6): THREE.Group {
    const group = new THREE.Group();
    group.position.set(x, 0.015, z); // Floating on water surface

    const padMat = new THREE.MeshStandardMaterial({
      color: 0x3a6034,
      roughness: 0.42, // Waxy wet leaf reflection
    });

    for (let p = 0; p < padCount; p++) {
      const padGeo = new THREE.CylinderGeometry(0.35 + (p % 3) * 0.1, 0.35 + (p % 3) * 0.1, 0.01, 16);
      const pad = new THREE.Mesh(padGeo, padMat);
      const angle = p * 2.399;
      const r = 0.4 + Math.sqrt(p) * 0.45;
      pad.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
      pad.rotation.y = p * 0.8;
      group.add(pad);

      // Blossom on first pad
      if (p === 0) {
        const flowerGeo = new THREE.ConeGeometry(0.18, 0.14, 8);
        const flowerMat = new THREE.MeshStandardMaterial({
          color: 0xfff0ea,
          roughness: 0.65,
        });
        const flower = new THREE.Mesh(flowerGeo, flowerMat);
        flower.position.set(pad.position.x, 0.08, pad.position.z);
        group.add(flower);
      }
    }

    return group;
  }

  /**
   * =========================================================================
   * 8. MEMORABLE WORLD LANDMARKS
   * =========================================================================
   */

  /**
   * Landmark: Ancient Scholar Banyan Tree (Awakening / Ch. 1)
   * Gnarled ancient trunk with spreading canopy reaching out over the river bend,
   * aerial root curtains, and mossy branches.
   */
  public createAncientScholarBanyan(uProgress: number, side: 'left' | 'right' = 'left'): THREE.Group {
    const group = new THREE.Group();
    group.name = `AncientScholarBanyan_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const halfWidth = riverWorld.getWidth(uProgress) * 0.5;
    const sideSign = side === 'right' ? 1 : -1;

    const rootX = center.x + normal.x * sideSign * (halfWidth + 2.8);
    const rootZ = center.z + normal.z * sideSign * (halfWidth + 2.8);
    const elev = riverWorld.getTerrainHeight(rootX, rootZ);

    group.position.set(rootX, elev, rootZ);

    // Twisted multi-stem trunk base
    const baseGeo = new THREE.CylinderGeometry(1.6, 2.4, 3.8, 12);
    const baseMesh = new THREE.Mesh(baseGeo, this.darkTrimMaterial);
    baseMesh.position.y = 1.9;
    group.add(baseMesh);

    // Buttress roots sprawling toward the water
    const rootCount = 6;
    for (let r = 0; r < rootCount; r++) {
      const angle = (r / rootCount) * Math.PI * 2;
      const rootLength = 2.8 + (r % 3) * 0.8;
      const rootGeo = new THREE.CylinderGeometry(0.18, 0.45, rootLength, 6);
      const root = new THREE.Mesh(rootGeo, this.darkTrimMaterial);
      root.rotation.z = Math.PI / 3.2;
      root.rotation.y = angle;
      root.position.set(Math.cos(angle) * 1.4, 0.6, Math.sin(angle) * 1.4);
      group.add(root);
    }

    // Great sweeping bough extending toward the river centerline
    const boughDir = normal.clone().multiplyScalar(-sideSign);
    const boughAngle = Math.atan2(boughDir.x, boughDir.z);

    const boughGeo = new THREE.CylinderGeometry(0.55, 0.95, 7.5, 8);
    const bough = new THREE.Mesh(boughGeo, this.darkTrimMaterial);
    bough.rotation.y = boughAngle;
    bough.rotation.z = -Math.PI / 3.6;
    bough.position.set(Math.sin(boughAngle) * 2.8, 4.4, Math.cos(boughAngle) * 2.8);
    group.add(bough);

    // Lush broad canopy dome
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x2b4a2e,
      roughness: 0.72,
    });
    const canopyGeo = new THREE.SphereGeometry(4.2, 12, 10);
    canopyGeo.scale(1.4, 0.75, 1.3);
    const canopy = new THREE.Mesh(canopyGeo, canopyMat);
    canopy.position.set(Math.sin(boughAngle) * 4.6, 6.8, Math.cos(boughAngle) * 4.6);
    group.add(canopy);

    // Secondary canopy cluster
    const subCanopy = new THREE.Mesh(canopyGeo, canopyMat);
    subCanopy.scale.set(0.75, 0.7, 0.75);
    subCanopy.position.set(0, 5.2, 0);
    group.add(subCanopy);

    // Hanging aerial root tendrils
    const vineMat = new THREE.MeshStandardMaterial({ color: 0x485838, roughness: 0.88 });
    for (let v = 0; v < 8; v++) {
      const vGeo = new THREE.CylinderGeometry(0.03, 0.02, 3.8 + (v % 3) * 0.7, 4);
      const vine = new THREE.Mesh(vGeo, vineMat);
      const vx = Math.sin(boughAngle) * (3.0 + (v % 4) * 0.8) + (v % 2 === 0 ? 0.6 : -0.6);
      const vz = Math.cos(boughAngle) * (3.0 + (v % 4) * 0.8) + (v % 3 === 0 ? 0.6 : -0.6);
      vine.position.set(vx, 3.2, vz);
      group.add(vine);
    }

    return enableShadows(group);
  }

  /**
   * Landmark: Misty Gorge Waterfall (Conflict / Ch. 4)
   * High rocky cliff face with cascading foaming water plume, rocky plunge pool,
   * and rising spray mist.
   */
  public createMistyGorgeWaterfall(uProgress: number, side: 'left' | 'right' = 'left'): THREE.Group {
    const group = new THREE.Group();
    group.name = `MistyGorgeWaterfall_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const halfWidth = riverWorld.getWidth(uProgress) * 0.5;
    const sideSign = side === 'right' ? 1 : -1;

    const cliffX = center.x + normal.x * sideSign * (halfWidth + 9.5);
    const cliffZ = center.z + normal.z * sideSign * (halfWidth + 9.5);
    const baseElev = riverWorld.getTerrainHeight(cliffX, cliffZ);

    group.position.set(cliffX, baseElev, cliffZ);

    // Sheer rock backing cliff tower
    const cliffGeo = new THREE.BoxGeometry(11.0, 36.0, 14.0);
    const cliff = new THREE.Mesh(cliffGeo, this.ancientStoneMaterial);
    cliff.position.y = 17.0;
    cliff.rotation.y = Math.atan2(normal.x * -sideSign, normal.z * -sideSign);
    group.add(cliff);

    // Cascading water chute (multi-tiered white water sheets)
    const fallMat = new THREE.MeshStandardMaterial({
      color: 0xebf7f5,
      roughness: 0.18,
      metalness: 0.08,
      transparent: true,
      opacity: 0.88,
    });

    const fallChuteGeo = new THREE.PlaneGeometry(3.4, 28.0, 4, 16);
    const fallMesh = new THREE.Mesh(fallChuteGeo, fallMat);
    fallMesh.position.set(
      -normal.x * sideSign * 5.6,
      14.0,
      -normal.z * sideSign * 5.6
    );
    fallMesh.rotation.y = Math.atan2(normal.x * -sideSign, normal.z * -sideSign);
    group.add(fallMesh);

    // Plunge pool rocky apron
    const rockMat = this.ancientStoneMaterial;
    for (let r = 0; r < 5; r++) {
      const rockGeo = new THREE.DodecahedronGeometry(1.6 + (r % 3) * 0.6);
      const rock = new THREE.Mesh(rockGeo, rockMat);
      const angle = (r / 5) * Math.PI;
      rock.position.set(
        -normal.x * sideSign * 6.2 + Math.cos(angle) * 2.2,
        0.5,
        -normal.z * sideSign * 6.2 + Math.sin(angle) * 2.2
      );
      group.add(rock);
    }

    // Foaming plunge pool surface disc
    const foamMat = new THREE.MeshBasicMaterial({
      color: 0xd6f0eb,
      transparent: true,
      opacity: 0.55,
    });
    const foamDisc = new THREE.Mesh(new THREE.CircleGeometry(3.6, 16), foamMat);
    foamDisc.rotation.x = -Math.PI / 2;
    foamDisc.position.set(
      -normal.x * sideSign * 6.2,
      0.15,
      -normal.z * sideSign * 6.2
    );
    group.add(foamDisc);

    return enableShadows(group);
  }

  /**
   * Landmark: Riverside Pagoda Pavilion (Insight / Ch. 5)
   * Hexagonal stone base, timber pillars, traditional upturned hip-and-gable roof,
   * and stone steps descending into the river margin.
   */
  public createRiversidePagodaPavilion(uProgress: number, side: 'left' | 'right' = 'right'): THREE.Group {
    const group = new THREE.Group();
    group.name = `RiversidePagodaPavilion_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const halfWidth = riverWorld.getWidth(uProgress) * 0.5;
    const sideSign = side === 'right' ? 1 : -1;

    const posX = center.x + normal.x * sideSign * (halfWidth + 4.2);
    const posZ = center.z + normal.z * sideSign * (halfWidth + 4.2);
    const elev = riverWorld.getTerrainHeight(posX, posZ);

    group.position.set(posX, elev, posZ);

    // Stone terrace plinth
    const plinthGeo = new THREE.CylinderGeometry(3.4, 3.8, 1.2, 6);
    const plinth = new THREE.Mesh(plinthGeo, this.ancientStoneMaterial);
    plinth.position.y = 0.6;
    group.add(plinth);

    // Stone steps descending towards water
    for (let s = 0; s < 4; s++) {
      const stepGeo = new THREE.BoxGeometry(2.4, 0.28, 0.75);
      const step = new THREE.Mesh(stepGeo, this.ancientStoneMaterial);
      step.position.set(
        -normal.x * sideSign * (2.4 + s * 0.65),
        0.5 - s * 0.25,
        -normal.z * sideSign * (2.4 + s * 0.65)
      );
      step.rotation.y = Math.atan2(-normal.x * sideSign, -normal.z * sideSign);
      group.add(step);
    }

    // 6 Wooden Pillars
    const pillarGeo = new THREE.CylinderGeometry(0.12, 0.14, 3.6, 8);
    for (let p = 0; p < 6; p++) {
      const angle = (p / 6) * Math.PI * 2;
      const pillar = new THREE.Mesh(pillarGeo, this.darkTrimMaterial);
      pillar.position.set(Math.cos(angle) * 2.4, 3.0, Math.sin(angle) * 2.4);
      group.add(pillar);
    }

    // Upturned Pagoda Tile Roof
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x242d2a,
      roughness: 0.62,
    });
    const lowerRoofGeo = new THREE.ConeGeometry(4.2, 1.4, 6);
    const lowerRoof = new THREE.Mesh(lowerRoofGeo, roofMat);
    lowerRoof.position.y = 5.2;
    group.add(lowerRoof);

    // Upper tiered roof
    const upperRoofGeo = new THREE.ConeGeometry(2.8, 1.2, 6);
    const upperRoof = new THREE.Mesh(upperRoofGeo, roofMat);
    upperRoof.position.y = 6.4;
    group.add(upperRoof);

    // Brass Finial spire
    const finial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.12, 0.9, 6),
      this.brassHardwareMaterial
    );
    finial.position.y = 7.4;
    group.add(finial);

    // Hanging amber lantern under eaves
    const lantern = this.createAuthenticWaterLantern();
    lantern.scale.set(0.65, 0.65, 0.65);
    lantern.position.set(0, 3.8, 0);
    group.add(lantern);

    return enableShadows(group);
  }

  /**
   * Landmark: Fisherman Stilt Shelter (Transformation / Ch. 6)
   * Weathered timber stilt hut with woven reed thatch roof, drying nets, and bamboo poles.
   */
  public createFishermanStiltShelter(uProgress: number, side: 'left' | 'right' = 'left'): THREE.Group {
    const group = new THREE.Group();
    group.name = `FishermanStiltShelter_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const halfWidth = riverWorld.getWidth(uProgress) * 0.5;
    const sideSign = side === 'right' ? 1 : -1;

    const posX = center.x + normal.x * sideSign * (halfWidth + 0.8);
    const posZ = center.z + normal.z * sideSign * (halfWidth + 0.8);
    const elev = riverWorld.getTerrainHeight(posX, posZ);

    group.position.set(posX, Math.max(elev, 0.2), posZ);

    // Stilt pilings driven into shoreline mud
    const pileGeo = new THREE.CylinderGeometry(0.12, 0.14, 3.4, 8);
    const corners = [
      [-1.4, -1.2],
      [1.4, -1.2],
      [-1.4, 1.2],
      [1.4, 1.2],
    ];
    corners.forEach(([cx, cz]) => {
      const pile = new THREE.Mesh(pileGeo, this.darkTrimMaterial);
      pile.position.set(cx, 0.5, cz);
      group.add(pile);
    });

    // Raised timber floorboards
    const floorGeo = new THREE.BoxGeometry(3.4, 0.18, 3.0);
    const floor = new THREE.Mesh(floorGeo, this.timberMaterial);
    floor.position.y = 1.9;
    group.add(floor);

    // Thatch Gable Roof
    const thatchMat = new THREE.MeshStandardMaterial({
      color: 0x8a7852,
      roughness: 0.95,
    });
    const roofGeo = new THREE.ConeGeometry(2.6, 1.6, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, thatchMat);
    roof.position.y = 3.6;
    roof.scale.set(1.2, 1.0, 1.1);
    group.add(roof);

    // Bamboo fishing poles leaning against stilt
    const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 4.2, 6);
    for (let p = 0; p < 3; p++) {
      const pole = new THREE.Mesh(poleGeo, this.bambooMaterial);
      pole.position.set(1.6, 1.5, -0.6 + p * 0.4);
      pole.rotation.z = -0.22;
      group.add(pole);
    }

    // Coiled hemp rope on deck
    const rope = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.05, 8, 16), this.hempRopeMaterial);
    rope.rotation.x = Math.PI / 2;
    rope.position.set(0.6, 2.05, 0.4);
    group.add(rope);

    return enableShadows(group);
  }

  /**
   * Landmark: Ancient Cliff Aqueduct Span (Between Ch. 5 and 6)
   * High masonry arch bridge spanning across the upper canyon gorge,
   * framing the horizon as the boat approaches from afar.
   */
  public createAncientCliffAqueduct(uProgress: number): THREE.Group {
    const bridgeGroup = new THREE.Group();
    bridgeGroup.name = `AncientCliffAqueduct_u${uProgress.toFixed(2)}`;

    const center = riverWorld.getPosition(uProgress);
    const normal = riverWorld.getNormal(uProgress);
    const tangent = riverWorld.getTangent(uProgress);
    const width = riverWorld.getWidth(uProgress);
    const spanLength = width + 10.0;

    // High arch vault (elevated high above boat headroom)
    const archRadius = spanLength * 0.48;
    const archGeo = new THREE.TorusGeometry(archRadius, 1.8, 10, 32, Math.PI);
    const archMesh = new THREE.Mesh(archGeo, this.ancientStoneMaterial);
    archMesh.rotation.y = Math.atan2(tangent.x, tangent.z) + Math.PI / 2;
    archMesh.rotation.z = Math.PI;
    archMesh.position.set(center.x, 3.2, center.z);
    bridgeGroup.add(archMesh);

    // High upper stone aqueduct conduit deck
    const deckGeo = new THREE.BoxGeometry(3.6, 1.4, spanLength);
    const deckMesh = new THREE.Mesh(deckGeo, this.ancientStoneMaterial);
    deckMesh.rotation.y = Math.atan2(normal.x, normal.z);
    deckMesh.position.set(center.x, archRadius + 4.2, center.z);
    bridgeGroup.add(deckMesh);

    return enableShadows(bridgeGroup);
  }
}

export const realisticAssetManager = RealisticAssetManager.getInstance();
