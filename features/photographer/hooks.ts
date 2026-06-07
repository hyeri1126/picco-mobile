import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  PhotographersQuery, PhotographerItem,
  HomeResponse, HomeSection, PhotoItem,
} from '@entities/photographer';
import { photographerApi } from './api';

export const usePhotographers = (query: PhotographersQuery) =>
  useInfiniteQuery({
    queryKey: ['photographers', query],
    queryFn: ({ pageParam }) =>
      photographerApi.getList({ ...query, cursor: pageParam as string | undefined }),
    getNextPageParam: (last) => last.data.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    select: (pages) => ({
      items: pages.pages.flatMap((p) => p.data.items),
      hasMore: pages.pages.at(-1)?.data.hasMore ?? false,
    }),
  });

export const usePhotographerDetail = (id: string) =>
  useQuery({
    queryKey: ['photographers', id],
    queryFn: () => photographerApi.getDetail(id),
    select: ({ data }) => data,
  });

export const usePhotographerPhotos = (id: string) =>
  useInfiniteQuery({
    queryKey: ['photographers', id, 'photos'],
    queryFn: ({ pageParam }) =>
      photographerApi.getPhotos(id, pageParam as string | undefined),
    getNextPageParam: (last) => last.data.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    select: (pages) => pages.pages.flatMap((p) => p.data.items),
  });

export const usePhotographerReviews = (id: string, photoOnly?: boolean) =>
  useInfiniteQuery({
    queryKey: ['photographers', id, 'reviews', photoOnly],
    queryFn: ({ pageParam }) =>
      photographerApi.getReviews(id, photoOnly, pageParam as string | undefined),
    getNextPageParam: (last) => last.data.nextCursor ?? undefined,
    initialPageParam: undefined as string | undefined,
    select: (pages) => pages.pages.flatMap((p) => p.data.items),
  });

export const usePhotographerSpots = (id: string) =>
  useQuery({
    queryKey: ['photographers', id, 'spots'],
    queryFn: () => photographerApi.getSpots(id),
    select: ({ data }) => data,
  });

// ── Optimistic save toggle ─────────────────────────────────────

export const useSaveToggle = () => {
  const qc = useQueryClient();

  const updateSaved = (photographerId: string, saved: boolean) => {
    qc.setQueriesData<{ data: HomeResponse }>(
      { queryKey: ['home'], exact: false },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            sections: old.data.sections.map((s: HomeSection) => ({
              ...s,
              items: (s.items as PhotographerItem[]).map((item) =>
                'id' in item && item.id === photographerId
                  ? { ...item, saved, saveCount: item.saveCount + (saved ? 1 : -1) }
                  : item,
              ),
            })),
          },
        };
      },
    );
    qc.setQueriesData<{ data: { id: string; saved: boolean; saveCount: number } }>(
      { queryKey: ['photographers', photographerId], exact: true },
      (old) =>
        old
          ? { ...old, data: { ...old.data, saved, saveCount: old.data.saveCount + (saved ? 1 : -1) } }
          : old,
    );
  };

  const save = useMutation({
    mutationFn: (id: string) => photographerApi.save(id),
    onMutate: (id) => updateSaved(id, true),
    onError: (_, id) => updateSaved(id, false),
  });

  const unsave = useMutation({
    mutationFn: (id: string) => photographerApi.unsave(id),
    onMutate: (id) => updateSaved(id, false),
    onError: (_, id) => updateSaved(id, true),
  });

  return (id: string, currentlySaved: boolean) => {
    if (currentlySaved) unsave.mutate(id);
    else save.mutate(id);
  };
};

// ── Optimistic like toggle ─────────────────────────────────────

export const useLikeToggle = () => {
  const qc = useQueryClient();

  const updateLiked = (photoId: string, liked: boolean) => {
    qc.setQueriesData<{ data: HomeResponse }>(
      { queryKey: ['home'], exact: false },
      (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            sections: old.data.sections.map((s: HomeSection) => ({
              ...s,
              items: (s.items as PhotoItem[]).map((item) =>
                'id' in item && item.id === photoId
                  ? { ...item, liked, likeCount: item.likeCount + (liked ? 1 : -1) }
                  : item,
              ),
            })),
          },
        };
      },
    );
  };

  const like = useMutation({
    mutationFn: (id: string) => photographerApi.likePhoto(id),
    onMutate: (id) => updateLiked(id, true),
    onError: (_, id) => updateLiked(id, false),
  });

  const unlike = useMutation({
    mutationFn: (id: string) => photographerApi.unlikePhoto(id),
    onMutate: (id) => updateLiked(id, false),
    onError: (_, id) => updateLiked(id, true),
  });

  return (id: string, currentlyLiked: boolean) => {
    if (currentlyLiked) unlike.mutate(id);
    else like.mutate(id);
  };
};
