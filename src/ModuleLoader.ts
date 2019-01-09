import { BaseControllerLoader } from '@src/controller/BaseController/BaseControllerLoader';
import { BenchmarkExtensionLoader } from '@src/extensions/BenchmarkExtension/BenchmarkExtensionLoader';
import { FreeWheelExtensionLoader } from '@src/extensions/FreeWheelExtension/FreeWheelExtensionLoader';
import { Instance } from '@src/Instance';
import { BaseMediaLoader } from '@src/media/BaseMedia/BaseMediaLoader';
import { DashMediaLoader } from '@src/media/DashMedia/DashMediaLoader';
import { HlsMediaLoader } from '@src/media/HlsMedia/HlsMediaLoader';
import { Module } from '@src/Module';
import { HTML5PlayerLoader } from '@src/player/HTML5Player/HTML5PlayerLoader';
import { FullscreenExtensionLoader } from '@src/extensions/FullscreenExtension/FullscreenExtensionLoader';
import {
  EventCallback,
  EventData,
  IModule,
  ModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';

const modules: Array<ModuleLoader<Module>> = [
  BaseControllerLoader,

  BaseMediaLoader,
  DashMediaLoader,
  HlsMediaLoader,

  HTML5PlayerLoader,

  BenchmarkExtensionLoader,
  FreeWheelExtensionLoader,
  FullscreenExtensionLoader,
];

export async function createFirstSupported<T>(
  type: ModuleLoaderTypes,
  instance: Instance,
  isSupportedArgs?: any,
): Promise<T> {
  const items = modules.filter(item => item.type === type);

  for (const loader of items) {
    if (await loader.isSupported(isSupportedArgs)) {
      return ((await loader.create(instance)) as unknown) as T;
    }
  }

  return null;
}

export async function createAllSupported<T>(
  type: ModuleLoaderTypes,
  instance: Instance,
  isSupportedArgs?: any,
): Promise<T[]> {
  const items = modules.filter(item => item.type === type);

  const instances: T[] = [];

  for (const loader of items) {
    if (await loader.isSupported(isSupportedArgs)) {
      instances.push(((await loader.create(instance)) as unknown) as T);
    }
  }

  return instances;
}

export function addModuleLoader(mod: ModuleLoader<Module>) {
  modules.push(mod);
}
