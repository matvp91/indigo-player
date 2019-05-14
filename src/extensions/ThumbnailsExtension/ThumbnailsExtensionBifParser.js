// BIF Parser from https://github.com/chemoish/videojs-bif/blob/master/src/parser.js
// LICENSE: https://github.com/chemoish/videojs-bif/blob/master/LICENSE

import jDataView from 'jdataview';

// Offsets

export const BIF_INDEX_OFFSET = 64;
export const FRAMEWISE_SEPARATION_OFFSET = 16;
export const NUMBER_OF_BIF_IMAGES_OFFSET = 12;
export const VERSION_OFFSET = 8;

// Metadata

export const BIF_INDEX_ENTRY_LENGTH = 8;

// Magic Number
// SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-MagicNumber
export const MAGIC_NUMBER = new Uint8Array([
  '0x89',
  '0x42',
  '0x49',
  '0x46',
  '0x0d',
  '0x0a',
  '0x1a',
  '0x0a',
]);

/**
 * Validate the file identifier against the magic number.
 *
 * @returns {boolean} isValid
 */
function validate(magicNumber) {
  let isValid = true;

  MAGIC_NUMBER.forEach((byte, i) => {
    if (byte !== magicNumber[i]) {
      isValid = false;

      return;
    }
  });

  return isValid;
}

/**
 * Parsing and read BIF file format.
 *
 * @param {ArrayBuffer} arrayBuffer
 */
export class BIFParser {
  constructor(arrayBuffer) {
    // Magic Number
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-MagicNumber
    const magicNumber = new Uint8Array(arrayBuffer).slice(0, 8);

    if (!validate(magicNumber)) {
      throw new Error('Invalid BIF file.');
    }

    this.arrayBuffer = arrayBuffer;
    this.data = new jDataView(arrayBuffer); // eslint-disable-line new-cap

    // Framewise Separation
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-FramewiseSeparation
    this.framewiseSeparation = this.data.getUint32(FRAMEWISE_SEPARATION_OFFSET, true) || 1000;

    // Number of BIF images
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-NumberofBIFimages
    this.numberOfBIFImages = this.data.getUint32(NUMBER_OF_BIF_IMAGES_OFFSET, true);

    // Version
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-Version
    this.version = this.data.getUint32(VERSION_OFFSET, true);

    this.bifIndex = this.generateBIFIndex(true);
  }

  /**
   * Create the BIF index
   * SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-BIFindex
   *
   * @returns {Array} bifIndex
   */
  generateBIFIndex() {
    const bifIndex = [];

    for (
      // BIF index starts at byte 64 (BIF_INDEX_OFFSET)
      let i = 0, bifIndexEntryOffset = BIF_INDEX_OFFSET;
      i < this.numberOfBIFImages;
      i += 1, bifIndexEntryOffset += BIF_INDEX_ENTRY_LENGTH
    ) {
      const bifIndexEntryTimestampOffset = bifIndexEntryOffset;
      const bifIndexEntryAbsoluteOffset = bifIndexEntryOffset + 4;

      const nextBifIndexEntryAbsoluteOffset = bifIndexEntryAbsoluteOffset + BIF_INDEX_ENTRY_LENGTH;

      // Documented example, items within `[]`are used to generate the frame.
      // 64, 65, 66, 67 | 68, 69, 70, 71
      // [Frame 0 timestamp] | [absolute offset of frame]
      // 72, 73, 74, 75 | 76, 77, 78, 79
      // Frame 1 timestamp | [absolute offset of frame]
      const offset = this.data.getUint32(bifIndexEntryAbsoluteOffset, true);
      const nextOffset = this.data.getUint32(nextBifIndexEntryAbsoluteOffset, true);
      const timestamp = this.data.getUint32(bifIndexEntryTimestampOffset, true);

      bifIndex.push({
        offset,
        timestamp,

        length: nextOffset - offset,
      });
    }

    return bifIndex;
  }

  /**
   * Return image data for a specific frame of a movie.
   *
   * @param {number} second
   * @returns {string} imageData
   */
  getImageDataAtSecond(second) {
    const image = 'data:image/jpeg;base64,';

    // since frames are defined at an interval of `this.framewiseSeparation`,
    // we need to convert the time into an appropriate frame number.
    const frameNumber = Math.floor(second / (this.framewiseSeparation / 1000));

    const frame = this.bifIndex[frameNumber];

    console.log({frame});

    if (!frame) {
      return image;
    }

    return `${image}${btoa(String.fromCharCode.apply(null,
      new Uint8Array(this.arrayBuffer.slice(frame.offset, frame.offset + frame.length))
    ))}`;
  }

  /**
   * Return image data for all BIF files.
   *
   * @returns {string} imageData
   */
  getImageData() {
    const images = [];
    this.bifIndex.forEach(frame => {
      const image = 'data:image/jpeg;base64,';

      images.push({
        start: frame.timestamp / 1000,
        src: `${image}${btoa(String.fromCharCode.apply(null,
            new Uint8Array(this.arrayBuffer.slice(frame.offset, frame.offset + frame.length))
          ))}`,
        x: 0,
        y: 0,
        width: 240,
        height: 145
      });
    });
    return images;
  }
}