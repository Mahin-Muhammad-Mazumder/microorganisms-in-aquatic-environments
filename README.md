# 🌊 AquaMicrobe 3D — Interactive Aquatic Microbiology & Biogeochemical WebGL Simulation

![Three.js](https://img.shields.io/badge/Three.js-r128_WebGL-000000?style=flat-square&logo=threedotjs&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-3.12_Tweening-88CE02?style=flat-square&logo=greensock&logoColor=black)
![Chart.js](https://img.shields.io/badge/Chart.js-Real--Time_Telemetry-FF6384?style=flat-square&logo=chartdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-HUD_Interface-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-10B981?style=flat-square)

**AquaMicrobe 3D** (*Microorganisms in Aquatic Environments*) is a 15-scene interactive 3D WebGL educational simulation and ecological visualization engine. Engineered with a **Simulation-First, Zero-Clutter HUD** architecture, the application transforms complex aquatic microbiology—from pelagic bacterioplankton and viral lysis bursts to deep-sea hydrothermal plumes and the biological carbon pump—into a real-time, manipulable 3D laboratory running natively in the browser.

[![Live Demo](https://img.shields.io/badge/Live_Demo-GitHub_Pages-0ea5e9?style=flat-square&logo=github)](https://mahin-muhammad-mazumder.github.io/microorganisms-in-aquatic-environments/)
[![Deploy](https://github.com/Mahin-Muhammad-Mazumder/microorganisms-in-aquatic-environments/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/Mahin-Muhammad-Mazumder/microorganisms-in-aquatic-environments/actions/workflows/deploy-pages.yml)

---

## 🎯 Architectural Highlights (CV & Engineering Overview)

* **🖥️ 100vw × 100vh Raycasted WebGL Viewport:** Built on **Three.js (`r128`)** with `OrbitControls` and `THREE.Raycaster` 3D object picking. The 3D canvas acts as an interactive spatial slide deck where every organism, depth plane, and chemical gradient is directly clickable in 3D space.
* **🎥 GSAP Spatial Camera Controller:** Clicking any 3D mesh or pressing hotkeys (`1–4`) triggers hardware-accelerated **GSAP (`3.12.2`)** camera position and target tweens, smoothly flying the user into microscopic or bathymetric inspection angles.
* **📍 3D-to-2D Screen-Space Projection Engine:** Custom `THREE.Vector3.project(camera)` matrix projection binds floating HTML/CSS badges (`pointer-events-auto`) to moving 3D meshes in real time with frustum culling.
* **🎛️ Dual-Parameter Live Simulation Sliders:** Every scene features two real-time environmental control sliders (e.g., *Magnification Scale*, *Solar Irradiance*, *Tidal Mixing*, *Viral Burst Rate*, *Nutrient Runoff*) that dynamically alter 3D particle velocities, procedural mesh scales, water fog density, and chemical colors at 60 FPS.
* **📊 Collapsible Telemetry & Inspector Drawer:** Selecting a 3D node slides open a frosted-glass inspector drawer (`max-w-[360px]`) displaying ultra-concise microbial takeaways alongside dynamic **Chart.js** depth-attenuation and eutrophication telemetry graphs.
* **⚡ Zero-Dependency Single-File Portability:** Architected to run both as a modular React/Next.js component (`AquaticSimulation.tsx`) and as a completely self-contained, single-file `index.html` deployment.

---

## 🧬 Complete 15-Scene Interactive Curriculum

### Part I: Pelagic Zonation, Gradients & Cellular Diversity (Scenes 01–08)

* **Scene 01 — The Aquatic Microbiome:** 3D planetary ocean biosphere with thermohaline circulation rings and orbiting biomass nodes (*Pelagic Bacterioplankton, Marine Virosphere Halo, Phototrophic Primary Producers, Deep Subsurface Biosphere*). **Sliders:** *Magnification Scale & Circulation Flux*.
* **Scene 02 — Vertical Zonation:** 3D pelagic water column featuring interactive depth rings (*Neuston, Euphotic, Mesopelagic, Benthic*) and descending marine snow particles. **Sliders:** *Depth Meter & Marine Snow Flux*.
* **Scene 03 — Physicochemical Gradients:** Depth-reactive particle column shifting color and velocity across *Thermocline, Halocline, Oxycline,* and *Photic Limit* planes. **Sliders:** *Solar Irradiance & Vertical Mixing*.
* **Scene 04 — Freshwater Ecosystems:** Split 3D hydro-terrain contrasting high-velocity *Lotic* river particles and epilithic cobble biofilms against thermally stratified *Lentic* lake layers. **Sliders:** *Flow Velocity & Allochthonous DOC*.
* **Scene 05 — Marine & Estuarine Systems:** Colliding freshwater and saltwater particle streams forming a dynamic inclined salt-wedge and *Estuarine Turbidity Maximum (ETM)*. **Sliders:** *Tidal Mixing & River Discharge*.
* **Scene 06 — Prokaryotes (Bacteria & Cyanobacteria):** High-detail procedural 3D models of *Pelagibacter ubique* (SAR11), *Prochlorococcus*, filamentous *Trichodesmium*, and *Vibrio* with animated helical flagella. **Sliders:** *Nutrient Availability & Flagellar Motor RPM*.
* **Scene 07 — Eukaryotes & Archaea:** Geometric 3D silica *Diatom* frustules, spinning *Dinoflagellates*, *Ciliates*, and ammonia-oxidizing *Thaumarchaeota*. **Sliders:** *Silica Concentration & Microzooplankton Grazing*.
* **Scene 08 — Aquatic Viruses & The Viral Shunt:** Icosahedral cyanophages docking onto bacterial hosts and triggering a 3D particle lysis burst that redirects carbon back into the dissolved pool. **Sliders:** *Viral Burst Rate & Virus-to-Bacterium Ratio (VBR)*.

### Part II: Biogeochemical Cycles, Extremophiles & Anthropogenic Frontiers (Scenes 09–15)

* **Scene 09 — The Microbial Loop:** Glowing 3D trophic energy network with animated pulses transferring carbon between *DOM, Heterotrophic Bacteria, Nanoflagellates,* and *Microciliates*. **Sliders:** *DOM Transfer Speed & Grazing Efficiency*.
* **Scene 10 — Biofilms & Microbial Mats:** Interactive benthic substrate where scrubbing the timeline grows bacterial microcolonies, an *Extracellular Polymeric Substance (EPS)* matrix dome, and quorum-sensing autoinducer particles. **Sliders:** *Biofilm Developmental Stage (1–5) & Shear Stress*.
* **Scene 11 — Biogeochemical Cycling I (The Biological Carbon Pump):** Sinking marine snow aggregates descending from surface phytoplankton to abyssal sediments with live **Chart.js** *Martin Curve Carbon Attenuation* telemetry. **Sliders:** *Sinking Flux Speed & Ballast Mineral Ratio*.
* **Scene 12 — Biogeochemical Cycling II (Nitrogen & Sulfur):** Stratified oxic-to-anoxic redox zones modeling *Nitrification, Denitrification, Anammox,* and *Dissimilatory Sulfate Reduction*. **Sliders:** *Oxygen Depletion & Redox Potential*.
* **Scene 13 — Extreme Aquatic Environments:** Deep-sea hydrothermal *Black Smoker* chimney spewing hyperthermophilic sulfide plumes alongside a polar sea-ice *Psychrophile* brine-channel crystal node. **Sliders:** *Vent Plume Velocity & Thermal Gradient*.
* **Scene 14 — Anthropogenic Impacts & Eutrophication:** Coastal water column where increasing agricultural runoff triggers surface *Harmful Algal Blooms (HABs)* and deep-water crimson *Hypoxia / Dead Zones*, paired with a live **Chart.js** *Nutrient vs. Bloom vs. Dissolved $O_2$ Crash* curve. **Sliders:** *Nutrient Runoff Load & Stratification Intensity*.
* **Scene 15 — Bioremediation & eDNA Frontiers:** Hydrocarbon oil-droplet micelles swarmed and degraded by *Alcanivorax borkumensis* alongside a rotating 3D environmental DNA (*eDNA*) double-helix metabarcoding node. **Sliders:** *Hydrocarbon Breakdown Rate & Biosurfactant Dispersal*.

---

## ⌨️ Interactive Controls & Keyboard Shortcuts

* **Mouse Left-Click + Drag:** Orbit camera 360° around the active 3D scene
* **Mouse Scroll:** Smooth dolly zoom in/out
* **Left-Click 3D Mesh or Floating Badge:** Tween camera to target node & open Right Inspector Drawer
* **`←` / `→` Arrow Keys:** Navigate to Previous / Next scene (`01` to `15`)
* **`1` / `2` / `3` / `4` Keys:** Quick-focus camera onto 3D Hotspot Nodes 1–4 in the current scene
* **`R` Key:** Reset camera to default scene orbital position and close inspector drawer
* **`H` Key:** Toggle Zen Mode (hide/show bottom control dock for unobstructed presentation)

---

## 🛠️ Tech Stack

* **3D Graphics & Spatial Engine:** Three.js (`r128`), WebGLRenderer, OrbitControls, Raycaster, Procedural BufferGeometry & Particle Systems (`THREE.Points`)
* **Animation & Camera Kinematics:** GSAP (GreenSock Animation Platform `3.12.2`)
* **Scientific Data Visualization:** Chart.js (Dynamic depth-attenuation & dissolved oxygen telemetry)
* **UI & HUD Styling:** Tailwind CSS (Frosted obsidian glassmorphism, non-blocking `pointer-events-none` HUD overlays)
* **Application Wrapper:** Next.js / React TypeScript (`AquaticSimulation.tsx`) + Standalone Single-File HTML5 build (`index.html`)

---

## 🚀 Getting Started

### Option A: Instant Standalone Launch (Zero-Build `index.html`)

Because the entire engine is also compiled into a self-contained single-file architecture, you can launch it immediately without installing Node modules:

1. Clone the repository:
   `git clone https://github.com/mahin/aquamicrobe-3d.git && cd aquamicrobe-3d`
2. Open `index.html` directly in Chrome, Edge, or Firefox, or serve it locally via VS Code Live Server / Python:
   `npx serve .`

### Option B: Next.js / React Development Server

1. Install dependencies:
   `npm install`
2. Start the development server:
   `npm run dev`
3. Open `http://localhost:3000` in your browser.

### Option C: Production GitHub Pages Deployment

The `main` branch deploys automatically to GitHub Pages through
`.github/workflows/deploy-pages.yml`. The workflow uses Next.js static export,
so no server runtime or API key is required for this interactive simulation.

To publish a new version, push to `main` and monitor the **Deploy AquaMicrobe 3D
to GitHub Pages** workflow in the repository's Actions tab. The public site is:
<https://github.com/Mahin-Muhammad-Mazumder/microorganisms-in-aquatic-environments/>.

For a local production check, run:

```bash
npm install
npm run build
```

The generated static site is written to `out/`.

---

## 📂 Repository Structure

* `index.html` — Complete standalone single-file 3D WebGL engine, HUD overlay, GSAP camera controller, and 15-scene dataset
* `components/AquaticSimulation.tsx` — Modular React/TypeScript wrapper for Next.js integration
* `app/page.tsx` — Root application viewport mount
* `app/layout.tsx` — Document metadata and font configuration
* `metadata.json` — Application manifest and simulation specifications
* `.github/workflows/deploy-pages.yml` — Reproducible GitHub Pages deployment
* `next.config.ts` — Static export and repository sub-path configuration

---

## 👤 Author

**Mahin Muhammad Mazumder (M. Mahin)**  
B.Sc. in Electrical and Electronic Engineering (EEE)  
University of Chittagong, Bangladesh

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for details.
