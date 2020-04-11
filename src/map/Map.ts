import loadGoogleMapApi from 'load-google-maps-api'
import poiIcon from '../../images/poi.png'
import poiIconblue from '../../images/poi_blue.png'

interface Coordinates {
    lat: number;
    lng: number;
}

interface MapOptions extends google.maps.MapOptions{
    divId: string;
}

class GoogleMap {
    _api: typeof google.maps

    _lastClickedMaker?: google.maps.Marker

    constructor(api: typeof google.maps){
        this._api = api
    }
    
    createMap(options: MapOptions): Promise<google.maps.Map> {
        const {Map} = this._api
        const {divId, ...rest} = options

        const mapDiv: Element | null = document.getElementById(divId)

        if (!mapDiv){
            return Promise.reject(`Unable to find element with id ${divId}`)
        }

        const instance = new Map(mapDiv, rest)

        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const {coords: {latitude, longitude}} = position
                instance.setCenter({lng: longitude, lat: latitude})
            })
        }

        return Promise.resolve(instance)
    }

    createMarker(coordinates: Coordinates, map: google.maps.Map, infoWindowCallback?: Function): google.maps.Marker {
        const {Marker} = this._api
        const marker = new Marker({
            position: coordinates,
            map,
            icon: poiIcon
        })

        marker.addListener('click', () => {

            if (!this._lastClickedMaker){
                this._lastClickedMaker = marker
            }
            
            if (this._lastClickedMaker !== marker){
                this._lastClickedMaker.setIcon(poiIcon)
                this._lastClickedMaker = marker
            }

            if (infoWindowCallback){
                infoWindowCallback()
            }
            marker.setIcon(poiIconblue)
        })

        return marker
    }
}

export default async function Map(): Promise<GoogleMap>{
    const api = await loadGoogleMapApi({key: process.env.GOOGLE_MAP_API_KEY})
    return new GoogleMap(api)
}