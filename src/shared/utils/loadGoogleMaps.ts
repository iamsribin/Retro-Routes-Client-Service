
// let scriptLoaded = false;

// export const loadGoogleMapsScript = (apiKey: string): Promise<void> => {
//   return new Promise((resolve, reject) => {
//     if (scriptLoaded) {
//       resolve();
//       return;
//     }

//     if (typeof window !== "undefined" && typeof window.google !== "undefined") {
//       scriptLoaded = true;
//       resolve();
//       return;
//     }

//     const script = document.createElement("script");
//     script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
//     script.async = true;
//     script.defer = true;

//     script.onload = () => {
//       scriptLoaded = true;
//       resolve();
//     };

//     script.onerror = () => {
//       reject(new Error("Failed to load Google Maps script"));
//     };

//     document.head.appendChild(script);
//   });
// };
