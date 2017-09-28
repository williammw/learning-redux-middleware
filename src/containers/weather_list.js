import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';




 class WeatherList extends Component{
     renderWeather(cityData){
         const name = cityData.city.name;
         return (
             <tr key={name}>
                <td>{name}</td>
             </tr>
         )
     }
    render(){
        return(
            <table className="table table-hover">
                <thead>
               <tr>
                <th> xx </th>
                <th> xx </th>
                <th> xx </th>
                <th> xx </th>
                </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        
        
        );
    }
}

function mapStateToProps({weather}){
    return {weather}
}

export default connect(mapStateToProps)(WeatherList);