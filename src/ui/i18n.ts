// List of language codes: http://www.lingoes.net/en/translator/langcode.htm

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
  },
};

export const getTranslation = languageCode => text => {
  if (translations[languageCode] && translations[languageCode][text]) {
    return translations[languageCode][text];
  }
  return text;
};
