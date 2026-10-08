import * as THREE from 'three';
import { riverWorld } from './RiverWorld';
import { realisticAssetManager } from './RealisticAssetManager';

/**
 * Procedural PBR Natural Environment Builder
 * Generates:
 * 1. 4 Botanical Tree Species with natural asymmetry, gnarled trunks, and organic foliage
 * 2. Irregular Geological Rock Formations (wet tide-marked boulders, karst cliffs, river slabs)
 * 3. Ground Scatter: Shoreline pebbles, river reeds, and exposed tree roots
 * All objects firmly rooted on terrain elevation (zero floating objects) with soft shadows.
 */
function createProceduralBarkNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff'; // Neutral normal in tangent space
  ctx.fillRect(0, 0, 512, 512);

  // Vertical bark furrow ridges & fissures
  for (let i = 0; i < 450; i++) {
    const x = Math.random() * 512;
    const w = Math.random() * 4 + 1.5;
    const r = Math.floor(Math.random() * 50 + 105);
    const g = Math.floor(Math.random() * 40 + 110);
    ctx.fillStyle = `rgb(${r}, ${g}, 255)`;
    ctx.fillRect(x, 0, w, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

function createProceduralRockNormalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.fillStyle = '#8080ff';
  ctx.fillRect(0, 0, 512, 512);

  // Mineral facets and horizontal stratification fissures
  for (let i = 0; i < 350; i++) {
    const y = Math.random() * 512;
    const h = Math.random() * 3 + 1;
    const r = Math.floor(Math.random() * 40 + 110);
    const g = Math.floor(Math.random() * 50 + 105);
    ctx.fillStyle = `rgb(${r}, ${g}, 255)`;
    ctx.fillRect(0, y, 512, h);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.NoColorSpace;
  return texture;
}

function enableGroupShadows(group: THREE.Group): THREE.Group {
  group.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  return group;
}

export class EnvironmentDetailSystem {
  // Shared materials for high performance and consistent cinematic lighting
  private willowTrunkMat: THREE.MeshStandardMaterial;
  private willowFoliageMat1: THREE.MeshStandardMaterial;
  private willowFoliageMat2: THREE.MeshStandardMaterial;

  private peachTrunkMat: THREE.MeshStandardMaterial;
  private peachBlossomMat1: THREE.MeshStandardMaterial;
  private peachBlossomMat2: THREE.MeshStandardMaterial;
  private peachLeafMat: THREE.MeshStandardMaterial;

  private pineTrunkMat: THREE.MeshStandardMaterial;
  private pineNeedleMat1: THREE.MeshStandardMaterial;
  private pineNeedleMat2: THREE.MeshStandardMaterial;

  private bambooStemMat: THREE.MeshStandardMaterial;
  private bambooLeafMat: THREE.MeshStandardMaterial;

  private dryRockMat: THREE.MeshStandardMaterial;
  private wetRockMat: THREE.MeshStandardMaterial;
  private karstCliffMat: THREE.MeshStandardMaterial;

  private reedMat: THREE.MeshStandardMaterial;
  private pebbleMat: THREE.MeshStandardMaterial;
  private rootMat: THREE.MeshStandardMaterial;

  constructor() {
    const barkNormal = createProceduralBarkNormalTexture();
    const rockNormal = createProceduralRockNormalTexture();

    // 1. Willow Materials (Soft sage, olive tones, desaturated organic)
    this.willowTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x362b21,
      normalMap: barkNormal,
      normalScale: new THREE.Vector2(0.8, 0.8),
      roughness: 0.90,
      metalness: 0.02,
    });
    this.willowFoliageMat1 = new THREE.MeshStandardMaterial({
      color: 0x4f6848,
      roughness: 0.84,
    });
    this.willowFoliageMat2 = new THREE.MeshStandardMaterial({
      color: 0x5e7956,
      roughness: 0.86,
    });

    // 2. Peach Materials (Dark weathered bark, soft pink blossoms, fresh green shoots)
    this.peachTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x302115,
      normalMap: barkNormal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.92,
    });
    this.peachBlossomMat1 = new THREE.MeshStandardMaterial({
      color: 0xe89f9c,
      roughness: 0.80,
    });
    this.peachBlossomMat2 = new THREE.MeshStandardMaterial({
      color: 0xf0b0ad,
      roughness: 0.82,
    });
    this.peachLeafMat = new THREE.MeshStandardMaterial({
      color: 0x536c42,
      roughness: 0.85,
    });

    // 3. Highland Pine Materials (Reddish fissured bark, deep forest needles)
    this.pineTrunkMat = new THREE.MeshStandardMaterial({
      color: 0x362519,
      normalMap: barkNormal,
      normalScale: new THREE.Vector2(1.1, 1.1),
      roughness: 0.94,
    });
    this.pineNeedleMat1 = new THREE.MeshStandardMaterial({
      color: 0x243428,
      roughness: 0.88,
    });
    this.pineNeedleMat2 = new THREE.MeshStandardMaterial({
      color: 0x2e4234,
      roughness: 0.86,
    });

    // 4. Bamboo Materials
    this.bambooStemMat = new THREE.MeshStandardMaterial({
      color: 0x42623e,
      roughness: 0.76,
    });
    this.bambooLeafMat = new THREE.MeshStandardMaterial({
      color: 0x527749,
      roughness: 0.82,
    });

    // 5. Rock & Cliff Materials
    this.dryRockMat = new THREE.MeshStandardMaterial({
      color: 0x4c534f,
      normalMap: rockNormal,
      normalScale: new THREE.Vector2(0.75, 0.75),
      roughness: 0.92,
      metalness: 0.04,
    });
    this.wetRockMat = new THREE.MeshStandardMaterial({
      color: 0x262c29,
      normalMap: rockNormal,
      normalScale: new THREE.Vector2(0.9, 0.9),
      roughness: 0.42, // Glossier wet waterline mineral surface
      metalness: 0.08,
    });
    this.karstCliffMat = new THREE.MeshStandardMaterial({
      color: 0x3f4643,
      normalMap: rockNormal,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughness: 0.94,
      flatShading: false,
    });

    // 6. Scatter Materials
    this.reedMat = new THREE.MeshStandardMaterial({
      color: 0x64744e,
      roughness: 0.85,
    });
    this.pebbleMat = new THREE.MeshStandardMaterial({
      color: 0x414640,
      normalMap: rockNormal,
      roughness: 0.80,
    });
    this.rootMat = new THREE.MeshStandardMaterial({
      color: 0x2a1f15,
      normalMap: barkNormal,
      roughness: 0.94,
    });
  }

  /**
   * Weeping River Willow (Salix babylonica)
   * High-fidelity multi-branching willow with natural curved boughs and weeping curtains.
   */
  public createWeepingWillow(x: number, z: number, scale = 1.0, seed = 0): THREE.Object3D {
    return realisticAssetManager.createRealisticWillow(x, z, scale, seed);
  }

  /**
   * Blooming Peach Tree (Prunus persica)
   * Gnarled trunk with layered blossoming boughs and organic petal clusters.
   */
  public createBloomingPeachTree(x: number, z: number, scale = 1.0, seed = 0): THREE.Object3D {
    return realisticAssetManager.createRealisticPeachTree(x, z, scale, seed);
  }

  /**
   * Highland River Pine (Pinus)
   * Stratified red-brown bark with tiered horizontal needle clouds.
   */
  public createHighlandPine(x: number, z: number, scale = 1.0, seed = 0): THREE.Object3D {
    return realisticAssetManager.createRealisticPine(x, z, scale, seed);
  }

  /**
   * Organic Clonal Bamboo Cluster (Phyllostachys)
   * Segmented culms with golden-angle branching and feathered foliage spray.
   */
  public createBambooGrove(x: number, z: number, stalkCount = 6, seed = 0): THREE.Group {
    return realisticAssetManager.createRealisticBambooGrove(x, z, stalkCount, seed);
  }

  /**
   * Irregular Geological Shoreline Boulder
   * Stratified Voronoi-cleaved rock with waterline mineral sheen.
   */
  public createShorelineBoulder(x: number, z: number, baseRadius = 1.4, seed = 0): THREE.Group {
    return realisticAssetManager.createRealisticShorelineBoulder(x, z, baseRadius, seed);
  }

  /**
   * Karst Limestone Cliff Tower (Mountain Valley)
   * Towering limestone crag with fluted dissolution and bedding strata.
   */
  public createKarstCliffTower(x: number, z: number, radius = 8.0, height = 28.0, seed = 0): THREE.Group {
    return realisticAssetManager.createRealisticKarstTower(x, z, radius, height, seed);
  }

  /**
   * River Reeds & Sedge Grass Clump
   * High-fidelity curved reed blades with cattail spikes.
   */
  public createRiverReeds(x: number, z: number, count = 12): THREE.Group {
    return realisticAssetManager.createRealisticReeds(x, z, count);
  }

  /**
   * Shoreline Pebble Bed
   * Small river-worn pebbles scattered along the waterline sand.
   */
  public createShorelinePebbleBed(x: number, z: number, count = 10, radius = 2.2): THREE.Group {
    const group = new THREE.Group();
    const groundY = riverWorld.getTerrainHeight(x, z);
    group.position.set(x, groundY, z);

    const pebbleGeo = new THREE.DodecahedronGeometry(0.2, 0);
    for (let i = 0; i < count; i++) {
      const pebble = new THREE.Mesh(pebbleGeo, this.pebbleMat);
      const angle = i * 2.399;
      const r = Math.sqrt((i + 1) / count) * radius;
      pebble.position.set(
        Math.cos(angle) * r,
        0.08,
        Math.sin(angle) * r
      );
      pebble.scale.set(1.2, 0.5, 0.9);
      pebble.rotation.set(i * 0.5, i * 1.1, i * 0.3);
      group.add(pebble);
    }

    return enableGroupShadows(group);
  }

  /**
   * Exposed Tree Roots
   * Arching roots emerging from riverbank soil and dipping toward the water.
   */
  public createExposedRoots(x: number, z: number, towardWaterDir: THREE.Vector3): THREE.Group {
    const group = new THREE.Group();
    const groundY = riverWorld.getTerrainHeight(x, z);
    group.position.set(x, groundY, z);

    for (let r = 0; r < 3; r++) {
      const rootCurve = new THREE.QuadraticBezierCurve3(
        new THREE.Vector3(0, 0.4, 0),
        new THREE.Vector3(towardWaterDir.x * 1.2, 0.6, towardWaterDir.z * 1.2),
        new THREE.Vector3(towardWaterDir.x * 2.4, -0.1, towardWaterDir.z * 2.4)
      );
      const tubeGeo = new THREE.TubeGeometry(rootCurve, 8, 0.09 - r * 0.02, 6, false);
      const rootMesh = new THREE.Mesh(tubeGeo, this.rootMat);
      rootMesh.rotation.y = (r - 1) * 0.35;
      group.add(rootMesh);
    }

    return enableGroupShadows(group);
  }
}

export const environmentDetailSystem = new EnvironmentDetailSystem();
