// List of language codes: http://www.lingoes.net/en/translator/langcode.htm
import { mergeDeep } from '../utils/mergeDeep';

export const translations = {
  'en-US': {
    Play: 'Play',
    Pause: 'Pause',
    Mute: 'Mute',
    Unmute: 'Unmute',
    Miniplayer: 'Miniplayer',
    Settings: 'Settings',
    'Full screen': 'Full screen',
    'Exit full screen': 'Exit full screen',
    Speed: 'Speed',
    'Normal speed': 'Normal',
    Subtitles: 'Subtitles',
    'No subtitles': 'None',
    Quality: 'Quality',
    'Automatic quality': 'Auto',
    'Enable subtitles': 'Enable subtitles',
    'Disable subtitles': 'Disable subtitles',
    'Rewind {s} seconds': 'Rewind {s} seconds',
    'Forward {s} seconds': 'Forward {s} seconds'
  },
  'fr-FR': {
    Play: 'Lecture',
    Pause: 'Pause',
    Mute: 'Désactiver le son',
    Unmute: 'Réactiver le son',
    Miniplayer: 'Miniplayer',
    Settings: 'Réglages',
    'Full screen': 'Plein écran',
    'Exit full screen': 'Quitter le mode plein écran',
    Speed: 'Vitesse',
    'Normal speed': 'Normal',
    Subtitles: 'Sous-titres',
    'No subtitles': 'Aucun',
    Quality: 'Qualité',
    'Automatic quality': 'Automatique',
    'Enable subtitles': 'Activer les sous-titres',
    'Disable subtitles': 'Désactiver les sous-titres',
    'Rewind {s} seconds': 'Rembobiner de {s} secondes',
    'Forward {s} seconds': 'Avancer de {s} secondes'
  },
  'nl-BE': {
    Play: 'Afspelen',
    Pause: 'Pauzeren',
    Mute: 'Dempen',
    Unmute: 'Unmute',
    Miniplayer: 'Mini speler',
    Settings: 'Instellingen',
    'Full screen': 'Volledig scherm',
    'Exit full screen': 'Volledig scherm afsluiten',
    Speed: 'Snelheid',
    'Normal speed': 'Normale snelheid',
    Subtitles: 'Ondertitels',
    'No subtitles': 'Geen',
    Quality: 'Kwaliteit',
    'Automatic quality': 'Automatisch',
    'Enable subtitles': 'Ondertitels aan',
    'Disable subtitles': 'Ondertitels uit',
    'Rewind {s} seconds': 'Terugspoelen {s} seconden',
    'Forward {s} seconds': 'Vooruitgang {s} seconden'
  },
  'de-DE': {
    Play: 'Wiedergabe',
    Pause: 'Pause',
    Mute: 'Stummschalten',
    Unmute: 'Stummschaltung aufheben',
    Miniplayer: 'Miniplayer',
    Settings: 'Einstellungen',
    'Full screen': 'Vollbild',
    'Exit full screen': 'Vollbildmodus verlassen',
    Speed: 'Geschwindigkeit',
    'Normal speed': 'Normal',
    Subtitles: 'Untertitel',
    'No subtitles': 'Aus',
    Quality: 'Qualität',
    'Automatic quality': 'Automatisch',
    'Enable subtitles': 'Untertitel an',
    'Disable subtitles': 'Untertitel aus',
    'Rewind {s} seconds': 'Rückspulen {s} sekunden',
    'Forward {s} seconds': 'Vorwärts bewegen {s} sekunden'
  },
  'hi-IN': {
    Play: 'चलाएँ',
    Pause: 'रोकें',
    Mute: 'ध्वनि बंद करें',
    Unmute: 'ध्वनि शुरू करें',
    Miniplayer: 'लघु संस्करण',
    Settings: 'नियंत्रण',
    'Full screen': 'पूर्ण संस्करण',
    'Exit full screen': 'पूर्ण संस्करण से बाहर निकलें',
    Speed: 'गति',
    'Normal speed': 'सामान्य',
    Subtitles: 'उपशीर्षक',
    'No subtitles': 'उपशीर्षक उपलब्ध नहीं है',
    Quality: 'गुणवत्ता',
    'Automatic quality': 'स्वचालित',
    'Enable subtitles': 'उपशीर्षक जारी रखें',
    'Disable subtitles': 'उपशीर्षक बंद करें',
  },
  'mr-IN': {
    Play: 'चालू करा',
    Pause: 'थांबवा',
    Mute: 'आवाज बंद करा ',
    Unmute: 'आवाज सुरू करा',
    Miniplayer: 'लघु आवृत्ती',
    Settings: 'नियंत्रणे',
    'Full screen': 'पूर्ण आवृत्ती',
    'Exit full screen': 'पूर्ण आवृत्तीतून बाहेर पडा',
    Speed: 'गति',
    'Normal speed': 'सामान्य',
    Subtitles: 'उपशीर्षके',
    'No subtitles': 'उपशीर्षके उपलब्ध नाहीत',
    Quality: 'गुणवत्ता',
    'Automatic quality': 'स्वयंचलित',
    'Enable subtitles': 'उपशीर्षके सूरू करा',
    'Disable subtitles': 'उपशीर्षके बंद करा',
  },
  'pt-BR': {
    Play: 'Reproduzir',
    Pause: 'Pausa',
    Mute: 'Mudo',
    Unmute: 'Ativar som',
    Miniplayer: 'Miniatura',
    Settings: 'Configurações',
    'Full screen': 'Tela cheia',
    'Exit full screen': 'Sair da tela cheia',
    Speed: 'Velocidade',
    'Normal speed': 'Normal',
    Subtitles: 'Legenda',
    'No subtitles': 'Sem legenda',
    Quality: 'Qualidade',
    'Automatic quality': 'Automática',
    'Enable subtitles': 'Habilitar legenda',
    'Disable subtitles': 'Desabilitar legenda',
  },
};

let translationsMerge = false

export const getTranslation = (languageCode, translationsUi) => (text, params?: object) => {
  if(!translationsMerge) {
    translationsMerge = mergeDeep(translations, translationsUi);
  }
  if (translationsMerge[languageCode] && translationsMerge[languageCode][text]) {
    let res = translationsMerge[languageCode][text];
    if (params && Object.keys(params).length > 0) {
      for (var k in params) {
        res = res.replace(new RegExp("\\{" + k + "\\}", "gi"), params[k]);
      }
    }
    return res;
  }
  return text;
};
