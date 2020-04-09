interface Field {
    addionalInformation: string | null;
    latitude: number;
    longitude: number;
    phoneNumber: string;
    name?: string | null;
}

interface ResponseField extends Field {
    canProvideAccomodation?: boolean;
    canProvideShower?: boolean;
    canProvideMeal?: boolean;
}

interface Response {
    id: string;
    fields: ResponseField;
    createdTime: Date;
}

export interface Record extends Field {
    id: string;
    services: string[];
    name: string;
}

const servicesList: {[key: string]: string} = {
    canProvideAccomodation: 'Hébergement',
    canProvideShower: 'Douche',
    canProvideMeal: 'Repas'
}

const filter = (data: Response): boolean => {
    const {fields:{name, longitude, latitude}} = data
    
    if (!name){
        return false
    }

    return longitude !== 0 && latitude !== 0
} 

const formatResponse = (accumulator: Record[], currentValue: Response): Record[] => {
    const {fields, id} = currentValue
    const {latitude, longitude, phoneNumber, name, addionalInformation, ...rest} = fields
    const data = {
        id,
        latitude,
        longitude,
        phoneNumber,
        name: name?.trim() as string, //filtered before
        addionalInformation,
        services: []
    }

    for( const [key] of Object.entries(rest)){
        const service: string = servicesList[key]
        if (service){
            (data.services as string[]).push(service)
        }
    }

    accumulator.push(data)
    return accumulator
}

export default async function call(): Promise<Record[]>{
    const url = process.env.API_AIRTABLE as string
    const request = await fetch(url)
    const {records} = await request.json()
    return records
        .filter(filter)
        .reduce(formatResponse, [])
}
