import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Picker,
  DeviceEventEmitter
} from 'react-native';
import {
  Button,
  Header,
} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SensorManager } from 'NativeModules';
import * as Progress from 'react-native-progress';
const SHAKE_THRESHOLD = 800;
const SHAKE_TIME = 4; // Segundos
const PAGE_NAME = 'Inicio'
export default class HomePage extends PureComponent {
  static navigationOptions = {
    drawerLabel: PAGE_NAME,
    drawerIcon: ({ tintColor }) => (
      <Ionicons name='md-home' size={25} color={tintColor} />
    ),
  };
  constructor(props) {
    super(props);
    this.state = {
      accelerometer: null,
      lastUpdate: null,
      shake: false,
      progress: 0,
      person: 'misa'
    };
  }
  CheckLight = () => {
    SensorManager.startLightSensor(100);
    DeviceEventEmitter.addListener('LightSensor', function (data) {
      console.warn(data);
    });
    setTimeout(() => {
      SensorManager.stopLightSensor();
    }, 10000 * 6);
  }
  Checkprogress = () => {
    setTimeout(() => {
      let progress = this.state.progress;
      if (progress ==  SHAKE_TIME) {
        SensorManager.stopAccelerometer();
        return;
      }
      progress += 1;
      this.setState({ progress });
      this.Checkprogress();
    }, 1000); // Da 3 segundos de tiempo para detectar el shake
  }
  Accelerometer = () => {
    this.setState({ shake: false, progress: 0 });
    DeviceEventEmitter.addListener('Accelerometer', (accelerometer) => {
      if(!this.state.accelerometer || !this.state.lastUpdate) {
        this.setState({ accelerometer, lastUpdate: (new Date).getTime()});
        return;
      }
      const lastUpdate = this.state.lastUpdate;
      const curTime = (new Date).getTime(); 
      const last = this.state.accelerometer;
      const { x, y, z } = accelerometer;
      const diffTime = (curTime - lastUpdate);
      if ((diffTime) < 100) {
        return;
      }
      const speed = Math.abs(x + y + z - last.x - last.y - last.z) / diffTime * 10000;
      if (speed > SHAKE_THRESHOLD) {
        console.warn('shake');
        this.setState({shake: true});
        SensorManager.stopAccelerometer();
      }
      this.setState({ accelerometer, lastUpdate: curTime });
    });
    SensorManager.startAccelerometer(100); // To start the accelerometer with a minimum delay of 100ms between events.
    this.Checkprogress();
  }
  
  openMenu = () => {
    this.props.navigation.openDrawer();
  }
  header = (<Header
        leftComponent={
        <TouchableOpacity onPress={this.openMenu}>
          <Ionicons name='md-menu' size={25} color={'#fff'}/>
        </TouchableOpacity>
        }
        centerComponent={
          <Text style={styles.textHeader}>
            {PAGE_NAME}
          </Text>
        }
      />)
  render() {
    const shake = this.state.shake + '';
    const progress = this.state.progress / SHAKE_TIME;
    return (
      <View style={styles.container}>
        {this.header}
        <View style={styles.content}>
          <Picker
            selectedValue={this.state.person}
            onValueChange={(itemValue) => this.setState({person: itemValue})}>
            <Picker.Item label="Misael" value="misa" />
            <Picker.Item label="Guillermo" value="guille" />
          </Picker>
          <Text>
            {this.state.person}
          </Text>
          <Button
            raised
            icon={{ name: 'cached' }}
            onPress={this.Accelerometer}
            title='Detectar shake'
          />
          <Button
            raised
            icon={{ name: 'home' }}
            onPress={this.CheckLight}
            title='Detectar luz' 
          />
          <Text>{shake}</Text>
          <Progress.Bar progress={progress} size={100} borderWidth={2} color={'red'} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  content: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  textHeader: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
});
