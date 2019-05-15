// Base BIF Parser from https://github.com/chemoish/videojs-bif/blob/master/src/parser.js
// LICENSE: https://github.com/chemoish/videojs-bif/blob/master/LICENSE

import jDataView from 'jdataview';

// Offsets

export const BIF_INDEX_OFFSET = 64;
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
export default class BIFParser {
  constructor(arrayBuffer) {
    // Magic Number
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-MagicNumber
    const magicNumber = new Uint8Array(arrayBuffer).slice(0, 8);

    if (!validate(magicNumber)) {
      throw new Error('Invalid BIF file.');
    }

    this.arrayBuffer = arrayBuffer;
    this.data = new jDataView(arrayBuffer); // eslint-disable-line new-cap

    // Number of BIF images
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-NumberofBIFimages
    this.numberOfBIFImages = this.data.getUint32(
      NUMBER_OF_BIF_IMAGES_OFFSET,
      true,
    );

    // Version
    // SEE: https://sdkdocs.roku.com/display/sdkdoc/Trick+Mode+Support#TrickModeSupport-Version
    this.version = this.data.getUint32(VERSION_OFFSET, true);

    this.bifIndex = this.generateBIFIndex(true);

    this.bifDimensions = { width: 240, height: 180 };

    try {
      this.getInitialImageDimensions();
    } catch (e) {
      console.warn('BIF Parser', e.stack);
    }
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

      const nextBifIndexEntryAbsoluteOffset =
        bifIndexEntryAbsoluteOffset + BIF_INDEX_ENTRY_LENGTH;

      // Documented example, items within `[]`are used to generate the frame.
      // 64, 65, 66, 67 | 68, 69, 70, 71
      // [Frame 0 timestamp] | [absolute offset of frame]
      // 72, 73, 74, 75 | 76, 77, 78, 79
      // Frame 1 timestamp | [absolute offset of frame]
      const offset = this.data.getUint32(bifIndexEntryAbsoluteOffset, true);
      const nextOffset = this.data.getUint32(
        nextBifIndexEntryAbsoluteOffset,
        true,
      );
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
   * Return image dimension data for a specific image source
   *
   * @returns {object} Promise
   */
  getInitialImageDimensions() {
    const image = 'data:image/jpeg;base64,';
    const src = `${image}${btoa(
      String.fromCharCode.apply(
        null,
        new Uint8Array(
          this.arrayBuffer.slice(
            this.bifIndex[0].offset,
            this.bifIndex[0].offset + this.bifIndex[0].length,
          ),
        ),
      ),
    )}`;
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (!img.width || !img.height) throw 'Missing image dimensions';
      this.bifDimensions = {
        width: img.width,
        height: img.height,
      };
    };
  }

  /**
   * Return image data for a specific frame of a movie.
   *
   * @param {number} second
   * @returns {string} imageData
   */
  getImageDataAtSecond(second) {
    const image = 'data:image/jpeg;base64,';

    const frame = this.bifIndex.find(bif => {
      return bif.timestamp / 1000 > second;
    });

    if (!frame) {
      return image;
    }

    const src = `${image}${btoa(
      String.fromCharCode.apply(
        null,
        new Uint8Array(
          this.arrayBuffer.slice(frame.offset, frame.offset + frame.length),
        ),
      ),
    )}`;

    // Build our image object using image dimensions and our newest source
    return {
      start: frame.timestamp / 1000,
      src,
      x: 0,
      y: 0,
      width: this.bifDimensions.width,
      height: this.bifDimensions.height,
    };
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
        src: `${image}${btoa(
          String.fromCharCode.apply(
            null,
            new Uint8Array(
              this.arrayBuffer.slice(frame.offset, frame.offset + frame.length),
            ),
          ),
        )}`,
        x: 0,
        y: 0,
        width: this.bifDimensions.width,
        height: this.bifDimensions.height,
      });
    });
    return images;
  }
}
