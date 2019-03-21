import { BaseControllerLoader } from '@src/controller/BaseController/BaseControllerLoader';
import { BenchmarkExtensionLoader } from '@src/extensions/BenchmarkExtension/BenchmarkExtensionLoader';
import { ContextMenuExtensionLoader } from '@src/extensions/ContextMenuExtension/ContextMenuExtensionLoader';
import { FreeWheelExtensionLoader } from '@src/extensions/FreeWheelExtension/FreeWheelExtensionLoader';
import { FullscreenExtensionLoader } from '@src/extensions/FullscreenExtension/FullscreenExtensionLoader';
import { GoogleIMAExtensionLoader } from '@src/extensions/GoogleIMAExtension/GoogleIMAExtensionLoader';
import { KeyboardNavigationExtensionLoader } from '@src/extensions/KeyboardNavigationExtension/KeyboardNavigationExtensionLoader';
import { PipExtensionLoader } from '@src/extensions/PipExtension/PipExtensionLoader';
import { StateExtensionLoader } from '@src/extensions/StateExtension/StateExtensionLoader';
import { SubtitlesExtensionLoader } from '@src/extensions/SubtitlesExtension/SubtitlesExtensionLoader';
import { ThumbnailsExtensionLoader } from '@src/extensions/ThumbnailsExtension/ThumbnailsExtensionLoader';
import { DimensionsExtensionLoader } from '@src/extensions/DimensionsExtension/DimensionsExtensionLoader';
import { BaseMediaLoader } from '@src/media/BaseMedia/BaseMediaLoader';
import { DashMediaLoader } from '@src/media/DashMedia/DashMediaLoader';
import { HlsMediaLoader } from '@src/media/HlsMedia/HlsMediaLoader';
import { HTML5PlayerLoader } from '@src/player/HTML5Player/HTML5PlayerLoader';
import {
  IInstance,
  IModule,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { UiExtensionLoader } from '@src/ui/UiExtensionLoader';
import find from 'lodash/find';

const modules: Array<IModuleLoader<IModule>> = [
  BaseControllerLoader,

  DashMediaLoader,
  HlsMediaLoader,
  BaseMediaLoader,

  HTML5PlayerLoader,

  PipExtensionLoader,
  UiExtensionLoader,
  StateExtensionLoader,
  BenchmarkExtensionLoader,
  FreeWheelExtensionLoader,
  FullscreenExtensionLoader,
  SubtitlesExtensionLoader,
  GoogleIMAExtensionLoader,
  ThumbnailsExtensionLoader,
  KeyboardNavigationExtensionLoader,
  ContextMenuExtensionLoader,
  DimensionsExtensionLoader,
];

export async function createFirstSupported<T>(
  type: ModuleLoaderTypes,
  instance: IInstance,
  isSupportedArgs?: any,
): Promise<T> {
  const items = modules.filter(item => item.type === type);

  for (const loader of items) {
    if (await loader.isSupported(instance, isSupportedArgs)) {
      return ((await loader.create(instance)) as unknown) as T;
    }
  }

  return null;
}

export async function createAllSupported<T>(
  type: ModuleLoaderTypes,
  instance: IInstance,
  isSupportedArgs?: any,
): Promise<T[]> {
  const items = modules.filter(item => item.type === type);

  const instances: T[] = [];

  for (const loader of items) {
    if (await loader.isSupported(instance, isSupportedArgs)) {
      instances.push(((await loader.create(instance)) as unknown) as T);
    }
  }

  return instances;
}

export function addModuleLoader(mod: IModuleLoader<IModule>) {
  modules.push(mod);
}
