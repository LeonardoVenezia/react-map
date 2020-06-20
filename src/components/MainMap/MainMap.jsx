import React, {Component} from 'react';
import './MainMap.css';


class MainMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            mapaGoogle: '',
            markers: [],
            markersList: [],
            newMarkerName: ''
        }
    }

    componentDidMount() {
        var script = document.createElement('script');
        script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCvUjZnzjvwyyeUkz8d4tp_WsspkSOXJ84&callback=window.initMap';
        script.defer = true;
        script.async = true;

        window.initMap = this.initGoogleMap.bind(this)

        document.head.appendChild(script);
    }

    initGoogleMap() {
        const initialPosition = {lat: -35.344, lng: -60.036};
        const mapaGoogle = new window.google.maps.Map(
            document.querySelector('#map'),
            {zoom: 4, center: initialPosition}
        );
        this.setState((state)=> ({
            ...state,
            mapaGoogle
        }))

        window.google.maps.event.addListener(mapaGoogle, 'click', this._createMarker.bind(this));

    }

    _dragMaker(marker, e) {
        const markersListItem = this._markersListItem(e.latLng, marker.marker)

        let markersList = this.state.markersList;

        markersList[marker.ref -1] = markersListItem;

        this.setState((state)=> ({
            ...state,
            markersList
        }))
    }

    _createMarker(event) {
        const clickedLocation = event.latLng;
        const marker = new window.google.maps.Marker({
            position: clickedLocation,
            map: this.state.mapaGoogle,
            label: {text: 'label'},
            draggable: true
        });

        marker.addListener('click', ()=> {
            this.state.mapaGoogle.setCenter(marker.getPosition());
        });

        const markersListItem = this._markersListItem(marker.position, marker)

        const newMarkerListItem = [...this.state.markersList, markersListItem];

        const newMarker = {
            marker,
            ref: newMarkerListItem.length
        }

        this.setState((state)=> ({
            ...state,
            markers: [...this.state.markers, newMarker],
            markersList: newMarkerListItem
        }))

        window.google.maps.event.addListener(marker, 'dragend', this._dragMaker.bind(this, newMarker));
    }


    _markersListItem(position, marker) {
        const label = marker.getLabel().text
        const lat = position.lat().toFixed(3);
        const lng = position.lng().toFixed(3);

        return <li onClick={this._changeMarkerName.bind(this, marker)} key={lat+lat}>{label} | {lat}, {lng}</li>
    }

    _changeMarkerName(marker) {
        const sameMarker = this.state.markers.find(m => m.marker === marker);
        marker.setLabel({text: this.state.newMarkerName});

        const markersListItem = this._markersListItem(marker.position, marker);
        this.state.markersList[sameMarker.ref - 1] = markersListItem;
        this.setState((state)=> ({
            ...state,
            markers: [...this.state.markers, sameMarker],
            markersList: [...this.state.markersList]
        }))
    }

    _handleNameChange(event) {
        this.setState({
            ...this.state,
            newMarkerName: event.target.value
        });
    }

    render() {
        return (
            <div className='container'>
                <div id='map' className='map'></div>
                <input type="text" value={this.state.newMarkerName} onChange={this._handleNameChange.bind(this)}/>
                <ul className='markersList'>
                    {this.state.markersList}
                </ul>
            </div>
        )
    }
}

export default MainMap;