import Map from './map/Map'
import configMap from './map/config'
import call from './api/api'
import {InfoWindow} from './ui'


document.addEventListener('DOMContentLoaded', async () => {
    try{
            
        const GoogleMap = await Map()
        const map = await GoogleMap.createMap({
            ...configMap,
            divId: 'map'
        })

        const InfoWindowPanel = new InfoWindow()
        InfoWindowPanel.create()

        const records = await call()
            
        for(const record of records){
            const {latitude, longitude} = record
            const position = {lat: latitude, lng: longitude}
            GoogleMap.createMarker(position, map, () => InfoWindowPanel.render(record))
        }
        
    }catch(error){
        console.log(error)
    }
})