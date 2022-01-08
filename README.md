<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->

<!-- [![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url] -->



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <!-- <a href="https://github.com/LucaMueller1/minecraft3Dwebapp">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a> -->

<h1 align="center">Minecraft 3D WebRender</h2>

  <p align="center">
    Web rendering a Minecraft world using Three.js including dynamic lighting, a sky dome, transparent leaves and character animation (work in progress).
    <br />
    <a href="https://lucamueller.me/minecraft-web"><strong>Demo »</strong></a>
    <br />
    <br />
    <a href="https://github.com/LucaMueller1/minecraft3Dwebapp/issues">Report Bug</a>
    ·
    <a href="https://github.com/LucaMueller1/minecraft3Dwebapp/issues">Request Feature</a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#running-the-project">Running the project</a>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

![![Product Name Screen Shot][product-screenshot]](https://user-images.githubusercontent.com/64702286/148650571-bd49de17-d61b-43d1-90b9-cb7c0bcb27a5.png)

Played around with Three.js and decided to try and load a Minecraft world in GLTF format. Turned out it's not as easy as thought (especially since I am pretty new to Blender and such). If you wanna see how everything works, have a look at the more detailed walktrough down below.

<p align="right">(<a href="#top">back to top</a>)</p>



### Built With

* [Three.js](https://threejs.org) for the 3D web rendering
* My library [three-tween-path](https://www.npmjs.com/package/three-tween-path) to create configurable movement paths (e.g. for a character walking animation)
* My library [three-creative-controls](https://www.npmjs.com/package/three-creative-controls) to mirror the Minecraft creative-mode control behaviour
* [Mineways](https://www.realtimerendering.com/erich/minecraft/public/mineways/) to export a Minecraft world as .obj files
* [Blender](https://www.blender.org) to create a binary glTF (.glb) file from the generated .obj
* [Draco 3D](https://google.github.io/draco/) for glTF compression
* [Vite](https://vitejs.dev) as frontend dev tool

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Running the project

Follow these steps to run the project locally:

1. Install NPM dependencies
   ```sh
   npm install
   ```
2. Start in development mode:
   ```sh
   npm run dev
   ```
Follow these steps to build the project:
1. Build project and preview with vite:
   ```sh
   npm run build
   npm run serve
   ```
2. Deploy static files using a webserver like NGINX

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

Once the project is running locally, navigate to `localhost:3000` in your browser. Give the project a few seconds to load (depends on your machine) and expore the world!

<p align="right">(<a href="#top">back to top</a>)</p>

## Screenshots


Transparent textures allowing for light and shadows to pass through
![screenshotLeaves](https://user-images.githubusercontent.com/64702286/148650573-2c030ea5-98d8-4dce-a5d0-8d2ffade0cd4.png)

World at night showing off beautiful atmosphere through torch lighting
![screenshotNight](https://user-images.githubusercontent.com/64702286/148650574-8220e425-482b-4118-ad1c-f7080cbd471a.png)

Closer look at dynamic lighting using spot lights
![screenshotTorch](https://user-images.githubusercontent.com/64702286/148650576-756767af-6ee1-4315-abe8-bdb92a2c6be4.png)

<p align="right">(<a href="#top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

- [x] Export Minecraft World as 3D models
- [x] Create one glTF file containing all the models the world is composed of
- [x] Create skydome
- [x] Mimic Minecraft controls in creative mode
- [x] Add basic pause menu
- [x] Create a Minecraft character with player skin as 3D model
- [x] Make player model follow a walking path
- [x] Include player animations (walking, idling)
  - [ ] Fix feet animations
- [ ] Import texture animations (water, lava, leaves, portal)
- [ ] Improve performance

<!-- See the [open issues](https://github.com/LucaMueller1/minecraft3Dwebapp/issues) for a full list of proposed features (and known issues). -->

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- CONTACT -->
## Contact

Luca Mueller - lucamueller32@gmail.com

Project Link: [https://github.com/LucaMueller1/minecraft3Dwebapp](https://github.com/LucaMueller1/minecraft3Dwebapp)

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- ACKNOWLEDGMENTS
## Acknowledgments

* []()
* []()
* []()

<p align="right">(<a href="#top">back to top</a>)</p> -->



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/LucaMueller1/minecraft3Dwebapp.svg?style=for-the-badge
[contributors-url]: https://github.com/LucaMueller1/minecraft3Dwebapp/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/LucaMueller1/minecraft3Dwebapp.svg?style=for-the-badge
[forks-url]: https://github.com/LucaMueller1/minecraft3Dwebapp/network/members
[stars-shield]: https://img.shields.io/github/stars/LucaMueller1/minecraft3Dwebapp.svg?style=for-the-badge
[stars-url]: https://github.com/LucaMueller1/minecraft3Dwebapp/stargazers
[issues-shield]: https://img.shields.io/github/issues/LucaMueller1/minecraft3Dwebapp.svg?style=for-the-badge
[issues-url]: https://github.com/LucaMueller1/minecraft3Dwebapp/issues
[license-shield]: https://img.shields.io/github/license/LucaMueller1/minecraft3Dwebapp.svg?style=for-the-badge
[license-url]: https://github.com/LucaMueller1/minecraft3Dwebapp/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/lucamueller1
[product-screenshot]: images/screenshot.png