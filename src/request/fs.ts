import { request } from "@/utils/request";
import useStore from "@/store";

export type FileList = {
  /**
   * 内容
   */
  content: Content[];
  header: string;
  provider: string;
  /**
   * 说明
   */
  readme: string;
  /**
   * 总数
   */
  total: number;
  /**
   * 是否可写入
   */
  write: boolean;
};
type Content = {
  /**
   * 创建时间
   */
  created?: string;
  hash_info?: null;
  hashinfo?: string;
  /**
   * 是否是文件夹
   */
  is_dir: boolean;
  /**
   * 修改时间
   */
  modified: string;
  /**
   * 文件名
   */
  name: string;
  /**
   * 签名
   */
  sign: string;
  /**
   * 大小
   */
  size: number;
  /**
   * 缩略图
   */
  thumb: string;
  /**
   * 类型
   */
  type: number;
};
export const getFileList = () =>
  request<FileList>({
    method: "POST",
    url: "/api/fs/list",
    data: {
      path: useStore.getState().musicPath,
    },
  });

export type FileInfo = {
  /**
   * 创建时间
   */
  created: string;
  hash_info: null;
  hashinfo: string;
  header: string;
  /**
   * 是否是文件夹
   */
  is_dir: boolean;
  /**
   * 修改时间
   */
  modified: string;
  /**
   * 文件名
   */
  name: string;
  provider: string;
  /**
   * 原始url
   */
  raw_url: string;
  /**
   * 说明
   */
  readme: string;
  related: null;
  /**
   * 签名
   */
  sign: string;
  /**
   * 大小
   */
  size: number;
  /**
   * 缩略图
   */
  thumb: string;
  /**
   * 类型
   */
  type: number;
};
export const getFileInfo = (path: string) =>
  request<FileInfo>({
    method: "POST",
    url: "/api/fs/get",
    data: {
      path,
    },
  });

export const getFileSlice = (path: string, start: number, end: number) =>
  request<ArrayBuffer, true>({
    method: "GET",
    url: path,
    headers: {
      Range: `bytes=${start}-${end}`,
    },
    responseType: "arraybuffer",
  });
