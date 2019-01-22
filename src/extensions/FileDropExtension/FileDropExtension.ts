import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { HTML5Player } from '@src/player/HTML5Player/HTML5Player';
import { Events } from '@src/types';
import { CaptionsExtension } from '../CaptionsExtension/CaptionsExtension';

export class FileDropExtension extends Module {
  public name: string = 'FileDropExtension';
  private dragOverClassName: string = 'ig-drag-over';

  constructor(instance: Instance) {
    super(instance);

    this.instance.container.ondragover = this.onDragOver;
    this.instance.container.ondragleave = this.removeDragOverClassName;
    this.instance.container.ondrop = this.onDrop;
  }

  private removeDragOverClassName = (e?: DragEvent) => {
    if (e) {
      e.preventDefault();
    }

    this.instance.container.classList.remove(this.dragOverClassName);
  }

  private onDragOver = (e: DragEvent) => {
    e.preventDefault();
    this.instance.container.classList.add(this.dragOverClassName);
  }

  private onDrop = (e: DragEvent) => {
    e.preventDefault();
    this.removeDragOverClassName();

    const files: File[] = Array.from(e.dataTransfer.files);
    const videoFile = files.find(file => file.type.startsWith('video/'));
    const subtitlesFiles = files.filter(file => file.type === 'text/vtt');

    if (videoFile) {
      this.loadVideo(videoFile);
    }

    this.loadSubtitles(subtitlesFiles);
  }

  private loadVideo = (videoFile: File) => {
    const player = this.instance.player as HTML5Player;

    if (!player.mediaElement.paused) {
      this.instance.once(Events.STATE_DURATION_CHANGE, () => {
        this.instance.play();
      });
    }

    this.instance.pause();
    player.setSource(URL.createObjectURL(videoFile));
  }

  private loadSubtitles = (files: File[]) => {
    const captionsExtension = this.instance.extensions
      .find(ext => ext.name === 'CaptionsExtension') as CaptionsExtension;

    if (!captionsExtension) {
      return;
    }

    for (const file of files) {
      captionsExtension.loadSubtitleFile(file);
    }
  }
}
