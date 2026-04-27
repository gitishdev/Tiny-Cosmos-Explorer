# Cosmic Canvas: A 3D Solar System Explorer

Cosmic Canvas is an interactive, photorealistic web-based 3D explorer of our Solar System and the wider Milky Way Galaxy. Built specifically with toddlers and parents in mind, it combines beautiful 3D graphics with exaggerated scales and stylized motion to make astronomical concepts accessible, engaging, and fun to explore.

## Features

- **Interactive 3D Environment**: Explore the cosmos using a dynamic 3D camera. Zoom out to view the entire galaxy, or zoom in to examine individual planets.
- **Hierarchical Navigation**: Seamlessly transition from a macroscopic galactic view down to the orbital dance of the planets.
- **Exaggerated Scale & Speed**: Planets and orbits are scaled non-linearly to ensure everything is easily visible and tappable. The "Show in Motion" feature accelerates orbital mechanics to create an engaging "synchronized dance".
- **Asterisms and Constellations**: Discover major asterisms (like the Summer Triangle and Winter Stars). Hover over constellation names to reveal glowing connections and learn facts about the stars that compose them. 
- **Toddler & Adult Modes**: 
  - *Adult Mode*: Use the robust search bar to quickly locate any celestial body.
  - *Toddler Mode*: Tap the friendly icon tray at the bottom to fly directly to planets and stars.
- **Fact Discovery**: Tap on any planet, moon, or star to reveal easy-to-understand space facts.

## Tech Stack

This project leverages modern frontend technologies for high-performance 3D rendering:

- **React Function Components**: Core UI and state management architecture.
- **Zustand**: Lightweight global state management for controlling camera views, search queries, and selected objects.
- **Three.js & React Three Fiber (R3F)**: The engine powering the 3D scene, rendering geometries, textures, and lighting.
- **React Three Drei**: Helper utilities for R3F, used for rendering HTML overlays in 3D space (`<Html>`), drawing constellation lines (`<Line>`), and managing the starfield (`<Stars>`).
- **Tailwind CSS**: Rapid UI styling for the overlay HUD.

## Getting Started

To run this project locally, you will need Node.js installed.

1. **Clone the repository**
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:** Navigate to `http://localhost:3000` (or the port specified in your terminal).

## Usage

- **Navigation**: Click and drag to rotate the camera. Scroll to zoom in and out.
- **Selecting Bodies**: Click directly on a planet or star in the 3D scene, use the search bar at the top, or click the icons in the bottom tray.
- **Motion Toggle**: Use the "MOTION" toggle buttons in the top UI to start or stop the orbital animations.
- **Lines Toggle**: Use the "LINES" toggle to show or hide all constellation connections simultaneously.
- **Constellation Hover**: When lines are hidden, hover over the floating constellation names to temporarily illuminate their lines and read their tooltip descriptions.

## Contributing

Contributions are welcome! If you'd like to improve Cosmic Canvas, please fork the repository and submit a pull request. 
