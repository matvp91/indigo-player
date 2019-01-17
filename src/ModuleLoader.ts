import { BaseControllerLoader } from '@src/controller/BaseController/BaseControllerLoader';
import { BenchmarkExtensionLoader } from '@src/extensions/BenchmarkExtension/BenchmarkExtensionLoader';
import { CaptionsExtensionLoader } from '@src/extensions/CaptionsExtension/CaptionsExtensionLoader';
import { FreeWheelExtensionLoader } from '@src/extensions/FreeWheelExtension/FreeWheelExtensionLoader';
import { FullscreenExtensionLoader } from '@src/extensions/FullscreenExtension/FullscreenExtensionLoader';
import { GoogleIMAExtensionLoader } from '@src/extensions/GoogleIMAExtension/GoogleIMAExtensionLoader';
import { StateExtensionLoader } from '@src/extensions/StateExtension/StateExtensionLoader';
import { Instance } from '@src/Instance';
import { BaseMediaLoader } from '@src/media/BaseMedia/BaseMediaLoader';
import { DashMediaLoader } from '@src/media/DashMedia/DashMediaLoader';
import { HlsMediaLoader } from '@src/media/HlsMedia/HlsMediaLoader';
import { Module } from '@src/Module';
import { HTML5PlayerLoader } from '@src/player/HTML5Player/HTML5PlayerLoader';
import {
  EventCallback,
  EventData,
  IModule,
  IModuleLoader,
  ModuleLoaderTypes,
} from '@src/types';
import { UiExtensionLoader } from '@src/ui/UiExtensionLoader';
import find from 'lodash/find';

const modules: Array<IModuleLoader<Module>> = [
  BaseControllerLoader,

  BaseMediaLoader,
  DashMediaLoader,
  HlsMediaLoader,

  HTML5PlayerLoader,

  StateExtensionLoader,
  BenchmarkExtensionLoader,
  FreeWheelExtensionLoader,
  FullscreenExtensionLoader,
  CaptionsExtensionLoader,
  GoogleIMAExtensionLoader,

  UiExtensionLoader,
];

export async function createFirstSupported<T>(
  type: ModuleLoaderTypes,
  instance: Instance,
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
  instance: Instance,
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

export function addModuleLoader(mod: IModuleLoader<Module>) {
  modules.push(mod);
}
