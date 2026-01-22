import { useRef, useState, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';
import { CAROUSEL_CONFIG } from '../constants';
import { UseCarouselProps, UseCarouselReturn } from '../types/banner';

export const useCarousel = ({ banners, screenWidth, autoPlayInterval = CAROUSEL_CONFIG.DEFAULT_AUTOPLAY_INTERVAL, scrollViewRef }: UseCarouselProps): UseCarouselReturn => {
    const itemWidth = screenWidth * CAROUSEL_CONFIG.ITEM_WIDTH_RATIO;
    const itemSpacing = CAROUSEL_CONFIG.ITEM_SPACING;
    const slideWidth = itemWidth + itemSpacing;
    const visibleSide = screenWidth * CAROUSEL_CONFIG.ITEM_VISIBLE_SIZE;
    const containerHeight = screenWidth > CAROUSEL_CONFIG.BREAKPOINT 
        ? CAROUSEL_CONFIG.CONTAINER_HEIGHT_LARGE 
        : CAROUSEL_CONFIG.CONTAINER_HEIGHT_SMALL;
    const extendedBanners = [...banners, ...banners, ...banners];
    const startIndex = banners.length;
    const totalExtended = extendedBanners.length;
    const containerWidth = totalExtended * slideWidth;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);
    const [isRotating, setIsRotating] = useState(false);
    const scrollX = useRef(new Animated.Value(0)).current;
    const autoPlayTimer = useRef<any>(null);
    const stopAutoPlay = useCallback(() => {
        if (autoPlayTimer.current) {
            clearInterval(autoPlayTimer.current);
            autoPlayTimer.current = null;
        }
    }, []);
    const startAutoPlay = useCallback(() => {
        if (isScrolling || isRotating || banners.length === 0 || autoPlayTimer.current) {
            return;
        };
    
        autoPlayTimer.current = setInterval(() => {
            const nextIndex = (currentIndex + 1) % banners.length;
            let scrollToPosition = (nextIndex + banners.length) * slideWidth;
            
            if (nextIndex === 0) {
                scrollToPosition = (banners.length * 2) * slideWidth;
                
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                        x: scrollToPosition,
                        animated: true,
                    });
                    
                    setCurrentIndex(nextIndex);
                    
                    setTimeout(() => {
                        if (scrollViewRef.current) {
                            scrollViewRef.current.scrollTo({
                                x: banners.length * slideWidth,
                                animated: false,
                            });
                        }
                    }, 300);
                }
            } else {
                setCurrentIndex(nextIndex);
                
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollTo({
                        x: scrollToPosition,
                        animated: true,
                    });
                }
            }
        }, autoPlayInterval);
    }, [
        currentIndex, 
        banners.length, 
        autoPlayInterval, 
        isScrolling, 
        isRotating, 
        slideWidth, 
        scrollViewRef
    ]);

    const getRealIndex = useCallback((scrollPosition: number): number => {
        const position = Math.round(scrollPosition / slideWidth);
        return position % banners.length;
    }, [slideWidth, banners.length]);

    const adjustPositionIfOutOfBounds = useCallback((scrollPosition: number): number => {
        const position = Math.round(scrollPosition / slideWidth);
        
        if (position >= banners.length * 2) {
            return (position - banners.length) * slideWidth;
        }
        
        if (position < banners.length) {
            return (position + banners.length) * slideWidth;
        }
        
        return scrollPosition;
    }, [slideWidth, banners.length]);

    const handleScrollBeginDrag = useCallback(() => {
        setIsScrolling(true);
        stopAutoPlay();
    }, [stopAutoPlay]);

    const handleScrollEndDrag = useCallback(() => {
        setTimeout(() => {
        setIsScrolling(false);
        }, CAROUSEL_CONFIG.DEFAULT_AUTOPLAY_INTERVAL);
    }, []);

    const createScrollHandler = useCallback(() => {
        return Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
            listener: (event: any) => {
                const contentOffsetX = event.nativeEvent.contentOffset.x;
                const correctedOffset = adjustPositionIfOutOfBounds(contentOffsetX);
                const index = getRealIndex(correctedOffset);
                
                if (index !== currentIndex) {
                    setCurrentIndex(index);
                }
            }
        });
    }, [adjustPositionIfOutOfBounds, getRealIndex, currentIndex]);

    useEffect(() => {
        stopAutoPlay();
        
        if (!isScrolling && !isRotating && banners.length > 0) {
            startAutoPlay();
        }
        
        return () => {
            stopAutoPlay();
        };
    }, [currentIndex, banners.length, autoPlayInterval, isScrolling, isRotating, stopAutoPlay, startAutoPlay]);

    useEffect(() => {
        if (!isRotating && !isScrolling && banners.length > 0 && !autoPlayTimer.current) {
            startAutoPlay();
        }
    }, [isRotating, isScrolling, banners.length, startAutoPlay]);

    return {
        itemWidth,
        itemSpacing,
        slideWidth,
        visibleSide,
        containerHeight,
        extendedBanners,
        startIndex,
        totalExtended,
        containerWidth,
        stopAutoPlay,
        startAutoPlay,
        getRealIndex,
        adjustPositionIfOutOfBounds,
        handleScrollBeginDrag,
        handleScrollEndDrag,
        createScrollHandler,
        setIsRotating,
        setCurrentIndex,
        setIsScrolling,
    };
};
