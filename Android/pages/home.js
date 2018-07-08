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
import io from 'socket.io-client';
import config from '../config';

const SHAKE_THRESHOLD = 4000; // Valor minimo de Velocidad de movimiento
const LIGHT_THRESHOLD = 100; // Valor minimo de Cantidad de luz
const SHAKE_TIME = 4; // Segundos
const LIGHT_TIME = 4; // Segundos
const PAGE_NAME = 'Inicio'; // Nombre pagina 
const MIN_STEPS = 5; // Cantidad de pasos minimos
export default class HomePage extends PureComponent {
  static navigationOptions = {
    drawerLabel: PAGE_NAME,
    drawerIcon: ({ tintColor }) => (
      <Ionicons name='md-home' size={25} color={tintColor} />
    ),
  };
  constructor(props) {
    super(props);
    const socket = io(config.API);
      socket.on('connect', () => {
    });
    this.state = {
      accelerometer: null,
      lastUpdate: null,
      shake: false,
      light: false,
      shakeProgress: 0,
      lightProgress: 0,
      person: 'misael',
      doorOpen: false,
      steps: 0,
      checkSteps: false,
      socket
    };
    this.StepCounter();
  }

  emitWantEnter() {
    const { person } = this.state;
    socket.emit('app-send-want', {
      person
    })
  }
  CheckLight = () => {
    this.setState({ light: false, lightProgress: 0 });
    SensorManager.startLightSensor(100);
    DeviceEventEmitter.addListener('LightSensor',(data) => {
      if(data.light >= LIGHT_THRESHOLD) {
        this.setState({ light: true });
      }
    });
    this.CheckLightProgress();
  }
  CheckLightProgress = () => {
    setTimeout(() => {
      let lightProgress = this.state.lightProgress;
      if (lightProgress == SHAKE_TIME) {
        SensorManager.stopLightSensor();
        return;
      }
      lightProgress += 1;
      this.setState({ lightProgress });
      this.CheckLightProgress();
    }, 1000); // Da SHAKE_LIGHT segundos de tiempo para detectar el shake
  }
  CheckShakeProgress = () => {
    setTimeout(() => {
      let shakeProgress = this.state.shakeProgress;
      if (shakeProgress == SHAKE_TIME) {
        SensorManager.stopAccelerometer();
        return;
      }
      shakeProgress += 1;
      this.setState({ shakeProgress });
      this.CheckShakeProgress();
    }, 1000); // Da SHAKE_TIME segundos de tiempo para detectar el shake
  }
  Accelerometer = () => {
    this.setState({ shake: false, shakeProgress: 0 });
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
        this.setState({shake: true});
        SensorManager.stopAccelerometer();
      }
      this.setState({ accelerometer, lastUpdate: curTime });
    });
    SensorManager.startAccelerometer(100);
    this.CheckShakeProgress();
  }
  StepCounter = () => {
    let { steps, checkSteps } = this.state;
    SensorManager.startStepCounter(500);
    DeviceEventEmitter .addListener('StepCounter',(data) => {
      if (steps == 0) {
        steps = data.steps;
        return this.setState({
          steps,
        })
      }
      this.setState({
        steps: data.steps - steps,
        checkSteps: true
      });
    });
  }
  openMenu = () => {
    this.props.navigation.openDrawer();
  }
  header = (
    <Header
      backgroundColor='#3D6DCC'
      innerContainerStyles={{ padding: 0}}
      leftComponent={
        <Ionicons raised onPress={this.openMenu} name='md-menu' size={25} color={'#fff'}/>
      }
      centerComponent={
        <Text style={styles.textHeader}>
          {PAGE_NAME}
        </Text>
      }
    />
  )
  btnAccelerometer = () => {
    const shake = this.state.shake;
    const progress = this.state.shakeProgress / SHAKE_TIME;
    let resultIcon = (<Ionicons reverse name='md-checkmark-circle-outline' size={50} color={'red'}/>);
    if(shake) {
      resultIcon = (<Ionicons reverse name='md-checkmark-circle-outline' size={50} color={'#7F9939'}/>)
    } 
    return  (
      <View style={styles.btn}>
        <Button
          raised
          icon={{ name: 'cached' }}
          onPress={this.Accelerometer}
          title=' Detectar Shake '
        />
        <View style={styles.progress}>
          <Progress.Bar progress={progress} size={100} borderWidth={1} color={'#4833FF'} />
        </View>
        <View style={styles.okOption}>
          {resultIcon}
        </View>
      </View>
    )
  }
  btnLight = () => {
    const light = this.state.light;
    const progress = this.state.lightProgress / LIGHT_TIME;
    let resultIcon = (<Ionicons reverse name='md-checkmark-circle-outline' size={50} color={'red'}/>);
    if (light) {
      resultIcon = (<Ionicons reverse name='md-checkmark-circle-outline' size={50} color={'#7F9939'}/>)
    } 
    return  (
      <View style={styles.btn}>
        <Button
          raised
          icon={{ name: 'highlight' }}
          onPress={this.CheckLight}
          title=' Detectar Luz  ' 
        />
        <View style={styles.progress}>
          <Progress.Bar progress={progress} size={100} borderWidth={1} color={'#4833FF'} />
        </View>
        <View style={styles.okOption}>
          {resultIcon}
        </View>
      </View>
    )
  }
  openDoor = () => {
    const { person } = this.state;
    this.state.socket.emit('want-to-enter', person);
  }
  wantEnterOption = () => {
    const { person, shake, light, steps, checkSteps } = this.state;
    if (!shake || !light || steps < MIN_STEPS || !checkSteps) {
      return;
    }
    return ( 
      <View style={styles.btn}>
        <Button
          onPress={this.openDoor}
          raised
          icon={{ name: 'open-in-new' }}
          title='Abrir' 
        />
      </View>
    )
  }
  render() {
    return (
      <View style={styles.container}>
        {this.header}
        <View style={styles.content}>
          <View>
            <Text>
              Entrar como:
            </Text>
          </View>
          <Picker
            selectedValue={this.state.person}
            onValueChange={(itemValue) => this.setState({person: itemValue})}>
            <Picker.Item label="Misael" value="misael" />
            <Picker.Item label="Guillermo" value="guille" />
            <Picker.Item label="Leonel" value="leonel" />
          </Picker>
          <View style={styles.row}>
            {this.btnAccelerometer()}
            {this.btnLight()}
          </View>
          <View style={styles.content}>
            {this.wantEnterOption()}
          </View>
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
  row: {
    flex: 1,
    backgroundColor: '#F5FCFF',
    flexDirection: 'row',
    marginHorizontal: 0,
    marginTop: 5
  },
  textHeader: {
    fontSize: 20,
    color: '#fff',
  },
  progress: {
    marginTop: 5,
    marginLeft: 13
  },
  okOption: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    marginTop: 1,
  }
});
