import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import BannerCarousel from './src/components/BannerCarousel';
import { BANNERS_DATA } from './src/data/index';


function App() {
  return (
      <View 
        style={styles.container}
        >
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.header}>
          <Text></Text>
        </View>

        <View style={styles.content}>
          <BannerCarousel 
            banners={BANNERS_DATA}
            autoPlayInterval={3500}
          />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 0,
    paddingHorizontal: 0,
    width: '100%'
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;
