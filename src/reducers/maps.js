export default function maps(state = {}, action){
    let new_state;
    switch (action.type){
        case 'left':
            new_state.maps = new_state.maps ? new_state.maps : {};
            new_state.maps = state.maps;
            return new_state;
        default:
            return state;


    }

}
