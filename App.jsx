import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = "05a5281064ecee2ba721afafe89720cd";
//실제론 api key를 여기에 두면 안되고, 서버에서 관리해야함

export default function App() {
  const [city, setCity] = useState('Loading...');
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);
  

  const getWeather = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy: 5});
    const location = await Location.reverseGeocodeAsync({latitude, longitude}, {useGoogleMaps:false});
    setCity(location[0].city);
    const { list } = await (
      await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`)
      ).json();
      const filteredList = list.filter(({ dt_txt }) => dt_txt.endsWith("00:00:00"));
      setDays(filteredList);
  };

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStylestyle={styles.weather}>
        {days.length === 0 ? (
        <View style={styles.day}>
          <ActivityIndicator color='black' size='large'/>
        </View>
        ) : (
        days.map((day, index) =>
          <View key={index} style={styles.day}>
            <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
            <Text style={styles.description}>{day.weather[0].main}</Text>
            <Text style={styles.tinyText}>{day.weather[0].description}</Text>
          </View>
        )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: 'yellow',
  },
  city: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 50,
    fontWeight: '500',
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: 'center',
  },
  temp: {
    marginTop: 50,
    fontSize: 178,
  },
  description: {
    marginTop: -30,
    fontSize: 50,
  },
  tinyText: {
    fontSize: 18,
  }
});

