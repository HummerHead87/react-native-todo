import React, { Component } from 'react';
import {  View, Text, StyleSheet, Platform, ListView, ActivityIndicator, Keyboard, AsyncStorage } from 'react-native';
import Header from './header';
import Footer from './footer';
import Row from './row';
// import './ReactotronConfig';

const filterItems = (filter, items) => {
  return items.filter((item) => {
    if (filter === 'ALL') return true
    if (filter === 'COMPLETED') return item.complete
    if (filter === "ACTIVE") return !item.complete
  })
}

export default class App extends Component {
  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    this.state = {
      loading: true,
      allComplete: false,
      filter: 'ALL',
      value: '',
      items: [],
      dataSource: ds.cloneWithRows([])
    }
  }
  render() {
    return (
      <View style={styles.container}>
        <Header
          value={this.state.value}
          onAddItem={this.handleAddItem}
          onChange={(value) => this.setState({ value })}
          onToggleAllComplete={this.handleToggleAllComplete}
        />
        <View style={styles.content}>
          <ListView
            style={styles.list}
            enableEmptySections
            dataSource={this.state.dataSource}
            onScroll={() => Keyboard.dismiss()}
            renderRow={({ key, ...value }) => {
              return (
                <Row
                  key={key}
                  {...value}
                  onComplete={(complete) => this.handleToggleComplete(key, complete)}
                  onRemove={() => this.handleRemoveItem(key)}
                />
              )
            }}
            renderSeparator={(sectionId, rowId) => {
              return <View key={rowId} style={styles.separator} />
            }}
          />
        </View>
        <Footer
          count={filterItems('ACTIVE', this.state.items).length}
          onFilter={this.handleFilter}
          filter={this.state.filter}
          onClearComplete={this.handleClearComplete}
        />
        {this.state.loading &&<View style={styles.loading}>
          <ActivityIndicator 
            animating
            size="large"
          />
        </View>}
      </View>
    );
  }

  componentDidMount() {
    AsyncStorage.getItem('items').then((json) => {
      try  {
        const items = JSON.parse(json)
        console.log('load items', items)
        
        this.setSource(items, items, {loading: false})
      } catch (e) {
        this.setState({loading: false})
      }
    })
  }

  setSource = (items, itemsDataSource, otherState = {}) => {
    this.setState({
      items,
      dataSource: this.state.dataSource.cloneWithRows(itemsDataSource),
      ...otherState
    })

    console.log('save items', items)
    AsyncStorage.setItem('items', JSON.stringify(items))
  }

  handleClearComplete = () => {
    const newItems = filterItems('ACTIVE', this.state.items)

    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleFilter = (filter) => {
    const {items} = this.state

    this.setSource(items, filterItems(filter, items), {filter})
  }

  handleRemoveItem = (key) => {
    const newItems = this.state.items.filter((item) => item.key !== key)

    this.setSource(newItems, filterItems(this.state.filter, newItems))
  }

  handleAddItem = () => {
    const { value, items } = this.state
    if (!value) return;
  
    const newItems = [
      ...items,
      {
        key: Date.now(),
        text: value,
        complete: false
      }
    ];

    this.setSource(newItems, filterItems(this.state.filter, newItems), { value: '' });
  }

  handleToggleComplete = (key, complete) => {
    const newItems = this.state.items.map((item) => {
      if (item.key !== key) return item;

      return {...item, complete}
    });

    this.setSource(newItems, filterItems(this.state.filter, newItems));
  }

  handleToggleAllComplete = () => {
    const complete = !this.state.allComplete;
    const newItems = this.state.items.map((item) => ({
      ...item,
      complete
    }))

    this.setSource(newItems, filterItems(this.state.filter, newItems), { allComplete: complete })
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    ...Platform.select({
      ios: { paddingTop: 30 },
      android: { paddingTop: 50 }
    })
  },
  content: {
    flex: 1,
  },
  list: {
    backgroundColor: '#fff',
  },
  separator: {
    borderWidth: 1,
    borderColor: '#f5f5f5',
  },
  loading: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  }
})
