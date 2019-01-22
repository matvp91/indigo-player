import { Instance } from '@src/Instance';
import { Module } from '@src/Module';
import { Events } from '@src/types';

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

    if (videoFile) {
      this.instance.once(Events.READY, () => {
        this.instance.play();
      });
      this.instance.pause();
      this.instance.player.setSource(URL.createObjectURL(videoFile));
    }
  }
}
