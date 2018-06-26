import React, { PureComponent } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from 'react-native';
import {
  Button,
  Header
} from 'react-native-elements';
import Ionicons from 'react-native-vector-icons/Ionicons';
import io from 'socket.io-client';
import config from '../config';

const PAGE_NAME = 'Acerca de'

export default class AboutPage extends PureComponent {
  static navigationOptions = {
    drawerLabel: PAGE_NAME,
    drawerIcon: ({ tintColor }) => (
      <Ionicons name = 'md-information-circle' size={25} color={tintColor} />
    ),
  };
  constructor(props) {
    super(props);
    const socket = io(config.API);
    socket.on('connect', () => {
    });
    this.state = {
      person: 'misael',
      socket
    };
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

  forceOpen = () => {
    this.state.socket.emit('force-open');
  }

  render() {
    return (
      <View style={styles.container}>
        {this.header}
        <View >
          <Text style={styles.welcome}>
            About
          </Text>
            <Button
              raised
              icon={{ name: 'cached' }}
              onPress={this.forceOpen}
              title=' Detectar Shake '
            />
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
  textHeader: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff'
  },
  welcome: {
    fontSize: 25,
    textAlign: 'center',
    margin: 10,
    color: 'blue'
  },
});
