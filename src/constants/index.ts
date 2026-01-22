export const CAROUSEL_CONFIG = {
    DEFAULT_AUTOPLAY_INTERVAL: 3500,
    ITEM_WIDTH_RATIO: 0.75,
    ITEM_SPACING: 20,
    ITEM_VISIBLE_SIZE: 0.12,
    BREAKPOINT: 400,
    CONTAINER_HEIGHT_LARGE: 250,
    CONTAINER_HEIGHT_SMALL: 150,
    BANNER_ASPECT_RATIO: 16 / 9,
} as const;

export const BANNER_IMAGES = {
    BANNER_1: require('../assets/images/banner1.jpg'),
    BANNER_2: require('../assets/images/banner2.png'),
    BANNER_3: require('../assets/images/banner3.png'),
    BANNER_4: require('../assets/images/banner4.png'),
    BANNER_5: require('../assets/images/banner5.png'),
} as const;
