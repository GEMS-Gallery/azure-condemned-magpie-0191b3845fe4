import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface File {
  'id' : bigint,
  'name' : string,
  'size' : [] | [string],
  'fileType' : string,
  'category' : string,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export interface _SERVICE {
  'addFile' : ActorMethod<[string, string, [] | [string], string], Result>,
  'getFiles' : ActorMethod<[], Array<File>>,
  'getFilesByCategory' : ActorMethod<[string], Array<File>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
