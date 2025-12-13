# 3D Space UI

A beautiful 3D space visualization built with React Three Fiber, featuring an immersive starfield environment with thousands of dynamically rendered stars.

## Features

- **GPU-Efficient Starfield**: 3,000+ stars rendered using instanced geometry for optimal performance
- **Spherical Distribution**: Stars are distributed in a realistic spherical pattern creating an infinite space feel
- **Dynamic Animation**: Subtle parallax drift with slow galactic rotation
- **Realistic Star Colors**: Color variations including white, blue, and warm-tinted stars
- **Interactive Camera**: Orbit controls for exploring the 3D space
- **Modern Tech Stack**: Built with React 19, Three.js, and Vite

## Tech Stack

- **React** 19.2.0 - UI framework
- **Three.js** 0.182.0 - 3D graphics library
- **React Three Fiber** 9.4.2 - React renderer for Three.js
- **React Three Drei** 10.7.7 - Useful helpers for React Three Fiber
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Vite** 7.2.4 - Build tool and dev server

## Installation

```bash
npm install
```

## Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Linting

Run ESLint:

```bash
npm run lint
```

## Project Structure

```
3d-space-ui/
├── src/
│   ├── components/
│   │   ├── ThreeScene.jsx       # Main 3D canvas setup
│   │   └── InstancedField.jsx   # Starfield component
│   ├── App.jsx                  # Root application component
│   └── main.jsx                 # Application entry point
├── public/                      # Static assets
├── index.html                   # HTML template
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── eslint.config.js            # ESLint configuration
└── package.json
```

## Key Components

### ThreeScene
The main scene component that sets up the 3D canvas with:
- Camera configuration (FOV: 50, position: [5, 5, 5])
- Ambient and directional lighting
- Orbit controls for camera interaction

### InstancedField
A highly optimized starfield component featuring:
- Configurable star count (default: 3000)
- Spherical distribution with customizable radius (default: 80 units)
- Per-star color attributes (white, blue, warm tints)
- Continuous rotation animation for parallax effect
- Point-based rendering for maximum GPU efficiency

## Performance

The starfield uses GPU-efficient instanced rendering with Three.js `BufferGeometry` and point materials, allowing thousands of stars to be rendered smoothly at 60 FPS.

## License

MIT
