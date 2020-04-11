import './infoWindow.scss'
interface Data{
    services: string[];
    name: string;
    phoneNumber: string;
    longitude: string;
    latitude: string;
}

export default class InfoWindow{
    _container?: Element | null

    create(): void{
        if (!this._container){
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
            this._container = document.querySelector('.infoWindow')
        }
    }

    render(data: Data): void{
        const {services, name, phoneNumber, longitude, latitude} = data
        if (this._container){
            const title = this._container.querySelector('.infoWindow__title') as HTMLElement
            const tel = this._container.querySelector('.infoWindow__tel') as HTMLElement
            const latLng = this._container.querySelector('.infoWindow__latlng') as HTMLElement
            const description = this._container.querySelector('.infoWindow__description') as HTMLElement

            description.innerHTML = ''
            title.innerHTML = name
            tel.setAttribute('href', `tel: ${phoneNumber}`)
            latLng.setAttribute('href', `https://maps.google.com/?q=${latitude},${longitude}`)

            if (services.length) {
                title.innerHTML += ' propose :'
                description.innerHTML = `<ul>${services.map((item) => `<li>${item}</li>`).join('')}</ul>`
            }

            (this._container as HTMLElement).style.opacity = 'initial'
        }
    }
}