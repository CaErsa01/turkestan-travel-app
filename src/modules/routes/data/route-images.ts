/** Real Turkestan tourism photos (Wikimedia Commons, CC-licensed) */

function wikiThumb(filename: string, width = 1280): string {
  const encoded = encodeURIComponent(filename).replace(/%20/g, "_");
  // MD5 prefix paths verified against commons.wikimedia.org (2026)
  const paths: Record<string, string> = {
    "Mausoleum_of_Khoja_Ahmed_Yasawi_in_Hazrat-e_Turkestan,_Kazakhstan.jpg": "6/6c",
    "Khoja_Ahmed_Yasawi_Mausoleum,_Turkistan,_Kazakhstan.jpg": "a/a1",
    "Mausoleum_of_Khoja_Ahmed_Yasawi_in_Turkistan_10.jpg": "b/bb",
    "Otrar_aerial_view_from_May_2016.jpg": "5/57",
    "Turkestan Karavan Saray.jpg": "f/f2",
    "Arystan_Bab_mausoleum_center_02.jpg": "f/f4",
    "Turkistan_Mausoleum_of_Khoja_Ahmed_Yasavi.jpg": "a/ab",
    "Mausoleum_of_Khoja_Ahmed_Yasawi,_Turkestan_2007.jpg": "4/4b",
    "Kul_Tigin_-_The_History_of_Kazakhstan.jpg": "2/26",
  };
  const prefix = paths[filename];
  if (!prefix) {
    throw new Error(`Missing Wikimedia path for ${filename}`);
  }
  return `https://upload.wikimedia.org/wikipedia/commons/thumb/${prefix}/${encoded}/${width}px-${encoded}`;
}

export const ROUTE_COVER_IMAGES: Record<string, string> = {
  "route-1day-sacred": wikiThumb(
    "Mausoleum_of_Khoja_Ahmed_Yasawi_in_Hazrat-e_Turkestan,_Kazakhstan.jpg"
  ),
  "route-2day-full": wikiThumb("Khoja_Ahmed_Yasawi_Mausoleum,_Turkistan,_Kazakhstan.jpg"),
  "route-historical": wikiThumb("Otrar_aerial_view_from_May_2016.jpg"),
  "route-family": wikiThumb("Turkestan Karavan Saray.jpg"),
  "route-religious": wikiThumb("Arystan_Bab_mausoleum_center_02.jpg"),
  "route-night": wikiThumb("Turkistan_Mausoleum_of_Khoja_Ahmed_Yasavi.jpg"),
  "route-budget": wikiThumb("Kul_Tigin_-_The_History_of_Kazakhstan.jpg"),
  "route-premium": wikiThumb("Mausoleum_of_Khoja_Ahmed_Yasawi_in_Turkistan_10.jpg"),
};

export const ROUTE_IMAGE_FALLBACK = ROUTE_COVER_IMAGES["route-1day-sacred"];
