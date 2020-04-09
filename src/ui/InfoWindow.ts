import { Record } from '../api/api'
import './infoWindow.scss'

export default class InfoWindow{
    private container?: Element | null

    public create(): void{
        if (!this.container){
            const element = `
                <div class="infoWindow">
                    <div class="infoWindow__coordinates">
                        <a href="#" title="Appeller l'hôte" class="infoWindow__tel"></a>
                        <a href="#" title="Rejoindre l'hôte" class="infoWindow__latlng"></a>
                    </div>
                    <div class="infoWindow__card">
                        <div class="infoWindow__title"></div>
                        <div class="infoWindow__description"></div>
                    </div>
                </div>
            `

            document.body.insertAdjacentHTML('afterbegin', element)
            this.container = document.querySelector('.infoWindow')
        }
    }

    public render(data: Record): void{
        const {services, name, phoneNumber, longitude, latitude} = data
        if (this.container){
            const title = this.container.querySelector('.infoWindow__title') as HTMLElement
            const tel = this.container.querySelector('.infoWindow__tel') as HTMLElement
            const latLng = this.container.querySelector('.infoWindow__latlng') as HTMLElement
            const description = this.container.querySelector('.infoWindow__description') as HTMLElement

            description.innerHTML = ''
            title.innerHTML = name
            tel.setAttribute('href', `tel: ${phoneNumber}`)
            latLng.setAttribute('href', `https://maps.google.com/?q=${latitude},${longitude}`)

            if (services.length) {
                title.innerHTML += ' propose :'
                description.innerHTML = `<ul>${services.map((item) => `<li>${item}</li>`).join('')}</ul>`
            }

            (this.container as HTMLElement).style.opacity = 'initial'
        }
    }
}