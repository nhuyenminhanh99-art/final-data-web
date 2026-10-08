/**
 * Authoritative English Production Copy Architecture
 * "The River of Insights — Analytics Leadership"
 */

export const journeyCopy = {
  brand: {
    title: 'The River of Insights',
    subtitle: 'Analytics Leadership',
    bookRef: 'Chapters 7–11 · Behind Every Good Decision',
    authors: 'Piyanka Jain & Puneet Sharma',
  },

  navigation: {
    home: 'Home',
    journey: 'Journey',
    chapters: 'Chapters',
    caseStudies: 'Case Studies',
    glossary: 'Glossary',
    about: 'About',
    getStarted: 'Begin Journey',
    returnHome: 'Return Home',
    skipToMain: 'Skip to main content',
  },

  controls: {
    camera: {
      label: 'Camera View',
      rider: 'Elevated Follow',
      bow: 'Bow Lantern',
      aerial: 'Aerial Drone',
      switchTooltip: 'Switch camera perspective (Elevated Follow / Bow Lantern / Aerial Drone)',
    },
    cruise: {
      start: 'Auto Cruise',
      pause: 'Pause Cruise',
      startTooltip: 'Enable automatic river cruise through chapters',
      pauseTooltip: 'Pause automatic cruise',
    },
    sailingMode: {
      guided: 'Guided Sailing',
      free: 'Free Sail',
      guidedTooltip: 'Switch to free manual river exploration',
      freeTooltip: 'Switch to guided waypoint navigation',
    },
    viewMode: {
      threeD: '3D World',
      lite2d: '2D Lite',
      tooltip: 'Toggle between immersive 3D graphics and lightweight 2D illustrations',
    },
    audio: {
      mute: 'Mute Audio',
      unmute: 'Enable Ambient Water Audio',
      tooltipMute: 'Mute water and rowing soundscape',
      tooltipUnmute: 'Unmute water and rowing soundscape',
    },
    debugHud: {
      label: 'Telemetry HUD',
      tooltip: 'Toggle navigation and avoidance telemetry overlay',
    },
    export: {
      label: 'Base44 / Lovable',
      tooltip: 'Export source code specification and prompt architecture for Base44 & Lovable',
    },
  },

  instructions: {
    heroBanner: 'Scroll or press ↓ to sail downstream · Drag mouse to look around',
    keyboardNav: 'Use Up/Down Arrow keys or Mouse Wheel to navigate the river corridor',
    arrivedNotice: 'Arrived at Chapter Landmark',
    nextChapter: 'Sail to next chapter',
    prevChapter: 'Sail to previous chapter',
  },

  landmarks: {
    exploreChapter: 'Explore Chapter',
    exploreCases: 'Explore 6 Case Studies',
    continueVoyage: 'Continue Downstream',
  },

  accessibility: {
    mainCanvasAria: 'Interactive 3D river navigation canvas. Use mouse wheel or keyboard arrow keys to sail the boat along the river corridor.',
    mobileMenuOpen: 'Open navigation menu',
    mobileMenuClose: 'Close navigation menu',
    audioToggleAria: 'Toggle ambient river soundscape',
    cameraToggleAria: 'Cycle camera perspective',
  },
} as const;
