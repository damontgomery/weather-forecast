export interface GeoLocation {
  latitude: number
  longitude: number
}

export const getGeoLocationFromURL = (): GeoLocation => {
  const queryParameters = new URLSearchParams(window.location.search)

  return {
    latitude: parseFloat(queryParameters.get('lat') ?? ''),
    longitude: parseFloat(queryParameters.get('lon') ?? ''),
  }
}

export const getGeoLocationDefault = (): GeoLocation => ({
  latitude: 41.9536,
  longitude: -87.7117,
})

export const getGeoLocationFromLocation = (): Promise<GeoLocation> => new Promise((resolve, reject) => {
  if (!navigator.geolocation) {
    reject("Geolocation is not supported by your browser")
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      resolve({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      })
    }, 
    () => {
      reject("Unable to retrieve your location")
    }
  )
})
