import Map from './map/Map'
import configMap from './map/config'
import {InfoWindow} from './ui'
import {functions} from './firebase/firebase'

document.addEventListener('DOMContentLoaded', async () => {
    try{
            
        const GoogleMap = await Map()
        const map = await GoogleMap.createMap({
            ...configMap,
            divId: 'map'
        })

        const InfoWindowPanel = new InfoWindow()
        InfoWindowPanel.create()

        const {data} = await functions.apiCall()
        for(const record of data){
            const {latitude, longitude} = record
            const position = {lat: latitude, lng: longitude}
            GoogleMap.createMarker(position, map, () => InfoWindowPanel.render(record))
        }
        
    }catch(error){
        console.log(error)
    }
})