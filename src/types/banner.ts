import { ImageSourcePropType, ScrollView } from 'react-native';

export interface BannerObject {
    id: number;
    imgSource: ImageSourcePropType;
};

export type BannerCarouselProps = {
    banners: BannerObject[];
    autoPlayInterval?: number;
};

export type UseCarouselProps = BannerCarouselProps & {
    screenWidth: number;
    scrollViewRef: React.RefObject<ScrollView | null>;
};

export type BannerProps = {
    banner?: BannerObject;
    width: number;
    containerHeight: number
}

export interface UseCarouselReturn {
  itemWidth: number;
  itemSpacing: number;
  slideWidth: number;
  visibleSide: number;
  containerHeight: number;
  extendedBanners: any[];
  startIndex: number;
  totalExtended: number;
  containerWidth: number;
  stopAutoPlay: () => void;
  startAutoPlay: () => void;
  getRealIndex: (scrollPosition: number) => number;
  adjustPositionIfOutOfBounds: (scrollPosition: number) => number;
  handleScrollBeginDrag: () => void;
  handleScrollEndDrag: () => void;
  createScrollHandler: () => any;
  setIsRotating: (value: boolean) => void;
  setCurrentIndex: (value: number) => void;
  setIsScrolling: (value: boolean) => void;
}
