/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  ImageBackground,
  Input,
  Button,
  TextInput,
  Alert,
  Image,
  FlatList,
  Item,
  TouchableOpacity,
  KeyboardAvoidingView
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {responsiveHeight as rh, responsiveWidth as rw, responsiveFontSize as rf} from "react-native-responsive-dimensions";
import images from './public/icons/images.js';
import LinearGradient from 'react-native-linear-gradient';

const weatherBitApiKey = '679dcaf864aa415c812b8a4fe23ba67f';

class MesaButton extends React.Component {
  constructor(props) {
    super(props);
    this.onPress = this.onPress.bind(this);
  }

  onPress() {
    this.props.onPress();
  } 

  render() {
    var style = {
      height: this.props.height || rh(5), 
      width: this.props.width || rw(30),
      borderRadius:3, 
      backgroundColor : 'blue', 
      marginLeft :0, 
      marginRight:0,
      marginTop :0,
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'center'
    };

    let width = rh(5);
    if (this.props.width) {
      width = this.props.width;
    }
    return ( 
      <TouchableOpacity onPress={this.onPress} style={style}>
        <Text style={{fontSize: rf(1.5), color: 'white', textAlign: 'center', textAlignVertical: 'center'}}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

class MyWeatherComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      weatherForecastData: [],
      city: '',
      returnedCityState: '',
      currentTime: '',
      error: '',
      currentTime: ''
    }

    this.handleCityChange = this.handleCityChange.bind(this);
    this.onGetWeather = this.onGetWeather.bind(this);
    this.itemCount = 0;
  }

  handleCityChange(city) {
    this.setState({city: city});
  }

  isNumeric(inputtxt) { 
    var letters = /^[0-9]+$/;
    if(inputtxt.match(letters)) {
      return true;
    }
    else {
      return false;
    }
  }

  componentDidMount() {
    setInterval(() => {
      let date = new Date();
      this.setState({currentTime: date.toDateString() + ' ' + date.toLocaleTimeString('en-US')})
    }, 1000);
  }

  onGetWeather() {
    console.log('GetWeather for ' + this.state.city);

    let url = `https://api.weatherbit.io/v2.0/forecast/daily?city=${this.state.city}&units=I&key=${weatherBitApiKey}`;
    let selectedData = [];

    fetch(url)
    .then(res => res.json())
    .then(json => {
      selectedData = json.data.slice(1, 9).map((item, index) => {
        return({indexKey: 'A' + index.toString(), date: new Date(item.datetime).toDateString(), day: new Date(item.datetime).toDateString().substr(0, 3), maxTemp: item.max_temp, minTemp: item.min_temp, humidity: item.rh, icon: item.weather.icon, description: item.weather.description})
      })
      // this.setState({weatherForecastData: selectedData, returnedCityState: json.city_name});
      // this.setState({weatherForecastData: selectedData, returnedCityState: json.city_name + ', ' + (this.isNumeric(json.state_code) ? json.country_code : json.state_code) + ' (' + json.timezone + ')', error: ''});
      // this.setState({weatherForecastData: selectedData, returnedCityState: json.city_name + ', ' + (this.isNumeric(json.state_code) ? json.country_code : json.state_code) + ' - ' + selectedData[0].date, error: ''});
      this.setState({weatherForecastData: selectedData, returnedCityState: json.city_name + ', ' + (this.isNumeric(json.state_code) ? json.country_code : json.state_code), error: ''});
    })
    .catch(error => this.setState({error: `Error locating forecast for: ${this.state.city}`}))
  }

  render() {
    let today = new Date();
    let days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

    return(
      <ImageBackground source={require('./clouds2.png')} style={{backgroundColor: '#AAAAAA', width: '100%', height: '100%'}}> 
        <View style={styles.titleView}>
          {/* <Text style={styles.dateTimeTitle}>{days[today.getDay()] + ' ' + this.state.currentTime}</Text> */}
          <Text style={styles.dateTimeTitle}>{this.state.currentTime}</Text>
          <Text style={styles.textTitle}>Winnetka Weather Works</Text>
        </View>

        <View style={styles.mainView}>
          <View style={styles.cityView}> 
            <Text style={styles.cityViewText}>City:</Text>
            <View style={styles.textInputShadow}>
              <TextInput style={styles.cityViewInput} value={this.state.city} onChangeText={this.handleCityChange}></TextInput>
            </View>
          </View>

          
          <View style={styles.buttonView}>
            <MesaButton title={'Get 7 Day Forecast'} width={rw(30)} height={rh(4)} onPress={this.onGetWeather}/>
          </View>      

          <View style={styles.weatherResultsView}>
            <View style={styles.returnedCityView}>
              <Text style={styles.returnedCityText}>{this.state.returnedCityState}</Text>
            </View> 

            <FlatList style={styles.flatList}
              data={this.state.weatherForecastData}
              renderItem={({ item }) => ( 
                <>
                  <LinearGradient colors={['transparent', '#000055', '#000022', '#000022', '#000055', 'transparent']}>
                    <View style={styles.forecastMainView}>
                      <View style={styles.forecastDayView}>
                        <Text style={styles.forecastDayText}>{item.day}</Text>
                        <Text style={styles.forecastDateText}>{item.date.substr(4).substr(0,6)}</Text>
                      </View>  
                      <View style={styles.forecastImageView}>
                        <Image style={styles.weatherIcon} source={images[item.icon]}></Image>
                      </View>
                      <View sytle={styles.forecastDescriptionView}>
                        <View style={styles.descriptionView}>
                          <Text style={styles.forecastDescriptionText}>{item.description}</Text>
                        </View>
                        <View style={styles.forecastTemperatureView}>
                          <Text style={styles.forecastTemperatureText}>{item.maxTemp + '\xB0' + '/' + item.minTemp + '\xB0'}</Text>
                        </View>
                        <View style={styles.forecastHumidityView}>
                          <Text style={styles.forecastHumidityText}>Humidity: {item.humidity + '%'}</Text>
                        </View>
                      </View>  
                    </View>
                  </LinearGradient>
                </>
              )}
              listKey={item => (item.indexKey)}
            />
          </View> 
        </View>  
      </ImageBackground>
    )
  }
}

const App: () => React$Node = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea}>
        <MyWeatherComponent></MyWeatherComponent>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },

  safeArea: {
    flex: 1,
    backgroundColor: '#00FF00'
  },

  weatherIcon: {
    alignSelf: 'flex-start',
    width: rw(10),    
    height: rh(5) 
  },

  returnedCityView: {
    marginTop: 5,
    marginBottom: 5
  },
  
  titleView: {
    flex: 1,
    flexDirection: 'column',
    marginLeft: 30,
    marginRight: 30,
    marginTop: 0,
    marginBottom: 10,
    paddingTop: 15,
    // borderStyle: 'solid',
    // borderWidth: 3,
    // borderColor: '#FF0000',
  },

  textTitle: {
    fontSize: rf(4),
    fontWeight: 'bold',
    fontStyle: 'italic',
    color: '#AAFF00',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 2,
    textShadowColor: '#000000',
    alignSelf: 'center'
  },

  dateTimeTitle: {
    fontSize: rf(1.5),
    alignSelf: 'center',
    color: '#0000FF'
  },

  mainView: {
    flex: 10,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: 30,
    marginRight: 30

    // borderStyle: 'solid',
    // borderWidth: 3,
    // borderColor: '#FF0000',

  },

  cityView: {
    flexDirection: 'row',
    alignItems: 'flex-start'
  },

  cityViewText: {
    fontSize: rf(2.5),
    marginBottom: rh(1),
    marginLeft: rh(1),
    marginRight: rh(1),
    color: '#FFFFFF',
    textShadowOffset: { width: 4, height: 4 },
    textShadowRadius: 2,
    textShadowColor: '#000000',
  },

  cityViewInput: {
    backgroundColor: '#EEEEEE',
    width: rw(75),
    marginBottom: 20,
    fontSize: rf(2),
    paddingTop: 3,
    paddingBottom: 3,
    height: rh(4),
    position: 'relative',
    top: -5,
    left: -5,
    // marginTop: rh(1)
    // marginBottom: rh(2),
    // marginLeft: rh(2),
  },

  textInputShadow: {
    backgroundColor: '#000000',
    width: rw(75),
    height: rh(4),
    marginBottom: rh(1),
    marginLeft: rh(1),
    marginTop: rh(1)
  },

  buttonView: {
    flexDirection: 'row',
    width: '100%',
    height: rh(5),
    justifyContent: 'center',
    marginTop: 10,
    // borderStyle: 'solid',
    // borderWidth: 3,
    // borderColor: '#000000'
  },

  flatList: {
    flex: 1,
    marginTop: 20,
    height: '100%',
    width: '100%'
  },

  weatherResultsView: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%'
  },

  scrollContainter: {
    flex: 1,
    // height: '100%'    
  },

///////////////////////////////////////  
  forecastScroll: {
    width: '100%',
  },

  forecastMainView: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingLeft: rw(10),
    paddingTop: rh(2),
    paddingBottom: rh(2),
    paddingRight: rw(2),
    width: '100%',
    // opacity: 0.9
  },

  forecastDayView: {
    width: rw(15),
    marginLeft: 0,
    marginRight: 5,
    paddingTop: 30,
    // borderStyle: 'solid',
    // borderWidth: 3,
    // borderColor: '#000000'
  },

  forecastDayText: {
    fontSize: rf(2),
    color: '#ffffff'
  },
  
  forecastDateText: {
    fontSize: rf(1),
    color: '#ffffff'
  },

  returnedCityText: {
    fontSize: rf(2)
  },

  forecastImageView: {
    marginLeft: 0,
    marginRight: 20,
    paddingTop: 20,
  },

  forecastDescriptionView: {

  },
  forecastDescriptionText: {
    fontSize: rf(1.5),
    color: '#ffffff'
  },

  forecastTemperatureView: {

  },

  forecastTemperatureText: {
    fontSize: rf(1.5),
    color: '#ffffff'
  },

  forecastHumidityView: {

  },

  forecastHumidityText: {
    fontSize: rf(1.5),
    color: '#ffffff'
  },

  forecastDataView: {
    flexDirection: 'column'
  },

  flatList: {
    // flex: 1,
    marginTop: 10
  }

});

export default App;
