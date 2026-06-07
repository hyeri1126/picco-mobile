import { supabase } from './supabase';

// RN에서는 웹 File 대신 이미지 picker가 주는 자산(uri 기반)을 받는다.
export interface ImageAsset {
  uri: string;
  /** 원본 파일명 (확장자 추출용, 선택) */
  name?: string;
  /** MIME 타입 (예: image/jpeg, 선택) */
  type?: string;
}

const guessExt = (asset: ImageAsset): string => {
  const fromName = asset.name?.split('.').pop();
  if (fromName && fromName !== asset.name) return fromName;
  const fromUri = asset.uri.split('?')[0].split('.').pop();
  if (fromUri) return fromUri;
  // type이 image/jpeg 형태면 뒷부분 사용
  return asset.type?.split('/').pop() ?? 'jpg';
};

const uploadImage = async (
  bucket: string,
  asset: ImageAsset,
  userId: string,
): Promise<string> => {
  const ext = guessExt(asset);
  const contentType = asset.type ?? `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const path = `${userId}/${Date.now()}.${ext}`;

  // uri → ArrayBuffer (RN fetch는 로컬 file:// uri도 처리)
  const res = await fetch(asset.uri);
  const body = await res.arrayBuffer();

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, body, { upsert: true, contentType });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

export const uploadProfileImage = (asset: ImageAsset, userId: string) =>
  uploadImage('profile-images', asset, userId);

export const uploadPortfolioImage = (asset: ImageAsset, userId: string) =>
  uploadImage('portfolio-images', asset, userId);
