import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { BannerProps, BannerObject } from '../types/banner';


const BannerComponent = ({ banner, width, containerHeight }: BannerProps) => {
    const defaultBanner: BannerObject = {
        id: new Date().getTime(),
        imgSource: { uri: 'https://via.placeholder.com/400x225' }
    };

    const currentBanner = banner || defaultBanner;
    const height = containerHeight;

    return (
        <View style={[styles.container, {width, height}]}>
            <Image
                source={currentBanner.imgSource} 
                style={styles.image}
                resizeMode='cover'
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
    },
    image: {
        borderRadius: 20,
        width: '100%',
        height: '100%'
    },
});

export default BannerComponent;
