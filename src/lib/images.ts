/** Local Turkestan photos — one unique image per homepage card */
const H = (file: string) => `/images/home/${file}`;

export const HERO_IMAGE = H("02-yasawi-alt.jpg");

/** Service cards on the homepage (7 with photos) */
export const FEATURE_IMAGES: Record<string, string> = {
  map: H("08-silkroad.jpg"),
  routes: H("06-otyrar-ground.jpg"),
  booking: H("13-booking.jpg"),
  audio: H("12-otyrar-view.jpg"),
  qr: H("03-rabiya.jpg"),
  ai: H("14-ai.jpg"),
  reviews: H("11-karavan-crop.jpg"),
  mobile: H("08-silkroad.jpg"),
  help: H("03-rabiya.jpg"),
};

/** Destination row on the homepage (5 cards) */
export const PLACE_IMAGES: Record<string, string> = {
  yasawi: H("01-yasawi.jpg"),
  hazret: H("10-hazret-crop.jpg"),
  arystan: H("04-arystan.jpg"),
  otyrar: H("05-otyrar-air.jpg"),
  karavan: H("07-karavan.jpg"),
  museum: H("01-yasawi.jpg"),
  bazaar: H("07-karavan.jpg"),
  "hotel-yassawi": H("02-yasawi-alt.jpg"),
  "restaurant-dastarkhan": H("04-arystan.jpg"),
  station: H("05-otyrar-air.jpg"),
  "turkestan-airport": H("06-otyrar-ground.jpg"),
  "nauryz-fest": H("03-rabiya.jpg"),
};

export function placeImageUrl(placeId: string): string {
  return PLACE_IMAGES[placeId] ?? H("01-yasawi.jpg");
}

export function featureImage(id: string): string {
  return FEATURE_IMAGES[id] ?? H("08-silkroad.jpg");
}
