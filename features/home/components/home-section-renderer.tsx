import { useRouter } from 'expo-router';
import { View } from 'react-native';

import type {
  HomeSection, CityItem, PhotoItem, AlbumItem, PhotographerItem,
} from '@entities/photographer';
import { ROUTES, href } from '@shared/config';
import {
  SectionHeader, HorizontalScroll, CityCard, AlbumCard,
  PhotoMasonry, PhotographerCard,
} from '@shared/ui';

interface HomeSectionRendererProps {
  section: HomeSection;
  onSave: (id: string, saved: boolean) => void;
  onLike: (id: string, liked: boolean) => void;
  onCitySelect?: (city: CityItem) => void;
}

export function HomeSectionRenderer({
  section, onSave, onLike, onCitySelect,
}: HomeSectionRendererProps) {
  const router = useRouter();
  const toDetail = (id: string) => router.push(href(`${ROUTES.photographers}/${id}`));

  const header = (
    <SectionHeader
      title={section.title}
      subtitle={section.subtitle}
      onSeeMore={section.seeMore ? () => router.push(href(ROUTES.photographers)) : undefined}
    />
  );

  if (section.type === 'city') {
    const items = section.items as CityItem[];
    return (
      <View>
        {header}
        <HorizontalScroll>
          {items.map((city) => (
            <CityCard key={city.id} city={city} onPress={() => onCitySelect?.(city)} />
          ))}
        </HorizontalScroll>
      </View>
    );
  }

  if (section.type === 'photo') {
    const items = section.items as PhotoItem[];
    return (
      <View>
        {header}
        <PhotoMasonry photos={items} onPhotoPress={toDetail} onLike={onLike} />
      </View>
    );
  }

  if (section.type === 'album') {
    const items = section.items as AlbumItem[];
    return (
      <View>
        {header}
        <HorizontalScroll>
          {items.map((album) => (
            <AlbumCard key={album.id} album={album} onPress={() => toDetail(album.photographer.id)} />
          ))}
        </HorizontalScroll>
      </View>
    );
  }

  if (section.type === 'photographer') {
    const items = section.items as PhotographerItem[];
    const variant = section.variant === 'ranked' ? 'ranked' : 'mini';

    if (section.layout === 'list') {
      return (
        <View>
          {header}
          {items.map((p) => (
            <PhotographerCard
              key={p.id}
              photographer={p}
              variant="ranked"
              onPress={() => toDetail(p.id)}
              onSave={() => onSave(p.id, p.saved)}
            />
          ))}
        </View>
      );
    }

    return (
      <View>
        {header}
        <HorizontalScroll>
          {items.map((p) => (
            <PhotographerCard
              key={p.id}
              photographer={p}
              variant={variant}
              onPress={() => toDetail(p.id)}
              onSave={() => onSave(p.id, p.saved)}
            />
          ))}
        </HorizontalScroll>
      </View>
    );
  }

  return null;
}
