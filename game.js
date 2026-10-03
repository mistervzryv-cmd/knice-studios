// game.js - Ancient 4X Strategy Game Core API & Localization / Save System
// Жестко заданный сид детерминированного генератора для полной стабильности карты
export const MAP_SEED = 98765;

import { MapGenerator } from './src/map/MapGenerator.ts';
import { HexCoord } from './src/map/HexCoord.ts';
import { GAME_CONSTANTS } from './src/config/GameConstants.ts';
import { CanvasRenderer } from './src/render/CanvasRenderer.ts';
import { GameState } from './src/core/GameState.ts';
import { UIManager } from './src/ui/UIManager.ts';
import { EventBus } from './src/core/EventBus.ts';
import { SaveManager } from './src/core/SaveManager.ts';
import {
  TRANSLATIONS,
  initLanguage,
  getCurrentLanguage,
  setLanguage,
  toggleLanguage,
  t,
  applyLanguageToDOM
} from './src/i18n/translations.ts';
import {
  DiplomaticStatus,
  HistoricalAge,
  DogmaId,
  UnitType,
  ResourceType,
  FactionTier,
  PoliticalRegime
} from './src/entities/Types.ts';
import { RESEARCH_TECHS, ResearchSystem } from './src/simulation/ResearchSystem.ts';
import { LANGUAGE_TECHS, LanguageSystem } from './src/simulation/LanguageSystem.ts';
import { CombatSystem } from './src/simulation/CombatSystem.ts';
import { EconomySystem } from './src/simulation/EconomySystem.ts';
import { QuestSystem, HISTORICAL_QUESTS } from './src/simulation/QuestSystem.ts';

// 1. Localization Module Exports
export {
  TRANSLATIONS,
  initLanguage,
  getCurrentLanguage,
  setLanguage,
  toggleLanguage,
  t,
  applyLanguageToDOM
};

// 2. Local Storage Saves Module Functions
export function saveGame(state) {
  const gs = state || window.gameState;
  if (!gs) {
    console.warn('[Ancient 4X] Cannot save: GameState not initialized');
    return false;
  }
  return SaveManager.saveGame(gs);
}

export function loadGame(state) {
  const gs = state || window.gameState;
  if (!gs) {
    console.warn('[Ancient 4X] Cannot load: GameState not initialized');
    return false;
  }
  const loaded = SaveManager.loadGame(gs);
  if (loaded) {
    if (window.renderer) {
      window.renderer.centerOnPlayerCapital();
      window.renderer.render();
    }
    if (window.uiManager) {
      window.uiManager.updateHUD();
      window.uiManager.updateInspector();
      window.uiManager.updateChronicles();
    }
  }
  return loaded;
}

export function hasSavedGame() {
  return SaveManager.hasSavedGame();
}

export function getSavedGameMeta() {
  return SaveManager.getSavedGameMeta();
}

// Expose globals for console access and cross-script interop
window.saveGame = saveGame;
window.loadGame = loadGame;
window.hasSavedGame = hasSavedGame;
window.getSavedGameMeta = getSavedGameMeta;
window.setLanguage = setLanguage;
window.toggleLanguage = toggleLanguage;
window.t = t;
window.TRANSLATIONS = TRANSLATIONS;
window.RESEARCH_TECHS = RESEARCH_TECHS;
window.LANGUAGE_TECHS = LANGUAGE_TECHS;

// 3. Hotkey: Spacebar to End Turn
window.addEventListener('keydown', (e) => {
  // Не перехватываем нажатия в полях ввода текста
  const targetTag = (e.target && (e.target.tagName || '')).toUpperCase();
  if (['INPUT', 'TEXTAREA'].includes(targetTag)) return;

  // Block auto‑repeat of held key
  if (e.repeat) return;

  if (e.code === 'Space' || e.key === ' ') {
    const endTurnBtn = document.getElementById('btn-end-turn');
    if (endTurnBtn) {
      e.preventDefault();
      endTurnBtn.click();
    }
  }
});

// Re-export Core Simulation & Engine Types
export {
  MapGenerator,
  HexCoord,
  GAME_CONSTANTS,
  CanvasRenderer,
  GameState,
  UIManager,
  EventBus,
  SaveManager,
  DiplomaticStatus,
  HistoricalAge,
  DogmaId,
  UnitType,
  ResourceType,
  FactionTier,
  PoliticalRegime,
  RESEARCH_TECHS,
  LANGUAGE_TECHS,
  ResearchSystem,
  LanguageSystem,
  CombatSystem,
  EconomySystem
};

console.log('Ancient 4X: Модули автосохранения, RU/EN локализации и мобильного touch-управления успешно загружены!');
