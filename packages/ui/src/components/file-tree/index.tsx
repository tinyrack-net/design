import { FileTreeDirectory, FileTreeFile, FileTreeRoot } from './file-tree.js';

export const FileTree = {
  Directory: FileTreeDirectory,
  File: FileTreeFile,
  Root: FileTreeRoot,
} as const;
export type {
  FileTreeDirectoryProps,
  FileTreeFileProps,
  FileTreeRootProps,
} from './file-tree.js';
export { FileTreeDirectory, FileTreeFile, FileTreeRoot };
