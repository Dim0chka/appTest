import React, { useRef, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, useWindowDimensions } from 'react-native';
import BannerComponent from './Banner';
import { BannerCarouselProps } from '../types/banner';
import { useCarousel } from '../hooks/useCarousel';

const BannerCarousel: React.FC<BannerCarouselProps> = ({ banners, autoPlayInterval }) => {
    const { width: SCREEN_WIDTH } = useWindowDimensions();
    const scrollViewRef = useRef<ScrollView>(null);
    
    const {
        itemWidth,
        itemSpacing,
        slideWidth,
        visibleSide,
        containerHeight,
        extendedBanners,
        startIndex,
        containerWidth,
        stopAutoPlay,
        getRealIndex,
        adjustPositionIfOutOfBounds,
        handleScrollBeginDrag,
        handleScrollEndDrag,
        createScrollHandler,
        setIsRotating,
        setCurrentIndex,
    } = useCarousel({
        banners,
        screenWidth: SCREEN_WIDTH,
        autoPlayInterval,
        scrollViewRef,
    });
    const [key, setKey] = useState(0);
    const prevWidthRef = useRef(SCREEN_WIDTH);

    useEffect(() => {
        if (Math.abs(SCREEN_WIDTH - prevWidthRef.current) > 50) {
        setIsRotating(true);
        stopAutoPlay();
        prevWidthRef.current = SCREEN_WIDTH;
        
        setKey(prev => prev + 1);
        
        setTimeout(() => {
            if (scrollViewRef.current && banners.length > 0) {
            scrollViewRef.current.scrollTo({
                x: startIndex * slideWidth,
                animated: false,
            });
            
            setTimeout(() => setIsRotating(false), 500);
            }
        }, 100);
        }
    }, [SCREEN_WIDTH, banners.length, slideWidth, startIndex, setIsRotating, stopAutoPlay]);

    useEffect(() => {
        if (scrollViewRef.current && banners.length > 0) {
        const initialPosition = startIndex * slideWidth;
        setTimeout(() => {
            scrollViewRef.current?.scrollTo({
            x: initialPosition,
            animated: false,
            });
        }, 300);
        }
    }, [key, banners.length, slideWidth, startIndex]);

    const handleCustomScrollEndDrag = (e: any) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const correctedOffset = adjustPositionIfOutOfBounds(contentOffsetX);
        const nearestSlideIndex = Math.round(correctedOffset / slideWidth);
        const snapPosition = nearestSlideIndex * slideWidth;
        const index = getRealIndex(snapPosition);

        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({
                x: snapPosition,
                animated: true,
            });
        }

        setCurrentIndex(index);
        handleScrollEndDrag();
    };

    const handleCustomMomentumScrollEnd = (e: any) => {
        const contentOffsetX = e.nativeEvent.contentOffset.x;
        const correctedOffset = adjustPositionIfOutOfBounds(contentOffsetX);
        
        if (Math.abs(correctedOffset - contentOffsetX) > slideWidth / 2) {
            if (scrollViewRef.current) {
                scrollViewRef.current.scrollTo({
                x: correctedOffset,
                animated: false,
                });
                
                const index = getRealIndex(correctedOffset);
                setCurrentIndex(index);
            }
        }
    };

    if (banners.length === 0) {
        return null;
    };

    return (
        <View style={styles.container} key={key}>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                showsHorizontalScrollIndicator={false}
                onScrollBeginDrag={handleScrollBeginDrag}
                onScrollEndDrag={handleCustomScrollEndDrag}
                onMomentumScrollEnd={handleCustomMomentumScrollEnd}
                onScroll={createScrollHandler()}
                snapToInterval={slideWidth}
                snapToAlignment="center"
                contentContainerStyle={{
                paddingHorizontal: visibleSide,
                alignItems: 'center',
                }}
                style={styles.scrollView}
            >
                <View style={[styles.slidesContainer, { 
                width: containerWidth, 
                height: containerHeight 
                }]}>
                {extendedBanners.map((banner, index) => (
                    <View
                    key={`${banner.id}-${index}-${key}`}
                    style={{ width: itemWidth, marginRight: itemSpacing }}
                    >
                    <BannerComponent
                        banner={banner}
                        width={itemWidth}
                        containerHeight={containerHeight}
                    />
                    </View>
                ))}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        width: '100%',
    },
    scrollView: {
        width: '100%',
    },
    slidesContainer: {
        flexDirection: 'row',
    }
});

export default BannerCarousel;
