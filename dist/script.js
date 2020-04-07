const ICON_SIZE = 70;
const titleWithNameID = "titleWithName";
const serviceListStringID = "serviceListString";
const centerControlDivID = "centerControlDiv";
function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 46.5040767, lng: -0.6221806 },
        mapTypeControlOptions: {
            mapTypeIds: [google.maps.MapTypeId.ROADMAP]
        },
        streetViewControl: false,
        zoom: 6.5
    });
    const phoneLinkHTML = document.createElement("a");
    const googleMapsIconlinkHTML = document.createElement("a");
    var centerControlDiv = document.createElement('div');
    centerControlDiv.appendChild(callHTMLIcon());
    centerControlDiv.appendChild(googleMapsIcon());
    var centerControl = new CenterControl(centerControlDiv);
    centerControlDiv.index = 1;
    map.controls[google.maps.ControlPosition.BOTTOM_CENTER].push(centerControlDiv);
    hideHostUI();
    getHostsInfoFromAirtableAPIAndUpdateUI();
    centerMapToUser();
    class Host {
        constructor(anObject) {
            this.name = anObject.name;
            this.phoneNumber = anObject.phoneNumber;
            this.latitude = anObject.latitude;
            this.longitude = anObject.longitude;
            this.canProvideShower = anObject.canProvideShower !== undefined ? anObject.canProvideShower : false;
            this.canProvideMeal = anObject.canProvideMeal !== undefined ? anObject.canProvideMeal : false;
            this.canProvideAccomodation = anObject.canProvideAccomodation !== undefined ? anObject.canProvideAccomodation : false;
            this.additionalInformation = anObject.someAdditionalInformation;
        }
        servicesString() {
            const mealString = "-Repas";
            const showerString = "-Douche";
            const accomodation = "-hébergement";
            const brString = "<br>";
            var serviceStringList = [];
            if (this.canProvideShower == true) {
                serviceStringList.push(showerString);
            }
            if (this.canProvideMeal == true) {
                serviceStringList.push(mealString);
            }
            if (this.canProvideAccomodation == true) {
                serviceStringList.push(accomodation);
            }
            var serviceListString = "";
            for (let count = 0; count < serviceStringList.length; count++) {
                if (count != 0) {
                    serviceListString += brString;
                }
                serviceListString += serviceStringList[count];
            }
            return serviceListString;
        }
        titleInControlCenterString() {
            return this.name + " propose :";
        }
        hasValidGPSCoordinates() {
            return this.latitude !== 0.0 && this.longitude !== 0.0;
        }
        googleMapsLink() {
            return "https://maps.google.com/?q=" + this.latitude + "," + this.longitude;
        }
    }
    function CenterControl(controlDiv) {
        var controlUI = document.createElement('div');
        controlUI.style.backgroundColor = '#fff';
        controlUI.style.border = '2px solid #fff';
        controlUI.style.borderRadius = '3px';
        controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
        controlUI.style.cursor = 'pointer';
        controlUI.style.marginBottom = '22px';
        controlUI.style.textAlign = 'center';
        controlUI.title = 'Click to recenter the map';
        controlDiv.appendChild(controlUI);
        var controlText = document.createElement('div');
        controlText.style.color = 'rgb(25,25,25)';
        controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
        controlText.style.fontSize = '16px';
        controlText.style.lineHeight = '38px';
        controlText.style.paddingLeft = '5px';
        controlText.style.paddingRight = '5px';
        controlText.innerHTML = 'Jean Thierry propose:';
        controlText.id = titleWithNameID;
        controlUI.appendChild(controlText);
        var secondText = document.createElement('p');
        secondText.innerHTML = '-Repas<br>-Douche<br>-hébergement';
        secondText.id = serviceListStringID;
        controlUI.appendChild(secondText);
    }
    function callHTMLIcon() {
        var callImage = document.createElement("img");
        callImage.src = "images/call_icon.png";
        callImage.alt = "Appeler l'hôte";
        callImage.height = ICON_SIZE;
        callImage.width = ICON_SIZE;
        phoneLinkHTML.appendChild(callImage);
        return phoneLinkHTML;
    }
    function googleMapsIcon() {
        var googleMapsIcon = document.createElement("img");
        googleMapsIcon.src = "images/google_maps_icon.png";
        googleMapsIcon.alt = "Rejoindre l'hôte";
        googleMapsIcon.width = ICON_SIZE;
        googleMapsIcon.height = ICON_SIZE;
        googleMapsIconlinkHTML.appendChild(googleMapsIcon);
        return googleMapsIconlinkHTML;
    }
    function updateGoogleMapsLink(link) {
        if (link !== undefined && link !== null) {
            googleMapsIconlinkHTML.href = link;
        }
    }
    function updatePhoneNumber(hostPhoneNumber) {
        if (hostPhoneNumber !== undefined && hostPhoneNumber !== null) {
            phoneLinkHTML.href = "tel:" + hostPhoneNumber;
        }
    }
    function hideHostUI() {
        centerControlDiv.style.display = "none";
    }
    function displayHostUI() {
        centerControlDiv.style.display = "block";
    }
    function setServiceListString(serviceListString) {
        document.getElementById(serviceListStringID).innerHTML = serviceListString;
    }
    function setTitleInControlCenterFromString(titleString) {
        document.getElementById(titleWithNameID).innerHTML = titleString;
    }
    function setServiceListStringFromHost(host) {
        setServiceListString(host.servicesString());
    }
    function getHostsInfoFromAirtableAPIAndUpdateUI() {
        const url = "https://api.airtable.com/v0/app90qrCEr09fpV6z/hosts?api_key=keyTD5KLrdrLtGhYF";
        axios.get(url).then(function (response) {
            const records = response.data.records;
            records.forEach(element => {
                const host = new Host(element.fields);
                if (host.hasValidGPSCoordinates()) {
                    var marker = new google.maps.Marker({ position: { lat: host.latitude, lng: host.longitude }, map: map });
                    marker.addListener('click', function (params) {
                        console.log(params);
                        setServiceListStringFromHost(host);
                        setTitleInControlCenterFromString(host.titleInControlCenterString());
                        displayHostUI();
                        updatePhoneNumber(host.phoneNumber);
                        updateGoogleMapsLink(host.googleMapsLink());
                    });
                }
            });
        })
            .catch(function (error) {
            console.log(error);
        });
    }
    function centerMapToUser() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                var infowindow = new google.maps.InfoWindow({
                    position: pos,
                    content: 'Here you are.'
                });
                map.setCenter(pos);
            });
        }
    }
}
//# sourceMappingURL=script.js.map