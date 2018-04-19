import React, {Component} from 'react';
import './App.css';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { reducers } from './reducers/index';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dimensions: 30,
      maxTunnels: 100,
      maxLength: 8
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  createArray(num, dimensions) {
    var array = [];
    for (var i = 0; i < dimensions; i++) {
      array.push([]);
      for (var j = 0; j < dimensions; j++) {
        array[i].push(num);
      }
    }
    return array;
  }

  onChange(e) {
    this.setState({
      [e.target.name]: this.validator(e.target.value)
    });
  }

  validator(x) {
    let input = Number(x);
    if (isNaN(input)){
      return 0;
    }
    return input;
  }

  //lets create a randomly generated map for our dungeon crawler
  createMap() {
    let dimensions = this.state.dimensions, // width and height of the map
      maxTunnels = this.state.maxTunnels, // max number of tunnels possible
      maxLength = this.state.maxLength, // max length each tunnel can have
      map = this.createArray(1, dimensions), // create a 2d array full of 1's
      currentRow = Math.floor(Math.random() * dimensions), // our current row - start at a random spot
      currentColumn = Math.floor(Math.random() * dimensions), // our current column - start at a random spot
      directions = [[-1, 0], [1, 0], [0, -1], [0, 1]], // array to get a random direction from (left,right,up,down)
      lastDirection = [], // save the last direction we went
      randomDirection; // next turn/direction - holds a value from directions

    // lets create some tunnels - while maxTunnels, dimentions, and maxLength  is greater than 0.
    while (maxTunnels && dimensions && maxLength) {

      // lets get a random direction - until it is a perpendicular to our lastDirection
      // if the last direction = left or right,
      // then our new direction has to be up or down,
      // and vice versa
      do {
         randomDirection = directions[Math.floor(Math.random() * directions.length)];
      } while ((randomDirection[0] === -lastDirection[0] && randomDirection[1] === -lastDirection[1]) || (randomDirection[0] === lastDirection[0] && randomDirection[1] === lastDirection[1]));

      var randomLength = Math.ceil(Math.random() * maxLength), //length the next tunnel will be (max of maxLength)
        tunnelLength = 0; //current length of tunnel being created

		// lets loop until our tunnel is long enough or until we hit an edge
      while (tunnelLength < randomLength) {

        //break the loop if it is going out of the map
        if (((currentRow === 0) && (randomDirection[0] === -1)) ||
            ((currentColumn === 0) && (randomDirection[1] === -1)) ||
            ((currentRow === dimensions - 1) && (randomDirection[0] === 1)) ||
            ((currentColumn === dimensions - 1) && (randomDirection[1] === 1))) {
          break;
        } else {
          map[currentRow][currentColumn] = 0; //set the value of the index in map to 0 (a tunnel, making it one longer)
          currentRow += randomDirection[0]; //add the value from randomDirection to row and col (-1, 0, or 1) to update our location
          currentColumn += randomDirection[1];
          tunnelLength++; //the tunnel is now one longer, so lets increment that variable
        }
      }

      if (tunnelLength) { // update our variables unless our last loop broke before we made any part of a tunnel
        lastDirection = randomDirection; //set lastDirection, so we can remember what way we went
        maxTunnels--; // we created a whole tunnel so lets decrement how many we have left to create
      }
    }

    let availableMap = [];
    for(let i=0; i< dimensions; i++){
        for(let j=0; j< dimensions; j++){
            if(map[i][j] === 0){
                availableMap.push([i,j]);
            }
        }
    }

    let random = Math.floor(Math.random() * (availableMap.length));
    let meRow = availableMap[random][0], // start row - start at a random spot
    meColumn = availableMap[random][1]; // start column - start at a random spot
    map[meRow][meColumn] = 2
    // console.log(map);
    return map; // all our tunnels have been created and our map is complete, so lets return it to our render()
  };

  onClick(e) {
    // force a rerender.
    this.forceUpdate()
  }

  selectClass(num){
      if( num === 0 ){
          return 'tunnel';
      } else if( num === 1 ) {
          return 'wall';
      } else {
          console.log('this is 2');
          return 'me'
      }

  }
  render() {
    let grid = this.createMap();
    const initial_state = {
        map: grid
    }
    // create the store
    const store = createStore(reducers, initial_state);

    return (
    <Provider store={store}>
      <div >
        {/* <div className="form-group row text-center">
          <div className="inline">
            <label>dimensions</label>
            <input className="form-control" name="dimensions" type="text" maxLength="2" value={this.state.dimensions} onChange={this.onChange}/>
          </div>
          <div className="inline">
            <label>maxTunnels</label>
            <input className="form-control" name="maxTunnels" type="text" maxLength="3" value={this.state.maxTunnels} onChange={this.onChange}/>
          </div>
          <div className="inline">
            <label>maxLength</label>
            <input className="form-control" name="maxLength" type="text" maxLength="3" value={this.state.maxLength} onChange={this.onChange}/>
          </div>
        </div> */}
        <table className="grid">
          <thead>
            {grid.map((obj, row) => <tr key={row}>{obj.map((obj2, col) =>< td className = {
                this.selectClass(obj2)
              }
              key = {
                col
              } > </td>)}</tr>)}
          </thead>
        </table>
      </div>
    </Provider>
    );
  }
}
export default App;
