import React, {Component} from 'react';
import './App.css';
import { createStore } from 'redux';
import { Provider } from 'react-redux'
import { reducers } from './reducers/index';


class App extends Component {
  constructor(props) {
    super(props);
      let maps = this.createMap();
      let grid = maps.maps;
      let player = maps.player;
      let enemy = maps.enemy;
      let medicine = maps.medicine;
      let location = maps.location
    this.state = {
      // dimensions: 30,
      // maxTunnels: 100,
      // maxLength: 8,
      maps: grid,
      player: player,
      enemy: enemy,
      medicine: medicine,
      location: location
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

    let dimensions = 30, // width and height of the map
      maxTunnels = 100, // max number of tunnels possible
      maxLength = 8, // max length each tunnel can have
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
    map[meRow][meColumn] = 2;
    // console.log(availableMap);

    const newAvailableMap = availableMap.filter((element) => {
        return !(element[0] === meRow && element[1] === meColumn)
    })
    // console.log(newAvailableMap);
    let random1 = Math.floor(Math.random() * (newAvailableMap.length));
    let enemyRow = newAvailableMap[random1][0], // start row - start at a random spot
    enemyColumn = newAvailableMap[random1][1]; // start column - start at a random spot
    map[enemyRow][enemyColumn] = 3;

    const newAvailableMap2 = newAvailableMap.filter((element) => {
        return !(element[0] === enemyRow && element[1] === enemyColumn)
    })
    // console.log(newAvailableMap2);
    let random2 = Math.floor(Math.random() * (newAvailableMap2.length));
    let medicineRow = newAvailableMap2[random2][0], // start row - start at a random spot
    medicineColumn = newAvailableMap2[random2][1]; // start column - start at a random spot
    map[medicineRow][medicineColumn] = 4;

    return {
        maps:map,
        location: [meRow, meColumn],
        player:100,
        enemy: 120,
        medicine:30
            }; // all our tunnels have been created and our map is complete, so lets return it to our render()
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
      } else if ( num === 3 ) {
          return 'enemy';
      } else if ( num === 4 ) {
          return 'medicine';
      } else {
          // console.log('this is 2');
          return 'me'
      }

  }

  arrowKey(e){
      let vector = [0,0];
      switch (e.keyCode) {
        case 37:   // left
          vector = [-1,0] // {x: -1, y: 0};
          break;
        case 38:  // up
          vector = [0,-1] // {x: 0, y: -1};
          break;
        case 39:  // right
          vector = [1,0] // {x: 1, y: 0};
          break;
        case 40:  // down
          vector = [0,1] // {x: 0, y: 1};
          break;
        default:
          vector = [0,0];
          break;
      }
      if (vector) {
        e.preventDefault();
        this.handleMove(vector);
      }
  }

  handleMove(vector){
      const state = this.state;
      const player = state.player;
      const medicine = state.medicine;
      const enemy = state.enemy;
      const maps = state.maps;
      const location = state.location;
      // console.log(player);
      // console.log(vector);
      const x = location[0];
      const y = location[1];
      const y1 = vector[0];
      const x1 = vector[1];
      let newLocation;
      let newPlayer = player;


      if(maps[x+x1][y+y1] === 0){     // able to move
          maps[x+x1][y+y1] = 2;
          maps[x][y] = 0 ;
          newLocation = [x+x1, y+y1];
      } else if (maps[x+x1][y+y1] === 4) {  // medicine
         maps[x+x1][y+y1] = 2;
         maps[x][y] = 0 ;
         newLocation = [x+x1, y+y1];
         newPlayer = player + medicine;
     } else if (maps[x+x1][y+y1] === 3) { // enemy
         if(player > enemy){
             alert('You win!')
         } else {
             alert('OOPS, You lose!')
         }

      } else {                        // 1 unable to move
          maps[x][y] = 2 ;
          newLocation = location;
      }
      // console.log(vector);
      // console.log(newPlayer);
      this.setState(
          {maps: maps, location:newLocation, player: newPlayer}
      )

  }



  componentDidMount() {
    window.addEventListener('keydown', this.arrowKey.bind(this)); //notice .bind
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.arrowKey.bind(this));
  }

  render() {
    // let maps = this.createMap();
    let grid = this.state.maps;
    // let position = maps.position;
    //
    // this.setState((grid,position) => {return {maps: grid, player: position}});
    // console.log(position);


    // create the store
    const store = createStore(reducers, {maps:grid});

    return (
    <Provider store={store}>
    <div id = 'game'>
      <ul id = 'ui'>
        <li id = 'health'><span className = 'label'>Player Health:</span> {this.state.player}</li>
        <li id = ''><span className = 'label'>Enemy Health:</span> {this.state.enemy}</li>

      </ul>
      <div>
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
      </div>
    </Provider>
    );
  }
}
export default App;
