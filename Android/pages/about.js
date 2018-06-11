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

const PAGE_NAME = 'Acerca de'

export default class AboutPage extends PureComponent {
  static navigationOptions = {
    drawerLabel: PAGE_NAME,
    drawerIcon: ({ tintColor }) => (
      < Ionicons name = 'md-information-circle' size={25} color={tintColor} />
    ),
  };
  openMenu = () => {
    this.props.navigation.openDrawer();
  }
  header = (
    <Header
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
    />
  )
  render() {
    return (
      <View style={styles.container}>
        {this.header}
        <View >
          <Text style={styles.welcome}>
            About
          </Text>
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
