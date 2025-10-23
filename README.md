![lead](docs/lead.svg)

<p float="left">
  <a href="https://apps.apple.com/us/app/puttlab/id6752844572?itscg=30200&itsct=apps_box_badge&mttnsubad=6752844572" style="display: inline-block;">
    <img src="https://toolbox.marketingtools.apple.com/api/v2/badges/download-on-the-app-store/black/en-us?releaseDate=1759104000" alt="Download on the App Store" style="height: 50px; width: auto; vertical-align: middle; object-fit: contain;" />
  </a>
  <img style="height: 50px; width: auto; vertical-align: middle; object-fit: contain;" src="./docs/playstore.png" />
</p>

<br />

# PuttLab

This application is designed to help disc golf players improve their putting skills through structured practice and detailed performance analysis. Putting is a critical part of disc golf, and consistent improvement requires focused, measurable training. this apps goal is to provide exactly that.

## Functionality

- The app works offline.
- It does not require an internet connection and makes no network requests.
- All data is stored locally on the device using a SQLITE Database
- It is built using React in combination with Capacitor to use native functionality

## Development

The application can be developed inside the browser, thanks to the great work at Capacitor. Run the following commands to get you started:

1. `pnpm i`
2. `pnpm run dev`

To test on android or ios, run:

1. `pnpm run build`
2. `pnpm cap sync`
3. `pnpm cap run ios` / `pnpm cap run android`

(android studio and xcode are required to be running to be able to run them on android or ios.)
